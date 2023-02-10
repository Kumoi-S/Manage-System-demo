// 整个项目api的管理

import request from "./request";

export default {
  getTableData(params) {
    // console.log("成功");
    return request({
      url: "/home/getTableData",
      method: "get",
      data: params,
      mock: true,
    });
  },
  getCountData() {
    return request({
      url: "/home/getCountData",
      method: "get",
      mock: true,
    });
  },
  getChartData() {
    return request({
      url: "/home/getChartData",
      method: "get",
      mock: true,
    });
  },
  getUserData(params) {
    return request({
      url: "/user/getUser",
      method: "get",
      mock: true,
      // @params : config: {total,page}, User.vue
      data: params,
    });
  },
  addUser(params) {
    return request({
      url: "/user/add",
      method: "post",
      mock: "true",
      data: params,
    });
  },
  editUser(params) {
    return request({
      url: "/user/edit",
      method: "post",
      mock: "true",
      data: params,
    });
  },
  deleteUser(params) {
    return request({
      url: "/user/delete",
      method: "get",
      mock: "true",
      data: params,
    });
  },
  // 不同用户返回不同菜单
  getMenu(params) {
    return request({
      url: "/permission/getMenu",
      method: "post",
      mock: "true",
      data: params,
    });
  },
};
