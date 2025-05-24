<template>
  <div id="UserManagerPage">
    <a-form
      style="margin-bottom: 16px"
      :model="searchParams"
      layout="inline"
      @finish="doSearch"
    >
      <a-form-item name="userAccount" label="用户账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="用户账号"/>
      </a-form-item>
      <a-form-item name="userName" label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="用户名"/>
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
        <template v-else-if="column.key === 'userAccount'">
          {{ record.userAccount }}
        </template>
        <template v-else-if="column.key === 'userName'">
          {{ record.userName }}
        </template>
        <template v-else-if="column.key === 'userAvatar'">
          <a-image :src="record.userAvatar" width="120px"/>
        </template>
        <template v-else-if="column.key === 'userProfile'">
          {{ record.userProfile }}
        </template>
        <template v-else-if="column.key === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="primary" danger @click="doDeleteUser(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {deleteUserByIdUsingGet, listUserVoByPageUsingPost} from "@/api/userController";
import {message} from "ant-design-vue";
import dayjs from "dayjs";
import {useLoginStore} from "@/stores/userLoginUserStore";

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '用户账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '用户头像',
    key: 'userAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: '用户简介',
    key: 'userProfile',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    key: 'userRole',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
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
  const res = await listUserVoByPageUsingPost({
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
const doDeleteUser = async (id: number) => {
  if (!id && loginUserStore.loginUser?.id === id) {
    message.error("操作错误");
    return;
  }
  const res = await deleteUserByIdUsingGet({
    id: id
  });
  if (res.code === 0) {
    message.success('删除用户成功');
    fetchData();
  }else {
    message.error('删除用户失败', res.message);
  }
}
</script>

<style scoped>
#UserManagerPage {

}
</style>
