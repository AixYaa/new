<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useMessage,
  NConfigProvider,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpin,
  NSteps,
  NStep,
  type GlobalThemeOverrides,
  type FormInst,
  type FormRules

} from 'naive-ui'
import { register, sendEmail } from '@/axios/LAR'

const router = useRouter()

// 加载状态
const show = ref(false)
const currentStep = ref(1) // 当前步骤

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
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '' // 验证码
})

const formRef = ref<FormInst | null>(null)
const message = useMessage()

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value) => {
        return value === formValue.value.password
      },
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为 6 位', trigger: 'blur' }
  ]
}

// 第一步：验证表单并发送验证码
const handleNextStep = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      show.value = true
      sendEmail({email:formValue.value.email}).then(res=>{
        show.value = false
        // @ts-nocheck
        if(res.code===200){
          message.success(res.msg)
          currentStep.value = 2
        }
      }).catch(err=>{
        show.value = false
        message.error(err.message)
      })
    } else {
      console.log(errors)
      message.error('请检查输入信息是否正确')
    }
  })
}

// 第二步：提交验证码完成注册
const handleFinalRegister = (e: MouseEvent) => {
  e.preventDefault()
  // 第二步只需要验证 code 字段，但在同一表单下比较麻烦，
  // 简单起见我们直接判断 code 是否为空，或者也可以单独为第二步建一个 form
  if(!formValue.value.code || formValue.value.code.length !== 6) {
      message.warning('请输入6位验证码')
      return
  }

  show.value = true
  register(formValue.value).then(res=>{
    show.value = false
    if(res.data.code===200){
      message.success('注册成功')
      router.push('/')
    }
  }).catch(err=>{
    show.value = false
    message.error(err.message)
  })
}

// 返回上一步
const handlePrevStep = () => {
  currentStep.value = 1
}

const goToLogin = () => {
  router.push('/')
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-spin :show="show">
      <div class="login-container">
        <!-- 左侧品牌展示区 -->
        <div class="brand-section">
          <div class="brand-content">
            <div class="logo-circle">
              <span class="logo-text">N</span>
            </div>
            <h1 class="brand-title">加入我们</h1>
            <p class="brand-slogan">开始您的旅程，加入我们的下一代平台。</p>
          </div>
          <!-- 装饰性流体背景 -->
          <div class="fluid-bg"></div>
        </div>

        <div class="form-section">

          <div class="form-wrapper">
            <div class="form-header">
              <h2 class="form-title">创建一个账号</h2>
              <p class="form-subtitle">
                {{ currentStep === 1 ? '请填写您的注册信息。' : '请输入发送到您邮箱的验证码。' }}
              </p>
            </div>

            <!-- 步骤条 -->
            <n-steps :current="currentStep" size="small" style="margin-bottom: 15px;" class="custom-steps">
              <n-step title="基本信息" />
              <n-step title="邮箱验证" />
            </n-steps>

            <n-form 
              ref="formRef" 
              :model="formValue" 
              :rules="rules" 
              size="large" 
              class="login-form"
            >
              
              <!-- 第一步表单 -->
              <div v-if="currentStep === 1" class="step-content">
                <n-form-item path="username" label="用户名">
                  <n-input v-model:value="formValue.username" placeholder="请输入用户名" class="custom-input" />
                </n-form-item>

                <n-form-item path="email" label="邮箱">
                  <n-input v-model:value="formValue.email" placeholder="请输入邮箱" class="custom-input" />
                </n-form-item>

                <n-form-item path="password" label="密码">
                  <n-input v-model:value="formValue.password" type="password" show-password-on="click" placeholder="请输入密码"
                    class="custom-input" />
                </n-form-item>

                <n-form-item path="confirmPassword" label="确认密码">
                  <n-input v-model:value="formValue.confirmPassword" type="password" show-password-on="click"
                    placeholder="请确认密码" class="custom-input" />
                </n-form-item>

                <n-button type="primary" block size="large" @click="handleNextStep" class="submit-btn" :bordered="false">
                  下一步
                </n-button>
              </div>

              <!-- 第二步表单 -->
              <div v-if="currentStep === 2" class="step-content">
                <n-form-item path="code" label="验证码">
                  <n-input 
                    v-model:value="formValue.code" 
                    placeholder="请输入6位验证码" 
                    class="custom-input text-center" 
                    :maxlength="6"
                  />
                </n-form-item>

                <n-button type="primary" block size="large" @click="handleFinalRegister" class="submit-btn" :bordered="false">
                  完成注册
                </n-button>
                
                <div class="text-center mt-4">
                   <n-button text type="primary" @click="handlePrevStep">
                    返回修改信息
                   </n-button>
                </div>
              </div>

            </n-form>

            <p class="signup-link">
              已经有账号？ <a href="#" @click.prevent="goToLogin">登录</a>
            </p>
          </div>

        </div>

        <!-- 右侧表单区 -->

      </div>
    </n-spin>
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

.text-center {
    text-align: center;
}
.mt-4 {
    margin-top: 16px;
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