<template>
  <div id="SpaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ spaceVo.spaceName }}（私有空间）</h2>
      <a-space>
        <a-button type="primary" @click="toAddPicture">+ 创建图片</a-button>
<!--        <a-tooltip-->
<!--          :title="`占用空间:${ convertBytes(spaceVo.totalSize) } / ${ convertBytes(spaceVo.maxSize) }`"-->
<!--        >-->
<!--          <a-progress-->
<!--            :percent="( spaceVo.totalSize * 100 / spaceVo.maxSize).toFixed(1)"-->
<!--          />-->
<!--        </a-tooltip>-->
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"/>
    <!-- 图片列表区 -->
    <PictureList :picture-vo-list="pictureVoList" :loading="loading" :show-o-p="true" :onReload="getPictureVoList"/>
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
import {defineProps} from 'vue';
import {message} from "ant-design-vue";
import {listPictureVoUsingPost} from "@/api/pictureController";
import {onMounted, reactive, ref} from "vue";
import {getSpaceVoUsingGet} from "@/api/spaceController";
import PictureList from "@/components/PictureList.vue";
import router from "@/router";

interface Props {
  id: string | number;
}

const props = defineProps<Props>();


// 获取空间信息
const id = props.id;
const spaceVo = ref<API.SpaceVo>({});
const fetchPictureDetail = async () => {
  if (!id) {
    message.error('空间不存在');
    return;
  }
  try {
    const res = await getSpaceVoUsingGet({
      id: id
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
    spaceId: id,
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

const onChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  getPictureVoList();
}

onMounted(() => {
  fetchPictureDetail();
  getPictureVoList();
});

const toAddPicture = () => {
  router.push({
    path: `/picture/add`,
    query: {
      spaceId: props.id
    }
  })
}
</script>
<style scoped>
#SpaceDetailPage {

}
</style>
