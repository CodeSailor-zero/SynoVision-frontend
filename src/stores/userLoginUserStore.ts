import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController'

export const useLoginStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVo>({
    userName: '未登录',
  })

  async function fetchLoginUser() {
    //调用接口获取当前用户信息
    const res = await getLoginUserUsingGet()
    if (res.code === 0 && res.data) {
      // loginUser.value = res.data
      setLoginUser(res.data)
    }
  }

  //跟新用户信息

  function setLoginUser(newUser: any) {
    loginUser.value = newUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
