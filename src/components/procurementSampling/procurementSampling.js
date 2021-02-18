import React, {Component} from 'react';
import {Input, Table, Space, Pagination, Modal, Select, Button, InputNumber, message, DatePicker, Tree, Checkbox,Tag} from 'antd';
import Axios from 'axios';
import 'moment/locale/zh-cn';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
// import locale from 'antd/es/locale/zh_CN';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './procurementSampling.scss';
import store from "../../store/store";
import action from "../../store/action";
const {Column} = Table;
const {Option} = Select;
const {confirm} = Modal;
const {TextArea} = Input;
class ProcurementSampling extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            currentPage: 1, pageSize: 10, pageTotal: 0,
            msg: '', flag: 1, visible: false,

            code: '', name: '',  person: '',   carNum: '',  pinl: '',   breedList: [],   breedId: '',  standerdList: [], standerd: '',  place: '', soldier: '',
            conclusion: '',   personIdList: [], personId: '',    info: '',
            singleAmount: '', vag: '',  gitTotalNum: '',  totalNum: '',   totalLv: '',   noPass: '',

            modalSource: [],

            totalBruiseNum :'', totalBruiseRate:'',  totalBumpNum :'',  totalBumpRate:'',
            totalSugarBackNum :'',  totalSugarBackRate:'',   totalDiseaseFruitNum:'',    totalDiseaseFruitRate:'',
            totalWormFruitNum:'',   totalWormFruitRate:'',   totalColorDifferenceNum:'',   totalColorDifferenceRate:'',
            totalStandardMixNum  :'', totalStandardMixRate:'',   totalSunburnNum:'',   totalSunburnRate:'',
            totalHailInjuryNum  :'',  totalHailInjuryRate:'',   totalFruitRustNum:'',   totalFruitRustRate:'',
            totalBranchInjuryNum :'',  totalBranchInjuryRate:'',   totalDeformityNum:'',   totalDeformityRate:'',
            totalDrugHarmNum :'',  totalDrugHarmRate:'',   totalDehydrationNum:'',   totalDehydrationRate:'',
            totalWaterCrackNum :'',  totalWaterCrackRate:'',   totalCrackedFruitNum:'',    totalCrackedFruitRate:'',
            totalRotNum :'',  totalRotRate:'',

            modalData1: [],
            object: {},
            varietyIdList: [],
            standardIdList: [],
            levelIdList: [],
            msg1: '',
            visible1: false,
            flag1: 1,   dates: null,
            supplierIdList: [], supplierId: '',
            batchNumbers: '',registrationCodes: '',
            supplierName1: '',  searchTimes: '',
            numbers: '',
            ////////
            samplingName: null,   samplingCode: null,  datesTime: null,   commissionList: [],    commission: null,
            carNumber: null,      originalSingleType: null,

            registrationCode1: '',  batchNumber1: '',
            modalData: [
                {boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0, id: 'dfsdfs543534534gdfgdfg54353'},{
                    flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                    unitNetWeight: '',    number: 0,      unitPrice: '',       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                    id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
                }
            ],
            materialCodeList: [],   materialNameList: [],
            treeData: [],    selectDataSource: [],   modalBottomList: [],
            loading: false,
            checkId: ''
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
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                align: 'center',
                width: 300
            },
            {
                title: '抽检单名称',
                dataIndex: 'sheetName',
                key: 'sheetName',
                align: 'center',
                width: 100
            },
            {
                title: '车号',
                dataIndex: 'carNo',
                key: 'carNo',
                align: 'center',
                width: 100
            },
            {
                title: '代办',
                dataIndex: 'supplierName',
                key: 'supplierName',
                align: 'center',
                width: 100
            },
            {
                title: '评级状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: 100,
                render: (text) => (
                    <span>{text==1?"未生成外购入库单":"已生成外购入库单"}</span>
                )
            },
            {
                title: '制单人',
                dataIndex: 'createdName',
                key: 'createdName',
                align: 'center',
                width: 100
            },
            {
                title: '修改时间',
                dataIndex: 'modifiedTime',
                key: 'modifiedTime',
                width: 160,
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'address',
                key: 'address',
                align: 'center',
                width: 200,
                fixed: "right",
                render: (text, record)=>(
                    <Space size="large">
                        <span onClick={this.changes.bind(this, record)} className="details">编辑</span>
                        <span onClick={this.deletes.bind(this, record)} className="deletes">删除</span>
                        <span onClick={this.details.bind(this, record)} className="changes">查看</span>
                    </Space>
                )
            }
        ];
        return(
            <div id="procurementSampling">
                <div className="procurementSampling">
                    <div className="placeSearch">
                        <span className="span1">名称</span>
                        <Input className="input1" allowClear onChange={(e)=>{this.setState({supplierName1: e.target.value})}}/>
                        <span className="span1 span111">代办</span>
                        <Select allowClear className={"input1"} value={this.state.supplierId} onChange={(e)=>{
                            this.setState({supplierId:e});
                        }}>
                            {
                                this.state.supplierIdList.map((item)=>{
                                    return(
                                        <Option value={item.id}>{item.supplierName}</Option>
                                    )
                                })
                            }
                        </Select>
                        <span className="span1 span111">制单</span>
                        <Select allowClear className={"input1"} value={this.state.supplierId} onChange={(e)=>{
                            this.setState({supplierId:e});
                        }}>
                            {
                                this.state.supplierIdList.map((item)=>{
                                    return(
                                        <Option value={item.id}>{item.supplierName}</Option>
                                    )
                                })
                            }
                        </Select>
                        <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                    </div>
                    <div className="bg">
                        <button className="searchs" onClick={this.download.bind(this)}>导出</button>
                        <button className="searchs" onClick={this.add.bind(this)}>新增</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: "暂无数据"}} columns={columns}></Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={()=>`共 ${this.state.pageTotal} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotal} showSizeChanger={false}/>
                    </div>

                    {/*新增*/}
                    <Modal title={this.state.msg} width="90%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                        <div className="modal11">
                            <div className="div3">
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">抽检单名称</span>
                                        <Input disabled value={this.state.samplingName} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">单据编码</span>
                                        <Input disabled value={this.state.samplingCode} className={"input3"}/>
                                    </li>
                                </ul>
                                <ul className="ul1 ul2">
                                    <li className="li1">
                                        <span className="span1">送货日期</span>
                                        <DatePicker disabled={this.state.flag==3?true:false} onChange={(e, time)=>{
                                            this.setState({
                                                datesTime: time
                                            })
                                        }} className="input3" placeholder=""
                                                    value={this.state.datesTime==''||this.state.datesTime==null?"": moment(this.state.datesTime, 'YYYY-MM-DD')}
                                                    locale={locale}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">代办</span>
                                        <Select allowClear className={"input3"} value={this.state.commission} onChange={(e)=>{
                                            let registrationCode1 = '', batchNumber1 = '';
                                            if(!(e == undefined || e == '' || e == '')) {
                                                if(e.indexOf(",")!=-1) {
                                                    registrationCode1 = e.split(",")[1];
                                                    batchNumber1 = e.split(",")[2];
                                                }
                                            }
                                            this.setState({
                                                commission: e,
                                                registrationCode1,
                                                batchNumber1
                                            });
                                        }} disabled={this.state.flag==3?true:false}>
                                            {
                                                this.state.commissionList.map((item)=>{
                                                    return(
                                                        <Option value={item.id+","+item.registrationCode+","+item.batchNumber} key={item.id}>{item.supplierName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <ul className="ul1 ul2">
                                    <li className="li1">
                                        <span className="span1">车号</span>
                                        <Input allowClear value={this.state.carNumber} className="input3" onChange={(e)=>{
                                            this.setState({
                                                carNumber: e.target.value
                                            })
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1 ul2">
                                    <li className="li1">
                                        <span className="span1">果园号</span>
                                        <Input disabled value={this.state.registrationCode1} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">批次号</span>
                                        <Input disabled value={this.state.batchNumber1} className={"input3"}/>
                                    </li>
                                </ul>
                            </div>
                            <div className="placeChangeTable">
                                <Table pagination={false} dataSource={this.state.modalData}
                                       locale={{emptyText: '暂无数据'}} scroll={{x: 2000}}>
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
                                                        <Select className={"input3"} style={{width: '100%'}}
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
                                                                            + "," + item.productStandard + "," + item.measurement+","+item.materialCode}
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
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    )}/>
                                    <Column width={200} title="周转物类型" dataIndex="turnoverType" key="turnoverType"
                                            align="center" render={(text, record) => (
                                        <>
                                            <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                <Select style={{width: '100%', textAlign: "left"}} value={text}
                                                        disabled={this.state.flag==3?true:false}
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
                                                } showSearch>
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
                                    <Column title="箱数" dataIndex="boxNum" key="boxNum" align="center"
                                            render={(text, record) => (
                                                <>
                                                    <InputNumber value={text} onChange={(e) => {
                                                        this.commonZone(e,record, "boxNum");
                                                    }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}/>
                                                </>
                                            )}/>
                                    <Column title="桶数" dataIndex="bucketNum" key="bucketNum" align="center"
                                            render={(text, record) => (
                                                <>
                                                    <InputNumber value={text} onChange={(e) => {
                                                        this.commonZone(e,record, "bucketNum");
                                                    }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}/>
                                                </>
                                            )}/>
                                    <Column title="单位" dataIndex="measurement" key="measurement" align="center" render={(text, record)=>(
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    )}/>
                                    <Column title="单位净重" dataIndex="unitNetWeight" key="unitNetWeight"
                                            align="center" render={(text, record) => (
                                        <>
                                            <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                <InputNumber value={text} onChange={(e) => {
                                                    this.state.modalData.forEach((item) => {
                                                        if (item.id == record.id) {
                                                            item.unitNetWeight = e;
                                                            this.setState({modalData: this.state.modalData})
                                                        }
                                                    })
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </div>
                                        </>
                                    )}/>
                                    <Column title="数量" dataIndex="number" key="number" align="center" width={160}
                                            render={(text, record) => (
                                                <>
                                                    <InputNumber value={text} onChange={(e) => {
                                                        if(e) {
                                                            this.commonZone(e,record, "number");
                                                        }
                                                    }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}/>
                                                </>
                                            )}/>
                                    <Column title="单价" dataIndex="unitPrice" key="unitPrice" align="center"
                                            render={(text, record) => (
                                                <>
                                                    <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                        <InputNumber value={text} onChange={(e) => {
                                                            this.state.modalData.forEach((item) => {
                                                                if (item.id == record.id) {
                                                                    if(e) {
                                                                        item.totalPrice = Number(item.number) * Number(e);
                                                                        item.taxUnitPrice = item.unitPrice = e;

                                                                    }
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
                                                    }} disabled={record.flag=="notShow"||this.state.flag==3?true:false}/>
                                                </>
                                            )}/>
                                    <Column title="含税单价" dataIndex="taxUnitPrice" key="taxUnitPrice" align="center"
                                            render={(text, record) => (
                                                <>
                                                    <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                        <InputNumber value={text} disabled onChange={(e) => {
                                                            this.state.modalData.forEach((item) => {
                                                                if (item.id == record.id) {
                                                                    item.taxUnitPrice = e;
                                                                    this.setState({modalData: this.state.modalData})
                                                                }
                                                            })
                                                        }}/>
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
                                                        }} disabled={this.state.flag==3?true:false}/>
                                                    </div>
                                                </>
                                            )}/>
                                    <Column title="规格型号" dataIndex="standard" key="standard" align="center" render={(text, record)=>(
                                        <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                    )}/>
                                </Table>
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

                    <Modal title="选择物料" width="100%" footer={null} getContainer={false} closable={false}
                           visible={this.state.visible1} centered={true}>
                        <div className="modal11 modal1">
                            <div className="modalTop">
                                <div className="modalTop_left">
                                    <Tree
                                        showLine={true}
                                        onSelect={this.onSelect.bind(this)}
                                        treeData={this.state.treeData}
                                        defaultSelectedKeys={this.state.defaultSelectedKeys}
                                    />
                                </div>
                                <div className="modalTop_right">
                                    <Table pagination={false} dataSource={this.state.selectDataSource} locale={{emptyText:'暂无数据'}} loading={this.state.loading}>
                                        <Column title="" dataIndex="checked" key="checked" align="center" render={(text, record)=>(
                                            <Checkbox onChange={this.bindChangeChecked.bind(this,record)} checked={text?true:false}></Checkbox>
                                        )}/>
                                        <Column title="物料编码" dataIndex="materialCode" key="materialCode" align="center"/>
                                        <Column title="物料名称" dataIndex="materialName" key="materialName" align="center"/>
                                        <Column title="规格" dataIndex="code" key="code" align="center"/>
                                    </Table>
                                </div>
                            </div>
                            <div className="modalBottom">
                                <ul className="">
                                    {this.state.modalBottomList.map((item)=>{
                                        return(
                                            this.handleClose(item)
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="div4">
                            <li className="li4">
                                <Button className="btn4" type="danger" onClick={() => {
                                    this.setState({visible1: false})
                                }}>取消</Button>
                            </li>
                            <li className="li4">
                                <Button className="btn4" type="primary" onClick={this.handleOk1.bind(this)}>确定</Button>
                            </li>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
    initData(currentPage){
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            supplierName: this.state.supplierName1,
            createdTime: this.state.searchTimes
        };
        Axios.post('/self/erp/randomCheck/queryAllRandomCheckSheet', params).then((res)=>{
            if(res.data.success) {
                this.setState({
                    dataSource: res.data.data.randomCheckSheets,
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

    /**
     * 加号
     */
    addModalData() {
        let str = new Date().getTime();
        this.state.modalData.splice(this.state.modalData.length-1, 0, {id: str, boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0, unitPrice: 0});
        this.setState({
            modalData: [...this.state.modalData]
        })
    }

    /**
     * 减号
     */
    subtraction(row) {
        if(this.state.modalData.length > 2) {
            this.state.modalData.forEach((outItem, index)=>{
                if(outItem.id == row.id) {
                    this.state.modalData.splice(index, 1);
                }
            });
            let boxNum = 0, bucketNum=0, number = 0, totalPrice = 0;
            for(let i=0;i<this.state.modalData.length-1;i++) {
                boxNum += Number(this.state.modalData[i].boxNum);
                bucketNum += Number(this.state.modalData[i].bucketNum);
                number += Number(this.state.modalData[i].number);
                totalPrice += Number(this.state.modalData[i].totalPrice);
            }
            this.state.modalData[this.state.modalData.length-1]["boxNum"] = boxNum.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["bucketNum"] = bucketNum.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["number"] = number.toFixed(2);
            this.state.modalData[this.state.modalData.length-1]["totalPrice"] = totalPrice.toFixed(2);
            this.setState({
                modalData: [...this.state.modalData]
            })
        }
    }

    handleClose(item) {
        if(item.checked) {
            return(
                <li style={{display: 'inline-block',marginLeft: '20px'}}>
                    <Tag color="#f50" closable onClose={this.close.bind(this, item)}>{item.materialName}</Tag>
                </li>
            )
        }
    }

    /**
     * 删除tab
     */
    close = (e) => {
        this.state.selectDataSource.forEach((item)=>{
            if(item.id == e.id) {
                item.checked = false;
            }
        })
        this.state.modalBottomList.forEach((item)=>{
            if(item.id == e.id) {
                item.checked = false;
            }
        })
        this.setState({
            selectDataSource: [...this.state.selectDataSource],
            modalBottomList: [...this.state.modalBottomList]
        })
        store.dispatch(action.setSelectModal(this.state.selectDataSource));
    }

    /**
     * 物料点击出现的当前数据
     * @param selectedKeys
     * @param e
     */
    onSelect(selectedKeys, e) {
        if(!e.selected) {
            message.warning("请再点击一次,刷新当前的物料组....");
            return false;
        }
        this.setState({
            loading: true
        })
        Axios.post("/self/erp/baseinfo/queryMaterialInfoByParentId", {id: e.selectedNodes[0].id, currentPage: 1, pageSize: 200000}).then((res)=>{
            if(res.data.success) {
                res.data.data.materialInfos.forEach((item)=>{
                    item.key = item.id;
                })
                if(store.getState().modalshion && store.getState().modalshion.length) {
                    store.getState().modalshion.forEach((outItem) => {
                        res.data.data.materialInfos.forEach((innerItem) => {
                            if (outItem.id == innerItem.id) {
                                innerItem.checked = outItem.checked;
                            }
                        })
                    })
                }
                this.setState({
                    selectDataSource: [...res.data.data.materialInfos],
                    loading: false
                })
            }else{
                this.setState({
                    loading: false,
                    selectDataSource: []
                })
            }
        })
    }

    /**
     * 选择表格里面的复选框   selectDataSource   modalBottomList
     */
    bindChangeChecked(row, e) {
        this.state.selectDataSource.forEach((item)=>{
            if(item.id == row.id) {
                if(e.target.checked) {
                    item.checked = true;
                }else{
                    item.checked = false;
                }
            }
        })
        let modalBottomList = [];
        this.state.selectDataSource.forEach((item)=>{
            modalBottomList.push({
                checked: item.checked,
                createdTime: item.createdTime,
                createdUser: item.createdUser,
                fullName: item.fullName,
                id: item.id,
                inventoryAccountCode: item.inventoryAccountCode,
                inventoryAccountCodeId: item.inventoryAccountCodeId,
                isDel: item.isDel,
                isValid: item.isValid,
                key: item.key,
                localIndex: item.localIndex,
                materialCode: item.materialCode,
                materialName: item.materialName,
                modifiedTime: item.modifiedTime,
                modifiedUser: item.modifiedUser,
                parentId: item.parentId,
                salesCostsAccountCode: item.salesCostsAccountCode,
                salesCostsAccountCodeId: item.salesCostsAccountCodeId,
                salesInputAccountCode: item.salesInputAccountCode,
                salesInputAccountCodeId: item.salesInputAccountCodeId,
                stock: item.stock,
                taxRate: item.taxRate,
                type: item.type
            })
        })
        this.setState({
            selectDataSource: [...this.state.selectDataSource],
            modalBottomList: [...modalBottomList]
        })
        if(store.getState().modalshion == null || store.getState().modalshion == '') {
            store.dispatch(action.setSelectModal(this.state.selectDataSource));
        }else{
            this.state.selectDataSource.forEach((item)=>{
                store.getState().modalshion.push(item);
            })
            // 去重
            let arr = [], obj = {};
            for(let i=store.getState().modalshion.length-1;i>0;i--) {
                if( !obj[store.getState().modalshion[i].id] ) {
                    arr.push(store.getState().modalshion[i]);
                    obj[store.getState().modalshion[i].id] = true;
                }
            }
            this.setState({
                modalBottomList: arr
            })
        }

    }

    /**
     * 查询物料编码
     */
    materialCodeMethod() {
        Axios.post('/self/erp/baseinfo/queryMaterialInfoItems', {}).then((res)=>{
            // materialName
            if(res.data.success) {
                this.setState({
                    materialCodeList: res.data.data.materialInfos,
                    materialNameList: res.data.data.materialInfos
                })
            }else{
                this.setState({
                    materialCodeList: [],  materialNameList: []
                })
            }
        })
    }

    /**
     * 选择按钮
     */
    selectClick() {
        this.selectMaterielTree();
        this.setState({
            visible1: true,
            modalBottomList: [],
            selectDataSource: []
        })
        this.state.selectDataSource.forEach((item)=>{
            item.checked = false;
        })
    }

    /**
     * 查询选择物料的tree数据
     * @param e
     */
    selectMaterielTree() {
        Axios.post("/self/erp/baseinfo/queryMaterialGroup", {}).then((res)=>{
            if(res.data.success) {
                this.agains(res.data.data.materialGroups);
            }else{
                this.setState({
                    treeData: []
                })
            }
        })
    }
    agains(array) {
        array.forEach((item)=>{
            item.title = item.materialName;
            item.key = item.id;
            if(item.children != undefined) {
                this.agains(item.children);
            }
        })
        this.setState({
            treeData: array
        })
        setTimeout(()=>{
            this.setState({
                defaultSelectedKeys: ["9c2520d4d4974fd7b83aae1c77348adb"]
            })
        }, 30)
    }
    /**
     * 查询供应商,
     */
    querySupplier() {
        Axios.post("/self/erp/randomCheck/querySupplier", {}).then((res)=>{
            if(res.data.success) {
                //console.log(res.data.data.suppliers);   // supplierName   id
                this.setState({
                    commissionList: res.data.data.suppliers
                })
            }else{
                this.setState({
                    commissionList: []
                })
            }
        })
    }

    /**
     * 单据编码 samplingCode
     */
    createCode() {
        Axios.post("/self/erp/randomCheck/generateRandomCheckCode").then((res)=>{
            // console.log(res)
            if(res.data.success) {
                if(this.state.flag  =1) {
                    this.setState({
                        samplingCode: res.data.data
                    })
                }
            }else{
                this.setState({
                    samplingCode: ""
                })
            }
        })
    }

    /**
     * 统计的公共方法
     */
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

    searchMethods() {
        this.initData(1);
        this.setState({
            currentPage: 1
        })
    }
    add() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let day = now.getDate();
        let datesTime = year+"-"+month+"-"+day;
        this.setState({
            visible: true,
            msg: '新增',
            flag: 1,
            supplierId: '',
            carNo: '',
            registrationCodes: '',
            batchNumbers: '',
            dates: '',
            numbers: '',
            modalData1: [],
            modalData: [{materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                unitNetWeight: '',    number: 0,      unitPrice: 0,       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                id: 'sdkjfhk424hrkefh83249823hfejdf328'},{
                flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                unitNetWeight: '',    number: 0,      unitPrice: 0,       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
            }],
            datesTime,
            commission: '',
            carNumber: '',
            originalSingleType: '',    registrationCode1: '',     batchNumber1: ''
        })
        this.querySupplier();
        this.materialCodeMethod();
        this.createCode();
    }

    /**
     * 导出
     */
    download() {

    }



    //////////////////////////////////////////////////////////////////////////
    /**
     * 列表根据id查详情的数据
     *
     */
    detailData(id) {
        Axios.post('/self/erp/randomCheck/queryRandomCheckSheetById', {id}).then((res)=>{
            if(res.data.success) {
                let object = res.data.data.randomCheckSheet;
                if(object.samplingItems && object.samplingItems.length) {
                    object.samplingItems.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                if(object.samplingItems && object.samplingItems.length) {
                    object.samplingItems.forEach((item)=>{
                        item.unitPrice = item.unitPrice / 100;
                    })
                }
                this.setState({
                    object,
                    modalData1: object.samplingItems,
                    supplierId: object.supplierId,
                    carNo: object.carNo,
                    registrationCodes: object.registrationCode,
                    batchNumbers: object.batchNumber,
                    dates: object.createdTime,
                    numbers: object.number
                });
            }else{
                this.setState({
                    object: {}
                })
            }
        })
    }
    changePages(val) {
        this.initData(val);
        this.setState({
            currentPage: val
        })
    }


    /**
     * 新增
     * @param row
     */
    adds(row) {
        this.setState({
            visible1: true,
            flag1: 1,
            msg1: '抽检项'
        });
        this.detailData(row.id);
    }

    /**
     * 删除抽检项
     */
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
                Axios.post('/self/erp/randomCheck/deleteRandomCheckSheet', params).then((res)=>{
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
    /**
     * 增加抽检项
     */
    addLiao() {
        let pump = [...this.state.modalData1];
        let uuid = this.getUUID();
        let varietyId = null;
        let standardId = null;
        let levelId = null;
        // if(this.state.varietyIdList && this.state.varietyIdList.length) {
        //     varietyId = this.state.varietyIdList[0].valueId;
        // }
        // if(this.state.standardIdList && this.state.standardIdList.length) {
        //     standardId = this.state.standardIdList[0].valueId;
        // }
        // if(this.state.levelIdList && this.state.levelIdList.length) {
        //     levelId = this.state.levelIdList[0].valueId;
        // }
        pump.push({
            key: uuid,
            varietyId,
            standardId,
            levelId,
            number: null,
            netWeight: null,
            unitPrice: null,
            conclusion: '合格'
        });
        this.setState({
            modalData1: pump
        });
        console.log(pump);
    }

    /**
     * 删除抽检项
     */
    deletesModal(index) {
        const dataList = [...this.state.modalData1];
        dataList.splice(index, 1);
        this.setState({
            modalData1: dataList
        });
    }
    /**
     * 详情
     * @param row
     */
    details(row) {
        this.setState({
            flag: 3,
            visible: true,
            msg: '详情',
            checkId: row.id
        })
        this.queryDetailsId(row);
        this.querySupplier();
        this.materialCodeMethod();
    }

    /**
     * 修改功能,(待做)
     * @param row
     */
    changes(row) {
        this.setState({
            flag: 2,
            visible: true,
            msg: '修改',
            checkId: row.id
        })
        this.queryDetailsId(row);
        this.querySupplier();
        this.materialCodeMethod();
    }
    queryDetailsId(row) {
        Axios.post("/self/erp/randomCheck/queryRandomCheckSheetById", {id: row.id}).then((res)=>{
            if(res.data.success) {
                let obj = res.data.data.randomCheckSheet;

                let arr2 = [];
                obj.samplingItems.forEach((item)=>{
                    arr2.push({
                        boxNum: item.boxNum,
                        baseInfoType: item.baseInfoType,
                        bucketNum: item.bucketNum,
                        materialName: item.materialName,
                        turnoverType: item.turnoverType,
                        measurement: item.measurement,
                        unitNetWeight: item.unitNetWeight,
                        number: item.number,
                        unitPrice: Number(item.unitPrice) / 100,
                        totalPrice: Number(item.totalPrice) / 100,
                        note: item.note,
                        taxUnitPrice: Number(item.taxUnitPrice) / 100,
                        standard: item.baseInfoType=='material'?item.materialStandard:item.baseInfoType=='accessories'?item.accessoriesStandard:item.productStandard,
                        materialCode: item.materialName + "," + item.baseInfoType + "," + item.materialStandard + "," + item.accessoriesStandard
                            + "," + item.productStandard + "," + item.measurement+","+item.materialCode,
                        id: item.id,
                        key: item.id
                    })
                })
                let boxNum = 0, bucketNum = 0, number = 0, totalPrice = 0;
                arr2.forEach((item)=>{
                    boxNum += Number(item.boxNum);
                    bucketNum += Number(item.bucketNum);
                    number += Number(item.number);
                    totalPrice += Number(item.totalPrice);
                })
                arr2.push({
                    flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum,    bucketNum,    measurement: '',
                    unitNetWeight: '',    number,      unitPrice: '',       totalPrice,      note: ''   ,   taxUnitPrice: '', standard: '',
                    id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
                })
                this.setState({
                    samplingName: obj.sheetName,
                    datesTime: obj.deliveryDate,
                    commission: obj.supplierId+","+obj.registrationCode+","+obj.batchNumber,
                    registrationCode1: obj.registrationCode,
                    batchNumber1: obj.batchNumber,
                    carNumber: obj.carNo,
                    originalSingleType: obj.carNo,
                    modalData: arr2,
                    samplingCode: obj.code
                })
            }else{
                message.warning(res.data.message);
                this.setState({
                    samplingName: ""
                })
            }
        })
    }
    handleOk() {
        let newParams = [];
        for(let i=0;i<this.state.modalData.length-1;i++) {
            newParams.push({
                baseInfoType: this.state.modalData[i].baseInfoType,
                boxNum: this.state.modalData[i].boxNum,
                bucketNum: this.state.modalData[i].bucketNum,
                materialCode: this.state.modalData[i].materialCode.indexOf(",")!=-1?this.state.modalData[i].materialCode.split(",")[6]:"",
                //id: this.state.modalData[i].id,
                materialName: this.state.modalData[i].materialName,
                measurement: this.state.modalData[i].measurement,
                note: this.state.modalData[i].note,
                number: this.state.modalData[i].number,
                standard: this.state.modalData[i].standard,
                totalPrice: Number(this.state.modalData[i].totalPrice) * 100,
                turnoverType: this.state.modalData[i].turnoverType,
                unitNetWeight: this.state.modalData[i].unitNetWeight,
                unitPrice: Number(this.state.modalData[i].unitPrice) * 100,
                taxUnitPrice: Number(this.state.modalData[i].taxUnitPrice) * 100,
            })
        }
        let params = {
            supplierId: this.state.commission == undefined || this.state.commission == null || this.state.commission == ''?"":this.state.commission.split(",")[0],
            carNo: this.state.carNumber,
            registrationCode: this.state.registrationCode1,
            batchNumber: this.state.batchNumber1,
            code: this.state.samplingCode,
            deliveryDate: this.state.datesTime,
            samplingItems: newParams
        }
        if(this.state.flag ==1) {
            // 新增
            Axios.post('/self/erp/randomCheck/addRandomCheckSheet', params).then((res)=>{
                if(res.data.success) {
                    message.success("成功");
                    this.setState({
                        visible: false
                    });
                    this.initData(this.state.currentPage);
                }else{
                    message.warning(res.data.message);
                }
            })
        }else if(this.state.flag ==2) {
            params.id = this.state.checkId
            Axios.post("/self/erp/randomCheck/updateRandomCheckSheet", params).then((res)=>{
                if(res.data.success) {
                    message.success("成功");
                    this.setState({
                        visible: false
                    });
                    this.initData(this.state.currentPage);
                }else{
                    message.warning(res.data.message);
                }
            })
        }
    }
    handleOk1() {
        let newA = [];
        if(this.state.modalBottomList && this.state.modalBottomList.length) {
            this.state.modalBottomList.forEach((item)=>{
                if(item.checked) {
                    newA.push({
                        checked: item.checked,
                        createdTime: item.createdTime,
                        createdUser: item.createdUser,
                        fullName: item.fullName,
                        id: item.id,
                        inventoryAccountCode: item.inventoryAccountCode,
                        inventoryAccountCodeId: item.inventoryAccountCodeId,
                        isDel: item.isDel,
                        isValid: item.isValid,
                        key: item.key,
                        localIndex: item.localIndex,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        modifiedTime: item.modifiedTime,
                        modifiedUser: item.modifiedUser,
                        parentId: item.parentId,
                        salesCostsAccountCode: item.salesCostsAccountCode,
                        salesCostsAccountCodeId: item.salesCostsAccountCodeId,
                        salesInputAccountCode: item.salesInputAccountCode,
                        salesInputAccountCodeId: item.salesInputAccountCodeId,
                        stock: item.stock,
                        taxRate: item.taxRate,
                        type: item.type,
                        boxNum : 0, bucketNum : 0, number : 0, totalPrice : 0
                    })
                }
            })
        }
        this.state.modalData.splice(this.state.modalData.length-1, 1);
        let newA2 = this.state.modalData.concat(newA);
        let boxNum = 0, bucketNum = 0, number = 0, totalPrice = 0;
        newA2.forEach((item)=>{
            boxNum += Number(item.boxNum);
            bucketNum += Number(item.bucketNum);
            number += Number(item.number);
            totalPrice += Number(item.totalPrice);
        })
        newA2.push({
            flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum,    bucketNum,    measurement: '',
            unitNetWeight: '',    number,      unitPrice: '',       totalPrice,      note: ''   ,   taxUnitPrice: '', standard: '',
            id: new Date().getTime(), key: new Date().getTime()
        })
        this.setState({
            modalData: newA2,
            visible1: false
        })
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
        this.initSelect();
        this.supplierFun();
    }
    /**
     * 品种,规格,抽检人的下拉框
     *
     */
    initSelect() {
        Axios.post('/self/erp/baseinfo/queryDictTypeAndValue').then((res)=>{
            // console.log(res.data.data);
            if(res.data.success) {
                this.setState({
                    varietyIdList: res.data.data.rawMaterialVariety,
                    standardIdList: res.data.data.rawMaterialStandard,
                    levelIdList: res.data.data.rawMaterialLevel
                })
            }else{
                this.setState({
                    varietyIdList: [],
                    standardIdList: [],
                    levelIdList: [],
                })
            }
        });
        Axios.post('/self/erp/baseinfo/queryUser').then((res)=>{
            if(res.data.success) {
                this.setState({
                    personIdList: res.data.data.users
                })
            }else{
                this.setState({
                    personIdList: []
                })
            }
        })
    }

    /**
     * 查询供应商的下拉框
     * @returns {string}
     */
    supplierFun() {
        let params = {
            supplierName: ''
        };
        Axios.post('/self/erp/randomCheck/querySupplier', params).then((res)=>{
            if(res.data.success) {
                this.setState({
                    supplierIdList: res.data.data.suppliers
                })
            }else{
                this.setState({
                    supplierIdList: []
                })
            }
        })
    }

    /**
     * 根据代办的id查询注册号和批次号
     * @returns {string}
     */
    queryRegistrationCodeAndBatchNumberBySupplierId(id) {
        Axios.post('/self/erp/randomCheck/queryRegistrationCodeAndBatchNumberBySupplierId', {id}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    registrationCodes: res.data.data.supplier.registrationCode,
                    batchNumbers: res.data.data.supplier.batchNumber
                })
            }else{
                this.setState({
                    registrationCodes: '',
                    batchNumbers: ''
                })
            }
        })
    }
    getUUID() {
        return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
export default ProcurementSampling;