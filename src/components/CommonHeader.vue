<template>
  <el-header>
    <div class="l-content">
      <el-button
        size="small"
        plain
        @click="handleCollapse"
      >
        <el-icon :size="20">
          <Menu />
        </el-icon>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb
        separator="/"
        class="bread"
      >
        <el-breadcrumb-item :to="{ path: '/' }"
          >首页</el-breadcrumb-item
        >

        <el-breadcrumb-item
          :to="current.path"
          v-if="current"
        >
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            class="user"
            :src="getImgSrc('user')"
            alt=""
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const router = useRouter();

    const getImgSrc = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url)
        .href;
    };

    const store = useStore();
    const handleCollapse = () => {
      // 调用vuex mutation
      store.commit("updateIsCollapse");
    };

    const handleLogout = () => {
      store.commit("clearMenu");
      router.push({
        name: "login",
      });
    };
    let current = computed(() => store.state.currentMenu);
    return {
      getImgSrc,
      handleCollapse,
      current,
      handleLogout,
    };
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #333;
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }

  h3 {
    color: #fff;
  }
}
.bread :deep(span) {
  color: #fff !important;
  cursor: pointer;
}
</style>
