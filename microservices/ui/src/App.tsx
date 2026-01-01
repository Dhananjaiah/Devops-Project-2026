import { useEffect, useMemo, useState } from 'react';
import { apiJson } from './api';
import type { Cart, LoginResponse, Order, Product, ProductListResponse, User } from './types';

type Status = { kind: 'idle' | 'error' | 'success'; message?: string };

export default function App() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [token, setToken] = useState<string>(() => localStorage.getItem('token') ?? '');
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const userId = user?.id ?? '';

  const [products, setProducts] = useState<Array<Product & { _id: string }>>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [createProduct, setCreateProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: ''
  });

  const [cart, setCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [shipping, setShipping] = useState({
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  });

  const authHeader = useMemo(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const refreshProducts = async () => {
    setProductLoading(true);
    try {
      const data = await apiJson<ProductListResponse>('/api/products');
      setProducts(data.products);
    } finally {
      setProductLoading(false);
    }
  };

  const refreshCart = async () => {
    if (!userId) return;
    setCartLoading(true);
    try {
      const data = await apiJson<Cart>(`/api/cart/${encodeURIComponent(userId)}`);
      setCart(data);
    } finally {
      setCartLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (!userId) return;
    setOrdersLoading(true);
    try {
      const data = await apiJson<Order[]>(`/api/orders?userId=${encodeURIComponent(userId)}`);
      setOrders(data);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts().catch((e) => setStatus({ kind: 'error', message: String(e?.message ?? e) }));
  }, []);

  useEffect(() => {
    if (!userId) return;
    refreshCart().catch((e) => setStatus({ kind: 'error', message: String(e?.message ?? e) }));
    refreshOrders().catch((e) => setStatus({ kind: 'error', message: String(e?.message ?? e) }));
  }, [userId]);

  const onRegister = async () => {
    setStatus({ kind: 'idle' });
    try {
      const res = await apiJson<{ id: string; email: string; name?: string }>(
        '/api/users/register',
        {
          method: 'POST',
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
            name: registerName
          })
        }
      );
      setStatus({ kind: 'success', message: `Registered user id: ${res.id}` });
      setLoginEmail(registerEmail);
      setRegisterPassword('');
    } catch (e: any) {
      setStatus({ kind: 'error', message: e?.message ?? String(e) });
    }
  };

  const onLogin = async () => {
    setStatus({ kind: 'idle' });
    try {
      const res = await apiJson<LoginResponse>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setStatus({ kind: 'success', message: `Logged in as ${res.user.email}` });
      setLoginPassword('');
    } catch (e: any) {
      setStatus({ kind: 'error', message: e?.message ?? String(e) });
    }
  };

  const onLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCart(null);
    setOrders([]);
    setStatus({ kind: 'success', message: 'Logged out' });
  };

  const onCreateProduct = async () => {
    setStatus({ kind: 'idle' });
    try {
      const payload = {
        ...createProduct,
        price: Number(createProduct.price),
        stock: Number(createProduct.stock)
      };
      await apiJson('/api/products', { method: 'POST', body: JSON.stringify(payload) });
      setStatus({ kind: 'success', message: 'Product created' });
      setCreateProduct({ name: '', description: '', price: 0, category: '', stock: 0, imageUrl: '' });
      await refreshProducts();
    } catch (e: any) {
      setStatus({ kind: 'error', message: e?.message ?? String(e) });
    }
  };

  const onAddToCart = async (productId: string, quantity: number) => {
    if (!userId) {
      setStatus({ kind: 'error', message: 'Login first (need userId)' });
      return;
    }

    setStatus({ kind: 'idle' });
    try {
      await apiJson(`/api/cart/${encodeURIComponent(userId)}/items`, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });
      setStatus({ kind: 'success', message: 'Added to cart' });
      await refreshCart();
    } catch (e: any) {
      setStatus({ kind: 'error', message: e?.message ?? String(e) });
    }
  };

  const onPlaceOrder = async () => {
    if (!userId) {
      setStatus({ kind: 'error', message: 'Login first (need userId)' });
      return;
    }

    setStatus({ kind: 'idle' });
    try {
      await apiJson('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ userId, shippingAddress: shipping })
      });
      setStatus({ kind: 'success', message: 'Order placed' });
      await refreshCart();
      await refreshOrders();
    } catch (e: any) {
      setStatus({ kind: 'error', message: e?.message ?? String(e) });
    }
  };

  return (
    <div className="container">
      <h1>E-Commerce UI (Sprint 3)</h1>

      {status.kind !== 'idle' && (
        <div className={status.kind === 'error' ? 'error' : 'success'}>{status.message}</div>
      )}

      <div className="grid">
        <div className="card">
          <h2>Auth</h2>
          <div className="row">
            <div>
              <div className="small">Register</div>
              <div className="row">
                <input placeholder="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                <input placeholder="password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                <input placeholder="name (optional)" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                <button onClick={onRegister} disabled={!registerEmail || !registerPassword}>
                  Register
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div className="row">
            <div>
              <div className="small">Login</div>
              <div className="row">
                <input placeholder="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <input placeholder="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <button onClick={onLogin} disabled={!loginEmail || !loginPassword}>
                  Login
                </button>
                <button onClick={onLogout} disabled={!user}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div className="small">
            User: {user ? <span className="code">{user.email}</span> : 'not logged in'} | userId:{' '}
            {userId ? <span className="code">{userId}</span> : '—'}
          </div>
        </div>

        <div className="card">
          <h2>Products</h2>
          <div className="row">
            <button onClick={() => refreshProducts().catch((e) => setStatus({ kind: 'error', message: e?.message ?? String(e) }))} disabled={productLoading}>
              Refresh
            </button>
            {productLoading && <span className="small">Loading…</span>}
          </div>

          <table className="table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Id</th>
                <th>Add to cart</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p._id} product={p} onAddToCart={onAddToCart} />
              ))}
            </tbody>
          </table>

          <div style={{ height: 10 }} />

          <div className="small">Create product</div>
          <div className="row">
            <input placeholder="name" value={createProduct.name} onChange={(e) => setCreateProduct((s) => ({ ...s, name: e.target.value }))} />
            <input placeholder="price" type="number" value={String(createProduct.price)} onChange={(e) => setCreateProduct((s) => ({ ...s, price: Number(e.target.value) }))} />
            <input placeholder="category" value={createProduct.category ?? ''} onChange={(e) => setCreateProduct((s) => ({ ...s, category: e.target.value }))} />
            <input placeholder="stock" type="number" value={String(createProduct.stock ?? 0)} onChange={(e) => setCreateProduct((s) => ({ ...s, stock: Number(e.target.value) }))} />
            <input placeholder="imageUrl" value={createProduct.imageUrl ?? ''} onChange={(e) => setCreateProduct((s) => ({ ...s, imageUrl: e.target.value }))} />
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            <textarea
              placeholder="description"
              rows={2}
              style={{ width: '100%' }}
              value={createProduct.description ?? ''}
              onChange={(e) => setCreateProduct((s) => ({ ...s, description: e.target.value }))}
            />
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            <button onClick={onCreateProduct} disabled={!createProduct.name || !createProduct.price}>
              Create
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Cart</h2>
          {!userId ? (
            <div className="small">Login to load cart</div>
          ) : (
            <>
              <div className="row">
                <button onClick={() => refreshCart().catch((e) => setStatus({ kind: 'error', message: e?.message ?? String(e) }))} disabled={cartLoading}>
                  Refresh
                </button>
                {cartLoading && <span className="small">Loading…</span>}
              </div>
              <div style={{ marginTop: 8 }}>
                <div className="small">Items</div>
                {cart?.items?.length ? (
                  <ul>
                    {cart.items.map((i) => (
                      <li key={`${i.productId}`}>Product {i.productId} × {i.quantity}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="small">(empty)</div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h2>Orders</h2>
          {!userId ? (
            <div className="small">Login to place/view orders</div>
          ) : (
            <>
              <div className="small">Shipping address</div>
              <div className="row">
                <input placeholder="street" value={shipping.street} onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))} />
                <input placeholder="city" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} />
                <input placeholder="state" value={shipping.state} onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))} />
                <input placeholder="zip" value={shipping.zipCode} onChange={(e) => setShipping((s) => ({ ...s, zipCode: e.target.value }))} />
                <input placeholder="country" value={shipping.country} onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} />
              </div>
              <div className="row" style={{ marginTop: 6 }}>
                <button onClick={onPlaceOrder}>Place order</button>
                <button onClick={() => refreshOrders().catch((e) => setStatus({ kind: 'error', message: e?.message ?? String(e) }))} disabled={ordersLoading}>
                  Refresh orders
                </button>
                {ordersLoading && <span className="small">Loading…</span>}
              </div>

              <div style={{ marginTop: 8 }}>
                {orders.length ? (
                  <ul>
                    {orders.map((o) => (
                      <li key={o._id}>
                        <span className="code">{o._id}</span> — total: {o.total} — status: {o.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="small">(no orders)</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="small">
        API calls use <span className="code">/api/*</span> so this works behind Gateway API later.
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onAddToCart
}: {
  product: Product & { _id: string };
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
}) {
  const [qty, setQty] = useState(1);

  return (
    <tr>
      <td>{product.name}</td>
      <td>{product.price}</td>
      <td className="code">{product._id}</td>
      <td>
        <div className="row">
          <input style={{ width: 90 }} type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <button onClick={() => onAddToCart(product._id, qty)} disabled={!product._id}>
            Add
          </button>
        </div>
      </td>
    </tr>
  );
}
