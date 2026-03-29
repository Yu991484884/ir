<template>
  <div class="plan-actual-chart-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="filter-panel">
        <div class="filter-grid">
          <div class="filter-item">
            <label class="filter-label">期間</label>
            <el-date-picker
              v-model="selectedMonth"
              type="month"
              placeholder="対象年月"
              class="full-width"
            />
          </div>
        </div>

        <div class="toolbar">
          <div class="toolbar-left">
            <el-button type="primary" icon="el-icon-search" @click="loadData">
              検索
            </el-button>
          </div>

          <div class="toolbar-right">
            <el-button type="warning" icon="el-icon-download" @click="exportToExcel">
              Excel出力
            </el-button>
          </div>
        </div>
      </div>

      <!-- グラフエリア -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">IR予実比較</div>
          <div class="chart-subtitle">営業所別の予定値と実績値を表示</div>
        </div>

        <div id="bie" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export default {
  name: "PlanActualChart",
  data() {
    return {
      selectedMonth: "",
      unitsData: [],
      scheduleData: [],
      myChart: null
    };
  },

  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
  },

  methods: {
    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },

    async loadData() {
      if (!this.selectedMonth) {
        this.$message.error("日付を選択してください");
        return;
      }

      const formattedDate = this.selectedMonth
        ? dayjs(this.selectedMonth).format("YYYY-M-D")
        : "";

      try {
        const [unitsResponse, scheduleResponse] = await Promise.all([
          axios.get(this.$httpUrl + "/record/units"),
          axios.post(this.$httpUrl + "/api/schedule/data", { month: formattedDate })
        ]);

        this.unitsData = unitsResponse.data.data || [];
        this.scheduleData = scheduleResponse.data || [];
        this.updateChart(this.scheduleData);
      } catch (error) {
        console.error(error);
        this.$message.error("グラフデータの取得に失敗しました");
      }
    },

    initChart() {
      const chartDom = document.getElementById("bie");
      if (!chartDom) return;

      this.myChart = echarts.init(chartDom);

      const option = {
title: {
  text: "IR予実比較",
  left: "center",
  top: 10,
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#303133"
  }
  // ❌ subtext削除
},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          top: 45,
          data: ["予定値", "実績値"],
          textStyle: {
            color: "#606266",
            fontSize: 12
          }
        },
        toolbox: {
          show: true,
          right: 20,
          top: 20,
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: 60,
          right: 40,
          bottom: 110,
          top: 100,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: [],
            axisLabel: {
              rotate: 45,
              interval: 0,
              color: "#606266"
            },
            axisLine: {
              lineStyle: {
                color: "#c0c4cc"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#606266"
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#e4e7ed"
              }
            }
          }
        ],
        series: [
          {
            name: "予定値",
            type: "bar",
            barGap: 0,
            label: {
              show: true,
              position: "top",
              fontSize: 11
            },
            emphasis: {
              focus: "series"
            },
            data: []
          },
          {
            name: "実績値",
            type: "bar",
            barGap: 0,
            label: {
              show: true,
              position: "top",
              fontSize: 11
            },
            emphasis: {
              focus: "series"
            },
            data: []
          }
        ]
      };

      this.myChart.setOption(option);
    },

    updateChart(data) {
      if (!this.myChart) return;

      const units = data.map(item => item.unit);
      const schedules = data.map(item => item.schedule);
      const actualCounts = data.map(item => item.actual_count);

      this.myChart.setOption({
        xAxis: {
          data: units
        },
        series: [
          {
            name: "予定値",
            data: schedules
          },
          {
            name: "実績値",
            data: actualCounts
          }
        ]
      });

      this.myChart.resize();
    },

    exportToExcel() {
      if (!this.scheduleData.length) {
        this.$message.warning("出力対象データがありません");
        return;
      }

      const units = this.scheduleData.map(item => item.unit);
      const schedules = this.scheduleData.map(item => item.schedule);
      const actualCounts = this.scheduleData.map(item => item.actual_count);

      const data = [
        ["営業所", "予定値", "実績値"],
        ...units.map((unit, index) => [unit, schedules[index], actualCounts[index]])
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const wsCols = ["A", "B", "C"];
      wsCols.forEach(col => {
        for (let row = 1; row <= data.length; row++) {
          const cell = ws[`${col}${row}`];
          if (cell) {
            cell.s = {
              font: {
                name: "游ゴシック",
                sz: 11,
                color: { rgb: "000000" }
              }
            };
          }
        }
      });

      const formattedMonth = this.selectedMonth
        ? dayjs(this.selectedMonth).format("YYYYMM")
        : "";
      const filename = `${formattedMonth}-IR予実.xlsx`;
      XLSX.writeFile(wb, filename);
    }
  }
};
</script>

<style scoped>
.plan-actual-chart-page {
  padding: 20px;
  background: #f7f8fa;
  min-height: 100%;
  box-sizing: border-box;
}

.page-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-panel {
  margin-bottom: 18px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.full-width {
  width: 100%;
}

.chart-card {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #ebeef5;
  border-radius: 14px;
  padding: 20px;
}

.chart-header {
  margin-bottom: 12px;
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.chart-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}

.chart-box {
  width: 100%;
  height: 720px;
}

@media screen and (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }

  .chart-box {
    height: 520px;
  }
}
</style>