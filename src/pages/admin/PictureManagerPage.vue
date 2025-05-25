<template>
  <div id="AdminPictureManagerPage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/picture/add" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/picture/add/batch" target="_blank" ghost>+ 批量创建图片</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"/>

    <a-form
      style="margin-bottom: 16px"
      :model="searchParams"
      layout="inline"
      @finish="doSearch"
    >
      <a-form-item name="pictureAccount" label="图片名">
        <a-input v-model:value="searchParams.name" placeholder="图片名"/>
      </a-form-item>
      <a-form-item name="pictureName" label="图片简介">
        <a-input v-model:value="searchParams.introduction" placeholder="图片简介"/>
      </a-form-item>
      <a-form-item name="reviewStatus" label="审核状态">
        <a-select
          style="min-width: 180px"
          v-model:value="searchParams.reviewStatus"
          placeholder="请选择审核状态"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          {{ record.id }}
        </template>
        <template v-else-if="column.key === 'url'">
          <a-image :src="record.url"/>
        </template>
        <template v-else-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-else-if="column.key === 'introduction'">
          {{ record.introduction }}
        </template>
        <template v-else-if="column.key === 'tags'">
          <a-tag v-for="tag in JSON.parse(record.tags)" :key="tag">
            <a-space wrap>
              {{ tag }}
            </a-space>
          </a-tag>
        </template>
        <template v-else-if="column.key === 'pictureInfo'">
          <a-space wrap>
            <a-tag>图片体积: {{ convertBytes(record.picSize) }}</a-tag>
            <a-tag>图片宽度：{{ record.picWidth }}</a-tag>
            <a-tag>图片高度：{{ record.picHeight }}</a-tag>
            <a-tag>宽高比：{{ record.picScale }}</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'reviewInfo'">
          <a-space wrap>
            <a-tag>审核状态: {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</a-tag>
            <a-tag>审核信息：{{ record.reviewMessage }}</a-tag>
            <a-tag>审核人：{{ record.reviewId }}</a-tag>
            <a-tag v-if="record.reviewTime">
              审核时间：{{ dayjs(record.reviewTime).format("YYYY-MM-DD HH:mm:ss") }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'userId'">
          {{ record.userId }}
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="primary"
              @click="handelReview(record,PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              过审
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="primary"
              danger
              @click="handelReview(record,PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="primary" :href="`/picture/add?id=${record.id}`" target="_blank">编辑</a-button>
            <a-button type="primary" danger @click="doDeletePicture(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import dayjs from "dayjs";
import {deletePictureUsingPost, doPictureReviewUsingPost, listPictureUsingPost} from "@/api/pictureController";
import {PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP, PIC_REVIEW_STATUS_OPTIONS} from "../../constant/picture";
import {convertBytes} from "@/util";

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '图片url',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: '图片名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '图片简介',
    key: 'introduction',
    dataIndex: 'introduction',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    key: 'pictureInfo',
    dataIndex: 'pictureInfo',
  },
  {
    title: '创建图片用户id',
    key: 'userId',
    dataIndex: 'userId',
  },
  {
    title: '审核信息',
    key: 'reviewInfo',
    dataIndex: 'reviewInfo',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];


const dataList = ref<API.Picture[]>([]);
const total = ref(0);

const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'desc',
})

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

const fetchData = async () => {
  const res = await listPictureUsingPost({
    ...searchParams
  })
  if (res.code === 0 && res.data) {
    dataList.value = res.data.records ?? [];
    total.value = res.data.total ?? 0;
  } else {
    message.error("获取数据失败", res.message);
  }
}

onMounted(() => {
  fetchData();
})

const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData();
}
const doSearch = () => {
  //重置页数
  searchParams.current = 1;
  fetchData();
}
const doDeletePicture = async (id: number) => {
  if (!id) {
    message.error("操作错误");
    return;
  }
  const res = await deletePictureUsingPost({
    id: id
  });
  if (res.code === 0) {
    message.success('删除图片成功');
    await fetchData();
  } else {
    message.error('删除图片失败', res.message);
  }
}

const handelReview = async (picture: API.Picture,reviewStatus) => {
  const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? "管理员手动通过" : "管理员手动拒绝";
  const res = await doPictureReviewUsingPost({
    id: picture.id,
    reviewStatus: reviewStatus,
    reviewMessage: reviewMessage
  });
  if (res.code === 0) {
    message.success('审核图片成功');
    await fetchData();
  } else {
    message.error('审核图片失败', res.message);
  }
}
</script>

<style scoped>
#AdminPictureManagerPage {

}
</style>
