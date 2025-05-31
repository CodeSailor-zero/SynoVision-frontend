<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <div class="title">图库</div>
        <!--        <router-link to="/">-->
        <!--          <div class="title-bar">-->
        <!--            &lt;!&ndash;        <img class="logo" src="../assets/logo.svg" alt="logo" />&ndash;&gt;-->
        <!--           -->
        <!--          </div>-->
        <!--        </router-link>-->
      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMeumCilck"/>
      </a-col>
      <a-col flex="120px">
        <div v-if="loginUserStore.loginUser.id">
          <a-dropdown>
            <a-space>
              <div class="user-name">
                <a-avatar :src="loginUserStore.loginUser.userAvatar"/>
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </div>
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <router-link to="/space/my">
                    <UserOutlined/>
                    我的空间
                  </router-link>
                </a-menu-item>
                <a-menu-item @click="doUserLoginOut">
                  <LogoutOutlined/>
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div class="user-login-status" v-else>
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>

    </a-row>


  </div>
</template>


<script lang="ts" setup>
import {computed, h, ref} from 'vue';
import {HomeOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons-vue';
import {MenuProps, message} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {userLoginOutUsingPost} from "@/api/userController";


const originItems = ([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/picture/add',
    label: '上传图片',
    title: '上传图片',
  },
  {
    key: '/space/add',
    label: '空间创建',
    title: '空间创建',
  },
  {
    key: '/admin/tag/add',
    label: '上传图片标签',
    title: '上传图片标签',
  },
  {
    key: '/admin/picture/add/batch',
    label: '批量上传图片',
    title: '批量上传图片',
  },
  {
    key: '/admin/userManager',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/picture/manager',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/tag/manager',
    label: '图片标签管理',
    title: '图片标签管理',
  },
  {
    key: '/admin/space/manager',
    label: '图片空间管理',
    title: '图片空间管理',
  },
  {
    key: 'other',
    label: h('a', {href: 'https://www.baidu.com', target: '_blank'}, '百度'),
    title: '百度',
  },
])

const filterMenu = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = useLoginStore().loginUser;
      if (!loginUser || loginUser?.userRole !== 'admin') {
        return false;
      }
    }
    return true;
  })
}

const items = computed(() => {
  return filterMenu(originItems);
})

const router = useRouter();
const loginUserStore = useLoginStore();

const doMeumCilck = ({key}) => {
  router.push(key);
}

const current = ref<string[]>([]);
router.afterEach((to, from, failure) => {
  current.value = [to.path];
})

const doUserLoginOut = async () => {
  const res = await userLoginOutUsingPost();
  if (res.code === 0) {
    message.success('退出成功');
    // 清除用户信息
    loginUserStore.loginUser = {userName: '未登录'}
    await router.replace('/user/login')
  } else {
    message.error('退出失败', res.message);
  }
}
</script>
<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;

}
.user-name {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
