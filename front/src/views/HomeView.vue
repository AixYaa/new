<script setup lang="ts">
import { h, ref, type Component } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NIcon,
  NDropdown,
  NAvatar,
  NSpace,
  NButton,
  NBreadcrumb,
  NBreadcrumbItem,
  type MenuOption
} from 'naive-ui'
import {
  PersonOutline as PersonIcon,
  LogOutOutline as LogOutIcon,
  SettingsOutline as SettingsIcon,
  GridOutline as DashboardIcon,
  MenuOutline as MenuIcon,
  NotificationsOutline as NotificationIcon,
  FolderOpenOutline as ProjectIcon
} from '@vicons/ionicons5'

const router = useRouter()
const userStore = useUserInfoStore()

// Sidebar collapsed state
const collapsed = ref(false)

// Icon helper
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// Menu options
const menuOptions: MenuOption[] = [
  {
    label: '控制台',
    key: 'dashboard',
    icon: renderIcon(DashboardIcon)
  },
  {
    label: '项目管理',
    key: 'projects',
    icon: renderIcon(ProjectIcon)
  },
  {
    label: '系统管理',
    key: 'system',
    icon: renderIcon(SettingsIcon),
    children: [
      {
        label: '用户管理',
        key: 'user-manage',
        icon: renderIcon(PersonIcon)
      },
      {
        label: '角色管理',
        key: 'role-manage'
      }
    ]
  }
]

// Dropdown options
const userOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon(PersonIcon)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutIcon)
  }
]

// Handle menu selection
const handleMenuUpdate = (key: string) => {
  if (key === 'dashboard') {
    router.push({ name: 'dashboard' })
  } else if (key === 'projects') {
    router.push({ name: 'projects' })
  } else {
    console.log('Selected menu:', key)
  }
}

// Handle user dropdown selection
const handleUserSelect = (key: string) => {
  if (key === 'logout') {
    localStorage.removeItem('x-token')
    router.push('/')
  }
}

// Toggle sidebar
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <n-layout has-sider class="layout-container">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger="arrow-circle"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="sider"
    >
      <div class="logo-container" :class="{ 'logo-collapsed': collapsed }">
        <div class="logo-icon">N</div>
        <span v-if="!collapsed" class="logo-text">New Project</span>
      </div>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :default-value="'dashboard'"
        @update:value="handleMenuUpdate"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered class="header">
        <div class="header-left">
           <n-button text style="font-size: 24px; margin-right: 16px" @click="toggleSidebar">
             <n-icon>
               <menu-icon />
             </n-icon>
           </n-button>
           <n-breadcrumb>
             <n-breadcrumb-item>首页</n-breadcrumb-item>
             <n-breadcrumb-item>控制台</n-breadcrumb-item>
           </n-breadcrumb>
        </div>

        <div class="header-right">
          <n-space align="center" size="large">
            <n-button text style="font-size: 20px">
              <n-icon>
                <notification-icon />
              </n-icon>
            </n-button>
            
            <n-dropdown :options="userOptions" @select="handleUserSelect">
              <div class="user-profile">
                <n-avatar round size="small" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                <span class="username">{{ userStore.userInfo.username || 'Admin' }}</span>
              </div>
            </n-dropdown>
          </n-space>
        </div>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px; background-color: #f5f7fa; min-height: calc(100vh - 64px);">
        <!-- Content Area -->
        <div class="content-wrapper">
          <RouterView />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.sider {
  background-color: #fff;
  z-index: 10;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  overflow: hidden;
  border-bottom: 1px solid #efeff5;
  transition: all 0.3s;
}

.logo-collapsed {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background-color: #18a058;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.logo-text {
  margin-left: 12px;
  font-weight: 700;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
}

.header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-profile:hover {
  background-color: #f3f3f5;
}

.username {
  margin-left: 8px;
  font-weight: 500;
}

.content-wrapper {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  min-height: 100%;
}
</style>
