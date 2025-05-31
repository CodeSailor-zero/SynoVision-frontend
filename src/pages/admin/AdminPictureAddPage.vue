<template>
  <div id="AdminPictureAddPage">
    <h2 style="margin-bottom: 16px">创建图片</h2>
    <a-form
      name="PictureForm"
      :model="PictureForm"
      layout="vertical"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="searchText"
        label="搜索词"
      >
        <a-input v-model:value="PictureForm.searchText" placeholder="请输入搜索词"/>
      </a-form-item>

      <a-form-item
        name="count"
        label="获取图片个数"
        :rules="[{ required: true, message: '请输入获取图片个数' }]"
      >
        <a-input-number
          style="min-width: 180px"
          v-model:value="PictureForm.count"
           placeholder="请输入获取图片数量"
          :defaultValue="0"
          :min="1"
          :max="5"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        name="namePrefix"
        label="名称前缀"
      >
        <a-input v-model:value="PictureForm.namePrefix" placeholder="请输入名称前缀，会自动补充序号"/>
      </a-form-item>


      <a-form-item>
        <a-button type="primary" html-type="submit">获取图片</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {message} from "ant-design-vue";
import {uploadByBatchUsingPost} from "@/api/pictureController";
import {useRouter} from "vue-router";


const PictureForm = ref<API.PictureUploadByBatchRequest>({})

const router = useRouter();

const loading = ref(false);

const handleSubmit = async (values: any) => {
  loading.value = true;
  const res = await uploadByBatchUsingPost(PictureForm.value);
  if (res.code == 0) {
    message.success('上传成功，成功条数：' + res.data);
    await router.push({
      path: '/'
    })
  } else {
    message.error('上传失败' + res.message);
  }
  loading.value = false;
};
</script>
<style scoped>
#AdminPictureAddPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
