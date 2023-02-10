<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <CommonAside class="main-aside" />
      <el-container class="main-container">
        <CommonHeader />
        <CommonTab />

        <el-main class="right-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { defineComponent } from 'vue';
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import CommonTab from "../components/CommonTab.vue";

// export default defineComponent({
//     components: {
//         CommonHeader,
//         CommonAside
//     }
// });
export default {
  components: {
    CommonHeader,
    CommonAside,
    CommonTab,
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  width: 100%;
  .lay-container {
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 100%;
    .main-aside {
      height: 100%;
      background-color: #545c64;
    }
    .main-container {
      height: 100%;

      // align-content: flex-start;
      // align-items: stretch;
      // justify-content: flex-start;
      flex-wrap: nowrap;
      flex-direction: column;
      // .right-main{
      //   height: ;
      // }
    }
  }
}
</style>
