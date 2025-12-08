<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NConfigProvider, NDialogProvider } from 'naive-ui'
</script>

<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
/* 全局重置，确保 RouterView 占满 */
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止滚动条 */
}
</style>