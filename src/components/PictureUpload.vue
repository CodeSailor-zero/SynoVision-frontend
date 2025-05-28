<template>
  <div class="PictureUpload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
    >
      <img v-if="props.picture?.url" :src="props.picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons-vue';
import type {UploadProps} from 'ant-design-vue';
import {message} from "ant-design-vue/lib";
import {uploadUsingPost} from "@/api/pictureController";

interface Props {
  picture?: API.PictureVo,
  spaceId?: number,
  onSuccess?: (newPicture: API.PictureVo) => void
}
const props = defineProps<Props>();


const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

/**
 * 上传前的校验
 * @param file
 */

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const handleUpload = async ({ file } : any) => {
  loading.value = true;
  try {
    const params : API.PictureUploadRequest = props.picture ? {id: props.picture.id} : {};
    params.spaceId = props.spaceId;
    console.log('上传图片',params)
    const res = await uploadUsingPost(params,{},file);
    if (res.code === 0 && res.data) {
      message.success('上传成功');
      //将上传的图片传递给父组件
      props?.onSuccess(res.data);
    }else {
      message.error('上传失败');
    }
  } catch (error) {
    console.error('上传失败',error);
    message.error('上传失败',error.message);
  }
  loading.value = false;



}
</script>

<style scoped>
.PictureUpload :deep(.ant-upload){
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

.PictureUpload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
