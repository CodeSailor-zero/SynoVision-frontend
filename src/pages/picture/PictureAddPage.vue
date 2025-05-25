<template>
<!--todo 图片修改还没有搞好，加上 http://localhost:5173/picture/add?id=xxxx。会直接跳转到登录页-->
<!--  就是登录状态丢失了-->
  <div id="PictureAddPage">
    <h2>{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <!--选择上传方式-->
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :onSuccess="onSuccess"/>
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :onSuccess="onSuccess"/>
      </a-tab-pane>
    </a-tabs>


    <a-form
      v-if="picture.id"
      name="PictureForm"
      :model="PictureForm"
      layout="vertical"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="name"
        label="名称"
        :rules="[{ required: true, message: '请输入图片名字' }]"
      >
        <a-input v-model:value="PictureForm.name" placeholder="请输入图片名字"/>
      </a-form-item>

      <a-form-item
        name="introduction"
        label="简介"
        :rules="[{ required: true, message: '请输入图表简介' }]"
      >
        <a-textarea
          v-model:value="PictureForm.introduction"
          placeholder="请输入图表简介"
          :auto-size="{minRows: 3, maxRows: 5}"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="PictureForm.category"
          placeholder="请输入分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="PictureForm.tags"
          :options="tagList"
          mode="tags"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import PictureUpload from "@/components/PictureUpload.vue";
import {onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {editPictureUsingPost, getPictureVoUsingGet, getTagCategoryUsingGet} from "@/api/pictureController";
import {useRoute, useRouter} from "vue-router";
import {useLoginStore} from "@/stores/userLoginUserStore";
import UrlPictureUpload from "@/components/UrlPictureUpload.vue";

const loginUserStore = useLoginStore();

const picture = ref<API.PictureVo>({});
const PictureForm = ref<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>();

const onSuccess = (newPicture: API.PictureVo) => {
  picture.value = newPicture;
  PictureForm.value.name = newPicture.name;
}

const router = useRouter();

const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id;
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values
  });
  if (res.code == 0) {
    message.success('创建成功');
    await router.push({
      path: `/picture/detail/${pictureId}`
    })
  } else {
    message.error('创建失败' + res.message);
  }
};

const categoryOptions = ref<String[]>([]);
const tagList = ref<String[]>([]);

const getTagCategoryOptions = async () => {

  const res = await getTagCategoryUsingGet();
  if (res.code == 0 && res.data) {
    categoryOptions.value = (res.data.categeoyList ?? []).map((data: String) => {
      return {
        value: data,
        label: data
      }
    });
    tagList.value = (res.data.tagList ?? []).map((data: String) => {
      return {
        value: data,
        label: data
      }
    });
  } else {
    message.error('获取失败' + res.message);
  }
};

const route = useRoute();
const id = route.query?.id;
const getOldPictureVo = async () => {
  const id = route.query?.id;
  if (id) {
    const res = await getPictureVoUsingGet({
      id: id
    });
    if (res.code == 0 && res.data) {
      const data = res.data;
      picture.value = data;
      PictureForm.value.name = data.name;
      PictureForm.value.introduction = data.introduction;
      PictureForm.value.category = data.category;
      PictureForm.value.tags = data.tags;
    }
  }
}

onMounted(() => {
  getTagCategoryOptions();
  getOldPictureVo();
});

</script>
<style scoped>
#PictureAddPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
