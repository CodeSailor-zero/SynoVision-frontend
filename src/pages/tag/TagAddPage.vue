<template>
  <div id="TagAddPage">
    <a-form
      name="TagForm"
      :model="TagForm"
      layout="vertical"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="tagName"
        label="名称"
        :rules="[{ required: true, message: '请输入标签的名字' }]"
      >
        <a-input v-model:value="TagForm.tagName" placeholder="请输入标签的名字"/>
      </a-form-item>
      <a-form-item name="tagType" label="上传类型">
        <a-select
          v-model:value="TagForm.tagType"
          :options="tagTypeList"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">创建标签</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {addTagUsingPost, updateTagUsingPost} from "@/api/tagController";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

interface TagProps {
  id: string | number;
}
const tagProp = defineProps<TagProps>();



const TagForm = ref<API.TagAddRequest>({})//[{value,label}]

const tagTypeList = [
  {
    value: 'system',
    label: 'system'
  },
  {
   value: 'user',
   label: 'user'
  }
]

const addTag = async () => {
  const res = await addTagUsingPost({
    tagName: TagForm.value.tagName,
    tagType: TagForm.value.tagType
  })
  if (res.code === 0) {
    message.success('创建成功');
    await router.replace({
      path: '/'
    });
  }else {
    message.error('创建失败',res.msg);
  }
}

const updateTag = async () => {
  const res = await updateTagUsingPost({
    id: tagProp.id,
    tagName: TagForm.value.tagName,
    tagType: TagForm.value.tagType
  })
  if (res.code === 0) {
    message.success('更新成功');
    await router.replace({
      path: '/'
    });
  }else {
    message.error('更新失败',res.msg);
  }
}

const router = useRouter();

const handleSubmit = async () => {
  if (!tagProp.id) {
    await addTag();
  } else {
    await updateTag();
  }
}



</script>
<style scoped>
#TagAddPage {

}
</style>
