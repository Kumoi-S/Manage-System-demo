<template>
  <!-- 新增按钮 和 用户搜索框 -->
  <div class="user-header">
    <!-- 按钮弹出对话框 -->
    <el-button
      type="primary"
      @click="handleAdd"
      >+新增</el-button
    >
    <el-form
      :inline="true"
      :model="formInline"
    >
      <el-form-item label="请输入">
        <el-input
          v-model="formInline.keyword"
          placeholder="请输入用户名"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleSearch"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格 -->
  <div class="table">
    <el-table
      :data="list"
      style="width: 100%"
      height="500px"
    >
      <!-- prop:字段名称 fixed:列固定在左侧或右侧 label:显示的标题 -->
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <el-table-column
        fixed="right"
        label="Operations"
        min-width="180"
        align="right"
      >
        <!-- #default="scope" 是vue的具名作用域插槽 可以将子组件的数据传到父组件 -->
        <!-- 由于调用el-table-column时 向其内部传入了插槽数据 -->
        <!-- 所以在el-table-column下的标签内使用#default 获取的是Table-column插槽 -->
        <!--  scope : { row, column, $index } -->
        <!-- scope.row就是本行的数据{name,age,sex...} -->
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页菜单 -->
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="config.total"
      class="pager"
      @current-change="changePage"
    />
  </div>

  <!-- 弹出对话框 -->
  <el-dialog
    v-model="dialogVisible"
    width="35%"
    :before-close="handleClose"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
  >
    <!-- 对话框内 表单 -->
    <el-form
      :inline="true"
      :model="formUser"
      ref="userForm"
    >
      <!-- 表单第一行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="姓名"
            prop="name"
            :rules="[
              {
                required: true,
                message: '姓名是必填项',
              },
            ]"
          >
            <el-input
              v-model="formUser.name"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="年龄"
            prop="age"
            :rules="[
              {
                required: true,
                message: '年龄是必填项',
              },
              {
                type: 'number',
                message: '年龄必须是数字',
              },
            ]"
          >
            <el-input
              v-model.number="formUser.age"
              placeholder="请输入年龄"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 表单第二行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="性别"
            prop="sex"
          >
            <el-select
              v-model="formUser.sex"
              placeholder="请选择"
            >
              <el-option
                label="男"
                value="男"
              />
              <el-option
                label="女"
                value="女"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="出生日期"
            prop="birth"
          >
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              label="出生日期"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 表单第三行 -->
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
          :rules="[
            {
              required: true,
              message: '地址是必填项',
            },
          ]"
        >
          <el-input
            v-model="formUser.addr"
            placeholder="请输入地址"
          />
        </el-form-item>
      </el-row>
      <!-- 表单第四行 按钮 -->
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button
            type="primary"
            @click="handleCancel"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="onSubmit"
            >确定</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { ElMessage } from "element-plus";
import { getCurrentInstance } from "vue";

export default {
  data() {
    return {
      action: "edit",
      list: [],
      // 控制对话框是否显示
      dialogVisible: false,
      // 添加用户时的信息
      formUser: {
        name: "",
        age: "",
        sex: "",
        birth: "",
        addr: "",
      },
      // 搜索
      formInline: {
        keyword: "",
      },
      // config用于分页
      config: {
        total: 0,
        page: 1,
        name: "",
      },
      tableLabel: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "sexLabel",
          label: "性别",
        },
        {
          prop: "birth",
          label: "出生日期",
          width: 200,
        },
        {
          prop: "addr",
          label: "地址",
          width: 320,
        },
      ],
    };
  },

  methods: {
    // 用于表格获取数据
    async getUserData() {
      let res = await this.api.getUserData(this.config);
      // console.log(res);
      this.config.total = res.count;
      this.list = res.list.map((item) => {
        item.sexLabel = item.sex == 0 ? "女" : "男";
        return item;
      });
    },

    changePage(page) {
      // console.log(page);
      this.config.page = page;
      this.getUserData(this.config);
    },

    // 点击新增用户按钮
    handleAdd() {
      // 改变对话框标题
      this.action = "add";
      // 出现对话框
      this.dialogVisible = true;
    },

    handleSearch() {
      this.config.name = this.formInline.keyword;
      this.getUserData(this.config);
    },

    // 点击对话框右上角的×
    handleClose(done) {
      ElMessageBox.confirm("确认关闭?")
        .then(() => {
          this.$refs.userForm.resetFields();
          done();
        })
        .catch(() => {
          // catch error
        });
    },

    // 日期格式化 提交用户数据前进行
    timeFormat(timeStamp) {
      let time = new Date(timeStamp);
      var year = time.getFullYear();
      var month = time.getMonth();
      var date = time.getDate();

      // e.g. 9月2号 -> 09 02
      date = date < 10 ? "0" + date : date;
      month = month < 10 ? "0" + month : month;

      return year + "-" + month + "-" + date;
    },

    // 编辑按钮 编辑用户
    handleEdit(row) {
      // 改变对话框标题
      this.action = "edit";
      // 出现对话框
      this.dialogVisible = true;

      // row是el-table-column传入的
      // row的信息来源于el-table的data 即list变量
      // list就是mock直接返回的数据 getUserList没有对sex做处理 表格中的姓名另起了一个sexLabel字段
      // 因此第一次row拿到的sex字段是数字
      if (row.sex == 1) {
        row.sex = "男";
      } else if (row.sex == 0) {
        row.sex = "女";
      }

      // P29 用于解决点了编辑后 新增用户的对话框会存留之前信息的问题
      // 立即同步row和formUser
      // FIXME: 这里的浅拷贝 深拷贝 不会
      this.$nextTick(() => Object.assign(this.formUser, row));

      // console.log(row);
    },

    // 删除用户
    handleDelete(row) {
      ElMessageBox.confirm("确认删除?")
        .then(async () => {
          console.log(row);
          await this.api.deleteUser({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
          this.getUserData(this.config);
        })
        .catch(() => {
          console.log("删除请求失败");
        });
    },

    // 用户提交 对话框点击确定
    onSubmit() {
      // 使用element内置方法验证表单
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.formUser.birth = this.timeFormat(this.formUser.birth);
          // 若当前在新增用户
          if (this.action == "add") {
            let res = await this.api.addUser(this.formUser);
            if (res) {
              // 重置表单
              this.$refs.userForm.resetFields();
              // 对话框消失
              this.dialogVisible = false;
              // 刷新表格
              this.getUserData();
            }
          } else if (this.action == "edit") {
            // 若当前在编辑用户
            // 将原本的男或女处理为1或0
            if (this.formUser.sex == "男") {
              console.log("nanxing ");
              this.formUser.sex = 1;
            } else if (this.formUser.sex == "女") {
              this.formUser.sex = 0;
            }

            // FIXED 之前 这里性别写的逻辑非常乱
            // 因为处理编辑按钮的handleClick会修改性别是数字还是男女
            // 处理提交按钮的onSubmit也会修改性别是数字还是男女
            // element组件里的vmodel也会修改formUser.sex是01

            // 解决方案:一开始是设置elseif都判断
            // 后面发现只需要把element组件里绑的vmodel从01改成男女就行了

            let res = await this.api.editUser(this.formUser);
            if (res) {
              // 重置表单
              this.$refs.userForm.resetFields();
              // 对话框消失
              this.dialogVisible = false;
              // 刷新表格
              this.getUserData();
            }
          }
        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          });
        }
      });
    },

    // 点击取消按钮 事件
    handleCancel() {
      this.dialogVisible = false;
      this.$refs.userForm.resetFields();
    },
  },
  mounted() {
    this.getUserData();
  },
};
</script>

<style lang="less" scoped>
.table {
  position: relative;
  height: 520px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}
.user-header {
  display: flex;
  justify-content: space-between;
}
</style>
