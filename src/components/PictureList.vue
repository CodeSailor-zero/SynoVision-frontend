<template>
  <div class="PictureList">
    <a-list
      style="padding: 0"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 , xxl: 6}"
      :data-source="props.pictureVoList"
      :loading="loading"
    >
      <template #renderItem="{ item : picture }">
        <a-list-item>
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img :alt="picture.name" :src="picture.thumbnailUrl ?? picture.url"
                   style="height: 180px; object-fit: cover"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template #actions v-if="showOP">
              <a-space v-if="props.canEditPicture" @click="(e) => doEdit(picture,e)">
                <EditOutlined/>
                编辑
              </a-space>
              <a-space v-if="props.canDeletePicture" @click="(e) => doDelete(picture,e)">
                <DeleteOutlined/>
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {deletePictureUsingPost} from "@/api/pictureController";

interface pictureProps {
  pictureVoList?: API.PictureVo[];
  loading: boolean
  showOP: boolean,
  onReload: () => void,
  canEditPicture: boolean,
  canDeletePicture: boolean
}

const props = withDefaults(defineProps<pictureProps>(), {
  pictureVoList: () => [],
  loading: false,
  showOP: false,
  canEditPicture: false,
  canDeletePicture: false,
});

const router = useRouter();
const doClickPicture = (picture: API.PictureVo) => {
  router.push({
    path: `/picture/detail/${picture.id}`,
  });
}

const doEdit = (picture, e) => {
  // 阻止冒泡
  e.stopPropagation();
  router.push({
    path: "/picture/add",
    query: {
      id: picture.id,
      spaceId: picture.spaceId
    }
  })
}
const doDelete = async (picture, e) => {
  // 阻止冒泡
  e.stopPropagation();
  const pictureId = picture.id;
  if (!pictureId) {
    message.error("操作错误");
    return;
  }
  const res = await deletePictureUsingPost({
    id: pictureId
  });
  if (res.code === 0) {
    message.success('删除图片成功');
    props.onReload?.();
  } else {
    message.error('删除图片失败', res.message);
  }
}


</script>
<style scoped>
</style>
