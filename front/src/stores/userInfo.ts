import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo: {id:number,username:string} = reactive({
        id: 0,
        username: ''
    })
    
    return {
        userInfo
    }
})
