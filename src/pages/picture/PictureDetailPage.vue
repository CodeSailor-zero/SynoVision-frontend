<template>
  <div id="PictureDetailPage">
    <a-row :gutter="[16,16]">
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image :src="pictureVo.url" style="max-height: 600px; object-fit: contain"/>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :src="pictureVo.userVo?.userAvatar"/>
                {{ pictureVo?.userVo?.userName }}
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="图片名称">{{ pictureVo.name }}</a-descriptions-item>
            <a-descriptions-item label="简介">{{ pictureVo.introduction }}</a-descriptions-item>
            <a-descriptions-item label="分类">{{ pictureVo.category }}</a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in pictureVo.tagList" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ dayjs(pictureVo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-descriptions-item>
            <a-descriptions-item label="图片大小">{{ convertBytes(pictureVo.picSize) }}</a-descriptions-item>
            <a-descriptions-item label="图片格式">{{ pictureVo.picFormat }}</a-descriptions-item>
          </a-descriptions>

          <a-space wrap>
           <a-button type="primary" @click="doDownload">
             下载
             <template #icon>
               <DownloadOutlined />
             </template>
           </a-button>
            <a-button v-if="canEditPicture" type="default" :icon="h(EditOutlined)" @click="doEditPicture">编辑</a-button>
            <a-button v-if="canDeletePicture" type="default" danger :icon="h(DeleteOutlined)" @click="doDeletePicture">删除</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {computed, h, onMounted, ref} from "vue";
import {deletePictureUsingPost, getPictureVoUsingGet} from "@/api/pictureController";
import {message} from "ant-design-vue";
import {DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import {convertBytes, downloadImage} from "@/util";
import {useRouter} from "vue-router";
import {SPACE_PERMISSION_ENUM} from "@/constant/space";

interface Props {
  pictureId: string | number;
}

const props = defineProps<Props>();

const id = props.pictureId;
const pictureVo = ref<API.PictureVo>({});
const fetchPictureDetail = async () => {
  if (!id) {
    message.error('图片不存在');
    return;
  }
  try {
    const res = await getPictureVoUsingGet({
      id: id
    });
    if (res.code == 0 && res.data) {
      pictureVo.value = res.data;
    } else {
      message.error('获取图片详情失败', res.message);
    }
  } catch (e: any) {
    message.error('获取图片详情失败', e.message);
  }

}

onMounted(() => {
  fetchPictureDetail();
});

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (pictureVo.value.parmissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

const router = useRouter();

const doEditPicture = () => {
  const id = pictureVo.value.id;
  router.replace({
    path: "/picture/add",
    query: {
      id: id,
      spaceId: pictureVo.value.spaceId
    }
  })
}
const doDeletePicture = async () => {
  const id = pictureVo.value.id;
  if (!id) {
    message.error("操作错误");
    return;
  }
  const res = await deletePictureUsingPost({
    id: id
  });
  if (res.code === 0) {
    message.success('删除图片成功');
    await router.replace({
      path: "/"
    })
  } else {
    message.error('删除图片失败', res.message);
  }
}

const doDownload = () => {
  downloadImage(pictureVo.value.originalUrl ?? '', pictureVo.value.name ?? '');
  console.log(pictureVo.value.originalUrl);
}

</script>
<style scoped>
#PictureDetailPage {
  margin-bottom: 16px;
}

</style>
