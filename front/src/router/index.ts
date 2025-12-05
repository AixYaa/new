import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { instance } from '../axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('x-token')
    
    // 如果没有 token，重定向到登录页
    if (!token) {
      next({ name: 'login' })
      return
    }

    try {
      // 验证 token 是否有效
      const res: any = await instance.get('/client/verify', {
        headers: {
          'x-token': token
        }
      })

      if (res.code === 200) {
        // token 有效，放行
        next()
      } else {
        // token 无效，清除 token 并重定向到登录页
        localStorage.removeItem('x-token')
        next({ name: 'login' })
      }
    } catch (error) {
      // 请求失败（如网络错误），也视为认证失败
      console.error('Token verification failed:', error)
      localStorage.removeItem('x-token')
      next({ name: 'login' })
    }
  } else {
    // 不需要认证的路由直接放行
    next()
  }
})

export default router