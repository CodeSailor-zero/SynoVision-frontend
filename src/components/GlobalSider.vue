<template>
  <div id="GlobalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      breakpoint="lg"
      collapsed-width="0"
      width="200"
    >
      <a-menu
        v-model:selectedKeys="current"
        :items="menuItems"
        mode="inline"
        @click="doMeumCilck"
      />
    </a-layout-sider>
  </div>
</template>
<script setup lang="ts">
import {computed, h, ref, watchEffect} from "vue";
import {PictureOutlined, UserOutlined , UserAddOutlined,UsergroupAddOutlined} from "@ant-design/icons-vue";
import {useLoginStore} from "@/stores/userLoginUserStore";
import {useRouter} from "vue-router";
import {SPACE_TYPE_ENUM} from "@/constant/space";
import {listMyTeamSpaceUsingPost} from "@/api/spaceMemberController";
import {message} from "ant-design-vue";

const loginUserStore = useLoginStore();

// 固定的菜单列表
const fixedItems = ([
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
  },
  {
    key: '/space/add?type=' + SPACE_TYPE_ENUM.PRIVATE,
    icon: () => h(UserAddOutlined),
    label: '创建私人空间',
    title: '创建私人空间',
  },
  {
    key: '/space/add?type=' + + SPACE_TYPE_ENUM.TEAM,
    icon: () => h(UsergroupAddOutlined),
    label: '创建团队空间',
    title: '创建团队空间',
  },
  {
    key: '/space/my',
    icon: () => h(UserOutlined),
    label: '我的空间',
    title: '我的空间',
  },
])

//  团队空间列表
const teamSpaceList = ref<API.SpaceMemberVo[]>([])
const menuItems = computed(() => {
  // 如果用户没有团队空间，则只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return fixedItems
  }
  // 如果用户有团队空间，则展示固定菜单和团队空间菜单
  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.spaceVo
    return {
      key: '/space/detail/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedItems, teamSpaceMenuGroup]
})

// 从后端获取团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.code === 0 && res.data) {
    teamSpaceList.value = res.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

const router = useRouter();


/**
 * 点击菜单跳转
 * @param key
 */
const doMeumCilck = ({key}) => {
  router.push(key);
}

/**
 * 当前选中的菜单
 */
const current = ref<string[]>([]);
router.afterEach((to, from, failure) => {
  current.value = [to.path];
})
</script>
<style scoped>
#GlobalSider {

}
</style>
