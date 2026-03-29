<template>
    <div style="width: 90%; margin-top: 80px;">
        <div style="margin-bottom: 5px;">
            <span class="demonstration">営業所：</span>
            <el-select v-model="affiliationcode" placeholder="営業所選択">
                <el-option
                v-for="unit in unitNames"
                :key="unit.id"
                :label="unit.name"
                :value="unit.name">
                </el-option>
            </el-select>
            <br><br>
            <el-button type="primary" style="margin-left: 5px;" @click="loadData">検索</el-button>
            <br><br>
        </div>
        <div id="main" style="width: 100%; height: 700px;"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  
  export default {
    data() {
        return {
            affiliationcode: '',
            unitNames: [],
            chart: null
        }
    },
    mounted() {
        this.initChart();
        this.fetchUnitNames(); // 获取营业所数据
    },
    methods: {
        initChart() {
            var chartDom = document.getElementById('main');
            this.chart = echarts.init(chartDom);
            this.chart.setOption({
                title: {
                    text: '企業体IR推移表'
                },
                tooltip: {
                    order: 'valueDesc',
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle',
                    axisLabel: {
                        rotate: 45, // 调整x轴标签的旋转角度，以便更好地显示长标签
                        interval: 0 // 强制所有标签都显示
                    }
                },
                yAxis: {
                    name: ''
                },
                grid: {
                    left: 50, // 调整左边距
                    right: 100, // 调整右边距
                    bottom: 100 // 调整下边距，以适应旋转后的x轴标签
                },
                series: []
            });
        },
        fetchUnitNames() {
            axios.get(this.$httpUrl + '/record/units').then(response => {
                this.unitNames = response.data.data; // 从API获取数据
            }).catch(error => {
                console.error('企業体の名所取得失敗:', error);
            });
        },
        fetchEchartsData() {
            const params = this.affiliationcode ? { affiliationcode: this.affiliationcode } : {};
            axios.get(this.$httpUrl + '/record/echartsData', { params }).then(response => {
                this.updateEcharts(response.data.data); // 更新图表
            }).catch(error => {
                console.error('DATA更新失敗:', error);
            });
        },
        loadData() {
            this.fetchEchartsData();
        },
        updateEcharts(data) {
            // 将Year字段转换为数字并排序
            data.forEach(item => {
                item.Year = parseInt(item.Year, 10);
            });
  
            data.sort((a, b) => a.Year - b.Year);
  
            const countries = Array.from(new Set(data.map(item => item.Country)));
            const datasetWithFilters = [];
            const seriesList = [];
  
            countries.forEach(country => {
                const datasetId = 'dataset_' + country;
                datasetWithFilters.push({
                    id: datasetId,
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                            and: [
                                { dimension: 'Year', gte: 202309 },
                                { dimension: 'Country', '=': country }
                            ]
                        }
                    }
                });
                seriesList.push({
                    type: 'line',
                    datasetId: datasetId,
                    showSymbol: false,
                    name: country,
                    endLabel: {
                        show: true,
                        formatter: function (params) {
                            return `${params.value.Country}: ${params.value.Income}`;
                        }
                    },
                    labelLayout: {
                        moveOverlap: 'shiftY'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    encode: {
                        x: 'Year',
                        y: 'Income',
                        label: ['Country', 'Income'],
                        itemName: 'Year',
                        tooltip: ['Income']
                    }
                });
            });
  
            const option = {
                animationDuration: 10000,
                dataset: [
                    {
                        id: 'dataset_raw',
                        source: data
                    },
                    ...datasetWithFilters
                ],
                series: seriesList
            };
            this.chart.setOption(option);
        },
        downloadPdf() {
            // PDF下载处理逻辑
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchEchartsData(); // 路由进入时自动加载数据
        });
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
    margin-left: 5px;
  }
  </style>
  