<template>
  <el-form
    :model="loginForm"
    class="login-container"
  >
    <h3>系统登陆</h3>
    <el-form-item>
      <el-input
        type="input"
        placeholder="请输入账号"
        v-model="loginForm.username"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="loginForm.password"
      ></el-input>
    </el-form-item>
    <el-form-item class="loginButtonContainer">
      <el-button
        type="primary"
        @click="onLogin"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "admin",
      },
    };
  },
  methods: {
    async onLogin() {
      const res = await this.api.getMenu(this.loginForm);
      // console.log(res);
      this.$store.commit("setMenu", res.menu);
      this.$store.commit("addMenu", this.$router);
      this.$store.commit("setToken", res.token);
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;

  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  box-shadow: 0 0 25px #cacaca;

  padding: 35px 35px 15px 15px;
  margin: 180px auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }
}
</style>
