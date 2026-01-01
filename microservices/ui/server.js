import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = Number(process.env.PORT ?? 8080);

const productTarget = process.env.PRODUCT_SERVICE_URL ?? 'http://product-service:3001';
const userTarget = process.env.USER_SERVICE_URL ?? 'http://user-service:3002';
const cartTarget = process.env.CART_SERVICE_URL ?? 'http://cart-service:3003';
const orderTarget = process.env.ORDER_SERVICE_URL ?? 'http://order-service:3004';

function rewriteApi(prefix) {
  return (path) => {
    if (path === '/') return prefix;
    if (path.startsWith('/?')) return `${prefix}${path.slice(1)}`;
    return `${prefix}${path}`;
  };
}

app.use(
  '/api/products',
  createProxyMiddleware({
    target: productTarget,
    changeOrigin: true,
    pathRewrite: rewriteApi('/api/products')
  })
);

app.use(
  '/api/users',
  createProxyMiddleware({
    target: userTarget,
    changeOrigin: true,
    pathRewrite: rewriteApi('/api/users')
  })
);

app.use(
  '/api/cart',
  createProxyMiddleware({
    target: cartTarget,
    changeOrigin: true,
    pathRewrite: rewriteApi('/api/cart')
  })
);

app.use(
  '/api/orders',
  createProxyMiddleware({
    target: orderTarget,
    changeOrigin: true,
    pathRewrite: rewriteApi('/api/orders')
  })
);

const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`UI host listening on :${port}`);
});
