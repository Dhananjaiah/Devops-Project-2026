import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const productTarget = process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3001';
const userTarget = process.env.USER_SERVICE_URL ?? 'http://localhost:3002';
const cartTarget = process.env.CART_SERVICE_URL ?? 'http://localhost:3003';
const orderTarget = process.env.ORDER_SERVICE_URL ?? 'http://localhost:3004';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      '/api/products': { target: productTarget, changeOrigin: true },
      '/api/users': { target: userTarget, changeOrigin: true },
      '/api/cart': { target: cartTarget, changeOrigin: true },
      '/api/orders': { target: orderTarget, changeOrigin: true }
    }
  }
});
