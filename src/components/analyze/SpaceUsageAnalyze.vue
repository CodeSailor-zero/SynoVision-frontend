<template>
  <div class="SpaceUsageAnalyze">
    <a-flex gap="middle">
      <a-card title="存储空间" style="width: 50%">
        <div style="height: 320px;text-align: center">
          <h3>
            {{data.usedSize ?? convertBytes(data.usedSize)}} /
            {{data.maxSize ? convertBytes(data.maxSize) : '无限制'}}
          </h3>
          <a-progress type="dashboard" :percent="data.sizeUsageRation ?? 0" />
        </div>
      </a-card>
      <a-card title="图片数量" style="width: 50%">
        <div style="height: 320px;text-align: center">
          <h3>
            {{data.usedCount}} /
            {{data.maxCount ?? '无限制'}}
          </h3>
          <a-progress type="dashboard" :percent="data.countUsageRation ?? 0" />
        </div>
      </a-card>
    </a-flex>

  </div>
</template>

<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {getSpaceUsageAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";
import {convertBytes} from "../../util";


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

const data = ref<API.SpaceUsageAnalyzeResponse>({})
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceUsageAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.code === 0 && res.data) {
    data.value = res.data;
  }else {
    message.error("获取数据失败");
  }
  loading.value = false;
}

watchEffect(() => {
  fetchData();
})

</script>

<style scoped>
.SpaceUsageAnalyze {

}
</style>
