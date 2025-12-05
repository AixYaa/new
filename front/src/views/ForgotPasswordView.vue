<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NConfigProvider, 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  type GlobalThemeOverrides
} from 'naive-ui'

const router = useRouter()

// 主题配置
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#63e2b7',
    primaryColorHover: '#7fe7c4',
    primaryColorPressed: '#5acea7',
  }
}

// 表单数据
const formValue = ref({
  email: ''
})

const handleReset = () => {
  console.log('Reset clicked', formValue.value)
  // 重置逻辑...
}

const goToLogin = () => {
  router.push('/')
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="login-container">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-circle">
            <span class="logo-text">N</span>
          </div>
          <h1 class="brand-title">忘记密码</h1>
          <p class="brand-slogan">输入您的邮箱，我们将发送重置密码的链接</p>
        </div>
        <!-- 装饰性流体背景 -->
        <div class="fluid-bg"></div>
      </div>
      
      <!-- 右侧表单区 -->
      <div class="form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <h2 class="form-title">重置密码</h2>
            <p class="form-subtitle">输入您的邮箱，我们将发送重置密码的链接</p>
          </div>
          
          <n-form
            ref="formRef"
            :model="formValue"
            size="large"
            class="login-form"
          >
            <n-form-item path="email" label="邮箱">
              <n-input 
                v-model:value="formValue.email" 
                placeholder="请输入邮箱"
                class="custom-input"
              />
            </n-form-item>
            
            <n-button 
              type="primary" 
              block 
              size="large"
              @click="handleReset"
              class="submit-btn"
              :bordered="false"
            >
              发送重置链接
            </n-button>
          </n-form>
          
          <p class="signup-link">
            已记住密码？ <a href="#" @click.prevent="goToLogin">登录</a>
          </p>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped>
.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #ffffff;
}

/* 左侧品牌区 */
.brand-section {
  position: relative;
  width: 45%;
  background-color: #0f172a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  max-width: 480px;
}

.logo-circle {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.logo-text {
  font-weight: 800;
  font-size: 24px;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.brand-slogan {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #94a3b8;
  font-weight: 400;
}

/* 抽象流体背景 */
.fluid-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1), transparent 30%);
  filter: blur(60px);
  z-index: 1;
  animation: fluidMove 20s ease-in-out infinite alternate;
}

@keyframes fluidMove {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-10%, -10%) rotate(5deg); }
}

/* 右侧表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #ffffff;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 40px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

/* 自定义表单样式 */
:deep(.n-form-item-label) {
  font-weight: 500;
  color: #334155;
}

:deep(.n-input) {
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

:deep(.n-input:hover) {
  border-color: #cbd5e1;
}

:deep(.n-input--focus) {
  border-color: #0f172a;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.05);
}

.submit-btn {
  height: 48px;
  font-weight: 600;
  font-size: 1rem;
  background-color: #0f172a;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
}

.submit-btn:hover {
  background-color: #1e293b;
}

.signup-link {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.signup-link a {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
}

/* 移动端适配 */
@media (max-width: 900px) {
  .brand-section {
    display: none;
  }
  
  .form-section {
    padding: 24px;
  }
}
</style>