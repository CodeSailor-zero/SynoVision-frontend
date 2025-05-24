<template>
  <div id="TagManagerPage">
    <a-form
      style="margin-bottom: 16px"
      :model="searchParams"
      layout="inline"
      @finish="doSearch"
    >
      <a-form-item name="userAccount" label="标签名称">
        <a-input v-model:value="searchParams.tagName" placeholder="标签名称"/>
      </a-form-item>
      <a-form-item name="userName" label="标签类型">
        <a-input v-model:value="searchParams.tagType" placeholder="标签类型"/>
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
        <template v-else-if="column.key === 'tagName'">
          {{ record.tagName }}
        </template>
        <template v-else-if="column.key === 'tagType'">
          <div v-if="record.tagType === 'system'">
            <a-tag color="red">{{record.tagType}}</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">{{record.tagType}}</a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'createId'">
          {{ record.createId }}
        </template>
        <template v-else-if="column.key === 'userIds'">
          <a-tag v-for="userId in JSON.parse(record.userIds ?? '[]')" :key="userId">
            <a-space wrap>
              {{ userId }}
            </a-space>
          </a-tag>
        </template>
        <template v-else-if="column.key === 'tagCount'">
         {{ record.tagCount }}
        </template>
        <template v-else-if="column.key === 'createTime'">
          <div v-if="record.createTime">
            {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </div>
        </template>
        <template v-else-if="column.key === 'editTime'">
          <div v-if="record.editTime">
            {{ dayjs(record.editTime).format("YYYY-MM-DD HH:mm:ss") }}
          </div>
        </template>
        <template v-else-if="column.key === 'updateTime'">
          <div v-if="record.updateTime">
            {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
          <a-button type="primary" :href="`/tag/add/${record.id}`">编辑</a-button>
          <a-button type="primary" danger @click="doDeleteTag(record.id)">删除</a-button>
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
import {useLoginStore} from "@/stores/userLoginUserStore";
import {deleteTagUsingPost, listTagByPageUsingPost} from "@/api/tagController";

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '标签名称',
    dataIndex: 'tagName',
    key: 'tagName',
  },
  {
    title: '标签上传类型',
    dataIndex: 'tagType',
    key: 'tagType',
  },
  {
    title: '创建人id',
    key: 'createId',
    dataIndex: 'createId',
  },
  {
    title: '使用者id',
    key: 'userIds',
    dataIndex: 'userIds',
  },
  {
    title: '标签一周使用次数',
    key: 'tagCount',
    dataIndex: 'tagCount',
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
    title: 'Action',
    key: 'action',
  },
];


const dataList = ref([]);
const total = ref(0);
const loginUserStore = useLoginStore();

const searchParams = reactive<API.UserQueryRequest>({
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
  const res = await listTagByPageUsingPost({
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
const loginUser =  loginUserStore.loginUser;
const doDeleteTag = async (id: number) => {
  if (!id || loginUser.userRole !== 'admin') {
    message.error("操作错误");
    return;
  }
  const res = await deleteTagUsingPost({
    id: id
  });
  if (res.code === 0) {
    message.success('删除标签成功');
    fetchData();
  }else {
    message.error('删除标签失败', res.message);
  }
}
</script>
<style scoped>
#TagManagerPage {

}
</style>
