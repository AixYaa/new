<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()
</script>

<template>
    <div>
        <h1>HomeView</h1>
        <p>Welcome, {{ userInfoStore.userInfo.username }}</p>
    </div>
</template>
