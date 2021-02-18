import React, {Component} from 'react';
import {Input, Select, Table, Space, Pagination, Modal, InputNumber, Button, DatePicker, Cascader, message, Switch, TreeSelect} from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './salesOrder.scss';
const {Option} = Select;
const {Column} = Table;
const {TextArea} = Input;
const { confirm } = Modal;
const {Search} = Input;
class SalesOrder extends Component{
    constructor(props){
        super(props);
        this.addBtn = "";  this.changeBtn = ""; this.deleteBtn = ""; this.checkBtn = ""; this.downloadBtn = "";
        this.measurement = "";
        this.state = {
            orderCode: '',   oderStatus: '',
            oderStatusList: [{label: '保存草稿', value: '0'},{label: '待审核', value: '1'},{label: '审核不通过', value: '2'},{label: '待分配', value: '3'}, {label: '待生产', value: '4'},
                {label: '生产中', value: '5'}, {label: '生产完成', value: '6'}, {label: '待交付', value: '7'}, {label: '完成', value: '8'}],
            dataSource: [],
            currentPage: 1,
            pageSize: 10,
            pageTotle: 0,
            msg: '',
            flag: 1,
            visible: false,

            orderCodes: '',   // 订单编码
            userIdList: [],   userId: '',   // 客户
            orderSddress: '',   // 交付地点
            orderPhone: null,   // 联系方式
            sendObjId: [],  sendObject: [],   // 抄送对象
            requirement: '',   // 客户要求

            productList: [],
            modalData: [],
            id: '',
            isPass: false,
            pass: true,
            checkId: '',
            version: '',
            status1: 1,
            materialTypesList: [],


            ///////////////////////////////////////////// 模态框里面的数据  ////////////////////////////////////////////////////////
            code: '',
            dateTime: '',
            salesTypeId: '',    salesTypeIdList: [],
            clientId: '',       clientIdList: [],
            deliveryLocationId: '',deliveryLocationIdList: [],
            currencyId: '',     currencyIdList: [],
            registrationCode: '',
            batchNumber: '',
            exchangeRate: '',
            productionDepartmentId: '', productionDepartmentIdList: [],
            materialCodeList: [],
            hetong: '',
            fapiao: '',
            empno: '',   empnoList: [],
            checkedTime: '',  checked: '',
            node1: '',
            node2: '',
            node3: '',
            node4: '',
            createdName: '',
            auditName: '',
            auditTime: ''
        }
    };
    render() {
        return(
            <div id="salesOrder">
                <div className="salesOrder">
                    <div className="placeSearch">
                        <span className="span1">订单名称</span>
                        <Input className="input1" allowClear onChange={(e)=>{this.setState({orderCode: e.target.value})}}/>
                        <span className="span1 span2">制单人</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({oderStatus: e})}}>
                            {
                                this.state.oderStatusList.map((item)=>{
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>
                        <span className="span1 span2">状态</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({oderStatus: e})}}>
                            {
                                this.state.oderStatusList.map((item)=>{
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>
                        <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                    </div>
                    <div className="bg">
                        <button className="searchs" onClick={this.add.bind(this)}
                            style={this.addBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >新增</button>
                        <button className="searchs searchs1" onClick={this.donload.bind(this)}
                            style={this.downloadBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >导出</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: '暂无数据'}}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                            )}/>
                            <Column title="日期" dataIndex="modifiedTime" key="modifiedTime" align="center"/>
                            <Column title="供应商" dataIndex="clientName" key="clientName" align="center"/>
                            <Column title="订单编码" dataIndex="code" key="code" align="center"/>
                            <Column title="金额（元）" dataIndex="totalPrice" key="totalPrice" align="center" render={(text, record)=>(
                                <span>{text / Math.pow(10, record.decimalPlaces)}</span>
                            )}/>
                            <Column title="制单" dataIndex="createdName" key="createdName" align="center"/>
                            <Column title="审核" dataIndex="auditName" key="auditName" align="center"/>
                            <Column title="审核状态" dataIndex="auditStatus" key="auditStatus" align="center" render={(text)=>(
                                <span>{text==0?"未审核":"已审核"}</span>
                            )}/>
                            <Column title="出库状态" dataIndex="status" key="status" align="center" render={(text)=>(
                                <span>{text==1?"未出库":text==2?"部分出库":text==3?"全部出库":"-"}</span>
                            )}/>
                            <Column title="操作" align="center" key="records" dataIndex="records" width="240px"
                                    render={(text, record) => (
                                        <Space size="large">
                                            <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes"
                                                  style={this.changeBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                                            >编辑</span>
                                            <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes"
                                                  style={this.deleteBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                                            >删除</span>
                                            {this.changeBtn == 1&&record.auditStatus==0?(
                                                <span key={"check"} onClick={this.check.bind(this, record)} className="check"
                                                      style={this.changeBtn == 1&&record.auditStatus==0 ? {display: 'inlineBlock'} : {display: "none"}}
                                                >审核</span>
                                            ):(
                                                <span key={"check"} onClick={this.notCheck.bind(this, record)} className="check"
                                                      style={this.changeBtn == 1&&record.auditStatus==1 ? {display: 'inlineBlock'} : {display: "none"}}
                                                >反审核</span>
                                            )}
                                            <span onClick={this.details.bind(this, record)} className="details span11">详情</span>
                                        </Space>
                                    )}
                            />
                        </Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={()=>`共 ${this.state.pageTotle} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotle} showSizeChanger={false}/>
                    </div>

                    <Modal title={this.state.msg} width="80%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                        <div className="modal1">
                            <div className="div3">
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*编号</span>
                                        <Input allowClear disabled value={this.state.code} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*日期</span>
                                        <DatePicker className="input3" onChange={this.orderTime.bind(this)} value={this.state.dateTime==undefined || this.state.dateTime=='' ?"":moment(this.state.dateTime, 'YYYY-MM-DD')} locale={locale}
                                                    disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*购货单位</span>
                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            value={this.state.clientId}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.clientIdList}
                                            placeholder=""
                                            treeDefaultExpandAll
                                            className="input3"
                                            onChange={(e, note)=>{
                                                this.setState({clientId: e})
                                            }}
                                            disabled={this.state.flag==3?true:false}
                                        />
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*销售方式</span>
                                        <Select className="input3" style={{width: '100%', textAlign: "left"}} value={this.state.salesTypeId}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({salesTypeId: e})}}>
                                            {this.state.salesTypeIdList.map((item)=>{
                                                return(
                                                    <Option value={item.valueId} key={item.valueId}>{item.value}</Option>
                                                )
                                            })}
                                        </Select>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*交货地点</span>
                                        <Select className="input3" style={{width: '100%', textAlign: "left"}} value={this.state.deliveryLocationId}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({deliveryLocationId: e})}}>
                                            {this.state.deliveryLocationIdList.map((item)=>{
                                                return(
                                                    <Option value={item.valueId} key={item.valueId}>{item.value}</Option>
                                                )
                                            })}
                                        </Select>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*币别</span>
                                        <Select className="input3" style={{width: '100%', textAlign: "left"}} value={this.state.currencyId}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{
                                            this.setState({currencyId: e, exchangeRate: e!=null&&e!=''&&e!=undefined?e.split(',')[1] / Math.pow(10, e.split(",")[2]):""})
                                        }}>
                                            {this.state.currencyIdList.map((item)=>{
                                                return(
                                                    <Option value={item.id+","+item.exchangeRate+","+item.decimalPlaces} key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*汇率</span>
                                        <Input allowClear value={this.state.exchangeRate} onChange={(e)=>{this.setState({exchangeRate:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*生产部门</span>
                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            className="input3"
                                            value={this.state.productionDepartmentId}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.productionDepartmentIdList}
                                            placeholder=""
                                            treeDefaultExpandAll
                                            onChange={(e)=>{this.setState({productionDepartmentId: e})}}
                                            showSearch
                                            filterTreeNode={(input, option) =>
                                                option.title.toLowerCase().indexOf(input.toLowerCase()) >=0
                                            }
                                            disabled={this.state.flag==3?true:false}
                                        />
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*批次号</span>
                                        <Input allowClear value={this.state.batchNumber} onChange={(e)=>{this.setState({batchNumber:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*果园号</span>
                                        <Input allowClear value={this.state.registrationCode} onChange={(e)=>{this.setState({registrationCode:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*合同号</span>
                                        <Input allowClear value={this.state.hetong} onChange={(e)=>{this.setState({hetong:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*发票号</span>
                                        <Input allowClear value={this.state.fapiao} onChange={(e)=>{this.setState({fapiao:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <div className="placeChangeTable">
                                    <Table pagination={false} dataSource={this.state.modalData} locale={{emptyText: '暂无数据'}} scroll={{x: 1500}}>
                                        <Column title="" align="center" key="records" dataIndex="records" width={120} fixed='left'
                                                render={(text, record) => (
                                                    <>
                                                        <span className="span_img1 span_img" onClick={this.addModalData.bind(this)}>+</span>
                                                        <span className="span_img2 span_img" onClick={this.subtraction.bind(this, record)}>-</span>
                                                    </>
                                                )}
                                        />
                                        <Column title="产品编码" dataIndex="materialCode" key="materialCode" align="center" width={300} render={(text, record)=>(
                                            <>
                                                <Select style={{width: '100%', textAlign: "left"}} value={text}
                                                        onChange={(e)=>{
                                                            this.state.modalData.forEach((item)=>{
                                                                if(item.id == record.id) {
                                                                    item.materialCode = e;
                                                                    if(record.materialCode != undefined && record.materialCode.indexOf(",")!=-1) {
                                                                        item.materialName = item.materialCode.split(",")[1];
                                                                        item.measure = item.materialCode.split(",")[2];
                                                                    }
                                                                    Axios.post("/self/erp/baseinfo/queryMaterialStockNumber", {materialCode: e.split(",")[3]}).then((res)=>{
                                                                        if(res.data.success) {
                                                                            item.stock = res.data.data;
                                                                        }else{
                                                                            item.stock = 0;
                                                                        }
                                                                        this.setState({
                                                                            modalData: this.state.modalData
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }} filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } showSearch disabled={this.state.flag==3?true:false}>
                                                    {this.state.materialCodeList.map((item)=>{
                                                        return(
                                                            <Option value={","+item.materialName+","+item.measurement+","+item.materialCode+","+item.baseInfoType} key={item.id}>{item.materialCode+"  "+item.materialName}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </>
                                        )}/>
                                        <Column title="产品名称" dataIndex="materialName" key="materialName" align="center" width={100}/>
                                        <Column width={200} title="包装版面" dataIndex="packagingLayout" key="packagingLayout" align="center" render={(text, record)=>(
                                            <>
                                                <Select style={{width: '100%', textAlign: "left"}} value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.packagingLayout = e;
                                                        }
                                                    })
                                                    this.setState({
                                                        modalData: this.state.modalData
                                                    })
                                                }} filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } showSearch disabled={this.state.flag==3?true:false}>
                                                    {this.state.materialTypesList.map((item)=>{
                                                        return(
                                                            <Option value={item.materialCode} key={item.id}>{item.materialName}</Option>
                                                        )
                                                    })}
                                                </Select>
                                            </>
                                        )}/>
                                        <Column title="单位" dataIndex="measure" key="measure" align="center" width={100}/>
                                        <Column title="桶数" dataIndex="bucketNum" key="bucketNum" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <InputNumber value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.bucketNum = e;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="箱数" dataIndex="boxNum" key="boxNum" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <InputNumber value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.boxNum = e;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="数量" dataIndex="number" key="number" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <InputNumber value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.number = e;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="单价" dataIndex="unitPrice" key="unitPrice" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <InputNumber value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.taxUitPrice = item.unitPrice = e;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="备注" dataIndex="note" key="note" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <Input value={text} onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.note = e.target.value;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="库存" dataIndex="stock" key="stock" align="center" width={200}/>
                                        <Column title="交付日期" dataIndex="dateTimes" key="dateTimes" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <DatePicker className="input3" onChange={(e, time)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.dateTimes = time;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} value={text==undefined || text=='' ?"":moment(text, 'YYYY-MM-DD')} locale={locale}
                                                            disabled={this.state.flag==3?true:false}/>
                                            </>
                                        )}/>
                                        <Column title="含税单价" dataIndex="taxUitPrice" key="taxUitPrice" align="center" width={200} render={(text, record)=>(
                                            <>
                                                <InputNumber value={text} disabled onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        if(item.id == record.id) {
                                                            item.taxUitPrice = e;
                                                        }
                                                    })
                                                    this.setState({modalData: this.state.modalData})
                                                }} />
                                            </>
                                        )}/>
                                    </Table>
                                </div>
                                <ul className="ul1" style={{marginTop: '40px'}}>
                                    <li className="li1">
                                        <span className="span1">*制单</span>
                                        <Input allowClear value={this.state.createdName} onChange={(e)=>{this.setState({createdName:e.target.value})}} className={"input3"}
                                               disabled/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*审核</span>
                                        <Input allowClear value={this.state.auditName} className={"input3"}
                                               disabled/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*审核日期</span>
                                        <Input allowClear value={this.state.auditTime} className={"input3"}
                                               disabled/>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*业务员</span>
                                        <Select className="input3" style={{width: '100%', textAlign: "left"}} value={this.state.empno}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({empno: e})}}>
                                            {this.state.empnoList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })}
                                        </Select>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*备注一</span>
                                        <Input allowClear value={this.state.node1} className={"input3"}
                                               onChange={(e)=>{this.setState({node1: e.target.value})}}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*备注二</span>
                                        <Input allowClear value={this.state.node2} className={"input3"}
                                               onChange={(e)=>{this.setState({node2: e.target.value})}}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*备注三</span>
                                        <Input allowClear value={this.state.node3} className={"input3"}
                                               onChange={(e)=>{this.setState({node3: e.target.value})}}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*备注四</span>
                                        <Input allowClear value={this.state.node4} className={"input3"}
                                               onChange={(e)=>{this.setState({node4: e.target.value})}}
                                               disabled={this.state.flag==3?true:false}/>
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

                    <Modal title="审核" footer={null} getContainer={false} closable={false}  visible={this.state.isPass} centered={true}>
                        <div className="modal1 modal2">
                            <span>是否通过</span>
                            <Switch className="switch2" checkedChildren="通过" unCheckedChildren="不通过" onChange={(e)=>{this.setState({pass: e})}} defaultChecked={this.state.pass} />
                        </div>
                        <div style={{textAlign: "center", paddingTop: '20px'}}>
                            <Button type="danger" style={{marginRight: '10%'}} onClick={()=>{this.setState({isPass: false})}}>取消</Button>
                            <Button type="primary" style={{marginLeft: '10%'}} onClick={this.handlePass.bind(this)}>确定</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
    componentWillMount() {
        let buttonList = JSON.parse(sessionStorage.getItem("buttonList"));
        // console.log(buttonList);
        if(buttonList && buttonList.length) {
            buttonList.forEach((item)=>{
                if(item.localIndex == "4-1-1") {
                    this.addBtn = item.flag;
                }
                if(item.localIndex == "4-1-2") {
                    this.changeBtn = item.flag;
                }
                if(item.localIndex == "4-1-3") {
                    this.deleteBtn = item.flag;
                }
                if(item.localIndex == "4-1-4") {
                    this.checkBtn = item.flag;
                }
                if(item.localIndex == "4-1-5") {
                    this.downloadBtn = item.flag;
                }
            })
        }
    }
    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            orderCode: this.state.orderCode,
            status: this.state.oderStatus
        };
        Axios.post('/self/erp/sales/querySalesOrder', params).then((res)=>{
            if(res.data.success) {
                res.data.data.salesOrders.forEach((item)=>{
                    item.key = item.id;
                });
                this.setState({
                    dataSource: res.data.data.salesOrders,
                    pageTotle: res.data.data.num
                })
            }else{
                this.setState({
                    dataSource: [],
                    pageTotle: 0
                })
            }
        })
    }
    subtraction(row) {
        if(this.state.modalData.length > 1) {
            this.state.modalData.forEach((outItem, index)=>{
                if(outItem.id == row.id) {
                    this.state.modalData.splice(index, 1);
                }
            });
            this.setState({
                modalData: [...this.state.modalData]
            })
        }
    }
    addModalData() {
        let str = new Date().getTime();
        this.state.modalData.push({id: str,key: str, bucketNum: 0, boxNum: 0});
        this.setState({
            modalData: [...this.state.modalData]
        })
    }
    searchMethods() {
        this.setState({
            currentPage: 1
        });
        this.initData(1);
    }
    changePages(val) {
        this.setState({
            currentPage: val
        });
        this.initData(val);
    }
    add() {
        let id1 = new Date().getTime()+"id1";
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let day = now.getDate();
        let dateTime = year+"-"+month+"-"+day;
        this.setState({
            msg: '新增',
            flag: 1,
            visible: true,
            userId: '',
            orderSddress: '',
            orderPhone: null,
            sendObjId: [],
            dateTime,
            requirement: '',
            modalData: [{id: id1, key: id1, boxNum: 0, bucketNum: 0}],
            status1: 0,
            clientId: "",
            deliveryLocationId: "",
            currencyId: "",
            exchangeRate: "",
            productionDepartmentId: "",
            empno: "",
            salesTypeId: "",
            registrationCode: "",
            batchNumber: "",
            node1: "",
            node2: "",
            node3: "",
            node4: "",
            hetong: "",
            fapiao: "",
        });
        this.bianCodeMethods();
        this.createDataList();
        this.clientListData();
    }
    changes(row) {
        this.setState({
            msg: '修改',
            flag: 0,
            visible: true,
            id: row.id,
            status1: row.status
        });
        this.shows(row.id);
        this.clientListData();
    }
    shows(id) {
        Axios.post('/self/erp/sales/querySalesOrderById', {id}).then((res)=>{
            if(res.data.success) {
                let object = res.data.data.salesOrder;
                let modalData = [];
                object.salesOrderItems.forEach((item)=>{
                    modalData.push({
                        key: item.id,
                        id: item.id,
                        materialCode: ","+item.materialName+","+item.measurement+","+item.materialCode+","+item.baseInfoType,
                        materialName: item.materialName,
                        packagingLayout: item.packagingLayout,
                        measure: item.measurement,
                        bucketNum: item.bucketNum,
                        boxNum: item.boxNum,
                        number: item.number,
                        unitPrice: item.unitPrice,
                        note: item.note,
                        stock: item.stock,
                        dateTimes: item.deliveryDate,
                        taxUitPrice: item.unitPrice
                    })
                })
                this.setState({
                    code: object.code,
                    clientId: object.clientId,
                    deliveryLocationId: object.deliveryLocationId,

                    currencyId: object.currencySign,

                    exchangeRate: Number(object.exchangeRate) / Math.pow(10, Number(object.decimalPlaces)),

                    productionDepartmentId: object.deptId,
                    empno: object.empno,
                    salesTypeId: object.salesTypeId,
                    registrationCode: object.registrationCode,
                    batchNumber: object.batchNumber,
                    node1: object.note1,
                    node2: object.note2,
                    node3: object.note3,
                    node4: object.note4,
                    hetong: object.contractNumber,
                    fapiao: object.invoiceNo,
                    dateTime: object.orderDate,
                    createdName: object.createdName,
                    auditName: object.auditName,
                    auditTime: object.auditTime,
                    modalData
                })
            }
        })
    }
    details(row) {
        this.setState({
            msg: '详情',
            flag: 3,
            visible: true,
            id: row.id,
            status1: row.status
        });
        this.shows(row.id);
        this.clientListData();
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
                Axios.post('/self/erp/sales/deleteSalesOrder', params).then((res)=>{
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
                Axios.post('/self/erp/sales/auditSalesOrder', params).then((res)=>{
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
                Axios.post('/self/erp/sales/auditSalesOrder', params).then((res)=>{
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
    handlePass() {
        let params = {
            id: this.state.checkId,
            status: this.state.pass ? 3 : 2,
            version: this.state.version
        }
        Axios.post('/self/erp/sales/auditSalesOrder', params).then((res)=>{
            if(res.data.success) {
                message.success("成功");
                this.initData(this.state.currentPage);
                this.setState({
                    isPass: false
                })
            }else{
                message.success(res.data.message);
            }
        })
    }

    /**
     * 增加按钮里面获取销售量的单位
     * @param id
     */
    getNumber(id) {
        // debugger
        console.log(this.state.productList);   // id
        console.log(this.state.modalData);    // productName
        if(this.state.productList && this.state.productList.length) {
            this.state.productList.forEach((outItem)=>{
                if(this.state.modalData && this.state.modalData.length) {
                    this.state.modalData.forEach((item)=>{
                        if(outItem.id == item.productName) {
                            item.measurement = outItem.measurement;
                        }
                    })
                }
            })
        }
        console.log(this.state.modalData);
    }
    donload() {

    }
    addLiao() {
        let pump = [...this.state.modalData];
        let uuid = this.getUUID();
        pump.push({
            key: uuid,
            productName: '',
            purchaseNum: ''
        });
        this.setState({
            modalData: pump
        })
    }
    handleOk() {
        this.submit('addSalesOrder', 'updateSalesOrder');
    }
    autoDraft() {
        this.submit('saveSalesOrderDraft', 'saveSalesOrderDraft');
    }
    // 提交
    submit(addSalesOrder, updateSalesOrder) {
        if(!this.state.currencyId) {
            message.warning("请选择币别");
            return false;
        }
        let salesOrderItems = [];
        this.state.modalData.forEach((item)=>{
            let totalPrice = item.number * item.unitPrice;
            salesOrderItems.push({
                boxNum: item.boxNum,
                bucketNum: item.bucketNum,
                deliveryDate: item.dateTimes,
                materialName: item.materialName,
                measurement: item.measure,
                note: item.note,
                number: item.number,
                packagingLayout: item.packagingLayout,
                taxUitPrice: item.taxUitPrice,
                unitPrice: item.unitPrice,
                totalPrice,
                baseInfoType: item.materialCode==undefined?"": item.materialCode.indexOf(",")!=-1?item.materialCode.split(",")[4]:"",
                materialCode: item.materialCode==undefined?"": item.materialCode.indexOf(",")!=-1?item.materialCode.split(",")[3]:""
            })
        })
        let currencyId = "", exchangeRate='';
        currencyId = this.state.currencyId.split(",")[0];
        if(this.state.exchangeRate) {
            exchangeRate = Number(this.state.exchangeRate)  * Math.pow(10, Number(this.state.currencyId.split(",")[2]));
        }else{
            exchangeRate = Number(this.state.currencyId.split(",")[1]) * Math.pow(10, Number(this.state.currencyId.split(",")[2]));
        }
        let params = {
            code: this.state.code,
            orderDate: this.state.dateTime,
            clientId: this.state.clientId,
            deliveryLocationId: this.state.deliveryLocationId,
            currencyId,
            exchangeRate,
            deptId: this.state.productionDepartmentId,
            empno: this.state.empno,
            salesTypeId: this.state.salesTypeId,
            registrationCode: this.state.registrationCode,
            batchNumber: this.state.batchNumber,
            note1: this.state.node1,
            note2: this.state.node2,
            note3: this.state.node3,
            note4: this.state.node4,
            contractNumber: this.state.hetong,
            invoiceNo: this.state.fapiao,
            currencySign: this.state.currencyId,
            salesOrderItems
        };
        if(this.state.flag == 1) { // 新增
            Axios.post('/self/erp/sales/addSalesOrder', params).then((res)=>{
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
        }else{ // 修改
            params.id = this.state.id;
            Axios.post('/self/erp/sales/updateSalesOrder', params).then((res)=>{
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

    /**
     * 生成销售订单的编码
     * @param index
     */
    createDataList() {
        Axios.post("/self/erp/sales/generateSalesOrderCode", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    code: res.data.data
                })
            }else{
                this.setState({
                    code: ""
                })
            }
        })
    }


    deletesModal(index) { // 删除模态框表格里面的数据
        let arrayList = [...this.state.modalData];
        arrayList.splice(index, 1);
        this.setState({
            modalData: arrayList
        })
    }
    orderTime(dates, pickys) {
        if(pickys) {
            this.setState({
                dateTime: pickys
            })
        }else{
            this.setState({
                dateTime: ""
            })
        }
    }
    // 查询下拉框里面的数据
    clientListData() {
        Axios.post('self/erp/baseinfo/queryDictTypeAndValue').then((res)=>{
            if(res.data.success) {
                this.setState({
                    salesTypeIdList: res.data.data.salesType,
                    deliveryLocationIdList: res.data.data.deliveryLocation,
                })
            }else{
                this.setState({
                    salesTypeIdList: [],
                    deliveryLocationIdList: [],
                })
            }
        });
        Axios.post('/self/erp/baseinfo/queryCurrency', {}).then((res)=>{
            //console.log(res.data.data.currencys)   // exchangeRate
            if(res.data.success) {
                this.setState({
                    currencyIdList: res.data.data.currencys
                })
            }else{
                this.setState({
                    currencyIdList: []
                })
            }
        })
        Axios.post('/self/erp/sales/queryClients', {}).then((res)=>{
            if(res.data.success) {
                //console.log();   // fullName  id
                this.again(res.data.data.clients);
            }else{
                this.setState({
                    clientIdList: []
                })
            }
        })
        Axios.post('/self/erp/dept/queryDept', {}).then((res)=>{
            if(res.data.success) {
                 // deptName  deptId
                this.again1(res.data.data.deptList);
            }else{
                this.setState({
                    productionDepartmentIdList: []
                })
            }
        })
        // 产品编码
        Axios.post('/self/erp/baseinfo/queryMaterialInfoItems', {}).then((res)=>{
            if(res.data.success) {
                // console.log(res.data.data.materialInfos);
                this.setState({
                    materialCodeList: res.data.data.materialInfos
                })
            }else{
                this.setState({
                    materialCodeList: []
                })
            }
        })
        //包装版面
        Axios.post('/self/erp/baseinfo/queryPackagingLayouts', {}).then((res)=>{
            if(res.data.success) {
                // console.log(res.data.data.materialInfos);
                this.setState({
                    materialTypesList: res.data.data.packagingLayouts
                })
            }else{
                this.setState({
                    materialTypesList: []
                })
            }
        })
        //查询业务员
        Axios.post('/self/erp/baseinfo/queryUser', {}).then((res)=>{
            if(res.data.success) {
                // console.log(res.data.data.materialInfos);
                this.setState({
                    empnoList: res.data.data.users
                })
            }else{
                this.setState({
                    empnoList: []
                })
            }
        })
    }

    again1(array) {
        array.forEach((item)=>{
            item.title = item.deptName;
            item.value = item.deptId;
            if(item.children != undefined) {
                this.again1(item.children);
            }
        })
        this.setState({
            productionDepartmentIdList: array
        })
    }
    again(arr) {
        arr.forEach((item)=>{
            item.title = item.fullName;
            item.value = item.id;
            if(item.children != undefined) {
                this.again(item.children);
            }
        })
        this.setState({
            clientIdList: arr
        })
    }
    // 获取订单编码
    bianCodeMethods() {
        Axios.post('/self/erp/sales/generateSalesOrderCode').then((res)=>{
            if(res.data.success) {
                this.setState({
                    orderCodes: res.data.data
                })
            }else{
                this.setState({
                    orderCodes: []
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
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
}
export default SalesOrder;