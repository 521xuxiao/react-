import React, {Component} from 'react';
import $ from "jquery";
import Axios from "axios";
import "./home1.scss"
import echarts from "echarts";
class Home1 extends Component{
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            todayCarNum: 0,
            carNumCompare: +0,
            todayPurchaseBucketNum: 0,
            purchaseBucketNumCompare: 0,
            todayPurchaseTotalWeight: 0,
            purchaseTotalWeightCompare: 0,
            todayPurchaseSupplierNum: 0,
            purchaseSupplierNumCompare: 0,
            echartsData1: [],
            echartsData2: [],
            echartsData3Name: [],  echartsData3Value: [],
            tableData: []
        }
    }
    render() {
        return(
            <div id="home1">
                <div className="home1">
                    <ol className="home1_top">
                        <ol className="home1_top_left">
                            <ol className="home1_top_left_inner">
                                <ol className="home1_top_left_inner_top">
                                    <ol className="home1_top_left_inner_top_left">
                                        <ol className="home1_top_left_inner_top_left_title">今日抽检车辆数</ol>
                                        <ol className="home1_top_left_inner_top_left_content">
                                            <ol className="home1_top_left_inner_top_left_content_a">{this.state.todayCarNum}</ol>
                                            <ol className="home1_top_left_inner_top_left_content_b">辆</ol>
                                        </ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.carNumCompare>=0?{display: "inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title">{this.state.carNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content"></ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.carNumCompare<0?{display: "inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title_another">{this.state.carNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content_another"></ol>
                                    </ol>
                                </ol>
                                <ol className="home1_top_left_inner_bottom home1_top_left_inner_top">
                                    <ol className="home1_top_left_inner_top_left">
                                        <ol className="home1_top_left_inner_top_left_title">今日采购桶数</ol>
                                        <ol className="home1_top_left_inner_top_left_content">
                                            <ol className="home1_top_left_inner_top_left_content_a">{this.state.todayPurchaseBucketNum}</ol>
                                            <ol className="home1_top_left_inner_top_left_content_b">桶</ol>
                                        </ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseBucketNumCompare>=0?{display: "inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title">{this.state.purchaseBucketNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content"></ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseBucketNumCompare<0?{display: "inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title_another">{this.state.purchaseBucketNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content_another"></ol>
                                    </ol>
                                </ol>
                            </ol>
                        </ol>
                        <ol className="home1_top_middle home1_top_left">
                            <ol className="home1_top_middle_inner home1_top_left_inner">
                                <ol className="home1_top_left_inner_top">
                                    <ol className="home1_top_left_inner_top_left">
                                        <ol className="home1_top_left_inner_top_left_title">今日采购量</ol>
                                        <ol className="home1_top_left_inner_top_left_content">
                                            <ol className="home1_top_left_inner_top_left_content_a">{this.state.todayPurchaseTotalWeight}</ol>
                                            <ol className="home1_top_left_inner_top_left_content_b">吨</ol>
                                        </ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseTotalWeightCompare>=0?{display:"inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title">{this.state.purchaseTotalWeightCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content"></ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseTotalWeightCompare<0?{display:"inlineBlock"}:{display: "none"}}>
                                        <ol className="home1_top_left_inner_top_left_title_another">{this.state.purchaseTotalWeightCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content_another"></ol>
                                    </ol>
                                </ol>
                                <ol className="home1_top_left_inner_bottom home1_top_left_inner_top">
                                    <ol className="home1_top_left_inner_top_left">
                                        <ol className="home1_top_left_inner_top_left_title">今日采购代办数量</ol>
                                        <ol className="home1_top_left_inner_top_left_content">
                                            <ol className="home1_top_left_inner_top_left_content_a">{this.state.todayPurchaseSupplierNum}</ol>
                                            <ol className="home1_top_left_inner_top_left_content_b">吨</ol>
                                        </ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseSupplierNumCompare>=0?{display:"inlineBlock"}:{display:"none"}}>
                                        <ol className="home1_top_left_inner_top_left_title">{this.state.purchaseSupplierNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content"></ol>
                                    </ol>
                                    <ol className="home1_top_left_inner_top_right" style={this.state.purchaseSupplierNumCompare<0?{display:"inlineBlock"}:{display:"none"}}>
                                        <ol className="home1_top_left_inner_top_left_title_another">{this.state.purchaseSupplierNumCompare}%</ol>
                                        <ol className="home1_top_left_inner_top_left_content_another"></ol>
                                    </ol>
                                </ol>
                            </ol>
                        </ol>
                        <ol className="home1_top_right">
                            <ol className="home1_top_right_inner">
                                <ol className="home1_top_right_inner_left">
                                    <ol className="home1_top_right_inner_top_left_title">供应商数量</ol>
                                    <ol className="home1_top_left_inner_top_left_content">
                                        <ol className="home1_top_left_inner_top_left_content_a">1234</ol>
                                        <ol className="home1_top_left_inner_top_left_content_b">吨</ol>
                                    </ol>
                                </ol>
                                <ol className="placeEcharts" id="placeEcharts"></ol>
                            </ol>
                        </ol>
                    </ol>
                    <ol className="home1_bottom">
                        <ol className="home1_bottom_left">
                            <ol className="home1_bottom_left_inner">
                                <ol className="home1_bottom_left_inner_title">采购明细</ol>
                                <ol className="home1_bottom_left_inner_left" id="home1_bottom_left_inner_left"></ol>
                                <ol className="home1_bottom_left_inner_right" id="home1_bottom_left_inner_right"></ol>
                            </ol>
                        </ol>
                        <ol className="home1_bottom_right">
                            <ol className="home1_bottom_right_inner">
                                <ol className="home1_bottom_right_inner_title">累计采购量排行</ol>
                                <ol className="home1_bottom_right_inner_content">
                                    <ol className="home1_bottom_right_inner_content_h3">
                                        <li className="home1_bottom_right_inner_content_h3_li1">序号</li>
                                        <li className="home1_bottom_right_inner_content_h3_li1">供应商名称</li>
                                        <li className="home1_bottom_right_inner_content_h3_li1">采购量 (kg)</li>
                                    </ol>
                                    <div className="placeLi" id="scroll-message">
                                        <ul className="ul7" id="ul7"></ul>
                                    </div>
                                </ol>
                            </ol>
                        </ol>
                    </ol>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.init1();
        this.initDom();
        this.initData();
    }
    initData() {
        Axios.post("/self/erp/dataAnalysis/queryPurchaseData").then((res)=>{
            if(res.data.success) {
                let obj = res.data.data;
                let echartsData1 = [], echartsData2 = [], echartsData3Name = [], echartsData3Value = [], tableData = [];
                obj.suppliers.forEach((item)=>{
                    echartsData1.push({name: item.supplierTypeIntro, value: item.supplierNum})
                })
                obj.pieChartData.forEach((item)=>{
                    echartsData2.push({name: item.variety, value: item.weight})
                })
                obj.barChartData.forEach((item)=>{
                    echartsData3Name.push(item.variety);
                    echartsData3Value.push(item.weight);
                })
                obj.purchasingVolumeRanks.forEach((item, index)=>{
                    tableData.push({index: index+1, name: item.supplierName, num: item.purchaseWeight})
                })
                this.setState({
                    todayCarNum: obj.todayCarNum,
                    carNumCompare: obj.carNumCompare >= 0 ? "+" + obj.carNumCompare: obj.carNumCompare,
                    todayPurchaseBucketNum: obj.todayPurchaseBucketNum,
                    purchaseBucketNumCompare: obj.purchaseBucketNumCompare >= 0 ? "+" + obj.purchaseBucketNumCompare:obj.purchaseBucketNumCompare,
                    todayPurchaseTotalWeight: obj.todayPurchaseTotalWeight,
                    purchaseTotalWeightCompare: obj.purchaseTotalWeightCompare >= 0 ? "+" + obj.purchaseTotalWeightCompare : obj.purchaseTotalWeightCompare,
                    todayPurchaseSupplierNum: obj.todayPurchaseSupplierNum,
                    purchaseSupplierNumCompare: obj.purchaseSupplierNumCompare >= 0 ? "+" + obj.purchaseSupplierNumCompare: obj.purchaseSupplierNumCompare,
                    echartsData1,
                    echartsData2,
                    echartsData3Name, echartsData3Value,
                    tableData
                })
            }else{
                this.setState({
                    todayCarNum: 0,
                    carNumCompare: 0,
                    todayPurchaseBucketNum: 0,
                    purchaseBucketNumCompare: 0,
                    todayPurchaseTotalWeight: 0,
                    purchaseTotalWeightCompare: 0,
                    todayPurchaseSupplierNum: 0,
                    purchaseSupplierNumCompare: 0,
                    echartsData1: [],
                    echartsData2: [],
                    echartsData3Name: [],  echartsData3Value: [],
                    tableData: []
                })
            }
            this.init1();
            this.lastSrollTop();
            setTimeout(()=>{
                this.props.parent.giveParentData();
            }, 0);
        }).catch((err)=>{
            setTimeout(()=>{
                this.props.parent.giveParentData();
            }, 0);
        })
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    init1() {
        let myChart1 = echarts.init(document.getElementById('placeEcharts'));
        let option1 = {
            tooltip: {
                trigger: 'item',
                show: false
            },
            color: ['#797AFF', '#F5AC49'],
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: this.state.echartsData1,
                    label: {
                        normal: {
                            formatter: function(params) {
                                return params.name +" : "+ params.value  + '\n' + '占百分比：' + params.percent + '%';
                            },
                            padding: [0, -10],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 20,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: 'auto',
                                    width: '105%',
                                    borderWidth: 0.5,
                                    height: 0.5,
                                },
                                per: {
                                    padding: [4, 0],
                                }
                            }
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart1.setOption(option1);

        let myChart2 = echarts.init(document.getElementById('home1_bottom_left_inner_left'));
        let data = this.state.echartsData2;
        let formatNumber = function(num) {
            let reg = /(?=(\B)(\d{3})+$)/g;
            return num.toString().replace(reg, ',');
        }
        let option2 = {
            tooltip: {
                trigger: 'axis',
                show: false
            },
            color: ['#503EFF', '#3E82FF', '#8BF39A', '#00FCFD'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [
                {
                    type: 'pie',
                    radius: ['45%', '60%'],
                    center: ['50%', '50%'],
                    data: this.state.echartsData2,
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            borderColor: "#061D31",
                            borderWidth: 2
                        }
                    },
                    labelLine: {
                        normal: {
                            length: 20,
                            length2: 120,
                            lineStyle: {
                                color: '#0F2C4D'
                            }
                        }
                    },
                    label: {
                        normal: {
                            formatter: params => {
                                return (
                                    '{icon|●}{name|' + params.name + '}{value|' +
                                    formatNumber(params.value) + '}'
                                );
                            },
                            padding: [0 , -100, 25, -100],
                            rich: {
                                icon: {
                                    fontSize: 16
                                },
                                name: {
                                    fontSize: 14,
                                    padding: [0, 10, 0, 4],
                                    color: '#666666'
                                },
                                value: {
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#333333'
                                }
                            }
                        }
                    }
                }
            ]
        };
        myChart2.setOption(option2);


        let myChart3 = echarts.init(document.getElementById('home1_bottom_left_inner_right'));
        let option3 = {
            tooltip: {
                trigger: 'axis',
                show: false
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: [
                {
                    type: 'category',
                    data: this.state.echartsData3Name,
                    axisTick: {
                        alignWithLabel: false
                    },
                    axisLabel: {
                        margin: 20,
                        color: '#fff',
                        textStyle: {
                            fontSize: 12
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#0F2C4D"
                        }
                    }
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        margin: 20,
                        color: '#fff',
                        textStyle: {
                            fontSize: 12
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#0F2C4D',
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#0F2C4D",
                        }
                    }
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.state.echartsData3Value,
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                let colorList = ['#FC8D52','#5D9CEC','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                                return colorList[params.dataIndex]
                            }
                        },
                    }
                }
            ]
        };
        myChart3.setOption(option3);
    }
    initDom() {
        $(".placeLi").css({
            height: $(".home1_bottom_right").height() - ( parseInt($(".home1_bottom_right_inner_content").css("paddingTop")) + $(".home1_bottom_right_inner_content_h3").height() + 10 )
        });
    }
    lastSrollTop() {
        setTimeout(()=>{
            let table = document.getElementById("scroll-message");
            let str = '';
            let tableData = this.state.tableData;
            tableData.forEach((item, index)=>{
                str = '<ol>'+
                        '<li className="home1_bottom_right_inner_content_h3_li1">'+item.index+'</li>'+
                        '<li className="home1_bottom_right_inner_content_h3_li1">'+item.name+'</li>'+
                        '<li className="home1_bottom_right_inner_content_h3_li1">'+item.num+'</li>'+
                    '</ol>'
                $('#scroll-message #ul7').append(str);
            })
            this.timer = null;
            table.scrollTop = 0;
            table.innerHTML += table.innerHTML;
            // if(table.scrollTop >= table.scrollHeight / 2) {
            // }
            function play() {
                clearInterval(this.timer);
                this.timer = setInterval(function() {
                    table.scrollTop++;
                    if (table.scrollTop >= table.scrollHeight / 2) {
                        table.scrollTop = 0;
                    }
                }, 100);
            }
            setTimeout(play, 500);
            table.onmouseover = function() {
                clearInterval(this.timer)
            };
            table.onmouseout = play;
        },0)
    }
}
export default Home1;
