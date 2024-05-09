<template>
    <div style="width: 40%; margin-top: 50px;">
      <div style="margin-bottom: 5px;">
        <span class="demonstration">営業所：</span>
        <el-select v-model="affiliationcode" placeholder="选择営業所">
          <el-option v-for="unit in unitNames" :key="unit.id" :label="unit.name" :value="unit.name"></el-option>
        </el-select>
        <br>
        <span class="demonstration">期間：</span>
        <el-date-picker v-model="today" type="daterange" range-separator="To" start-placeholder="开始日" end-placeholder="结束日" class="date-picker-margin"></el-date-picker>
        <br><br>
      </div>
      <div id="bie" style="width: 200%; height: 700px;"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  
  export default {
    name: "EchartsDemo",
    data() {
      return {
        myChart: null,
        unitNames: [],
        affiliationcode: '',
        today: [],
        defaultData: this.generateData(),
      };
    },
    mounted() {
      this.initBie();
      this.run(this.defaultData);
    },
    methods: {
      generateData() {
        const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
        const data = [];
        for (let year = 1950; year <= 2014; year++) {
          countries.forEach(country => {
            data.push({
              Year: year.toString(),
              Country: country,
              Income: Math.floor(Math.random() * (64304 - 4670 + 1)) + 4670
            });
          });
        }
        return data;
      },
      initBie() {
        this.myChart = echarts.init(document.getElementById('bie'), 'dark', {useDirtyRect: true});
      },
      run(_rawData) {
        const datasetWithFilters = [{
          id: 'dataset_raw',
          source: _rawData
        }];
        const seriesList = [];
        const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
        const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
  
        countries.forEach((country, index) => {
          seriesList.push({
            type: 'line',
            datasetId: 'dataset_raw',
            name: country,
            showSymbol: false,
            encode: {
              x: 'Year',
              y: 'Income',
              seriesName: 'Country'
            },
            color: colors[index],
            label: {
              show: true,
              position: 'right',
              formatter: function(params) {
                if (params.dataIndex === _rawData.length / countries.length - 1) { // Only show label on the last point
                  return `${params.value[1]} ${country}`;
                }
                return '';
              }
            }
          });
        });
  
        var option = {
          dataset: datasetWithFilters,
          xAxis: {
            type: 'category',
            name: 'Year'
          },
          yAxis: {
            type: 'value',
            name: 'Income'
          },
          series: seriesList
        };
  
        this.myChart.setOption(option, true);
      }
    }
  }
  </script>
  
  
  <style scoped>
  button {
    margin-left: 5px;
    padding: 10px 15px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #66b1ff;
  }
  .date-picker-margin {
    margin-right: 50px;
  }
  </style>
  