<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.png" alt="" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2022-7-11</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px" height="450px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLable"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            class="icons"
            :is="item.icon"
            :style="{ background: item.color }"
          />
          <div class="details">
            <p class="number">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>

      <!-- 折线图 -->
      <el-card style="height: 280px">
        <div ref="echart" style="height: 280px"></div>
      </el-card>

      <div class="graph">
        <!-- 柱状图渲染 -->
        <el-card style="height: 2 60px">
          <div ref="userEchart" style="height: 260px"></div>
        </el-card>

        <!-- 饼图 -->
        <el-card style="height: 260px">
          <div ref="videoEchart" style="height: 220px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import axios from "axios";
import * as echarts from "echarts";

export default {
  // 在setup钩子中使用了getCurrentInstance(),这种做法不被推荐,为了获取本组件的实例,使用选项式api的this
  setup() {
    // const tableLable = {
    //   name: "课程",
    //   todayBuy: "今日购买",
    //   monthBuy: "本月购买",
    //   totalBuy: "总购买",
    // };
    // return { tableLable };
    // let tableData = ref([]);
    // // getTableList是一个异步函数
    // const getTableList = async () => {
    //   // 已封装axios，不再使用
    //   // await axios.get("/home/getData").then((res) => {
    //   //   console.log(res);
    //   //   if (res.data.code == 200) tableData.value = res.data.data.tableData;
    //   // });
    //   //获取当前组件实例
    //   const { proxy } = getCurrentInstance();
    //   //通过实例的全局属性调用方法
    //   let res = await proxy.api.getTableData();
    //   tableData.value = res.tableData;
    // };
    // onMounted(getTableList);
    // return {tableData,tableLable};
  },

  data() {
    return {
      tableLable: {
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      tableData: [],
      countData: [],

      //echarts图表
      xOptions: {
        // 图例文字颜色
        textStyle: {
          color: "#333",
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: [],
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: [
          "#2ec7c9",
          "#b6a2de",
          "#5ab1ef",
          "#ffb980",
          "#d87a80",
          "#8d98b3",
        ],
        series: [],
      },
      pieOptions: {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [],
      },
      orderData: {
        xData: [],
        series: [],
      },
      userData: {
        xData: [],
        series: [],
      },
      // 饼图
      videoData: {
        series: [],
      },
    };
  },
  methods: {
    // 页面左下角数据
    async getTableList() {
      let res = await this.api.getTableData();
      this.tableData = res.tableData;
    },
    // 页面右上角数据
    async getCountData() {
      let res = await this.api.getCountData();
      // console.log(res);
      this.countData = res.countData;
    },
    // 页面右下角数据
    async getChartData() {
      let result = await this.api.getChartData();
      // console.log(result);
      let res = result.orderData;
      let userRes = result.userData;
      let videioRes = result.videoData;
      this.orderData.xData = res.date;
      const keyArray = Object.keys(res.data[0]);
      const series = [];
      keyArray.forEach((key) => {
        series.push({
          name: key,
          data: res.data.map((item) => item[key]),
          type: "line",
        });
      });
      this.orderData.series = series;
      this.xOptions.xAxis.data = this.orderData.xData;
      this.xOptions.series = this.orderData.series;
      // 渲染折线图
      let hEcharts = echarts.init(this.$refs.echart);
      hEcharts.setOption(this.xOptions);

      // 渲染柱状图
      this.userData.xData = userRes.map((item) => item.date);
      this.userData.series = [
        {
          name: "新增用户",
          data: userRes.map((item) => item.new),
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userRes.map((item) => item.active),
          type: "bar",
        },
      ];
      this.xOptions.xAxis.data = this.userData.xData;
      this.xOptions.series = this.userData.series;
      let uEcharts = echarts.init(this.$refs.userEchart);
      uEcharts.setOption(this.xOptions);

      // 饼图
      this.videoData.series = [
        {
          data: videioRes,
          type: "pie",
        },
      ];
      this.pieOptions.series = this.videoData.series;
      let vEcharts = echarts.init(this.$refs.videoEchart);
      vEcharts.setOption(this.pieOptions);
    },
  },
  mounted() {
    this.getTableList();
    this.getCountData();
    this.getChartData();
  },
};
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 30%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: white;
    }
    .details {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .number {
        font-size: 30px;
        // margin-bottom: 5px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
      width: 48%;
    }
  }
}
</style>
