<template>
  <div id="AnalyzePage">
    <h2>
      空间图库分析 -
      <span v-if="queryAll">全部空间</span>
      <span v-else-if="queryPublic">公开空间</span>
      <span v-else>
        <router-link :to="`/space/detail/${spaceId}`">
          空间ID: {{ spaceId }}
        </router-link>
      </span>
    </h2>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceTagAnalyze :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceRankAnalyze v-if="isAdmin" :space-id="spaceId" :query-all="queryAll" :query-public="queryPublic"/>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">

import SpaceUsageAnalyze from "@/components/analyze/SpaceUsageAnalyze.vue";
import SpaceCategoryAnalyze from "@/components/analyze/SpaceCategoryAnalyze.vue";
import SpaceTagAnalyze from "@/components/analyze/SpaceTagAnalyze.vue";
import SpaceSizeAnalyze from "@/components/analyze/SpaceSizeAnalyze.vue";
import SpaceUserAnalyze from "@/components/analyze/SpaceUserAnalyze.vue";
import SpaceRankAnalyze from "@/components/analyze/SpaceRankAnalyze.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import {useLoginStore} from "@/stores/userLoginUserStore";

const route = useRoute()
const spaceId = computed(() => {
  return route.query?.spaceId
})
const queryAll = computed(() => {
  return !!route.query?.queryAll
})
const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

const loginUser = useLoginStore().loginUser;
const isAdmin = computed(() => {
  return loginUser?.userRole === 'admin'

})
</script>
<style scoped>
#AnalyzePage {

}
</style>
