<template>
  <div class="SpaceUserAnalyze">

    <a-card title="空间图片用户上传分析">
      <template #extra>
        <a-flex gap="middle">
          <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
          <a-input-search  enter-button="搜索" placeholder="请输入用户的id" @search="doSearch" />
        </a-flex>
      </template>
      <v-chart :option="options" style="height: 320px;" :loading="loading"/>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import {computed, ref, watchEffect} from "vue";
import {getSpaceUserAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
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

//时间维度
const timeDimension = ref<"day" | "week" | "month">('day');
//时间维度选项框
const timeDimensionOptions = [
  {
    label: '日',
    value: 'day'
  },
  {
    label: '周',
    value: 'week'
  },
  {
    label: '月',
    value: 'month'
  }
]
//用户id
const userId = ref<string>();
const doSearch = (searchValue: string) => {
  console.log(searchValue)
  userId.value = searchValue;
  console.log(userId)
}

// 获取后端数据
const dataList = ref<API.SpaceUserAnalyzeResponse[]>([])

const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceUserAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value
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
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        smooth: false, // 平滑折线
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})
</script>

<style scoped>
.SpaceUserAnalyze {

}
</style>
