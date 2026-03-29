<template>
  <div style="text-align: center; background-color: rgb(255,255,255); height: 100%; padding: 0px; margin: 0px;">
    <h1 style="font-size: 50px;">{{ user.name }}</h1>

    <el-descriptions title="個人設定" :column="2" size="40" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          ID
        </template>
        {{ user.id }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-place"></i>
          営業所
        </template>
        {{ getUnitName(user.unitcode) }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-place"></i>
          組織
        </template>
        {{
          getOrganizationName(user.organizationcode) 
        }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          権限
        </template>
        {{ getRoleName(user.roleid)}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-star-off"></i>
          職種
        </template>
        {{ getOccupationName(user.occupationcode) }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-help"></i>
          役職
        </template>
        {{
         getJobTitleName(user.jobtitlecode)
        }}
      </el-descriptions-item>
    </el-descriptions>

    <DateUtils></DateUtils>

    <div class="chart-wrap">
      <div class="chart-title">ECharts Sample (Builder Stats)</div>
      <div ref="builderChart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import DateUtils from "./DateUtils";
import * as echarts from "echarts";

const MAX_TOP = 3000000;
const MAX_BOTTOM = 500;

export default {
  name: "Home",
  components: { DateUtils },
  data() {
    return {
    user: {},
    chart: null,
    unitList: [],
    authorityList: []
    };
  },
  methods: {
    init() {
      const curUser = sessionStorage.getItem("CurUser");
      this.user = curUser ? JSON.parse(curUser) : {};
    },

loadUnits() {
  this.$axios.get(this.$httpUrl + '/unit/list')
    .then(res => {
      this.unitList = res.data || [];
      console.log("unitList=", this.unitList);
      console.log("user.unitcode=", this.user.unitcode);
    })
    .catch(err => {
      console.error("Unit取得失敗:", err);
      this.unitList = [];
    });
},

loadAuthorities() {
  this.$axios.get(this.$httpUrl + '/m-authority/list')
    .then(res => {
      this.authorityList = res.data || [];
      console.log("authorityList=", this.authorityList);
      console.log("user.organizationcode=", this.user.organizationcode);
      console.log("user.roleid=", this.user.roleid);
      console.log("user.occupationcode=", this.user.occupationcode);
      console.log("user.jobtitlecode=", this.user.jobtitlecode);
    })
    .catch(err => {
      console.error("Authority取得失敗:", err);
      this.authorityList = [];
    });
},

getUnitName(unitcode) {
  const unit = this.unitList.find(item => item.unitcode == unitcode);
  return unit ? unit.name : "不明";
},

getOrganizationName(code) {
  const item = this.authorityList.find(row => row.organizationcode == code);
  return item ? item.columnName : "不明";
},

getRoleName(code) {
  const item = this.authorityList.find(row => row.roleid == code);
  return item ? item.rolenm : "不明";
},

getOccupationName(code) {
  const item = this.authorityList.find(row => row.occupationcode == code);
  return item ? item.occupationnm : "不明";
},

getJobTitleName(code) {
  const item = this.authorityList.find(row => row.jobtitlecode == code);
  return item ? item.jobtitlenm : "不明";
},

    initBuilderChart() {
      const el = this.$refs.builderChart;
      if (!el) return;

      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
      this.chart = echarts.init(el);

      const builderJson = {
        all: 10887,
        charts: {
          大宮ユニット: 948567,
          川口ユニット: 789645,
          船橋ユニット: 234562,
          鴻巣ユニット: 897456,
          岩槻ユニット: 245697,
          横浜ユニット: 123698,
          浮島ユニット: 785496,
          厚木ユニット: 458963,
          大宮センター: 2485961,
          岩槻センター: 1896741,
          厚木センター: 2978546,
          浮島センター: 1237896
        },
        components: {
          大宮ユニット: 15,
          川口ユニット: 34,
          船橋ユニット: 55,
          鴻巣ユニット: 20,
          岩槻ユニット: 11,
          横浜ユニット: 22,
          浮島ユニット: 28,
          厚木ユニット: 150,
          大宮センター: 250,
          岩槻センター: 300,
          厚木センター: 350,
          浮島センター: 400
        },
        ie: 9743
      };

      const downloadJson = {
        "仕分けミス（商品違い）": 17365,
        "確認ミス": 4079,
        "仕分けミス（過剰・不足）": 6929,
        "配送中破損・紛失": 14890
      };

      const themeJson = {
        "その他（内容の詳細記載）": 1594,
        "おろし間違え（不足、間違い、テレコ）": 925,
        "積み付けミス": 1608,
        "センター内破損": 721,
        "顧客起因（誤発注、誤指示等": 2179,
        "品質異常（解凍・温度帯間違え）": 1982
      };

      const waterMarkText = "ECHARTS";
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.height = 100;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 0.08;
      ctx.font = "20px Microsoft Yahei";
      ctx.translate(50, 50);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(waterMarkText, 0, 0);

      const option = {
        backgroundColor: {
          type: "pattern",
          image: canvas,
          repeat: "repeat"
        },
        tooltip: {},
        title: [
          {
            text: "当月当社のIR実績",
            subtext: "合計 " + builderJson.all,
            left: "25%",
            textAlign: "center"
          },
          {
            text: "自社要因別",
            subtext:
              "合計 " +
              Object.keys(downloadJson).reduce(function (all, key) {
                return all + downloadJson[key];
              }, 0),
            left: "75%",
            textAlign: "center"
          },
          {
            text: "顧客要因別",
            subtext:
              "合計 " +
              Object.keys(themeJson).reduce(function (all, key) {
                return all + themeJson[key];
              }, 0),
            left: "75%",
            top: "50%",
            textAlign: "center"
          }
        ],
        grid: [
          {
            top: 50,
            width: "50%",
            bottom: "45%",
            left: 10,
            containLabel: true
          },
          {
            top: "55%",
            width: "50%",
            bottom: 0,
            left: 10,
            containLabel: true
          }
        ],
        xAxis: [
          {
            type: "value",
            max: MAX_TOP,
            splitLine: { show: false }
          },
          {
            type: "value",
            max: MAX_BOTTOM,
            gridIndex: 1,
            splitLine: { show: false }
          }
        ],
        yAxis: [
          {
            type: "category",
            data: Object.keys(builderJson.charts),
            axisLabel: { interval: 0, rotate: 30 },
            splitLine: { show: false }
          },
          {
            gridIndex: 1,
            type: "category",
            data: Object.keys(builderJson.components),
            axisLabel: { interval: 0, rotate: 30 },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            type: "bar",
            z: 3,
            label: { position: "right", show: true },
            data: Object.values(builderJson.charts)
          },
          {
            type: "bar",
            stack: "chart",
            silent: true,
            itemStyle: { color: "#eee" },
            data: Object.keys(builderJson.charts).map(function (key) {
              return MAX_BOTTOM - builderJson.components[key];
            })
          },
          {
            type: "bar",
            stack: "component",
            xAxisIndex: 1,
            yAxisIndex: 1,
            z: 3,
            label: { position: "right", show: true },
            data: Object.keys(builderJson.components).map(function (key) {
              return builderJson.components[key];
            })
          },
          {
            type: "bar",
            stack: "component",
            silent: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: { color: "#eee" },
            data: Object.keys(builderJson.components).map(function (key) {
              return builderJson.all - builderJson.components[key];
            })
          },
          {
            type: "pie",
            radius: [0, "30%"],
            center: ["75%", "25%"],
            data: Object.keys(downloadJson).map(function (key) {
              return {
                name: key,
                value: downloadJson[key]
              };
            })
          },
          {
            type: "pie",
            radius: [0, "30%"],
            center: ["75%", "75%"],
            data: Object.keys(themeJson).map(function (key) {
              return {
                name: key,
                value: themeJson[key]
              };
            })
          }
        ]
      };

      this.chart.setOption(option);
      window.addEventListener("resize", this.handleResize);
    },

    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
  this.loadUnits();
  this.loadAuthorities();
  this.initBuilderChart();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
};
</script>

<style scoped>
.el-descriptions {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}

.chart-wrap {
  width: 90%;
  margin: 24px auto 40px auto;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}

.chart-title {
  padding: 10px 12px;
  text-align: left;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.04);
}

.chart {
  width: 100%;
  height: 650px;
}
</style>
