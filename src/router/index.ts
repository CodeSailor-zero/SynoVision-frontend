import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserManagerPage from '@/pages/admin/UserManagerPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import NoAuthPage from '@/pages/common/NoAuthPage.vue'
import PictureAddPage from '@/pages/picture/PictureAddPage.vue'
import PictureManagerPage from '@/pages/admin/PictureManagerPage.vue'
import PictureDetailPage from '@/pages/picture/PictureDetailPage.vue'
import TagManagerPage from '@/pages/admin/TagManagerPage.vue'
import TagAddPage from '@/pages/tag/TagAddPage.vue'
import AdminPictureAddPage from "@/pages/admin/AdminPictureAddPage.vue";
import SpaceManagerPage from "@/pages/admin/SpaceManagerPage.vue";
import SpaceAddPage from "@/pages/space/SpaceAddPage.vue";
import SpaceMyPage from "@/pages/space/SpaceMyPage.vue";
import SpaceDetailPage from "@/pages/space/SpaceDetailPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/admin/userManager',
      name: '用户管理页面',
      component: UserManagerPage,
    },
    {
      path: '/user/login',
      name: '用户登录页面',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册页面',
      component: UserRegisterPage,
    },
    {
      path: '/picture/add',
      name: '上传图片页面',
      component: PictureAddPage,
    },
    {
      path: '/admin/picture/add/batch',
      name: '批量上传图片页面',
      component: AdminPictureAddPage,
    },
    {
      path: '/admin/tag/add:id',
      name: '上传图片标签页面',
      props: true,
      component: TagAddPage,
    },
    {
      path: '/admin/picture/manager',
      name: '图片管理页面',
      component: PictureManagerPage,
    },
    {
      path: '/admin/tag/manager',
      name: '图片标签管理页面',
      component: TagManagerPage,
    },
    {
      path: '/admin/space/manager',
      name: '图片空间管理页面',
      component: SpaceManagerPage,
    },
    {
      path: '/picture/detail/:pictureId',
      name: '图片详细页面',
      props: true,
      component: PictureDetailPage,
    },
    {
      path: '/common/NoAuth',
      name: '无权限页面',
      component: NoAuthPage,
    },
    {
      path: '/space/add/:id?',
      name: '空间创建页面',
      component: SpaceAddPage,
    },
    {
      path: '/space/my',
      name: '我的空间页面',
      component: SpaceMyPage,
    },
    {
      path: '/space/detail/:id',
      name: "空间详细页面",
      props: true,
      component: SpaceDetailPage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
