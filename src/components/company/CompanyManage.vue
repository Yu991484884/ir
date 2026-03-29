<template>
  <div class="trend-chart-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="filter-panel">
        <div class="filter-grid">
          <div class="filter-item">
            <label class="filter-label">営業所</label>
            <el-select
              v-model="affiliationcode"
              placeholder="営業所選択"
              clearable
              filterable
              class="full-width"
            >
              <el-option
                v-for="unit in unitNames"
                :key="unit.id || unit.name"
                :label="unit.name"
                :value="unit.name"
              />
            </el-select>
          </div>
        </div>

        <div class="toolbar">
          <div class="toolbar-left">
            <el-button type="primary" icon="el-icon-search" @click="loadData">
              検索
            </el-button>
          </div>
        </div>
      </div>

      <!-- グラフ表示エリア -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">企業体IR推移表</div>
          <div class="chart-subtitle">企業体別のIR推移を折れ線グラフで表示</div>
        </div>

        <div id="main" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  name: "CorporateTrendChart",
  data() {
    return {
      affiliationcode: "",
      unitNames: [],
      chart: null
    };
  },

  mounted() {
    this.initChart();
    this.fetchUnitNames();
    this.fetchEchartsData();
    window.addEventListener("resize", this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },

  methods: {
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },

    initChart() {
      const chartDom = document.getElementById("main");
      if (!chartDom) return;

      this.chart = echarts.init(chartDom);

      this.chart.setOption({
        title: {
          text: "企業体IR推移表",
          left: "center",
          top: 10,
          textStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#303133"
          }
        },
        tooltip: {
          trigger: "axis",
          order: "valueDesc"
        },
        legend: {
          top: 45,
          type: "scroll",
          textStyle: {
            color: "#606266",
            fontSize: 12
          }
        },
        xAxis: {
          type: "category",
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
        },
        yAxis: {
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
        },
        grid: {
          left: 60,
          right: 80,
          top: 95,
          bottom: 100
        },
        series: []
      });
    },

    fetchUnitNames() {
      axios
        .get(this.$httpUrl + "/record/units")
        .then(response => {
          this.unitNames = response.data.data || [];
        })
        .catch(error => {
          console.error("営業所一覧取得失敗:", error);
          this.$message.error("営業所一覧の取得に失敗しました");
        });
    },

    loadData() {
      this.fetchEchartsData();
    },

    fetchEchartsData() {
      const params = this.affiliationcode
        ? { affiliationcode: this.affiliationcode }
        : {};

      axios
        .get(this.$httpUrl + "/record/echartsData", { params })
        .then(response => {
          console.log("echartsData response:", response.data);

          const responseBody = response.data || {};
          const rawData = Array.isArray(responseBody.data)
            ? responseBody.data
            : Array.isArray(responseBody.records)
            ? responseBody.records
            : Array.isArray(responseBody.data?.records)
            ? responseBody.data.records
            : [];

          if (!rawData.length) {
            this.$message.warning("グラフ表示対象データがありません");
            this.renderEmptyChart();
            return;
          }

          this.updateEcharts(rawData);
        })
        .catch(error => {
          console.error("グラフデータ取得失敗:", error);
          this.$message.error("グラフデータの取得に失敗しました");
          this.renderEmptyChart();
        });
    },

    normalizeYear(value) {
      if (value === null || value === undefined || value === "") {
        return "";
      }

      if (typeof value === "number") {
        return String(value);
      }

      const str = String(value).trim();

      // 2024-01-15 -> 202401
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        return str.slice(0, 7).replace("-", "");
      }

      // 2024/01/15 -> 202401
      if (/^\d{4}\/\d{2}\/\d{2}/.test(str)) {
        return str.slice(0, 7).replace("/", "");
      }

      // 202401, 20240101 など
      const digits = str.replace(/\D/g, "");
      if (digits.length >= 6) {
        return digits.slice(0, 6);
      }

      return str;
    },

    updateEcharts(data) {
      if (!this.chart) return;

      // バックエンド項目名ゆれ対応
      const normalized = data
        .map(item => {
          const year = this.normalizeYear(
            item.Year ??
              item.year ??
              item.today ??
              item.month ??
              item.date
          );

          const country =
            item.Country ??
            item.country ??
            item.corporateentity ??
            item.corporateEntity ??
            item.name ??
            "不明";

          const income = Number(
            item.Income ??
              item.income ??
              item.count ??
              item.total ??
              item.value ??
              0
          );

          return {
            Year: year,
            Country: country,
            Income: isNaN(income) ? 0 : income
          };
        })
        .filter(item => item.Year && item.Country);

      console.log("normalized chart data:", normalized);

      if (!normalized.length) {
        this.$message.warning("グラフ用に変換できるデータがありません");
        this.renderEmptyChart();
        return;
      }

      // X軸（年月）一覧
      const years = [...new Set(normalized.map(item => item.Year))].sort();

      // 系列（企業体）一覧
      const countries = [...new Set(normalized.map(item => item.Country))];

      // series生成
      const series = countries.map(country => {
        const values = years.map(year => {
          const found = normalized.find(
            item => item.Country === country && item.Year === year
          );
          return found ? found.Income : 0;
        });

        return {
          name: country,
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          data: values,
          emphasis: {
            focus: "series"
          }
        };
      });

      this.chart.setOption(
        {
          title: {
            text: "企業体IR推移表"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: countries,
            top: 45,
            type: "scroll"
          },
          xAxis: {
            type: "category",
            data: years,
            axisLabel: {
              rotate: 45,
              interval: 0,
              color: "#606266"
            }
          },
          yAxis: {
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
          },
          series: series
        },
        true
      );

      this.chart.resize();
    },

    renderEmptyChart() {
      if (!this.chart) return;

      this.chart.setOption(
        {
          title: {
            text: "企業体IR推移表"
          },
          legend: {
            data: []
          },
          xAxis: {
            type: "category",
            data: []
          },
          yAxis: {
            type: "value"
          },
          series: []
        },
        true
      );
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchEchartsData();
    });
  }
};
</script>

<style scoped>
.trend-chart-page {
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
  height: 700px;
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