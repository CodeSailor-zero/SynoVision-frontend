<template>
  <div id="PictureAddPage">
    <h2>{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      <a-typography-link @click="router.push(`/space/detail/${spaceId}`)" target="_blank">
        保存至空间：{{ spaceId }}
      </a-typography-link>
    </a-typography-paragraph>
    <!--选择上传方式-->
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess"/>
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess"/>
      </a-tab-pane>
    </a-tabs>

    <!-- 图片操作区域 -->
    <div v-if="picture" class="edit-bar">
      <a-flex justify="space-around">
        <a-button :icon="h(EditOutlined)" @click="doEditPicture">编辑图片</a-button>
        <a-button :icon="h(EditOutlined)" @click="doEOutPaintingPicture">扩图</a-button>
      </a-flex>
    </div>
    <!-- 只有原始地址的图片可以操作 -->
    <Image-cropper ref="imageCropperRef" :image-url="picture?.originalUrl" :picture="picture" :space-id="spaceId" :onSuccess="onCropPicture"/>
    <ImageOutPainting ref="imageOutPaintingRef" :picture="picture" :space-id="spaceId" :onSuccess="onCropPicture"/>

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
import {computed, h, onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {editPictureUsingPost, getPictureVoUsingGet, getTagCategoryUsingGet} from "@/api/pictureController";
import {useRoute, useRouter} from "vue-router";
import {useLoginStore} from "@/stores/userLoginUserStore";
import UrlPictureUpload from "@/components/UrlPictureUpload.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import {EditOutlined} from "@ant-design/icons-vue";
import ImageOutPainting from "@/components/ImageOutPainting.vue";

const loginUserStore = useLoginStore();

const picture = ref<API.PictureVo>({});
const PictureForm = ref<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>();
const route = useRoute();
const router = useRouter();

const onSuccess = (newPicture: API.PictureVo) => {
  picture.value = newPicture;
  PictureForm.value.name = newPicture.name;
}


const spaceId = computed(() => {
  return route.query?.spaceId;
})
const handleSubmit = async (values: any) => {
  const pictureId = picture.value.id;
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
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


const id = route.query?.id;
const getOldPictureVo = async () => {
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

//图片编辑器弹窗
const imageCropperRef = ref();
const doEditPicture = async () => {
  imageCropperRef.value?.openModel();
}

//图片扩图弹窗
const imageOutPaintingRef = ref();
const doEOutPaintingPicture = async () => {
  imageOutPaintingRef.value?.openModel();
}

const onCropPicture = (newPicture :  API.PictureVo) => {
  picture.value = newPicture;
}

</script>
<style scoped>
#PictureAddPage {
  max-width: 720px;
  margin: 0 auto;
}
#PictureAddPage .edit-bar {
  text-align: center;
  margin: 16px auto;
}
</style>
