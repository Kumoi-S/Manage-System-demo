import { createApp } from "vue";
import App from "./App.vue";

// 挂在vue router
import router from "./router";

//less
import "./assets/less/index.less";

//vuex store对象 全局注册
import store from "./store/index";

//mock 全局注册
import "./api/mock.js";

const app = createApp(App);

//element icon 全局注册
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

//在全局属性下挂载api
import api from "./api/api.js";
app.config.globalProperties.api = api;

// 页面加载前 加载路由列表
store.commit("addMenu", router);

// 检查当前页面是否存在
const checkRouter = (path) => {
  // @当前路径path 与所有路径逐一比对 若存在相同路径则说明存在对应当前地址的页面
  let hasChecked = router
    .getRoutes()
    .filter((route) => route.path == path).length;
  if (hasChecked) {
    return true;
  } else {
    return false;
  }
};
// 导航守卫
router.beforeEach((to, from) => {
  // to and from are both route objects. must call `next`.
  store.commit("getToken");
  const token = store.state.token;
  // 如果 没token且不在login页面
  if (!token && to.name != "login") {
    return { name: "login" };
    // 如果 即将前往的路径不正确
  } else if (!checkRouter(to.path)) {
    return { name: "login" };
  } else {
    return;
  }
});

app.use(router).use(store);
app.mount("#app");
