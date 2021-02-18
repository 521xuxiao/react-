import React, {Component} from "react";
import {Input, Table, Space, Pagination, Modal, Select, Button, InputNumber, message, DatePicker, Tree, Checkbox,Tag, TreeSelect} from 'antd';
import Axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./purchasingStorage.scss"
const {Option} = Select;   const {Column} = Table;  const { confirm } = Modal;
class PurchasingStorage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            supplierId: '',   supplierIdList: [],
            getInStatus: '',  getInStatusList: [],
            checkedState: '', checkedStateList: [],
            datesTime: '',

            dataSource: [],  currentPage: 1, pageSize: 10, pageTotal: 0,
            id: '',
            ///////////////////////////////  模态框里面的数据  /////////////////////////////////////
            currentIndex: 0,
            fontSizeList: [{label: '篮字', value: 1}, {label: '红字', value: 2}],
            msg: '',   visible: false,   flag: 1,
            orderCode: '',
            warehouseInTypeList: [{label:"直购", value:'purchase'}, {label:"外调", value:'transfer'}],   warehouseInType: '',
            dateTime: '',
            commission: '',   commissionList: [],
            carNumber: '',
            receivingWarehouse: '',   receivingWarehouseList: [],
            cultivationBatch: '',
            plantingBase: '',
            campusProject: "",
            batchNo: '',
            realname: '',    realnameList: [],
            dept: '',        deptList: [],
            saleNameList: [],   saleName: '',
            supplierName: '',
            sourceSheetType: '',   sourceSheetTypeList: [{label: '无', value: ''}, {label: '抽检单', value: 'cjd'}, {label: '采购订单', value: 'cgdd'}],
            ////////////////////////////////  模态框里面的表格数据   ////////////////////////////////////////////////
            modalData: [],
            materialNameList: [],
            materialCodeList: [],
            isSaleName: false,
            isCommission: false,

            ///////////////////////////////////////////  第二个模态框 //////////////////////////////////////////////////

            visible1: false,   msg1: "",
            ulList: [{name: '采购订单'}, {name: '采购抽检'}],
            currentIndexLi: 0,
            dataSource1: [],
            currentPage1: 1, pageSize1: 10, pageTotal1: 0
        }
    }
    render() {
        const columns = [
            {
                title: '序号',
                align: 'center',
                width: 80,
                render: (text, record, index)=>(
                    <span>{(this.state.currentPage - 1)*this.state.pageSize+index+1}</span>
                ),
                fixed: 'left'
            },
            {
                title: '时间',
                dataIndex: 'inboundDate',
                key: 'inboundDate',
                align: 'center',
                width: 300
            },
            {
                title: '供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                align: 'center',
                width: 100
            },
            {
                title: '订单编码',
                dataIndex: 'code',
                key: 'code',
                align: 'center',
                width: 100
            },
            {
                title: '金额',
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                align: 'center',
                render: (text)=>(
                    <span>{text / 100}</span>
                )
            },
            {
                title: '制单',
                dataIndex: 'createdName',
                key: 'createdName',
                align: 'center',
                width: 100
            },
            // {
            //     title: '收料仓库',
            //     dataIndex: 'createdName',
            //     key: 'createdName',
            //     align: 'center',
            // },
            {
                title: '实收数量',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: '部门',
                dataIndex: 'deptName',
                key: 'deptName',
                align: 'center'
            },
            {
                title: '业务员',
                dataIndex: 'salesman',
                key: 'salesman',
                align: 'center'
            },
            {
                title: '审核状态',
                dataIndex: 'auditStatus',
                key: 'auditStatus',
                align: 'center',
                render: (text)=>(
                    <span>{text==0?"否":"是"}</span>
                )
            },
            {
                title: '操作',
                dataIndex: 'address',
                key: 'address',
                align: 'center',
                width: 250,
                fixed: "right",
                render: (text, record)=>(
                    <Space size="large">
                        <span key={"details"} onClick={this.changes.bind(this, record)} className="details">编辑</span>
                        <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes">删除</span>
                        {record.auditStatus==0?(
                            <span key={"deletes"} onClick={this.check.bind(this, record)} className="changes">审核</span>
                        ):(
                            <span key={"deletes"} onClick={this.notCheck.bind(this, record)} className="changes">反审核</span>
                        )}
                        <span onClick={this.details.bind(this, record)} className="details span11">查看</span>
                    </Space>
                )
            }
        ];
        return (
            <div id="purchasingStorage">
                <div className="placeSearch">
                    <span className="span1">供应商</span>
                    <Select allowClear className={"input1"} value={this.state.supplierId} onChange={(e)=>{
                        this.setState({supplierId:e});
                    }}>
                        {
                            this.state.supplierIdList.map((item)=>{
                                return(
                                    <Option value={item.id} key={item.id}>{item.supplierName}</Option>
                                )
                            })
                        }
                    </Select>
                    <span className="span1 span111">收库状态</span>
                    <Select allowClear className={"input1"} value={this.state.getInStatus} onChange={(e)=>{
                        this.setState({getInStatus:e});
                    }}>
                        {
                            this.state.getInStatusList.map((item)=>{
                                return(
                                    <Option value={item.id} key={item.id}>{item.supplierName}</Option>
                                )
                            })
                        }
                    </Select>
                    <span className="span1 span111">审核状态</span>
                    <Select allowClear className={"input1"} value={this.state.checkedState} onChange={(e)=>{
                        this.setState({checkedState:e});
                    }}>
                        {
                            this.state.checkedStateList.map((item)=>{
                                return(
                                    <Option value={item.id} key={item.id}>{item.supplierName}</Option>
                                )
                            })
                        }
                    </Select>
                    <span className="span1 span111">时间</span>
                    <DatePicker onChange={(e, time)=>{
                        this.setState({
                            datesTime: time
                        })
                    }} className="input1" placeholder="" locale={locale}/>
                    <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                </div>

                <div className="bg">
                    <button className="searchs" onClick={this.download.bind(this)}>导出</button>
                    <button className="searchs" onClick={this.add.bind(this)}>新增</button>
                    <button className="searchs" onClick={this.create.bind(this)}>生成</button>
                </div>
                <div className="placeTable">
                    <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: "暂无数据"}} columns={columns}></Table>
                </div>
                <div className="placePagination">
                    <Pagination showTotal={()=>`共 ${this.state.pageTotal} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotal} showSizeChanger={false}/>
                </div>

                <Modal title={this.state.msg} width="90%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                    <div className="modal11">
                        <ul className="modal11_ul1">
                            {this.state.fontSizeList.map((item, index)=>{
                                return(
                                    <li key={item.value} onClick={this.handleClickLi.bind(this, index)}
                                    className={this.state.currentIndex==index?"active modal11_ul1_li":"modal11_ul1_li"}>{item.label}</li>
                                )
                            })}
                        </ul>
                        <div className="div3">
                            <ul className="ul1">
                                <li className="li1">
                                    <span className="span1">订单编码</span>
                                    <Input disabled value={this.state.orderCode} className={"input3"}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">入库单类型</span>
                                    <Select allowClear className={"input3"} value={this.state.warehouseInType} onChange={(e)=>{
                                        this.setState({
                                            warehouseInType: e
                                        });
                                    }} disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.warehouseInTypeList.map((item)=>{
                                                return(
                                                    <Option value={item.value} key={item.value}>{item.label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">日期</span>
                                    <DatePicker disabled={this.state.flag==3?true:false} onChange={(e, time)=>{
                                        this.setState({
                                            dateTime: time
                                        })
                                    }} className="input3" placeholder=""
                                                value={this.state.dateTime==''||this.state.dateTime==null?"": moment(this.state.dateTime, 'YYYY-MM-DD')}
                                                locale={locale}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">供应商</span>
                                    <TreeSelect
                                        treeDataSimpleMode
                                        style={{width: '100%'}}
                                        value={this.state.commission}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        placeholder="选择供应商"
                                        onChange={(value, label, extra) => {

                                            this.setState({commission: value, supplierName: label[0], isCommission: true})
                                        }}
                                        loadData={this.onLoadData.bind(this)}
                                        treeData={this.state.commissionList}
                                        className="input3"
                                        onSelect={this.treeSelect.bind(this)}
                                        disabled={this.state.flag==3?true:false}
                                    />
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">车号</span>
                                    <Input allowClear value={this.state.carNumber} className="input3" onChange={(e)=>{
                                        this.setState({
                                            carNumber: e.target.value
                                        })
                                    }} disabled={this.state.flag==3?true:false}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">发票号</span>
                                    <Input disabled value={this.state.batchNumber1} className={"input3"}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">收料仓库</span>
                                    <Select allowClear className={"input3"} value={this.state.receivingWarehouse} onChange={(e)=>{
                                        this.state.modalData.forEach((item)=>{
                                            item.warehouseId = e;
                                        })
                                        this.setState({
                                            receivingWarehouse: e,
                                            modalData: this.state.modalData
                                        });
                                    }} disabled={this.state.flag==3?true:false} filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } showSearch>
                                        {
                                            this.state.receivingWarehouseList.map((item)=>{
                                                return(
                                                    <Option value={item.id} key={item.id}>{item.fullName}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">种植批次</span>
                                    <Input value={this.state.cultivationBatch} className={"input3"} onChange={(e)=>{this.setState({
                                        cultivationBatch: e.target.value
                                    })}} disabled={this.state.flag==3?true:false}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">果园号</span>
                                    <Input disabled value={this.state.campusProject} className={"input3"} onChange={(e)=>{
                                        this.setState({campusProject: e.target.value})
                                    }}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">种植基地</span>
                                    <Input value={this.state.plantingBase} className={"input3"} onChange={(e)=>{this.setState({
                                        plantingBase: e.target.value
                                    })}} disabled={this.state.flag==3?true:false}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">批次号</span>
                                    <Input disabled value={this.state.batchNo} className={"input3"} onChange={(e)=>{this.setState({
                                        batchNo: e.target.value
                                    })}}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">源单类型</span>
                                    <Select allowClear className={"input3"} value={this.state.sourceSheetType} onChange={(e)=>{
                                        this.setState({
                                            sourceSheetType: e
                                        });
                                    }} disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.sourceSheetTypeList.map((item)=>{
                                                return(
                                                    <Option value={item.value} key={item.value}>{item.label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                            </ul>
                        </div>
                        <div className="placeChangeTable">
                            <Table pagination={false} dataSource={this.state.modalData}
                                   locale={{emptyText: '暂无数据'}} scroll={{x: 3000}}>
                                <Column title="" align="center" key="records" dataIndex="records" width={120}
                                        fixed='left'
                                        render={(text, record) => (
                                            <>
                                                <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                            <span style={{display: 'inline-block',width: '30px',height: '30px',borderRadius: '50%',
                                                                border: "1px solid #999",fontSize: '30px', fontWeight: 'bolder', userSelect: 'none',
                                                                cursor: 'pointer',textAlign: 'center', lineHeight: '25px',color: '#14BB12'}}
                                                                  onClick={this.addModalData.bind(this)}>+</span>
                                                    <span style={{display: 'inline-block',width: '30px',height: '30px',borderRadius: '50%',
                                                        border: "1px solid #999",fontSize: '30px', fontWeight: 'bolder', userSelect: 'none',
                                                        cursor: 'pointer',textAlign: 'center', lineHeight: '25px',color: '#DF0035',marginLeft: '10px'}}
                                                          onClick={this.subtraction.bind(this, record)}>-</span>
                                                </div>
                                                <div style={record.flag!="notShow"?{display: 'none'}:{display: "block"}}>
                                                    <span>合计</span>
                                                </div>
                                            </>
                                        )}
                                />
                                <Column title="物料编码" dataIndex="materialCode" key="materialCode" align="center"
                                        width={300} render={(text, record) => (
                                    <>
                                        <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                            <div style={{width: '300px', overflow: 'hidden'}}>
                                                <div style={{width: '200px', float: 'left'}}>
                                                    <Select className={"input3"} style={this.state.currentIndex==0?{width: '100%',color:'#000000a6'}:{width: '100%', color:'red'}}
                                                            onChange={(e) => {
                                                                let arr = [];
                                                                if (e.indexOf(",") != -1) {
                                                                    arr = e.split(",");
                                                                } else {
                                                                    arr = [];
                                                                }
                                                                this.state.modalData.forEach((item) => {
                                                                    if (item.id == record.id) {
                                                                        item.materialCode = e;
                                                                        item.materialName = arr[0];
                                                                        item.measurement = arr[5];
                                                                        item.stock = arr[7];
                                                                        if (arr[1] == "material") {
                                                                            item.standard = arr[2];
                                                                            item.baseInfoType = "material";
                                                                        } else if (arr[1] == "accessories") {
                                                                            item.standard = arr[3];
                                                                            item.baseInfoType = "accessories";
                                                                        } else if (arr[1] == "product") {
                                                                            item.standard = arr[4];
                                                                            item.baseInfoType = "product";
                                                                        }
                                                                        this.setState({modalData: this.state.modalData})
                                                                    }
                                                                })
                                                            }} value={text}
                                                            disabled={this.state.flag == 3 ? true : false} filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    } showSearch>
                                                        {
                                                            this.state.materialCodeList.map((item, index) => {
                                                                return (
                                                                    <Option
                                                                        value={item.materialName + "," + item.baseInfoType + "," + item.materialStandard + "," + item.accessoriesStandard
                                                                        + "," + item.productStandard + "," + item.measurement+","+item.materialCode+","+item.stock}
                                                                        key={index}>{item.materialCode+": "+item.materialName}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </div>
                                                {/*<div style={{width: '60px', float: 'left'}}>*/}
                                                {/*    <Button type="primary" onClick={this.selectClick.bind(this)}>选择</Button>*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </>
                                )}/>
                                <Column title="物料名称" dataIndex="materialName" key="materialName" align="center" render={(text, record)=>(
                                    <div style={this.state.currentIndex==0?{color:'#000000a6'}:{color:'red'}}>
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    </div>
                                )}/>
                                <Column width={200} title="周转物类型" dataIndex="turnoverType" key="turnoverType"
                                        align="center" render={(text, record) => (
                                    <div>
                                        <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                            <Select style={this.state.currentIndex==0?{width: '100%', textAlign: "left", color: '#000000a6'}: {width: '100%', textAlign: "left",color:'red'}} value={text}
                                                    onChange={
                                                        (e) => {
                                                            this.state.modalData.forEach((item) => {
                                                                if (item.id == record.id) {
                                                                    item.turnoverType = e;
                                                                    this.setState({modalData: this.state.modalData})
                                                                }
                                                            })
                                                        }
                                                    } filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch disabled={this.state.flag==3?true:false}>
                                                {this.state.materialNameList.map((item) => {
                                                    return (
                                                        <Option value={item.materialCode}
                                                                key={item.materialCode}>{item.materialName}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                )}/>
                                <Column title="箱数" dataIndex="boxNum" key="boxNum" align="center"
                                        render={(text, record) => (
                                            <>
                                                <InputNumber value={text} onChange={(e) => {
                                                    this.commonZone(e,record, "boxNum");
                                                }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}
                                                style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}}/>
                                            </>
                                        )}/>
                                <Column title="桶数" dataIndex="bucketNum" key="bucketNum" align="center"
                                        render={(text, record) => (
                                            <>
                                                <InputNumber value={text} onChange={(e) => {
                                                    this.commonZone(e,record, "bucketNum");
                                                }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}
                                                style={this.state.currentIndex==0?{color: '#000000a6'}:{color: 'red'}}/>
                                            </>
                                        )}/>
                                <Column title="单位" dataIndex="measurement" key="measurement" align="center" render={(text, record)=>(
                                    <div style={this.state.currentIndex==0?{color:'#000000a6'}:{color:'red'}}>
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    </div>
                                )}/>
                                <Column title="应收数量" dataIndex="receivableNumber" key="receivableNumber" align="center" width={160}
                                        render={(text, record) => (
                                            <>
                                                <InputNumber value={text} onChange={(e) => {
                                                    this.commonZone(e,record, "receivableNumber");
                                                }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}
                                                style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}}/>
                                            </>
                                        )}/>
                                <Column title="实收数量" dataIndex="number" key="number" align="center" width={160}
                                        render={(text, record) => (
                                            <>
                                                <InputNumber value={text} onChange={(e) => {
                                                    if(e) {
                                                        this.commonZone(e,record, "number");
                                                    }
                                                }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}
                                                 style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}}/>
                                            </>
                                        )}/>
                                <Column title="单价" dataIndex="unitPrice" key="unitPrice" align="center"
                                        render={(text, record) => (
                                            <>
                                                <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                    <InputNumber value={text} style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}} onChange={(e) => {
                                                        this.state.modalData.forEach((item) => {
                                                            if (item.id == record.id) {
                                                                item.totalPrice = Number(item.number) * Number(e);
                                                                item.taxUnitPrice = item.unitPrice = e;
                                                            }
                                                        })
                                                        this.setState({modalData: this.state.modalData})
                                                    }} disabled={this.state.flag==3?true:false}/>
                                                </div>
                                            </>
                                        )}/>
                                <Column title="金额" dataIndex="totalPrice" key="totalPrice" align="center"
                                        render={(text, record) => (
                                            <>
                                                <InputNumber value={text} onChange={(e) => {
                                                    if(e) {
                                                        this.commonZone(e,record, "totalPrice");
                                                    }
                                                }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}
                                                             style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}}/>
                                            </>
                                        )}/>
                                <Column title="收料仓库" dataIndex="warehouseId" key="warehouseId" align="center"
                                        render={(text, record) => (
                                            <>
                                            <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                <Select value={text}
                                                        disabled={this.state.flag==3?true:false}
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        } showSearch
                                                        onChange={
                                                            (e) => {
                                                                this.state.modalData.forEach((item) => {
                                                                    if (item.id == record.id) {
                                                                        item.warehouseId = e;
                                                                        this.setState({modalData: this.state.modalData})
                                                                    }
                                                                })
                                                            }
                                                        } style={this.state.currentIndex==0?{color:'#000000a6',width: '100%', textAlign: "left"}:{color: 'red',
                                                    width: '100%', textAlign: "left"}}>
                                                    {this.state.receivingWarehouseList.map((item) => {
                                                        return (
                                                            <Option value={item.id}
                                                                    key={item.id}>{item.fullName}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </div>
                                            </>
                                        )}/>
                                <Column title="备注" dataIndex="note" key="note" align="center"
                                        render={(text, record) => (
                                            <>
                                                <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                    <Input value={text} onChange={(e) => {
                                                        this.state.modalData.forEach((item) => {
                                                            if (item.id == record.id) {
                                                                item.note = e.target.value;
                                                                this.setState({modalData: this.state.modalData})
                                                            }
                                                        })
                                                    }} style={this.state.currentIndex==0?{color:'#000000a6'}:{color: 'red'}}
                                                           disabled={this.state.flag==3?true:false}/>
                                                </div>
                                            </>
                                        )}/>
                                <Column title="包装版面" dataIndex="packagingLayout" key="packagingLayout" align="center"
                                    render={(text, record) => (
                                        <>
                                            <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                <Select value={text} disabled={this.state.flag==3?true:false} style={this.state.currentIndex==0?{color:'#000000a6',width: '100%', textAlign: "left"}:
                                                    {color: 'red',width: '100%', textAlign: "left"}}
                                                        onChange={
                                                            (e) => {
                                                                this.state.modalData.forEach((item) => {
                                                                    if (item.id == record.id) {
                                                                        item.packagingLayout = e;
                                                                        this.setState({modalData: this.state.modalData})
                                                                    }
                                                                })
                                                            }
                                                        }>
                                                    {this.state.materialNameList.map((item) => {
                                                        return (
                                                            <Option value={item.materialCode}
                                                                    key={item.materialCode}>{item.materialName}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </div>
                                        </>
                                    )}/>
                                <Column title="规格型号" dataIndex="standard" key="standard" align="center" render={(text, record)=>(
                                    <div style={this.state.currentIndex==0?{color: '#000000a6'}:{color:'red'}}>
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    </div>
                                )}/>
                                <Column title="库存" dataIndex="stock" key="stock" align="center" render={(text, record)=>(
                                    <div style={this.state.currentIndex==0?{color: '#000000a6'}:{color:'red'}}>
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    </div>
                                )}/>
                                <Column title="源单单号" dataIndex="sourceSheetId" key="sourceSheetId" align="center" render={(text, record)=>(
                                    <>
                                        <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                            <Input value={text} onChange={(e) => {
                                                this.state.modalData.forEach((item) => {
                                                    if (item.id == record.id) {
                                                        item.sourceSheetId = e.target.value;
                                                        this.setState({modalData: this.state.modalData})
                                                    }
                                                })
                                            }} style={this.state.currentIndex==0?{color: '#000000a6'}:{color:'red'}}
                                                   disabled={this.state.flag==3?true:false}/>
                                        </div>
                                    </>
                                )}/>
                            </Table>
                        </div>
                        <div className="div3">
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">制单</span>
                                    <Input disabled value={this.state.createName} className={"input3"}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">保管</span>
                                    <Select allowClear className="input3" value={this.state.realname} onChange={(e)=>{
                                        this.setState({
                                            realname: e
                                        });
                                    }} disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.realnameList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">验收</span>
                                    <Select allowClear className="input3" value={this.state.checkLeader} onChange={(e)=>{
                                        this.setState({
                                            checkLeader: e
                                        });
                                    }} disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.realnameList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">部门</span>
                                    <TreeSelect
                                        className="input3"
                                        style={{ width: '100%' }}
                                        value={this.state.dept}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.deptList}
                                        placeholder=""
                                        treeDefaultExpandAll
                                        onChange={this.deptChange.bind(this)}
                                        disabled={this.state.flag==3?true:false}
                                    />
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">业务员</span>
                                    <Select allowClear className="input3" value={this.state.saleName} onChange={(e)=>{
                                        this.setState({
                                            saleName: e,
                                            isSaleName: true
                                        });
                                    }} disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.saleNameList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">审核</span>
                                    <Input disabled value={this.state.check} className={"input3"}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">审核日期</span>
                                    <Input disabled value={this.state.checkTime} className={"input3"}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">记账</span>
                                    <Input disabled value={this.state.jizhang} className={"input3"}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="div4">
                        <li className="li4">
                            <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>取消</Button>
                        </li>
                        <li className="li4" style={this.state.flag==3?{display: 'none'}:{display: 'block'}}>
                            <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                        </li>
                    </div>
                </Modal>
                <Modal title={this.state.msg1} width="90%" footer={null} getContainer={false} closable={false}  visible={this.state.visible1} centered={true}>
                    <div className="modal11">
                        <ul className="ulPlaceTab">
                            {this.state.ulList.map((item, index)=>{
                                return(
                                    <li className={this.state.currentIndexLi==index?"active ulPlaceTab_li1":"ulPlaceTab_li1"} key={index} onClick={this.clickLi.bind(this, index)}>{item.name}</li>
                                )
                            })}
                        </ul>
                        <div className="placeTable">
                            <Table pagination={false} dataSource={this.state.dataSource1} locale={{emptyText: '暂无数据'}}>
                                <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                    <span>{(this.state.currentPage1-1)*this.state.pageSize1+index+1}</span>
                                )}/>
                                <Column title="仓库" dataIndex="name" key="name" align="center"/>
                                <Column title="编码" dataIndex="code" key="code" align="center"/>
                                <Column title="操作" align="center" key="records" dataIndex="records" width="240px"
                                    render={(text, record) => (
                                        <Space size="large">
                                            <span key={"changes"} onClick={this.createBtn.bind(this, record)} className="changes">生成</span>
                                        </Space>
                                    )}
                                />
                            </Table>
                        </div>
                        <div className="placePagination">
                            <Pagination showTotal={()=>`共 ${this.state.pageTotal1} 条`} current={this.state.currentPage1} onChange={this.changePages1.bind(this)} pageSize={this.state.pageSize1} total={this.state.pageTotal1} showSizeChanger={false}/>
                        </div>
                        <div className="div4">
                            <li className="li4">
                                <Button className="btn4" type="danger" onClick={()=>{this.setState({visible1: false})}}>取消</Button>
                            </li>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize
        }
        Axios.post("/self/erp/purchaseInbound/queryPurchaseInboundSheet", params).then((res)=>{
            if(res.data.success) {
                res.data.data.purchaseInboundSheets.forEach((item)=>{
                    item.key = item.id;
                })
                this.setState({
                    dataSource: res.data.data.purchaseInboundSheets,
                    pageTotal: res.data.data.num
                })
            }else{
                this.setState({
                    dataSource: [],
                    pageTotal: 0
                })
            }
        })
    }
    initTree() {
        Axios.post("/self/erp/baseinfo/querySupplierGroup", {}).then((res)=>{
            if(res.data.success) {
                let commissionList = [];
                res.data.data.supplierGroups.forEach((item)=>{
                    commissionList.push({
                        title: item.fullName,
                        id: item.id,
                        pId: item.parentId,
                        isLeaf: false,
                        value: item.id
                    })
                })
                this.setState({
                    commissionList
                })
            }else{
                this.setState({
                    commissionList: []
                })
            }
        })
    }
    searchMethods() {
        this.initData(this.state.currentPage)
    }

    /**
     * 生成按钮
     * @param val
     */
    create() {
        this.setState({
            visible1: true,
            msg1: '生成入库单'
        })
    }

    /**
     * 第二个模态框里面的生成按钮
     * @param val
     */
    createBtn() {

    }

    /**
     * 第二个模态框里面的分页按钮
     * @param i
     */
    changePages1(val) {

    }

    clickLi(i) {
        this.setState({
            currentIndexLi: i
        })
    }

    //部门变化的模态框
    deptChange(val) {
        this.setState({
            dept: val
        })
        Axios.post("/self/erp/dept/queryDeptUsers", {deptId: val}).then((res)=>{
            if(res.data.success) {
                // empno   realname
                this.setState({
                    saleNameList: res.data.data.userList,
                    saleName: ''
                })
            }else{
                this.setState({
                    saleNameList: []
                })
            }
        })
    }

    /**
     * 增加按钮
     */
    addModalData() {
        let str = new Date().getTime();
        let warehouseId = "";
        if(this.state.receivingWarehouse) {
            warehouseId = this.state.receivingWarehouse;
        }
        this.state.modalData.splice(this.state.modalData.length-1, 0, {key: str, id: str, boxNum: 0, bucketNum: 0, number: 0,
            totalPrice: 0, unitPrice: 0, receivableNumber: 0, warehouseId});
        this.setState({
            modalData: [...this.state.modalData]
        })
    }

    /**
     * 减少按钮
     */
    subtraction(row) {
        if(this.state.modalData.length > 2) {
            this.state.modalData.forEach((outItem, index)=>{
                if(outItem.id == row.id) {
                    this.state.modalData.splice(index, 1);
                }
            });
            let boxNum = 0, bucketNum=0, number = 0, totalPrice = 0, receivableNumber=0;
            for(let i=0;i<this.state.modalData.length-1;i++) {
                boxNum += Number(this.state.modalData[i].boxNum);
                bucketNum += Number(this.state.modalData[i].bucketNum);
                number += Number(this.state.modalData[i].number);
                totalPrice += Number(this.state.modalData[i].totalPrice);
                receivableNumber += Number(this.state.modalData[i].receivableNumber);
            }
            this.state.modalData[this.state.modalData.length-1]["boxNum"] = boxNum.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["bucketNum"] = bucketNum.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["number"] = number.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["totalPrice"] = totalPrice.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["receivableNumber"] = receivableNumber.toFixed(2);
            this.setState({
                modalData: [...this.state.modalData]
            })
        }
    }

    /**
     * 收料仓库下拉框
     * @param e
     * @param record
     * @param name
     */
    receivingWarehouseList() {
        Axios.post("/self/erp/baseinfo/queryWarehouseAreas", {}).then((res)=>{    // 收料仓库下拉框
            if(res.data.success) {
                this.setState({
                    receivingWarehouseList: res.data.data.warehouseAreas
                })
            }else{
                this.setState({
                    receivingWarehouseList: []
                })
            }
        })
        Axios.post("/self/erp/purchaseInbound/generatePurchaseInboundCode", {}).then((res)=>{  //  编码
            if(res.data.success) {
                this.setState({
                    orderCode: res.data.data
                })
            }else{
                this.setState({
                    orderCode: ""
                })
            }
        })
        Axios.post("/self/erp/baseinfo/queryMaterialInfoItems", {}).then((res)=>{  //   查询物料下拉框编码
            if(res.data.success) {
                this.setState({
                    materialCodeList: res.data.data.materialInfos,
                    materialNameList: res.data.data.materialInfos
                })
            }else{
                this.setState({
                    materialCodeList: [],
                    materialNameList: []
                })
            }
        })
        Axios.post("/self/erp/baseinfo/queryUser", {}).then((res)=>{   // 保管下拉框
            if(res.data.success) {
                this.setState({
                    realnameList: res.data.data.users
                })
            }else{
                this.setState({
                    realnameList: []
                })
            }
        })
        Axios.post("/self/erp/dept/queryDept", {}).then((res)=>{  // 部门列表
            if(res.data.success) {
                this.again(res.data.data.deptList);
            }else{
                this.setState({
                    deptList: []
                })
            }
        })
    }
    again(array) {
        array.forEach((item)=>{
            item.title = item.deptName;
            item.value = item.deptId;
            if(item.children != undefined) {
                this.again(item.children);
            }
        })
        this.setState({
            deptList: array
        })
    }

    // 统计公共方法
    commonZone(e,record, name) {
        this.state.modalData.forEach((item) => {
            if (item.id == record.id) {
                item[name] = e;
                item.unitPrice = (Number(item.totalPrice) / Number(item.number)).toFixed(2);
                this.setState({modalData: this.state.modalData})
            }
        })
        let num = 0;
        for(let i=0;i<this.state.modalData.length-1;i++){
            num += Number(this.state.modalData[i][name]);
        }
        this.state.modalData[this.state.modalData.length-1][name] = num.toFixed(2);
        this.setState({
            modalData: [...this.state.modalData]
        })
    }


    /**
     * 供应商控件的点击选择
     */
    treeSelect(node, nodeTree) {
        // console.log(nodeTree);
        // registrationCode
        this.setState({
            campusProject: nodeTree.registrationCode,
            batchNo: nodeTree.batchNumber
        })
    }

    /**
     * 供应商的异步加载数据
     */
    onLoadData = treeNode =>
        new Promise(resolve => {
            const {id} = treeNode.props;
            let params = {
                id: treeNode.props.id,
                currentPage: 1,
                pageSize: 200000
            }
            Axios.post("/self/erp/baseinfo/querySupplierByParentId", params).then((res) => {
                if (res.data.success) {
                    let arr = [];
                    let boolean = true;
                    if(res.data.data.suppliers.length==0)
                        boolean = false
                    if(res.data.data.suppliers && res.data.data.suppliers.length) {
                        res.data.data.suppliers.forEach((item) => {
                            arr.push(
                                {
                                    id: item.id,
                                    pId: item.parentId,
                                    value: item.id,
                                    title: item.supplierName,
                                    isLeaf: boolean,
                                    registrationCode: item.registrationCode,
                                    batchNumber: item.batchNumber
                                }
                            )
                        })
                    }
                    this.setState({
                        commissionList: this.state.commissionList.concat(arr)
                    })
                } else {
                    this.setState({
                        commissionList: this.state.commissionList.concat([])
                    })
                }
                resolve();
            });
        })

    /**
     * 模态框里面的增加按钮
     */
    selectClick() {

    }

    /**
     * 点击红色蓝色的切换按钮
     */
    handleClickLi(item) {
        this.setState({
            currentIndex: item
        })
    }

    add() {
        let obj = sessionStorage.getItem("userInfo");
        let realName = JSON.parse(obj).realname;
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let date = now.getDate();
        let dateTime = year +"-"+ month +"-"+ date;
        this.setState({
            flag: 1,
            visible: true,
            msg: "新增",
            isSaleName: false,
            isCommission: false,

            warehouseInType: '',
            commission: '',
            dateTime,
            carNumber: '',
            batchNumber1: '',
            receivingWarehouse: '',
            cultivationBatch: '',
            campusProject: '',
            plantingBase: '',
            batchNo: '',
            sourceSheetType: '',
            realname: '',  checkLeader:'',
            dept:'',   saleName:'',    check:'',    checkTime:'',    jizhang:'',
            createName: realName,

            modalData: [
                {key: 'dfsdfs543534534gdfgdfg54353', boxNum: 0, bucketNum: 0,receivableNumber: 0, number: 0, totalPrice: 0, id: 'dfsdfs543534534gdfgdfg54353', unitPrice: 0},
                {
                    flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                    unitNetWeight: '', receivableNumber: 0,   number: 0,  unitPrice: 0,       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                    id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn',
                    key: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
                }
            ]
        })
        this.receivingWarehouseList();
        this.initTree();
    }
    changes(row) {
        this.receivingWarehouseList();
        this.setState({
            id: row.id,
            visible: true,
            flag: 2,
            msg: "修改",
            isSaleName: false,
            isCommission: false
        })
        this.initTree();
        this.queryById(row);
    }
    details(row) {
        this.receivingWarehouseList();
        this.setState({
            id: row.id,
            visible: true,
            flag: 3,
            msg: "编辑",
            isSaleName: false,
            isCommission: false
        })
        this.initTree();
        this.queryById(row);
    }
    queryById(row) {
        Axios.post("/self/erp/purchaseInbound/queryPurchaseInboundSheetById", {id: row.id}).then((res)=>{
            if(res.data.success) {
                let modalData= [];
                let obj = res.data.data.purchaseInboundSheet;
                obj.purchaseInboundSheetItems.forEach((item)=>{
                    modalData.push({
                        key: item.id,
                        id: item.id,
                        materialCode: item.materialName + "," + item.baseInfoType + "," + item.materialStandard + "," + item.accessoriesStandard
                            + "," + item.productStandard + "," + item.measurement+","+item.materialCode+","+item.stock,
                        materialName: item.materialName,
                        turnoverType: item.turnoverType,
                        boxNum: item.boxNum,
                        bucketNum: item.bucketNum,
                        measurement: item.measurement,
                        receivableNumber: item.receivableNumber,
                        number: item.number,
                        unitPrice: item.unitPrice,
                        totalPrice  : item.totalPrice,
                        warehouseId   : item.warehouseId,
                        note : item.note,
                        packagingLayout: item.packagingLayout,
                        standard : item.standard,
                        stock : item.stock,
                        sourceSheetId: item.sourceSheetCode   // 源单单号
                    })
                })
                modalData.push({
                    key: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn',
                    flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                    unitNetWeight: '', receivableNumber: 0,   number: 0,      unitPrice: '',       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                    id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
                })
                this.setState({
                    batchNumber1: '',
                    commission: obj.supplierName,
                    warehouseInType: obj.purchaseType,
                    dateTime: obj.inboundDate,

                    warehouseId: obj.defaultWarehouseId,
                    campusProject: obj.registrationCode,
                    batchNo: obj.batchNumber,
                    sourceSheetType: obj.sourceSheetType,
                    realname: obj.keeperEmpno,
                    checkLeader: obj.checkLeader,
                    dept: obj.deptId,
                    saleName: obj.salesman,

                    orderCode: obj.code,
                    carNumber: obj.carNo,
                    receivingWarehouse: obj.defaultWarehouseId,
                    cultivationBatch: obj.cultivationBatch,
                    plantingBase: obj.plantingBase,

                    createName: obj.createName,
                    check: obj.auditName,    checkTime: obj.auditTime,    jizhang:'',

                    modalData
                })
            }
        })
    }
    deletes(row) {
        let that = this;
        confirm({
            title: '你确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id
                };
                Axios.post('/self/erp/purchaseInbound/deletePurchaseInboundSheet', params).then((res)=>{
                    if(res.data.success) {
                        message.success("删除成功");
                        that.initData(that.state.currentPage);
                    }else{
                        message.warning(res.data.message);
                    }
                })
            },
            onCancel() {},
        });
    }
    check(row) {
        let that = this;
        confirm({
            title: '你确定要审核吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id,
                    auditStatus: 1,
                    version: row.version
                };
                Axios.post('/self/erp/purchaseInbound/auditPurchaseInboundSheet', params).then((res)=>{
                    if(res.data.success) {
                        message.success("成功");
                        that.initData(that.state.currentPage);
                    }else{
                        message.warning(res.data.message);
                    }
                })
            },
            onCancel() {},
        });
    }
    notCheck(row) {
        let that = this;
        confirm({
            title: '你确定要反审核吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id,
                    auditStatus: 0,
                    version: row.version
                };
                Axios.post('/self/erp/purchaseInbound/auditPurchaseInboundSheet', params).then((res)=>{
                    if(res.data.success) {
                        message.success("成功");
                        that.initData(that.state.currentPage);
                    }else{
                        message.warning(res.data.message);
                    }
                })
            },
            onCancel() {},
        });
    }
    handleOk() {
        let newArr = [];
        for(let i=0;i<this.state.modalData.length;i++) {
            if(this.state.modalData[i].flag == undefined) {
                let obj = this.state.modalData[i];
                newArr.push({
                    materialCode: obj.materialCode == null?'': obj.materialCode.indexOf(",") != -1  ? obj.materialCode.split(",")[6] : '',
                    materialName: obj.materialName,
                    receivableNumber: obj.receivableNumber,
                    number: obj.number,
                    baseInfoType: obj.materialCode == null?'': obj.materialCode.indexOf(",") != -1  ? obj.materialCode.split(",")[1] : '',
                    boxNum: obj.boxNum,
                    bucketNum: obj.bucketNum,
                    measurement: obj.measurement,
                    turnoverType: obj.turnoverType,
                    totalPrice: Number(obj.totalPrice) * 100,
                    unitPrice: Number(obj.unitPrice) * 100,
                    note: obj.note,
                    sourceSheetCode: obj.sourceSheetId,
                    warehouseId: obj.warehouseId,
                    packagingLayout: obj.packagingLayout,
                    standard: obj.standard,
                    stock: obj.stock,
                    sourceSheetId: ''   // 原单id, 生成带过来的
                })
            }
        }
        let params = {
            code: this.state.orderCode,
            supplierName: this.state.isCommission?this.state.supplierName:"",
            supplierId: this.state.isCommission? this.state.commission: "",
            deptId: this.state.dept,
            empno: this.state.isSaleName? this.state.saleName : '',
            sourceSheetType: this.state.sourceSheetType,  // 原单类型
            carNo: this.state.carNumber,
            redBlueMark: this.state.currentIndex==0?"blue":"red",
            purchaseType: this.state.warehouseInType,
            summary: '',
            checkLeader: this.state.checkLeader,
            registrationCode: this.state.campusProject,
            batchNumber: this.state.batchNo,
            keeperEmpno: this.state.realname,
            defaultWarehouseId: this.state.receivingWarehouse,
            inboundDate: this.state.dateTime,


            receivingWarehouse: this.state.receivingWarehouse,
            cultivationBatch: this.state.cultivationBatch,
            plantingBase: this.state.plantingBase,
            purchaseInboundSheetItems: newArr,
        }
        if(this.state.flag == 1) {
            Axios.post("/self/erp/purchaseInbound/addPurchaseInboundSheet", params).then((res)=>{
                if(res.data.success) {
                    message.success("新增成功");
                    this.initData(this.state.currentPage);
                    this.setState({
                        visible: false
                    })
                }else{
                    message.warning(res.data.message);
                }
            })
        }else if(this.state.flag == 2) {
            params.id = this.state.id;
            Axios.post("/self/erp/purchaseInbound/updatePurchaseInboundSheet", params).then((res)=>{
                if(res.data.success) {
                    message.success("修改成功");
                    this.initData(this.state.currentPage);
                    this.setState({
                        visible: false
                    })
                }else{
                    message.warning(res.data.message);
                }
            })
        }
    }
    changePages(val) {
        this.setState({
            currentPage: val
        })
        this.initData(val)
    }
    download() {

    }
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
}
export default PurchasingStorage