import { createStore } from "vuex";
import Cookie from "js-cookie";

export default createStore({
  state: {
    isCollapse: true,
    // @currentMenu:对象 当前访问的页面 是tabsLIst中的一个元素
    currentMenu: null,
    tabsList: [
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    // 存储页面列表 用于设置页面左侧 动态导航栏
    menu: [],
    // token
    token: "",
  },
  mutations: {
    updateIsCollapse(state, payload) {
      state.isCollapse = !state.isCollapse;
    },
    // @val clickMenu函数传入的对象item{path,name,label...} 见CommonAside.vue
    selectMenu(state, val) {
      val.name == "home"
        ? (state.currentMenu = null)
        : (state.currentMenu = val);

      if (val.name == "home") {
        state.currentMenu = null;
      } else {
        state.currentMenu = val;
        let result = state.tabsList.findIndex(
          (item) => item.name === val.name
        );
        result == -1 ? state.tabsList.push(val) : "";
        // console.log(state.tabsList);
      }
    },
    closeTab(state, val) {
      let res = state.tabsList.findIndex(
        (item) => item.name === val.name
      );
      state.tabsList.splice(res, 1);
    },
    setMenu(state, val) {
      state.menu = val;
      localStorage.setItem("menu", JSON.stringify(val));
      console.log("object");
      console.log(localStorage.getItem("menu"));
      // console.log("menu setted");
      // console.log(val);
    },
    addMenu(state, router) {
      // 从localStorage获取菜单列表
      if (!localStorage.getItem("menu")) return;
      const menu = JSON.parse(localStorage.getItem("menu"));
      // 添加到vuex
      state.menu = menu;

      // 动态路由
      const menuArray = [];
      menu.forEach((item) => {
        if (item.children) {
          item.children = item.children.map((item) => {
            let url = `../views/${item.url}.vue`;
            item.component = () => import(url);
            return item;
          });
          menuArray.push(...item.children);
        } else {
          let url = `../views/${item.url}.vue`;
          item.component = () => import(url);
          menuArray.push(item);
        }
      });
      menuArray.forEach((item) => {
        router.addRoute("home1", item);
      });
    },
    clearMenu(state) {
      // menu设为空值
      state.menu = [];
      localStorage.removeItem("menu");
    },
    setToken(state, val) {
      state.token = val;
      Cookie.set("token", val);
    },
    clearToken(state) {
      state.token = "";
      Cookie.remove("token");
    },
    getToken(state) {
      state.token = state.token || Cookie.get("token");
    },
  },
});
