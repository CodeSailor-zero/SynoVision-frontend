<template>
  <div id="UserLoginPage">
    <h2 class="title">图库-用户登录</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      name="user"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: '请输入你的账号' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入你的账号"/>
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入你的密码' },
          {min: 8,message: '密码长度不能小于8位'}
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入你的密码"/>
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">立即注册</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {userLoginUsingPost} from "@/api/userController";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";

const loginUserSore = useLoginStore();
const router = useRouter();

const formState = ref<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});
const handleSubmit = async () => {
  const res = await userLoginUsingPost(formState.value);
  if (res.code == 0 && res.data) {
    message.success('登录成功');
    //跟新用户状态
    await loginUserSore.setLoginUser(res.data);
    await router.replace('/');
  }else {
    message.error('登录失败' + res.message);
  }
};

</script>
<style scoped>
#UserLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  margin-bottom: 16px;
  color: #bbb;
}

.tips {
  text-align: right;
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
}
</style>
