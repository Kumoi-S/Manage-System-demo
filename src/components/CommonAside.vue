<template>
  <el-aside :width="this.$store.state.isCollapse ? '180px' : '64px'">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="!this.$store.state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="this.$store.state.isCollapse">后台管理</h3>
      <h3 v-show="!this.$store.state.isCollapse">后台</h3>

      <el-menu-item
        :index="item.path"
        v-for="item in noChildren()"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <component
          class="icons"
          :is="item.icon"
        />
        <span>{{ item.label }}</span>
      </el-menu-item>

      <el-sub-menu
        :index="item.label"
        v-for="item in hasChildren()"
        :key="item.path"
      >
        <template #title>
          <component
            class="icons"
            :is="item.icon"
          />
          <span>{{ item.label }}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="clickMenu(subItem)"
          >
            <component
              class="icons"
              :is="subItem.icon"
            />
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    //     <!--@ 里面的对象用于传入clickMenu  -->
    const list = [
      {
        path: "/user",
        name: "user",
        label: "用户管理",
        icon: "user",
        url: "UserManage/UserManage",
      },
      {
        label: "其他",
        icon: "Plus",
        path: "other",
        children: [
          {
            path: "/page1",
            name: "page1",
            label: "页面1",
            icon: "setting",
            url: "Other/PageOne",
          },
          {
            path: "/page2",
            name: "page2",
            label: "页面2",
            icon: "setting",
            url: "Other/PageTwo",
          },
        ],
      },
    ];
    // console.log(this.$store);
    const noChildren = () => {
      return asyncList.filter((item) => !item.children);
    };
    const hasChildren = () => {
      return asyncList.filter((item) => item.children);
    };

    // <!-- @item 传入自v-for="item in noChildren()/hasChildren()" -->
    // <!-- @item是list中的一个{path,name,label...}对象 -->
    const clickMenu = (item) => {
      router.push({
        name: item.name,
      });
      // vuex提交
      store.commit("selectMenu", item);
    };

    const asyncList = store.state.menu;

    return {
      noChildren,
      hasChildren,
      clickMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
.icons {
  width: 18px;
  height: 18px;
}

.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}
</style>
