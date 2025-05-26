<template>
  <div id="HomePage">
    <div class="search-Bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图片进行搜索"
        enter-button="搜索"
        size="large"
        @search="handleSearch"
      />
    </div>

    <a-tabs v-model:active-key="selectedCategory" @change="handleSearch">
      <a-tab-pane key="all" tab="全部"/>
      <a-tab-pane v-for="category in categoryOptions" :key="category" :tab="category" />
    </a-tabs>

    <div class="tag-Bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="handleSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>


    <a-list
      style="padding: 0"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 , xxl: 6}"
      :data-source="pictureVoList"
      :pagination="pagination"
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
                  {{picture.category ?? '默认'}}
                </a-tag>
                <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                </a-tag>
              </a-flex>
            </template>
          </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {getTagCategoryUsingGet, listPictureVoUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const pictureVoList = ref<API.PictureVo[]>([]);

const total = ref(0);

const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'desc',
})

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    onChange: (page : number,pageSize : number) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData();
    }
  }
})

const loading = ref(false);

const fetchData = async () => {
  loading.value = true;

  const params = {
    ...searchParams,
    tags: [] as string[]
  }
  if (selectedCategory.value != 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((userTag, index) => {
    // 如果使用此 tag
    if (userTag) {
      params.tags.push(tagList.value[index])
    }
  });

  const res = await listPictureVoUsingPost(params);
  if (res.code === 0 && res.data) {
    pictureVoList.value = res.data.records ?? [];
    total.value = res.data.total ?? 0;
  } else {
    message.error("获取数据失败", res.message);
  }
  loading.value = false;
}

const  handleSearch = () => {
  //重置页数
  searchParams.current = 1;
  fetchData();
}

const categoryOptions = ref<String[]>([]);
const selectedCategory = ref<String>('all');
const tagList = ref<String[]>([]);
const selectedTagList = ref<String[]>([]);//[true/false]

const getTagCategoryOptions = async () => {

  const res = await getTagCategoryUsingGet();
  if (res.code == 0 && res.data) {
    categoryOptions.value = (res.data.categeoyList ?? []);
    tagList.value = (res.data.tagList ?? []);
  } else {
    message.error('获取失败' + res.message);
  }
};

onMounted(() => {
  fetchData();
  getTagCategoryOptions();
});

const router = useRouter();
const doClickPicture = (picture : API.PictureVo) => {
  router.push({
    path: `/picture/detail/${picture.id}`,
  });
}

</script>
<style scoped>
#HomePage {

}
#HomePage .search-Bar {
  max-width: 580px;
  margin: 0 auto 16px;
}
#HomePage .tag-Bar {
  margin-bottom: 16px;
}
</style>
