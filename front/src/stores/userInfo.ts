import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo = ref<{id:number,username:string}>({
        id: 0,
        username: ''
    })
    
    return {
        userInfo
    }
}, {
    persist: true
})
