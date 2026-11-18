/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Supabase Client Setup
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

function mapSupabaseOrderRow(row: any) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customer: {
      id: row.customer_id || undefined,
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone || '',
    },
    shippingAddress: row.shipping_address || {
      fullName: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone || '',
      addressLine1: row.shipping_address_line1 || '',
      addressLine2: row.shipping_address_line2 || '',
      city: row.shipping_city || '',
      state: row.shipping_state || '',
      pincode: row.shipping_pincode || '',
    },
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    total: Number(row.total || 0),
    couponCode: row.coupon_code || null,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    createdAt: row.created_at,
  };
}

async function saveOrderToSupabase(order: any, upiId?: string): Promise<{ saved: boolean; error?: string }> {
  if (!supabase) {
    return { saved: false, error: 'Supabase client is not configured' };
  }

  try {
    const { error: orderError } = await supabase.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      customer_id: order.customer?.id || null,
      customer_name: order.customer?.name || order.shippingAddress?.fullName || 'Guest',
      customer_email: order.customer?.email || order.shippingAddress?.email || 'guest@elixirbeaute.com',
      customer_phone: order.customer?.phone || order.shippingAddress?.phone || '',
      shipping_address_line1: order.shippingAddress?.addressLine1 || '',
      shipping_address_line2: order.shippingAddress?.addressLine2 || '',
      shipping_city: order.shippingAddress?.city || '',
      shipping_state: order.shippingAddress?.state || '',
      shipping_pincode: order.shippingAddress?.pincode || '',
      shipping_address: order.shippingAddress || {},
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      shipping_fee: Number(order.shippingFee || 0),
      total: Number(order.total || 0),
      coupon_code: order.couponCode || null,
      payment_method: order.paymentMethod,
      upi_id: upiId || null,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      created_at: order.createdAt,
    });

    if (orderError) {
      console.error('❌ Supabase orders insert error:', orderError.code, orderError.message);
      return { saved: false, error: orderError.message };
    }

    if (Array.isArray(order.items) && order.items.length > 0) {
      const itemRows = order.items.map((item: any) => ({
        order_id: order.id,
        order_number: order.orderNumber,
        product_id: String(item.productId || ''),
        product_name: String(item.name || ''),
        category: String(item.category || ''),
        unit_price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        line_total: Number(item.price || 0) * Number(item.quantity || 1),
        image: String(item.image || ''),
        created_at: order.createdAt,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
      if (itemsError) {
        console.error('❌ Supabase order_items insert error:', itemsError.code, itemsError.message);
      }
    }

    return { saved: true };
  } catch (err: any) {
    console.error('❌ Supabase save exception:', err?.message || err);
    return { saved: false, error: err?.message || 'Unknown Supabase error' };
  }
}

async function fetchOrdersFromSupabase(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }
    return (data || []).map(mapSupabaseOrderRow);
  } catch {
    return null;
  }
}

function mergeOrders(supabaseOrders: any[] | null, localOrders: any[]) {
  if (!supabaseOrders || supabaseOrders.length === 0) {
    return localOrders;
  }
  const byId = new Map<string, any>();
  for (const o of localOrders) {
    byId.set(o.id, o);
  }
  for (const o of supabaseOrders) {
    byId.set(o.id, o);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Storage directory
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
const TMP_DB_FILE = '/tmp/elixir_store.json';

if (!IS_VERCEL && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string, salt: string = 'elixir_luxe_salt_2026'): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Token generator
function generateToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, ts: Date.now() });
  return Buffer.from(payload).toString('base64');
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.userId && parsed.role) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Database schema
interface DbData {
  products: any[];
  orders: any[];
  users: any[];
  coupons: { code: string; discountPercent: number; minSpend: number; maxDiscount: number }[];
}

// Initial DB loader
function loadDb(): DbData {
  const candidateFiles = IS_VERCEL ? [TMP_DB_FILE, DB_FILE] : [DB_FILE];
  for (const file of candidateFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.error(`Error reading ${file}, trying fallback...`, e);
      }
    }
  }

  // Seed default admin and sample data
  const adminSalt = 'elixir_luxe_salt_2026';
  const defaultAdmin = {
    id: 'user-admin-01',
    name: 'Madame Claire Delacroix',
    email: 'admin@elixirbeaute.com',
    passwordHash: hashPassword('LuxeAdmin@2026', adminSalt),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const sampleCustomer = {
    id: 'user-cust-01',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    passwordHash: hashPassword('Customer@123', adminSalt),
    role: 'customer',
    phone: '+91 98201 44556',
    address: 'Flat 12B, Sea Green Apartments, Bandra West, Mumbai 400050',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  };

  const sampleCustomer2 = {
    id: 'user-cust-02',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@example.com',
    passwordHash: hashPassword('Customer@123', adminSalt),
    role: 'customer',
    phone: '+91 98112 33445',
    address: 'Villa 7, Golf Links, New Delhi 110003',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  };

  const sampleOrders = [
    {
      id: 'ORD-2026-8841',
      orderNumber: 'ELX-8841',
      customer: {
        id: sampleCustomer.id,
        name: sampleCustomer.name,
        email: sampleCustomer.email,
        phone: sampleCustomer.phone,
      },
      shippingAddress: {
        fullName: 'Ananya Sharma',
        phone: '+91 98201 44556',
        addressLine1: 'Flat 12B, Sea Green Apartments',
        addressLine2: 'Perry Cross Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
      items: [
        {
          productId: 'p-001',
          name: 'Botanical Radiance Squalane Elixir',
          category: 'Serums',
          price: 3450,
          quantity: 1,
          image: '/images/category_skincare_serum_1793790405658.jpg',
        },
        {
          productId: 'p-055',
          name: 'Velvet Haute Rouge Matte — Nuance 04 Rose Pêche',
          category: 'Lipsticks',
          price: 2450,
          quantity: 1,
          image: '/images/category_lipstick_velvet_1793790406318.jpg',
        },
      ],
      subtotal: 5900,
      discount: 885, // 15% off coupon
      shippingFee: 0,
      total: 5015,
      couponCode: 'LUXE15',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ORD-2026-8892',
      orderNumber: 'ELX-8892',
      customer: {
        id: sampleCustomer2.id,
        name: sampleCustomer2.name,
        email: sampleCustomer2.email,
        phone: sampleCustomer2.phone,
      },
      shippingAddress: {
        fullName: 'Rohan Mehra',
        phone: '+91 98112 33445',
        addressLine1: 'Villa 7, Golf Links',
        addressLine2: 'Near Lodhi Gardens',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110003',
      },
      items: [
        {
          productId: 'p-083',
          name: 'Rose de Mai Extrait de Parfum',
          category: 'Perfumes',
          price: 6800,
          quantity: 1,
          image: '/images/category_perfume_flacon_1793790404112.jpg',
        },
      ],
      subtotal: 6800,
      discount: 680,
      shippingFee: 0,
      total: 6120,
      couponCode: 'WELCOME10',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const defaultCoupons = [
    { code: 'LUXE15', discountPercent: 15, minSpend: 2500, maxDiscount: 1500 },
    { code: 'ROSEGOLD20', discountPercent: 20, minSpend: 4000, maxDiscount: 2000 },
    { code: 'WELCOME10', discountPercent: 10, minSpend: 1500, maxDiscount: 1000 },
  ];

  // We read the initial products list from cosmeticsCatalog file
  let initialProducts: any[] = [];
  try {
    const catalogPath = path.resolve(__dirname, 'src/data/cosmeticsCatalog.ts');
    if (fs.existsSync(catalogPath)) {
      // Just initialize empty or will populate on first request
    }
  } catch (e) {
    // fallback
  }

  const initialDb: DbData = {
    products: initialProducts,
    orders: sampleOrders,
    users: [defaultAdmin, sampleCustomer, sampleCustomer2],
    coupons: defaultCoupons,
  };

  saveDb(initialDb);
  return initialDb;
}

function saveDb(data: DbData): void {
  const targetFile = IS_VERCEL ? TMP_DB_FILE : DB_FILE;
  try {
    fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    if (!IS_VERCEL) {
      console.error('Failed to write to store.json', err);
    }
  }
}

// Global in-memory DB
let db = loadDb();

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  (req as any).user = verified;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin credentials required' });
    }
    next();
  });
}

// ==================== API ROUTES ====================

// --- Sync/Seed Products (Frontend sends initial catalog if empty) ---
app.post('/api/sync-catalog', (req: Request, res: Response) => {
  const { products } = req.body;
  if (Array.isArray(products) && (!db.products || db.products.length === 0)) {
    db.products = products;
    saveDb(db);
    return res.json({ success: true, count: db.products.length });
  }
  return res.json({ success: true, count: db.products?.length || 0 });
});

// --- Products Routes ---
app.get('/api/products', (req: Request, res: Response) => {
  let list = db.products || [];
  const { category, search, sort, featured } = req.query;

  if (category && category !== 'All') {
    list = list.filter((p: any) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search && String(search).trim()) {
    const q = String(search).toLowerCase().trim();
    list = list.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      p.keyIngredients?.some((k: string) => k.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    list = list.filter((p: any) => p.isFeatured || p.badge === 'Bestseller');
  }

  // Sort
  if (sort === 'price-low') {
    list.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a: any, b: any) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a: any, b: any) => b.rating - a.rating);
  } else if (sort === 'discount') {
    list.sort((a: any, b: any) => b.discountPercent - a.discountPercent);
  } else if (sort === 'newest') {
    list.sort((a: any, b: any) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
  }

  res.json({
    products: list,
    total: list.length,
    categories: ['Skincare', 'Serums', 'Moisturizers', 'Foundations', 'Lipsticks', 'Makeup', 'Perfumes', 'Accessories']
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.products?.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Add Product (Admin Only)
app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const newProduct = req.body;
  if (!newProduct.name || !newProduct.category || !newProduct.price) {
    return res.status(400).json({ error: 'Name, category, and price in INR are required' });
  }

  newProduct.id = 'p-' + Date.now().toString(36);
  newProduct.price = Number(newProduct.price);
  newProduct.originalPrice = Number(newProduct.originalPrice || newProduct.price);
  newProduct.discountPercent = Number(newProduct.discountPercent || 0);
  newProduct.rating = Number(newProduct.rating || 5.0);
  newProduct.reviewCount = Number(newProduct.reviewCount || 0);
  newProduct.stock = Number(newProduct.stock || 50);

  if (!Array.isArray(newProduct.images)) {
    newProduct.images = newProduct.image ? [newProduct.image] : [];
  }
  if (!Array.isArray(newProduct.keyIngredients)) {
    newProduct.keyIngredients = typeof newProduct.keyIngredients === 'string'
      ? newProduct.keyIngredients.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  }

  db.products = [newProduct, ...(db.products || [])];
  saveDb(db);
  res.status(201).json(newProduct);
});

// Edit Product (Admin Only)
app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const idx = db.products?.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1 || idx === undefined) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated = {
    ...db.products[idx],
    ...req.body,
    price: Number(req.body.price ?? db.products[idx].price),
    originalPrice: Number(req.body.originalPrice ?? db.products[idx].originalPrice),
    stock: Number(req.body.stock ?? db.products[idx].stock),
    discountPercent: Number(req.body.discountPercent ?? db.products[idx].discountPercent),
  };

  db.products[idx] = updated;
  saveDb(db);
  res.json(updated);
});

// Delete Product (Admin Only)
app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const initialLength = db.products?.length || 0;
  db.products = db.products?.filter((p: any) => p.id !== req.params.id) || [];
  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveDb(db);
  res.json({ success: true, message: 'Product deleted' });
});

// --- Authentication Routes ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const hash = hashPassword(password);
  if (user.passwordHash !== hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id, user.role);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: 'user-' + Date.now().toString(36),
    name: name.trim(),
    email: cleanEmail,
    passwordHash: hashPassword(password),
    role: 'customer',
    phone: phone || '',
    address: address || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const token = generateToken(newUser.id, newUser.role);
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
    },
  });
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const authUser = (req as any).user;
  const user = db.users.find((u: any) => u.id === authUser.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
    },
  });
});

// --- Promo Code Validation ---
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const coupon = db.coupons.find((c: any) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid promotion code' });
  }

  if (subtotal < coupon.minSpend) {
    return res.status(400).json({
      error: `Minimum order amount of ₹${coupon.minSpend.toLocaleString('en-IN')} required for code ${coupon.code}`,
    });
  }

  const calculatedDiscount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
  res.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount: Math.round(calculatedDiscount),
    message: `${coupon.discountPercent}% luxury privilege applied!`,
  });
});

// --- Orders Routes ---
app.post('/api/orders', async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod, subtotal, discount, shippingFee, total, couponCode, customer, upiId } = req.body;

  if (!items || !items.length || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Incomplete order information' });
  }

  const orderNum = 'ELX-' + Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    id: 'ORD-' + Date.now(),
    orderNumber: orderNum,
    customer: customer || {
      name: shippingAddress.fullName,
      email: shippingAddress.email || 'guest@elixirbeaute.com',
      phone: shippingAddress.phone || '',
    },
    shippingAddress,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    shippingFee: Number(shippingFee || 0),
    total: Number(total),
    couponCode: couponCode || null,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Processing',
    createdAt: new Date().toISOString(),
  };

  // Adjust product stock
  items.forEach((item: any) => {
    const product = db.products?.find((p: any) => p.id === item.productId);
    if (product && product.stock >= item.quantity) {
      product.stock -= item.quantity;
    }
  });

  // Save to Supabase backend tables (orders & order_items)
  const supabaseResult = await saveOrderToSupabase(newOrder, upiId);

  db.orders.unshift(newOrder);
  saveDb(db);

  res.status(201).json({
    ...newOrder,
    supabaseSaved: supabaseResult.saved,
  });
});

// Get User's Orders
app.get('/api/orders/my-orders', requireAuth, async (req: Request, res: Response) => {
  const authUser = (req as any).user;
  const user = db.users.find((u: any) => u.id === authUser.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const supabaseOrders = await fetchOrdersFromSupabase();
  const allOrders = mergeOrders(supabaseOrders, db.orders);

  const userOrders = allOrders.filter(
    (o: any) =>
      (o.customer?.id && o.customer.id === user.id) ||
      (o.customer?.email && o.customer.email.toLowerCase() === user.email.toLowerCase())
  );

  res.json(userOrders);
});

// Admin: Get all orders
app.get('/api/admin/orders', requireAdmin, async (_req: Request, res: Response) => {
  const supabaseOrders = await fetchOrdersFromSupabase();
  res.json(mergeOrders(supabaseOrders, db.orders));
});

// Admin: Update order status
app.put('/api/admin/orders/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body;
  let order = db.orders.find((o: any) => o.id === req.params.id);

  if (supabase) {
    const updates: Record<string, any> = {};
    if (status) updates.order_status = status;
    if (paymentStatus) updates.payment_status = paymentStatus;
    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', req.params.id)
        .select('*')
        .maybeSingle();
      if (!error && data && !order) {
        order = mapSupabaseOrderRow(data);
      }
    }
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) order.orderStatus = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  saveDb(db);

  res.json(order);
});

// Admin: Customers list
app.get('/api/admin/customers', requireAdmin, async (_req: Request, res: Response) => {
  const supabaseOrders = await fetchOrdersFromSupabase();
  const allOrders = mergeOrders(supabaseOrders, db.orders);

  const customers = db.users
    .filter((u: any) => u.role !== 'admin')
    .map((u: any) => {
      const userOrders = allOrders.filter(
        (o: any) => o.customer?.email?.toLowerCase() === u.email.toLowerCase()
      );
      const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        ordersCount: userOrders.length,
        totalSpent,
        createdAt: u.createdAt,
      };
    });

  res.json(customers);
});

// Admin: Analytics & Stats
app.get('/api/admin/stats', requireAdmin, async (_req: Request, res: Response) => {
  const supabaseOrders = await fetchOrdersFromSupabase();
  const allOrders = mergeOrders(supabaseOrders, db.orders);

  const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const totalOrders = allOrders.length;
  const totalProducts = db.products?.length || 0;
  const totalCustomers = db.users.filter((u: any) => u.role !== 'admin').length;

  // Category sales breakdown
  const categoryCount: Record<string, number> = {};
  allOrders.forEach((o: any) => {
    o.items?.forEach((item: any) => {
      const cat = item.category || 'Skincare';
      categoryCount[cat] = (categoryCount[cat] || 0) + (item.quantity || 1);
    });
  });

  // Recent 6 orders
  const recentOrders = allOrders.slice(0, 6);

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    categorySales: categoryCount,
    recentOrders,
  });
});

// --- Vite Middlewares Setup ---
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for all non-API GET requests in dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ ÉLIXIR BEAUTÉ luxury server running on http://0.0.0.0:${PORT}`);
  });
}

if (!IS_VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export default app;
