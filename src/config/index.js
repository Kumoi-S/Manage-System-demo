// 环境配置文件

const env = import.meta.env.MODE || "prod";

const EnvConfig = {
  development: {
    baseApi: "",
    mockApi: "",
  },
  test: {
    baseApi: "",
    mockApi: "",
  },
  prod: {
    baseApi: "",
    mockApi: "",
  },
};

export default {
  env,

  //mock的开关
  mock: true,

  // ...的含义：把右值分解为一个个参数，例如...[1,2,3]===1,2,3
  ...EnvConfig[env],
};
