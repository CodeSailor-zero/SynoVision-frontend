<template>
  <div id="GlobalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      breakpoint="lg"
      collapsed-width="0"
      width="200"
    >
      <a-menu
        v-model:selectedKeys="current"
        :items="userItems"
        mode="inline"
        @click="doMeumCilck"
      />
    </a-layout-sider>
  </div>
</template>
<script setup lang="ts">
import {h, ref} from "vue";
import {PictureOutlined, UserOutlined} from "@ant-design/icons-vue";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {useRouter} from "vue-router";

const userItems = ([
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
  },
  {
    key: '/space/my',
    icon: () => h(UserOutlined),
    label: '我的空间',
    title: '我的空间',
  },
])

const router = useRouter();
const loginUserStore = useLoginStore();

const doMeumCilck = ({key}) => {
  router.push(key);
}

const current = ref<string[]>([]);
router.afterEach((to, from, failure) => {
  current.value = [to.path];
})
</script>
<style scoped>
#GlobalSider {

}
</style>
