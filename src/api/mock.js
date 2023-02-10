import Mock from "mockjs";
import homeApi from "./mockData/home.js";
import userApi from "./mockData/user.js";
import permissionApi from "./mockData/permission.js";
// 拦截请求

Mock.mock("/home/getTableData", homeApi.getHomeData);
Mock.mock("/home/getCountData", homeApi.getCountData);

// getChartData用了mock的template随机生成语法 所以必须返回一个对象 返回函数时无法使用随机生成
Mock.mock("/home/getChartData", homeApi.getChartData());
// getUserList如果加了括号 会发生调用 不传入参数会引发错误
Mock.mock(/user\/getUser/, "get", userApi.getUserList);
// 用户编辑 User.vue
Mock.mock(/user\/add/, "post", userApi.createUser);
Mock.mock(/user\/edit/, "post", userApi.updateUser);
Mock.mock(/user\/delete/, "get", userApi.deleteUser);
// 用户登录
Mock.mock(/permission\/getMenu/, "post", permissionApi.getMenu);
