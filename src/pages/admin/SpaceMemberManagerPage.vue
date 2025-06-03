<template>
  <div id="SpaceMemberManagerPage">
    <!-- 添加成员 -->
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 成员管理表单 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.userVo?.userAvatar" />
            {{ record.userVo?.userName }}
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'spaceUserRole'">
          <a-select
            style="width: 100px"
            v-model:value="record.spaceUserRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value) => editSpaceRole(value, record)"
          />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" danger @click="doDeleteSpaceUser(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {defineProps, reactive} from "vue";
import {onMounted, ref} from "vue";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {message} from "ant-design-vue";
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost
} from "@/api/spaceMemberController";
import {SPACE_ROLE_OPTIONS} from "@/constant/space";
import dayjs from "dayjs";

interface Props {
  spaceId: string;
}

const props = defineProps<Props>();

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceUserRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const dataList = ref<API.SpaceMemberVo[]>([]);
const loginUserStore = useLoginStore();


const fetchData = async () => {
  const newSpaceId = props.spaceId
  if (!newSpaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId: newSpaceId
  })
  if (res.code === 0 && res.data) {
    dataList.value = res.data
  } else {
    message.error("获取数据失败", res.message);
  }
}

onMounted(() => {
  fetchData();
})

const formData = reactive<API.SpaceMemberAddRequest>({})
// 创建成员
const handleSubmit = async () => {
  const newSpaceId = props.spaceId
  if (!newSpaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId: newSpaceId,
    ...formData,
  })
  if (res.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}

// 编辑成员角色
const editSpaceRole = async (value, record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceUserRole: value,
  })
  if (res.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.message)
  }
}

//删除成员
const doDeleteSpaceUser = async (id: number) => {
  if (!id && loginUserStore.loginUser?.id === id) {
    message.error("操作错误");
    return;
  }
  const res = await deleteSpaceUserUsingPost({
    id: id
  });
  if (res.code === 0) {
    message.success('删除用户成功');
    fetchData();
  } else {
    message.error('删除用户失败', res.message);
  }
}
</script>
<style scoped>
#SpaceMemberManagerPage {

}
</style>
