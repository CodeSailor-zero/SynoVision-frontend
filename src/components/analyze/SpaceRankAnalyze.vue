<template>
  <div class="SpaceRankAnalyze">
    <a-card title="空间资源使用排行分析">
      <v-chart :option="options" style="height: 320px;" :loading="loading"/>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import {computed, ref, watchEffect} from "vue";
import {getSpaceRankAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
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
const dataList = ref<API.Space[]>([])
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceRankAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    topNum: 10
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
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: '空间使用量 (MB)',
    },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
      },
    ],
  }
})
</script>

<style scoped>
.SpaceRankAnalyze {

}
</style>
