import router from '@/router'
import {useLoginStore} from '@/stores/userLoginUserStore'

//是否为首次获取用户信息
let firstFetchLoginUser = true

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginStore();
  let loginUser = loginUserStore.loginUser;
  if (!loginUser?.id) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
    console.log("进来了")
  }
  const toUrl = to.fullPath;
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      next('/common/NoAuth');
    }
  }
  next();
})
