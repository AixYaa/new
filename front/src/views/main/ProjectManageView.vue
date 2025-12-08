<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { 
  NCard, 
  NButton, 
  NSpace, 
  NGrid,
  NGridItem,
  NModal, 
  NForm, 
  NFormItem, 
  NInput, 
  NUpload, 
  useMessage,
  NTag,
  NIcon,
  NSpin,
  NEllipsis,
  NEmpty,
  type UploadFileInfo
} from 'naive-ui'
import { 
  CreateOutline,
  CloudUploadOutline,
  EyeOutline,
  TrashOutline,
  AddOutline,
  DocumentTextOutline,
  ServerOutline,
  LinkOutline
} from '@vicons/ionicons5'
import { 
  getProjectList, 
  uploadProject, 
  updateProject,
  deleteProject, 
  type Project 
} from '@/axios/LAR'

const message = useMessage()

// 列表数据
const data = ref<Project[]>([])
const loading = ref(false)

// 获取列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await getProjectList()
    if (res.code === 200) {
      data.value = res.data
    } else {
      message.error(res.msg || '获取项目列表失败')
    }
  } catch (error) {
    message.error('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

// 状态处理辅助函数
const getStatusType = (status: string) => {
  switch (status) {
    case 'processing': return 'warning'
    case 'failed': return 'error'
    default: return 'success'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'processing': return '处理中'
    case 'failed': return '失败'
    default: return '已部署'
  }
}

// 模态框控制
const showModal = ref(false)
const formRef = ref(null)
const formValue = ref({
  name: '',
  description: '',
  backendUrl: '', // 新增
  file: null as File | null
})
const uploading = ref(false)
const isEdit = ref(false)
const currentId = ref('')

// 打开上传模态框
const handleOpenUpload = () => {
  isEdit.value = false
  currentId.value = ''
  formValue.value = { name: '', description: '', backendUrl: '', file: null }
  showModal.value = true
}

// 打开编辑模态框
const handleEdit = (row: Project) => {
  isEdit.value = true
  currentId.value = row._id
  formValue.value = {
    name: row.项目名称,
    description: row.项目描述,
    backendUrl: row.后端地址 || '',
    file: null
  }
  showModal.value = true
}

// 监听文件变化
const handleFileChange = (data: { fileList: UploadFileInfo[] }) => {
  if (data.fileList && data.fileList.length > 0) {
    formValue.value.file = data.fileList[0].file as File
  } else {
    formValue.value.file = null
  }
}

// 提交上传
const handleSubmit = async () => {
  // 编辑模式下不需要文件，但需要名字
  if (!formValue.value.name) {
    message.warning('请输入项目名称')
    return
  }
  
  // 上传模式下必须有文件
  if (!isEdit.value && !formValue.value.file) {
    message.warning('请上传项目文件')
    return
  }
  
  uploading.value = true
  
  try {
    if (isEdit.value) {
      // 编辑逻辑
      const res = await updateProject(currentId.value, {
        name: formValue.value.name,
        description: formValue.value.description,
        backendUrl: formValue.value.backendUrl
      })
      if (res.code === 200) {
        message.success('更新成功')
        showModal.value = false
        fetchProjects()
      } else {
        message.error(res.msg || '更新失败')
      }
    } else {
      // 上传逻辑
      const formData = new FormData()
      formData.append('name', formValue.value.name)
      formData.append('description', formValue.value.description)
      if (formValue.value.backendUrl) {
        formData.append('backendUrl', formValue.value.backendUrl)
      }
      formData.append('file', formValue.value.file as File)
      
      const res = await uploadProject(formData)
      if (res.code === 200) {
        message.success('上传成功')
        showModal.value = false
        fetchProjects()
      } else {
        message.error(res.msg || '上传失败')
      }
    }
  } catch (error) {
    message.error(isEdit.value ? '更新请求失败' : '上传请求失败')
  } finally {
    uploading.value = false
  }
}

// 预览项目
const previewModalShow = ref(false)
const currentPreviewUrl = ref('')
const currentPreviewTitle = ref('')

const handlePreview = (row: Project) => {
  currentPreviewUrl.value = `http://localhost:3000${row.预览地址}`
  currentPreviewTitle.value = row.项目名称
  previewModalShow.value = true
}

// 删除项目
const handleDelete = (row: Project) => {
  if(confirm(`确定要删除项目 "${row.项目名称}" 吗？`)) {
    deleteProject(row._id).then(res => {
      if (res.code === 200) {
        message.success('删除成功')
        fetchProjects()
      } else {
        message.error(res.msg || '删除失败')
      }
    })
  }
}
</script>

<template>
  <div class="project-manage">
    <div class="header-actions">
      <h2>项目管理</h2>
      <n-button type="primary" @click="handleOpenUpload">
        <template #icon>
          <n-icon :component="AddOutline" />
        </template>
        上传项目
      </n-button>
    </div>

    <n-spin :show="loading">
      <div v-if="data.length === 0 && !loading" class="empty-state">
        <n-empty description="暂无项目，快去上传一个吧" />
      </div>

      <n-grid x-gap="16" y-gap="16" cols="1 s:2 m:3 l:4" responsive="screen">
        <n-grid-item v-for="item in data" :key="item._id">
          <n-card hoverable class="project-card">
            <template #header>
              <div class="card-header">
                <div class="icon-wrapper">
                  <n-icon :component="DocumentTextOutline" color="#18a058" />
                </div>
                <n-ellipsis style="max-width: 150px">
                  {{ item.项目名称 }}
                </n-ellipsis>
              </div>
            </template>
            <template #header-extra>
              <n-tag :type="getStatusType(item.状态)" size="small" :bordered="false">
                {{ getStatusText(item.状态) }}
              </n-tag>
            </template>
            
            <div class="card-content">
              <n-ellipsis :line-clamp="2" :tooltip="false" class="description">
                {{ item.项目描述 || '暂无描述' }}
              </n-ellipsis>
              
              <div class="meta-info">
                <n-icon :component="TimeOutline" class="time-icon" />
                <span class="time">{{ new Date(item.上传时间).toLocaleString() }}</span>
              </div>

              <div v-if="item.后端地址" class="backend-info">
                <n-tag size="small" :bordered="false" type="info">
                  <template #icon>
                    <n-icon :component="LinkOutline" />
                  </template>
                  后端: {{ item.后端地址 }}
                </n-tag>
              </div>
            </div>

            <template #action>
              <div class="card-actions">
                <n-button 
                  size="small" 
                  secondary 
                  type="primary" 
                  :disabled="item.状态 !== 'deployed'"
                  @click="handlePreview(item)"
                  class="action-btn"
                >
                  <template #icon><n-icon :component="EyeOutline" /></template>
                  预览
                </n-button>
                <n-button 
                  size="small" 
                  secondary 
                  type="info" 
                  @click="handleEdit(item)"
                  class="action-btn"
                >
                  <template #icon><n-icon :component="CreateOutline" /></template>
                  编辑
                </n-button>
                <n-button 
                  size="small" 
                  secondary 
                  type="error" 
                  @click="handleDelete(item)"
                  class="action-btn"
                >
                  <template #icon><n-icon :component="TrashOutline" /></template>
                  删除
                </n-button>
              </div>
            </template>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-spin>

    <!-- 上传/编辑模态框 -->
    <n-modal v-model:show="showModal" preset="dialog" :title="isEdit ? '编辑项目' : '上传项目'">
      <n-form
        ref="formRef"
        :model="formValue"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        style="margin-top: 24px"
      >
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入项目名称" />
        </n-form-item>
        <n-form-item label="项目描述" path="description">
          <n-input v-model:value="formValue.description" type="textarea" placeholder="请输入项目描述" />
        </n-form-item>
        <n-form-item label="后端服务地址" path="backendUrl">
          <n-input v-model:value="formValue.backendUrl" placeholder="例如: http://localhost:8080/api" />
        </n-form-item>
        <n-form-item label="项目文件" path="file" v-if="!isEdit">
          <n-upload
            accept=".zip"
            :max="1"
            :default-upload="false"
            @change="handleFileChange"
          >
            <n-button>
              <template #icon>
                <n-icon :component="CloudUploadOutline" />
              </template>
              选择 ZIP 压缩包
            </n-button>
          </n-upload>
        </n-form-item>
      </n-form>
      
      <template #action>
        <n-space>
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" :loading="uploading" @click="handleSubmit">
            {{ isEdit ? '确认修改' : '确认上传' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 预览模态框 -->
    <n-modal
      v-model:show="previewModalShow"
      preset="card"
      :title="'预览 - ' + currentPreviewTitle"
      style="width: 90vw; height: 90vh;"
    >
      <div class="preview-container">
        <iframe 
          v-if="currentPreviewUrl" 
          :src="currentPreviewUrl" 
          frameborder="0" 
          width="100%" 
          height="100%"
        ></iframe>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.project-manage {
  min-height: 100%;
  padding-bottom: 24px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #1f2225;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #e7f5ee;
  border-radius: 8px;
  margin-right: 12px;
}

.card-content {
  margin-top: 8px;
  flex: 1;
}

.description {
  color: #666;
  font-size: 14px;
  height: 42px; /* 2 lines */
  margin-bottom: 16px;
}

.meta-info {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.time-icon {
  margin-right: 4px;
}

.backend-info {
  margin-top: 8px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
}

.empty-state {
  padding: 60px 0;
  display: flex;
  justify-content: center;
}

.preview-container {
  width: 100%;
  height: calc(90vh - 100px);
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
