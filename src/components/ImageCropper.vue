<template>
  <a-modal  class="ImageCropper" v-model:visible="visible" title="操作图片" :footer="false" @cancel="closeModel">
    <div>
        <vue-cropper
          ref="cropperRef"
          :img="props.imageUrl"
          output-type="png"
          :info="true"
          :can-move="false"
          :can-move-box="true"
          :fixed-box="false"
          :auto-crop="true"
          :center-box="true"
        />
        <div style="margin-bottom: 16px"/>
        <div class="ImageCropperOptions">
          <a-space>
            <a-button @click="rotateLeft">向左旋转</a-button>
            <a-button @click="rotateRight">向右旋转</a-button>
            <a-button @click="changeScale(1)">放大</a-button>
            <a-button @click="changeScale(-1)">缩小</a-button>
            <a-button :loading="loading" type="primary" @click="handelConfirm">确认</a-button>
          </a-space>
        </div>
    </div>
  </a-modal>


</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {uploadUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue/lib";

interface Props {
  imageUrl: string,
  picture?: API.PictureVo,
  spaceId?: number,
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>();

const cropperRef = ref(null);

//缩放比例
const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num);
}

//向左旋转
const rotateLeft = () => {
  cropperRef.value?.rotateLeft();
}

//向右旋转
const rotateRight = () => {
  cropperRef.value?.rotateRight();
}

const handelConfirm = () => {
  cropperRef.value.getCropBlob((blob: any) => {
    const fileName = (props.picture?.name || 'image') + '.png';
    const file = new File([blob], fileName, {type: blob.type});
    handleUpload({file});
  })
}

const loading = ref(false);
const handleUpload = async ({ file } : any) => {
  loading.value = true;
  try {
    const params : API.PictureUploadRequest = props.picture ? {id: props.picture.id} : {};
    params.spaceId = props.spaceId;
    console.log('上传图片',file)
    const res = await uploadUsingPost(params,{},file);
    if (res.code === 0 && res.data) {
      message.success('上传成功');
      //将上传的图片传递给父组件
      props?.onSuccess(res.data);
      closeModel();
    }else {
      message.error('上传失败');
    }
  } catch (error) {
    console.error('上传失败',error);
    message.error('上传失败',error.message);
  }
  loading.value = false;
}

const visible = ref(false);
//打开弹窗
const openModel = () => {
  visible.value = true
}
//关闭弹窗
const closeModel = () => {
  visible.value = false
}

//将函数暴露给父组件
defineExpose({
  openModel,
})

</script>

<style scoped>
.ImageCropper {
  text-align: center;
}

.ImageCropper .vue-cropper {
  height: 400px !important;
}

</style>
