<template>
  <div id="UserRegisterPage">
    <h2 class="title">图库-用户注册</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
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
      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '请确认你的密码' },
          {min: 8,message: '密码长度不能小于8位'}
        ]"
      >
        <a-input-password v-model:value="formState.checkPassword" placeholder="请确认你的密码"/>
      </a-form-item>
      <div class="tips">
        已有账号？
        <RouterLink to="/user/login">立即登录</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {userRegisterUsingPost} from "@/api/userController";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";

const router = useRouter();

const formState = ref<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword:''
});
const handleSubmit = async () => {
  if (formState.value.userPassword != formState.value.checkPassword) {
    message.error('两次密码不一致');

  }
  const res = await userRegisterUsingPost(formState.value);
  if (res.code == 0) {
    message.success('注册成功');
    await router.replace('/user/login');
  }else {
    message.error('注册失败' + res.message);
  }

};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
<style scoped>
#UserRegisterPage {
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
