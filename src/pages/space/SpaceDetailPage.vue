<template>
  <div id="SpaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ SPACE_TYPE_MAP[spaceVo.spaceType] }} : {{ spaceVo.spaceName }}</h2>
      <a-space size="middle">
        <a-button v-if="canManager" type="primary" @click="toSpaceMemberManager">空间成员管理</a-button>
        <a-button v-if="canUploadPicture" type="primary" @click="toAddPicture">+ 创建图片</a-button>
        <a-button v-if="canManager" type="primary" ghost :icon="h(BarChartOutlined)" @click="toAnalyzeSpace">分析空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"/>
    <!-- 图片列表区 -->
    <PictureList
      :picture-vo-list="pictureVoList"
      :loading="loading"
      :show-o-p="true"
      :onReload="getPictureVoList"
      :canEdit="canEditPicture"
      :canDelete="canDeletePicture"
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onChange"
    />

  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, h, reactive, ref, watch, watchEffect} from 'vue';
import {message} from "ant-design-vue";
import {listPictureVoUsingPost} from "@/api/pictureController";
import {getSpaceVoUsingGet} from "@/api/spaceController";
import PictureList from "@/components/PictureList.vue";
import router from "@/router";
import {BarChartOutlined} from "@ant-design/icons-vue";
import {SPACE_PERMISSION_ENUM, SPACE_TYPE_MAP} from "@/constant/space";

interface Props {
  id: string | number;
}

const props = defineProps<Props>();

// 获取空间信息
const spaceVo = ref<API.SpaceVo>({});
const fetchSpaceDetail = async () => {
  if (!props.id) {
    message.error('空间不存在');
    return;
  }
  try {
    const res = await getSpaceVoUsingGet({
      id: props.id
    });
    if (res.code == 0 && res.data) {
      spaceVo.value = res.data;
    } else {
      message.error('获取空间详情失败', res.message);
    }
  } catch (e: any) {
    message.error('获取空间详情失败', e.message);
  }
}

// 获取图片列表的信息
const loading = ref(false);
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'desc',
})
const pictureVoList = ref<API.PictureVo[]>([]);
const total = ref(0);
const getPictureVoList = async () => {

  const params = {
    spaceId: props.id,
    ...searchParams

  }

  const res = await listPictureVoUsingPost(params);
  if (res.code === 0 && res.data) {
    pictureVoList.value = res.data.records ?? [];
    total.value = res.data.total ?? 0;
  } else {
    message.error("获取数据失败", res.message);
  }
}

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (spaceVo.value.parmissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManager = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

const onChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  getPictureVoList();
}

watchEffect(() => {
  fetchSpaceDetail();
  getPictureVoList();
})


const toAddPicture = () => {
  router.push({
    path: `/picture/add`,
    query: {
      spaceId: props.id
    }
  })
}

const toAnalyzeSpace = () => {
  router.push({
    path: `/space/analyze`,
    query: {
      spaceId: props.id
    }
  })
}

const toSpaceMemberManager = () => {
  router.push({
    path: `/admin/space/member/manager/${props.id}`,
  })
}
</script>
<style scoped>
#SpaceDetailPage {

}
</style>
