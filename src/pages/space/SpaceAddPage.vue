<template>
  <!--todo 图片修改还没有搞好，加上 http://localhost:5173/space/add?id=xxxx。会直接跳转到登录页-->
  <!--  就是登录状态丢失了-->
  <div id="SpaceAddPage">
    <h2>{{ route.query?.id ? '修改空间' : '创建空间' }}</h2>
    <a-form
      name="SpaceForm"
      :model="SpaceForm"
      layout="vertical"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="spaceName"
        label="空间名称"
        :rules="[{ required: true, message: '请输入空间名称' }]"
      >
        <a-input v-model:value="SpaceForm.spaceName" placeholder="空间名称"/>
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          style="min-width: 180px"
          v-model:value="SpaceForm.spaceLevel"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系
        <a href="https://github.com/CodeSailor-zero" target="_blank">sean</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}：大小{{ convertBytes(spaceLevel.maxSize) }}，数量{{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {addSpaceUsingPost, editSpaceUsingPost, getSpaceUsingGet, getSpaceVoUsingGet} from "@/api/spaceController";
import {useRoute, useRouter} from "vue-router";
import {SPACE_LEVEL_OPTIONS} from "@/constant/space";
import {getSpaceLevelUsingGet} from "@/api/pictureController";
import {convertBytes} from "../../util";


const space = ref<API.SpaceVo>({});
const SpaceForm = ref<API.SpaceAddRequest | API.SpaceEditRequest>({})


const router = useRouter();

const route = useRoute();
const id = route.params?.id;
const getOldSpaceVo = async () => {
  if (id) {
    const res = await getSpaceVoUsingGet({
      id: id
    });
    if (res.code == 0 && res.data) {
      const data = res.data;
      space.value = data;
      SpaceForm.value.spaceName = data.spaceName;
      SpaceForm.value.spaceLevel = data.spaceLevel;
    }
  }
}


const spaceLevelList = ref([]);

// 获取space空间级别
const getSpaceLevelList = async () => {
  const res = await getSpaceLevelUsingGet();
  if (res.code == 0 && res.data) {
    spaceLevelList.value = res.data;
  } else {
    message.error('获取空间级别失败：' + res.message);
  }
}

onMounted(() => {
  getOldSpaceVo();
  getSpaceLevelList();
});

const handleSubmit = async (values: any) => {
  const spaceId = space.value?.id;
  let res;
  //更新
  if (spaceId) {
    res = await editSpaceUsingPost({
      id: spaceId,
      ...SpaceForm.value
    })
  } else {
    //创建
    res = await addSpaceUsingPost({
      ...SpaceForm.value
    });
  }
  if (res.code == 0) {
    message.success('操作成功');
    await router.push({
      path: `/space/detail/${res.data}`
    })
  } else {
    message.error('操作失败' + res.message);
  }
};

</script>
<style scoped>
#SpaceAddPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
