<template>
  <a-modal class="ImageOutPainting" v-model:visible="visible" title="Ai扩图" :footer="false" @cancel="closeModel">
    <a-row gutter="16">
      <a-col span="12">
        <h4>原始图片</h4>
        <img :src="props.picture?.url" :alt="props.picture?.name" style="max-width: 100%">
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <img v-if="resultUrl" :src="resultUrl" :alt="props.picture?.name" style="max-width: 100%">
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px"/>
    <a-flex justify="center" gap="16">
      <a-button type="primary" ghost :loading="!!taskId" @click="createTask">生成图片</a-button>
      <a-button v-if="resultUrl" type="primary" :loading="uploading" @click="handleUpload">保存图片</a-button>
    </a-flex>
  </a-modal>


</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {
  createOutPaintingTaskUsingPost,
  getOutPaintingTaskUsingGet,
  uploadByUrlUsingPost
} from "@/api/pictureController";
import {message} from "ant-design-vue/lib";

interface Props {

  picture?: API.PictureVo,
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>();

//扩图后的图片url
const resultUrl = ref<string>('');

const taskId = ref()

/**
 * 生成扩图任务
 */
const createTask = async () => {
  if (!props.picture?.id) {
    return;
  }
  loading.value = true;
  const res = await createOutPaintingTaskUsingPost({
    pictureId: props.picture.id,
    param: {
      xScale: 2,
      yScale: 2
    }
  });
  if (res.code === 0 && res.data) {
    message.success('生成任务成功');
    //此次任务的唯一标识 taskId
    taskId.value = res.data.output.taskId;
    //开始轮询，查看任务是否执行完成
    startPolling();
  } else {
    message.error('生成任务失败');
  }
  loading.value = false;
}

// 轮询定时器
let pollingTimer: NodeJS.Timeout = null;

//开启轮询
const startPolling = () => {
  if (!taskId.value) {
    return;
  }

  pollingTimer = setInterval(async () => {
    try {
      const res = await getOutPaintingTaskUsingGet({
        taskId: taskId.value
      });
      if (res.code === 0 && res.data) {
        const taskResult = res.data.output;
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('扩图成功');
          resultUrl.value = taskResult.outputImageUrl;
          //关闭轮询
          closePolling();
        } else if (taskResult.taskStatus === 'FAILED') {
          message.error('扩图失败');
          //关闭轮询
          closePolling();
        }
      }
    } catch (e) {
      console.error('轮询失败', e);
      message.error('扩图失败' + e.message)
      //关闭轮询
      closePolling();
    }
  },3000) //每隔三秒轮询一次
}

//关闭轮询
const closePolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    taskId.value = null;
  }
}


const loading = ref(false);
const uploading = ref(false);
/**
 * 上传图片
 */
const handleUpload = async () => {
  uploading.value = true;
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultUrl.value,
      spaceId: props.spaceId
    }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadByUrlUsingPost(params);
    if (res.code === 0 && res.data) {
      message.success('上传成功');
      //将上传的图片传递给父组件
      props?.onSuccess?.(res.data);
      closeModel();
    } else {
      message.error('上传失败');
    }
  } catch (error) {
    console.error('上传失败', error);
    message.error('上传失败', error.message);
  }
  uploading.value = false;
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
.ImageOutPainting {
  text-align: center;
}

.ImageOutPainting .vue-cropper {
  height: 400px !important;
}

</style>
