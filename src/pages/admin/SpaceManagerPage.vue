<template>
  <div id="SpaceManagerPage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/space/add" target="_blank">+ 创建空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"/>
    <a-form
      style="margin-bottom: 16px"
      :model="searchParams"
      layout="inline"
      @finish="doSearch"
    >
      <a-form-item name="spaceName" label="空间名">
        <a-input v-model:value="searchParams.spaceName" placeholder="空间名"/>
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          style="min-width: 180px"
          v-model:value="searchParams.spaceLevel"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
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
        <template v-else-if="column.key === 'spaceName'">
          {{ record.spaceName }}
        </template>
        <template v-else-if="column.key === 'userName'">
          {{ record.userName }}
        </template>
        <template v-else-if="column.key === 'spaceLevel'">
          空间级别：{{ SPACE_LEVEL_MAP[record.spaceLevel] }}
        </template>
        <template v-else-if="column.key === 'spaceInfo'">
          <a-space wrap>
            <a-tag>空间图片容量大小: {{ Number(record.totalSize) === 0 ? '0' : convertBytes(record.totalSize) }} / {{ convertBytes(record.maxSize) }}</a-tag>
            <a-tag>空间图片数量大小：{{ record.totalCount }} / {{ record.maxCount }}</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'userId'">
          {{ record.userId }}
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.key === 'editTime'">
          {{ dayjs(record.editTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.key === 'updateTime'">
          {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="primary" ghost @click="toEditSpace(record.id)">编辑</a-button>
            <a-button type="primary" danger @click="doDeleteSpace(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {deleteSpaceUsingPost, listSpaceUsingPost} from "@/api/spaceController";
import {SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS} from "@/constant/space";
import dayjs from "dayjs";
import {convertBytes} from "@/util";
import router from "@/router";

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '空间名',
    dataIndex: 'spaceName',
    key: 'spaceName',
  },
  {
    title: '空间等级',
    dataIndex: 'spaceLevel',
    key: 'spaceLevel',
  },
  {
    title: '空间信息',
    key: 'spaceInfo',
    dataIndex: 'spaceInfo',
  },
  {
    title: '创建用户id',
    key: 'userId',
    dataIndex: 'userId',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    key: 'editTime',
    dataIndex: 'editTime',
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const dataList = ref([]);
const total = ref(0);

const searchParams = reactive<API.SpaceQueryRequest>({
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
  const res = await listSpaceUsingPost({
    ...searchParams,
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
const doDeleteSpace = async (id: number) => {
  if (!id ) {
    message.error("操作错误");
    return;
  }
  const res = await deleteSpaceUsingPost({
    id: id
  });
  if (res.code === 0) {
    message.success('删除空间成功');
    await fetchData();
  }else {
    message.error('删除空间失败', res.message);
  }
}
const toEditSpace = (id) => {
  router.push({
    path: `/space/add/${id}`
  })
}
</script>
<style scoped>
#SpaceManagerPage {

}
</style>
