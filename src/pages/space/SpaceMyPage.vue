<template>
  <div id="SpaceMyPage">
    <span>请稍等片刻…………………</span>
  </div>
</template>
<script setup lang="ts">

import {useRouter} from "vue-router";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {listSpaceVoUsingPost} from "@/api/spaceController";
import {message} from "ant-design-vue";
import {onMounted} from "vue";

const router = useRouter();
const userLoginStore = useLoginStore();

const checkUserSpace = async () => {
  //1.判断用户是否登录，未登录则跳转到登录页
  const loginUser = userLoginStore.loginUser;
  if (!loginUser.id) {
    //未登录
    await router.replace({
      path: '/user/login'
    });
    return;
  }
  //2.判断用户是否拥有空间，没有则跳转到创建空间页面
  const res = await listSpaceVoUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1
  });
  if (res.code === 0) {
    if (res.data.records?.length > 0) {
      const space = res.data.records[0];
      //有空间，跳转到详细页
      await router.replace({
        path: `/space/detail/${space.id}`
      });
    }else {
      //没有空间，跳转到创建空间页面
      await router.replace({
        path: '/space/add'
      });
      message.warn('请先创建空间');
    }
  }else {
    //请求失败
    message.error('请求失败 ' + res.message);
  }
}

onMounted(() => {
  checkUserSpace();
})
</script>
