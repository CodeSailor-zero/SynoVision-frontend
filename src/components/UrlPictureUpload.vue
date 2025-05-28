<template>
  <div class="UrlPictureUpload">
    <a-input-group compact>
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片地址"/>
      <a-button type="primary" style="width: 120px" :loading="loading" @click="handleUpload">提交</a-button>
    </a-input-group>
    <div class="picture-url">
      <img v-if="props.picture.url" :src="props.picture.url" :alt="props.picture?.name"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {message} from "ant-design-vue/lib";
import {uploadByUrlUsingPost} from "@/api/pictureController";

interface Props {
  picture?: API.PictureVo,
  spaceId: number,
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>();


const loading = ref<boolean>(false);
const fileUrl = ref<string>('');


const handleUpload = async () => {
  loading.value = true;
  try {
    const params: API.PictureUploadRequest = {fileUrl: fileUrl.value}
    params.spaceId = props.spaceId;
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadByUrlUsingPost(params);
    if (res.code === 0 && res.data) {
      message.success('上传成功');
      //将上传的图片传递给父组件
      props?.onSuccess(res.data);
    } else {
      message.error('上传失败');
    }
  } catch (error) {
    console.error('上传失败', error);
    message.error('上传失败', error.message);
  }
  loading.value = false;


}
</script>

<style scoped>
.UrlPictureUpload  {
  margin-bottom: 16px;
}

.UrlPictureUpload img {
  max-width: 100%;
  max-height: 480px;
}

.UrlPictureUpload .picture-url {
  text-align: center;
  margin-top: 16px;
}

</style>
