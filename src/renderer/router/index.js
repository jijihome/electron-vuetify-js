/**
 * router/index.ts
 *
 * 移除自动路由, 使用手动路由管理
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      { path: '', component: () => import('@/pages/index.vue') },

      // 添加其他路由...
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

router.onError((err) => {
  console.error('路由错误:', err);
});

export default router;
