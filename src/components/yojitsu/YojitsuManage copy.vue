<template>
  <div style="width: 80%; margin-top: 100px;">
    <div style="margin-bottom: 5px;">
      <span class="demonstration">　期間：</span>
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        placeholder="対象年月"
      />
      <el-button type="primary" style="margin-left: 5px;" @click="loadData">検索</el-button>
      <el-button type="success" style="margin-left: 5px;margin-bottom: 10px;" @click="exportToExcel">出力</el-button>
    </div>
    <div id="bie" style="width: 200%; height: 800px; margin-top: 20px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      selectedMonth: ''
    };
  },
  methods: {
    async loadData() {
      const formattedDate = this.selectedMonth ? dayjs(this.selectedMonth).format('YYYY-M-D') : '';
      try {
        const response = await axios.post(this.$httpUrl + '/api/schedule/data', { month: formattedDate });
        this.updateChart(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    initChart() {
      var chartDom = document.getElementById('bie');
      var myChart = echarts.init(chartDom);
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['予定値', '実際値']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%', // 调整图表距离左边的距离
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: [],
            axisLabel: {
              rotate: 45, // 旋转标签
              interval: 0 // 强制显示所有标签
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '予定値',
            type: 'bar',
            barGap: 0,
            label: {
              show: true,
              position: 'inside',
              distance: 15,
              align: 'left',
              verticalAlign: 'middle',
              rotate: 90,
              formatter: '{c}  {name|{a}}',
              fontSize: 16,
              rich: { name: {} }
            },
            emphasis: { focus: 'series' },
            data: []
          },
          {
            name: '実際値',
            type: 'bar',
            barGap: 0,
            label: {
              show: true,
              position: 'inside',
              distance: 15,
              align: 'left',
              verticalAlign: 'middle',
              rotate: 90,
              formatter: '{c}  {name|{a}}',
              fontSize: 16,
              rich: { name: {} }
            },
            emphasis: { focus: 'series' },
            data: []
          }
        ]
      };
      myChart.setOption(option);
      this.myChart = myChart; // 保存图表实例
    },
    updateChart(data) {
      const units = data.map(item => item.unit);
      const schedules = data.map(item => item.schedule);
      const actualCounts = data.map(item => item.actual_count);

      this.myChart.setOption({
        xAxis: {
          data: units
        },
        series: [
          {
            name: '予定値',
            data: schedules
          },
          {
            name: '実際値',
            data: actualCounts
          }
        ]
      });
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style scoped>
button2 {
  margin-left: 5px;
  padding: 10px 15px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button2:hover {
  background-color: #66b1ff;
}

.date-picker-margin {
  margin-right: 50px;
}
</style>
