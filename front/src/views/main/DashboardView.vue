<script setup lang="ts">
import { 
  NGrid, 
  NGridItem, 
  NCard, 
  NStatistic, 
  NIcon,
  NDataTable,
  NSpace,
  NTag,
  NProgress
} from 'naive-ui'
import { 
  PeopleOutline, 
  CartOutline, 
  CashOutline, 
  TrendingUpOutline 
} from '@vicons/ionicons5'

// 模拟数据
const columns = [
  {
    title: '项目名称',
    key: 'name'
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(
        NTag,
        {
          type: row.status === 'active' ? 'success' : 'warning',
          bordered: false
        },
        {
          default: () => (row.status === 'active' ? '进行中' : '待处理')
        }
      )
    }
  },
  {
    title: '进度',
    key: 'progress',
    render(row: any) {
      return h(
        NProgress,
        {
          type: 'line',
          percentage: row.progress,
          indicatorPlacement: 'inside',
          processing: row.status === 'active'
        }
      )
    }
  }
]

const data = [
  { key: 1, name: '前端重构', status: 'active', progress: 65 },
  { key: 2, name: 'API 接口优化', status: 'pending', progress: 30 },
  { key: 3, name: '移动端适配', status: 'active', progress: 80 },
  { key: 4, name: '自动化测试', status: 'pending', progress: 10 }
]

import { h } from 'vue'

</script>

<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <n-grid x-gap="12" y-gap="12" :cols="4" responsive="screen" item-responsive>
      <n-grid-item span="4 m:2 l:1">
        <n-card hoverable class="stat-card">
          <n-statistic label="总用户数" value="12,345">
            <template #prefix>
              <n-icon :component="PeopleOutline" color="#2080f0" />
            </template>
            <template #suffix>
              <span class="trend up">
                <n-icon :component="TrendingUpOutline" /> 12%
              </span>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      
      <n-grid-item span="4 m:2 l:1">
        <n-card hoverable class="stat-card">
          <n-statistic label="今日订单" value="156">
            <template #prefix>
              <n-icon :component="CartOutline" color="#18a058" />
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      
      <n-grid-item span="4 m:2 l:1">
        <n-card hoverable class="stat-card">
          <n-statistic label="总销售额" value="¥ 1,234,567">
            <template #prefix>
              <n-icon :component="CashOutline" color="#f0a020" />
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      
      <n-grid-item span="4 m:2 l:1">
        <n-card hoverable class="stat-card">
          <n-statistic label="活跃度" value="88%">
            <template #prefix>
              <n-icon :component="TrendingUpOutline" color="#d03050" />
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 主要内容区 -->
    <n-grid x-gap="12" y-gap="12" :cols="12" class="mt-4" item-responsive>
      <!-- 左侧图表占位 -->
      <n-grid-item span="12 m:8">
        <n-card title="访问趋势" class="h-full">
           <div class="chart-placeholder">
             这里可以放置 ECharts 或其他图表组件
           </div>
        </n-card>
      </n-grid-item>

      <!-- 右侧列表 -->
      <n-grid-item span="12 m:4">
        <n-card title="进行中的项目" class="h-full">
          <n-data-table
            :columns="columns"
            :data="data"
            :bordered="false"
            :bottom-bordered="false"
            size="small"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 0;
}

.stat-card {
  border-radius: 8px;
}

.trend {
  font-size: 12px;
  margin-left: 8px;
}

.trend.up {
  color: #18a058;
}

.mt-4 {
  margin-top: 16px;
}

.h-full {
  height: 100%;
}

.chart-placeholder {
  height: 300px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 4px;
  border: 1px dashed #ddd;
}
</style>
