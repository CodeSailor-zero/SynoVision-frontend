import router from '@/router'
import {useLoginStore} from '@/stores/userLoginUserStore'

//是否为首次获取用户信息
let firstFetchLoginUser = true

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginStore()
  let loginUser = loginUserStore.loginUser;
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.fullPath;
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      next('/common/NoAuth');
    }
  }
  next();
})
