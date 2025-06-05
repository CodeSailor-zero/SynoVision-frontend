<template>
  <a-modal class="ImageCropper" v-model:visible="visible" title="操作图片" :footer="false" @cancel="closeModel">
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
      <div class="ImageEditActions" v-if="isTeamSpace">
        <!-- 图片协作编辑区域  -->
        <a-flex justify="space-between" gap="middle">
          <span v-if="editingUser">用户 {{ editingUser.userName }} 正在编辑</span>
          <a-button v-if="canEnterEditPic" type="primary" ghost @click="handelEnterEdit">进入编辑</a-button>
          <a-button v-if="canExitEditPic" type="primary" danger @click="handelExitEdit">退出编辑</a-button>
        </a-flex>
      </div>
      <div style="margin-bottom: 16px"/>
      <div class="ImageCropperOptions">
          <!-- 图片操作区域 -->
        <a-flex justify="space-around" gap="middle">
          <a-button :disabled="canEditPic" @click="rotateLeft">向左旋转</a-button>
          <a-button :disabled="canEditPic" @click="rotateRight">向右旋转</a-button>
          <a-button :disabled="canEditPic" @click="changeScale(1)">放大</a-button>
          <a-button :disabled="canEditPic" @click="changeScale(-1)">缩小</a-button>
          <a-button type="primary" :disabled="!canEditPic" :loading="loading" @click="handelConfirm">确认</a-button>
        </a-flex>
      </div>
    </div>
  </a-modal>


</template>

<script setup lang="ts">
import {computed, defineProps, onUnmounted, ref, watchEffect} from 'vue';
import {uploadUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue/lib";
import {useLoginStore} from "@/stores/userLoginUserStore";
import PictureEditWs from "@/util/PictureEditWs";
import {PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM} from "@/constant/picture";
import {SPACE_TYPE_ENUM} from "@/constant/space";

interface Props {
  imageUrl: string,
  picture?: API.PictureVo,
  spaceId?: number,
  space?: API.SpaceVo,
  onSuccess?: (newPicture: API.PictureVo) => void
}

const props = defineProps<Props>();

const cropperRef = ref(null);

//缩放比例
const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num);
  if (num < 0) {
    handelEditAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  } else {
    handelEditAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  }
}

//向左旋转
const rotateLeft = () => {
  cropperRef.value?.rotateLeft();
  handelEditAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

//向右旋转
const rotateRight = () => {
  cropperRef.value?.rotateRight();
  handelEditAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

const handelConfirm = () => {
  cropperRef.value.getCropBlob((blob: any) => {
    const fileName = (props.picture?.name || 'image') + '.png';
    const file = new File([blob], fileName, {type: blob.type});
    handleUpload({file});
  })
}

const loading = ref(false);
const handleUpload = async ({file}: any) => {
  loading.value = true;
  try {
    const params: API.PictureUploadRequest = props.picture ? {id: props.picture.id} : {};
    params.spaceId = props.spaceId;
    console.log('上传图片', file)
    const res = await uploadUsingPost(params, {}, file);
    if (res.code === 0 && res.data) {
      message.success('上传成功');
      //将上传的图片传递给父组件
      props?.onSuccess(res.data);
      closeModel();
    } else {
      message.error('上传失败');
    }
  } catch (error) {
    console.error('上传失败', error);
    message.error('上传失败', error.message);
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
  // 销毁 webSocket
  if (webSocket) {
    webSocket?.closeconnect();
  }
  manualClose.value = false;
  editingUser.value = undefined;
}

//将函数暴露给父组件
defineExpose({
  openModel,
})

//----------------- 协作区域 -----------------
const loginuserStore = useLoginStore();
const loginuser = loginuserStore.loginUser;
const manualClose = ref(false); //  是否重连 webscoket ,true为重连，false为不重连
//判断当前空间是否为团队空间
const isTeamSpace = computed(() => {
  return props.space?.spaceType  === SPACE_TYPE_ENUM.TEAM
})

// 正在编辑的用户
const editingUser = ref<API.UserVo>();

// 当前的用户是否有权限可以进入编辑
const canEnterEditPic = computed(() => {
  return !editingUser.value
});

// 当前用户是否有权限可以退出编辑
const canExitEditPic = computed(() => {
  return loginuser?.id === editingUser.value?.id;
})

// 当前用户是否可以编辑图片
const canEditPic = computed(() => {
  //如果不是团队空间，则任何用户都可以编辑图片
  if (isTeamSpace.value) {
    return true;
  }
  // 如果是团队空间，则只有有权限的团队空间成员可以编辑图片
  return loginuser?.id === editingUser.value?.id;
})

let webSocket: PictureEditWs | null;
// 初始化 webSocket
const initWebSocket = () => {
  const pictureId = props.picture?.id;
  if (!pictureId || !visible.value) {
    return;
  }
  // 如果已经有 webSocket，就之间关闭
  if (webSocket) {
    webSocket.closeconnect();
  }
  // 创建 webSocket 实例
  webSocket = new PictureEditWs(pictureId,manualClose.value);
  // webSocket 创建连接
  webSocket.connect();
  // 监听事件
  //1. 编辑通知
  webSocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg: any) => {
    console.log('收到图片编辑通知', msg)
    message.info(msg.message)
  })
  //2.错误通知
  webSocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg: any) => {
    console.log('收到图片编辑错误通知', msg)
    message.error(msg.message)
  })
  //3.进入编辑
  webSocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg: any) => {
    console.log('收到图片进入编辑通知', msg)
    message.info(msg.message)
    //  更新正在编辑的用户
    editingUser.value = msg.userVo;
    console.log('收到图片进入编辑通知', msg)
  })
  //4.执行编辑操作
  webSocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg: any) => {
    console.log('收到图片执行编辑操作通知', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        rotateLeft();
        break;
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        rotateRight();
        break;
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        changeScale(1);
        break;
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        changeScale(-1);
        break;
    }
  })
  //5.退出编辑
  webSocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg: any) => {
    console.log('收到图片退出编辑通知', msg)
    message.info(msg.message)
    //  更新正在编辑的用户
    editingUser.value = undefined;
  })
}

// 监听 pictureId | visible 变化，初始化 webSocket
watchEffect(() => {
  //只有团队空间时才初始化 WebSocket
  if (isTeamSpace.value) {
    initWebSocket();
  }

})

// 销毁 webSocket
onUnmounted(() => {
  if (webSocket) {
    webSocket?.closeconnect();
  }
  manualClose.value = false;
  editingUser.value = undefined;
})

// 发送进入编辑请求
const handelEnterEdit = () => {
  webSocket?.sendMessage({
    type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
  });
}

// 发送退出编辑请求
const handelExitEdit = () => {
  webSocket?.sendMessage({
    type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
  });
}

// 发送执行编辑操作请求
const handelEditAction = (action: string) => {
  webSocket?.sendMessage({
    type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
    editAction: action
  });
}
</script>

<style scoped>
.ImageCropper {
  text-align: center;
}

.ImageCropper .vue-cropper {
  height: 400px !important;
}

</style>
