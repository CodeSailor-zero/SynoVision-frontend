<template>
  <div class="SpaceTagAnalyze">
    <a-card title="空间图片标签分析">
      <v-chart :option="options" style="height: 320px;" :loading="loading"/>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts';
import 'echarts';
import 'echarts-wordcloud'
import {computed, ref, watchEffect} from "vue";
import {getSpaceTagAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";


interface Props {
  queryAll?: boolean,
  queryPublic?: boolean,
  spaceId?: number,
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})
// 加载状态
const loading = ref(true);

// 获取后端数据
const dataList = ref<API.SpaceTagAnalyzeResponse[]>([])
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceTagAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.code === 0 && res.data) {
    dataList.value = res.data ?? [];
  }else {
    message.error("获取数据失败");
  }
  loading.value = false;
}

watchEffect(() => {
  fetchData();
})

// 图表选项
const options = computed(() => {
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`, // 随机颜色
        },
        data: tagData,
      },
    ],
  }
})
</script>

<style scoped>
.SpaceTagAnalyze {

}
</style>
