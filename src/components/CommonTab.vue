<template>
  <div class="tags">
    <!--@tags是tabsList[], tag是其中一个对象{path,name,label,icon} -->
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name != 'home'"
      :disable-transitions="false"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const menuBeingClosed = store.state.currentMenu;

    const tags = store.state.tabsList;

    //<!--@item 是click事件传入了vuex的store.state中tabsList中的一个对象{path,name,label,icon}  -->
    const changeMenu = (item) => {
      // push一个命令路由
      router.push({ name: item.name });
    };
    // 标签关闭
    // <!--@tag vuex.state的tabsList中的一个元素对象{path,name,label,icon} -->
    // <!--@index tabsList中元素的数组下标 -->
    const handleClose = (tag, index) => {
      // 获取当前tabsList[]的长度
      let length = tags.length - 1;
      // vuex提交事件
      store.commit("closeTab", tag);

      // 如果被删除tag的名字不是当前页面的名字, 跳出函数;
      if (tag.name != route.name) {
        return;
      }

      // 被删除的是当前页面
      if (index == length) {
        // 且 如果被删除页面是最后一个 -> 跳转到tabsList中前一个页面
        router.push({
          name: tags[index - 1].name,
        });
      } else {
        // 且 如果被删除的不是最后一个页面 -> 跳转到tabsList中后一个页面
        router.push({
          name: tags[index].name,
        });
      }
    };
    return { tags, changeMenu, handleClose };
  },
};
</script>

<style lang="less" scoped>
.tags {
  padding: 20px;
  width: 100%;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
