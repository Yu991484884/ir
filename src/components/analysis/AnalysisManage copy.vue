<template>
    <div style="width: 40%; margin-top: 50px;">
        <div style="margin-bottom: 5px;">
            <span class="demonstration">営業所：</span>
            <el-input v-model="affiliationcode" placeholder="営業所検索" suffix-icon="el-icon-search" style="width: 200px;margin-bottom: 10px; margin-right: 20px; "
                        @keyup.enter.native="loadPost"></el-input><br>
            <span class="demonstration">　期間：</span>
                <el-date-picker
                v-model="today"
                type="daterange"
                range-separator="To"
                start-placeholder="開始日"
                end-placeholder="終了日">
                </el-date-picker><br><br>
            <el-button type="primary" style="margin-left: 5px;" @click="loadData">検索</el-button>
             <el-button type="success" style="margin-left: 5px;" @click="downloadPdf">出力</el-button><br><br>
        </div>
        <div id="bie" style="width: 200%; height: 700px;"></div>
    </div>
</template>
<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import * as echarts from 'echarts';

export default {
    name:"Echarts",
    data(){
        return{

            affiliationcode: '', // 添加営業所搜索框绑定的数据
            today: [], // 添加日期选择器绑定的数据
            // 数据初始化为空数组
            // 不再需要factorData，因为我们会在loadData中获取数据
            // factorData: []
        }
    },
    mounted(){

        // 你可能不需要在挂载时就加载数据
        // this.fetchFactorData(); 
        this.initBie()
    },

    methods:{
        // 发送搜索请求并处理数据
        async loadData() {
            try {
                // const [startDate, endDate] = this.today; // 解构日期范围
                const today = this.today; // 解构日期范围
                // 构建POST请求的请求体
                const requestBody = {
                    param: {
                        affiliationcode: this.affiliationcode,
                        today: this.today // 假设后端需要的是一个数组
                    }
                };

                // 发送POST请求到后端，使用listPageC2端点
                const response = await this.$axios.post(this.$httpUrl + '/record/listPageC2', requestBody);
                // 用返回的数据更新ECharts图表
                this.updateChart(response.data.data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        initBie() {
            let chartDom = document.getElementById('bie');
            let myChart = echarts.init(chartDom);
            let option;
             // 使用factorData来构建ECharts的数据系列
            //  let seriesData = this.factorData.map(item => ({
            //     value: item.count, // 假设每个`factor`有一个`count`属性
            //     name: item.factor // 使用`factor`字段作为名称
            // }));

            option = {
                title: {
                    text: 'IR統計分析',
                    subtext: '要因別',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },

                // 图例
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top:'10%',
                },
                series: [
                    {
                        name: 'IR統計分析',
                        type: 'pie',
                        radius: '50%',
                        center: ['70%', '50%'], // 调整这个值来移动饼图
                        // data: seriesData,
                        data:[],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label:{
                            normal:{
                                show:true,
                                // {a} 表示系列名。
                                // {b} 表示数据项的名字。
                                // {c} 表示数据项的值。
                                // {d} 表示数据项值的百分比。
                                formatter:'{b} ({d}%)'
                            }
                        }
                    }
                ],
            };

            // option && myChart.setOption(option);
            myChart.setOption(option);
               },

            downloadPdf() {
                const today = new Date();
                const dateString = today.toISOString().split('T')[0].replace(/-/g,'');
                 // 检查affiliationcode是否为空或未定义，如果是，则不添加到文件名中
                 const filename = `${dateString}${this.affiliationcode ? '-' + this.affiliationcode : ''}-IR統計分析.pdf`; // 根据affiliationcode生成文件名

                // 使用html2canvas对我们的数据可视化进行截图
                html2canvas(document.querySelector("#bie")).then(canvas => {
                    // 将canvas转换成一个图片URL
                    const imgData = canvas.toDataURL('image/png');
                    
                    // 创建一个新的jsPDF实例
                    const pdf = new jsPDF({
                        orientation: 'landscape',
                    });

                    // 将图片添加到PDF中
                    // pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                    pdf.addImage(imgData, 'PNG',  0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                    
                    // 保存PDF（如果你想要在客户端保存PDF）
                    pdf.save(filename);
                });
                    
                },
                updateChart(data) {
                    let chartDom = document.getElementById('bie');
                    let myChart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);

   

                    let seriesData = data.map(item => ({
                        // value: item.count, // 后端返回的数据字段
                        value: !isNaN(item.count) ? Number(item.count) : 0, // 确保count是数字类型
                        name: item.factor // 后端返回的数据字段
                    }));

                    // 计算总和
                    //reduce 函数用于迭代数组中的每个元素，并累加其 count 属性。
                    let total = seriesData.reduce((sum,item)=> sum + item.value,0);
                    console.log('合計：'+total)
                    
                    // 构建完整的标题文本，包括总和
                    let titleText = 'IR統計分析 - 合計: ' + total;

                    // 获取已有的配置或创建新的配置
                    let option = myChart.getOption();
                    option.title[0].text = titleText; // 更新标题文本
                    option.series[0].data = seriesData; // 更新数据
                    // option.series[0].data = seriesData;// 更新数据
                    myChart.setOption(option, true); // 使用新配置更新图表

                },


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
</style>
