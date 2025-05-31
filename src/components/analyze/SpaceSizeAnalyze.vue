<template>
  <div class="SpaceSizeAnalyze">
    <a-card title="空间资源使用分析">
      <v-chart :option="options" style="height: 320px;" :loading="loading"/>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import {computed, ref, watchEffect} from "vue";
import {getSpaceSizeAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
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
const dataList = ref<API.SpaceSizeAnalyzeResponse[]>([])
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceSizeAnalyzeUsingPost({
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
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRanges,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: '图片大小',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})
</script>

<style scoped>
.SpaceSizeAnalyze {

}
</style>
