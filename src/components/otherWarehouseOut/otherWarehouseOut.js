import React, {Component} from "react"
import {Input, Select, Table, Space, Pagination, Modal, InputNumber, Button, DatePicker, Upload, message, Switch, TreeSelect} from 'antd';
import { ExclamationCircleOutlined ,UploadOutlined} from '@ant-design/icons';
import Axios from 'axios';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./otherWarehouseOut.scss"
const {Option} = Select;
const {Column} = Table;
const {TextArea} = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
class OtherWarehouseOut extends Component{
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',  endTime: '',
            searchType: '',  searchTypeList: [],
            status: '',      statusList: [],
            dataSource: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            //////////////////////////////// 模态框  ///////////////////////////////////////////
            msg: '',
            flag: 1,
            visible: false,
            salesTypeIdList: [],
            modalData: [],
            materialCodeList: [],

            getterDeptId: '',   getterDeptIdList: [],
            deliveryDate: '',
            clientIdList: [],  clientId: '',
            supplierIdList: [],  supplierId: '',
            purpose: '',
            deliveryWarehouseId: '', deliveryWarehouseIdList:[],
            deliveryEmpnoList: [], deliveryEmpno: '',
            materialGetterList: [], materialGetter: '',
            deliveryWarehouseId2: '',
            fontSizeList: [{label: '篮字', value: 1}, {label: '红字', value: 2}], currentIndex: 0,

        }
    }
    render() {
        return(
            <div className="otherWarehouseOut">
                <div className="placeSearch">
                    <span className="span1">日期</span>
                    <RangePicker onChange={(e, time)=>{
                        if(time[0]) {
                            this.setState({
                                startTime: time[0],
                                endTime: time[1]
                            })
                        }else{
                            this.setState({
                                startTime: "",
                                endTime: ""
                            })
                        }
                    }} className="input1 inputDatePicker" placeholder="" locale={locale} showTime/>
                    <span className="span1 span2">供应商</span>
                    <Select allowClear className="input1" onChange={(e)=>{this.setState({searchType: e})}}>
                        {
                            this.state.searchTypeList.map((item)=>{
                                return(
                                    <Option value={item.value} key={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>

                    <span className="span1 span2">状态</span>
                    <Select allowClear className="input1" onChange={(e)=>{this.setState({status: e})}}>
                        {
                            this.state.statusList.map((item)=>{
                                return(
                                    <Option value={item.value} key={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                    <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                </div>
                <div className="bg">
                    <button className="searchs" onClick={this.add.bind(this)}>新增</button>
                    <button className="searchs searchs1" onClick={this.donload.bind(this)}>导出</button>
                </div>
                <div className="placeTable">
                    <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: '暂无数据'}}>
                        <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                            <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                        )}/>
                        <Column title="时间" dataIndex="deliveryDate" key="deliveryDate" align="center"/>
                        <Column title="编号" dataIndex="code" key="code" align="center"/>
                        <Column title="供应商" dataIndex="supplierName" key="supplierName" align="center"/>
                        <Column title="数量" dataIndex="number" key="number" align="center"/>
                        <Column title="仓库" dataIndex="deliveryWarehouseName" key="deliveryWarehouseName" align="center"/>
                        <Column title="金额" dataIndex="totalPrice" key="totalPrice" align="center" render={(text)=>{
                            return(
                                <span>{text / 100}</span>
                            )
                        }}/>
                        <Column title="制单" dataIndex="createdName" key="createdName" align="center"/>
                        <Column title="审核" dataIndex="auditStatus" key="auditStatus" align="center" render={(text)=>(
                            <span>{text==0?"未审核":"已审核"}</span>
                        )}/>
                        <Column title="操作" align="center" key="records" dataIndex="records"
                            render={(text, record) => (
                                <Space size="large">
                                    <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes">编辑</span>
                                    <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes">删除</span>
                                    {record.auditStatus==1?(
                                        <span onClick={this.notCheck.bind(this, record)} className="details span11">反审核</span>
                                    ):(
                                        <span onClick={this.check.bind(this, record)} className="details span11">审核</span>
                                    )}
                                    <span onClick={this.details.bind(this, record)} className="details span11">查看</span>
                                </Space>
                            )}
                        />
                    </Table>
                </div>
                <div className="placePagination">
                    <Pagination showTotal={()=>`共 ${this.state.pageTotal} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotal} showSizeChanger={false}/>
                </div>

                <Modal title={this.state.msg} width="80%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                    <div className="modal1">
                        <ul className="modal11_ul1">
                            {this.state.fontSizeList.map((item, index)=>{
                                return(
                                    <li key={item.value} onClick={this.handleClickLi.bind(this, index)}
                                        className={this.state.currentIndex==index?"active modal11_ul1_li":"modal11_ul1_li"}>{item.label}</li>
                                )
                            })}
                        </ul>
                        <ul className="salesInvoiceUl">
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">编号</span>
                                <div className="salesInvoiceDiv1">
                                    <Input allowClear value={this.state.code} disabled/>
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">领料部门</span>
                                <div className="salesInvoiceDiv1">
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        value={this.state.getterDeptId}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.getterDeptIdList}
                                        placeholder=""
                                        treeDefaultExpandAll
                                        onChange={(e)=>{this.setState({getterDeptId: e})}}
                                        showSearch
                                        filterTreeNode={(input, option) =>
                                            option.title.toLowerCase().indexOf(input.toLowerCase()) >=0
                                        }
                                        disabled={this.state.flag==3?true:false}
                                    />
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">日期</span>
                                <div className="salesInvoiceDiv1">
                                    <DatePicker style={{width: '100%'}} onChange={(e, time)=>{
                                        this.setState({deliveryDate: time})
                                    }}
                                    value={this.state.deliveryDate==undefined || this.state.deliveryDate=='' ?"":moment(this.state.deliveryDate, 'YYYY-MM-DD')} locale={locale}
                                    disabled={this.state.flag==3?true:false}/>
                                </div>
                            </li>
                        </ul>
                        <ul className="salesInvoiceUl salesInvoiceUl1">
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">客户</span>
                                <div className="salesInvoiceDiv1">
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        value={this.state.clientId}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.clientIdList}
                                        placeholder=""
                                        treeDefaultExpandAll
                                        onChange={(e)=>{this.setState({clientId: e})}}
                                        showSearch
                                        filterTreeNode={(input, option) =>
                                            option.title.toLowerCase().indexOf(input.toLowerCase()) >=0
                                        }
                                        disabled={this.state.flag==3?true:false}
                                    />
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">供应商</span>
                                <div className="salesInvoiceDiv1">
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        value={this.state.supplierId}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.supplierIdList}
                                        placeholder=""
                                        treeDefaultExpandAll
                                        onChange={(e)=>{this.setState({supplierId: e})}}
                                        showSearch
                                        filterTreeNode={(input, option) =>
                                            option.title.toLowerCase().indexOf(input.toLowerCase()) >=0
                                        }
                                        disabled={this.state.flag==3?true:false}
                                    />
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">用途</span>
                                <div className="salesInvoiceDiv1">
                                    <Input allowClear value={this.state.purpose} onChange={(e)=>{this.setState({
                                        purpose: e.target.value
                                    })}} disabled={this.state.flag==3?true:false}/>
                                </div>
                            </li>
                        </ul>
                        <ul className="salesInvoiceUl salesInvoiceUl1">
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">发货仓库</span>
                                <div className="salesInvoiceDiv1">
                                    <Select className="input3" style={{width: '100%'}} value={this.state.deliveryWarehouseId}
                                            disabled={this.state.flag==3?true:false}
                                            onChange={(e)=>{this.setState({deliveryWarehouseId: e})}}>
                                        {this.state.deliveryWarehouseIdList.map((item)=>{
                                            return(
                                                <Option value={item.id} key={item.id}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                            </li>
                        </ul>

                        <div className="placeChangeTable">
                            <Table pagination={false} dataSource={this.state.modalData} locale={{emptyText: '暂无数据'}} scroll={{x: 2000}}>
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
                                                                item.measurement = item.materialCode.split(",")[2];
                                                                item.stock = item.materialCode.split(",")[3];
                                                            }
                                                        }
                                                    })
                                                    this.setState({
                                                        modalData: this.state.modalData
                                                    })
                                                }} disabled={this.state.flag==3?true:false}>
                                            {this.state.materialCodeList.map((item)=>{
                                                return(
                                                    <Option value={","+item.materialName+","+item.measurement+","+item.stock+","+item.materialCode+","+item.baseInfoType} key={item.id}>{item.materialCode+"  "+item.materialName}</Option>
                                                )
                                            })}
                                        </Select>
                                    </>
                                )}/>
                                <Column title="产品名称" dataIndex="materialName" key="materialName" align="center" width={100}/>
                                <Column width={200} title="周转物类型" dataIndex="turnoverType" key="turnoverType" align="center" render={(text, record)=>(
                                    <>
                                        <Select style={{width: '100%', textAlign: "left"}} value={text} onChange={(e)=>{
                                            this.state.modalData.forEach((item)=>{
                                                if(item.id == record.id) {
                                                    item.turnoverType = e;
                                                }
                                            })
                                            this.setState({
                                                modalData: this.state.modalData
                                            })
                                        }} disabled={this.state.flag==3?true:false}>
                                            {this.state.materialCodeList.map((item)=>{
                                                return(
                                                    <Option value={item.materialCode} key={item.id}>{item.materialName}</Option>
                                                )
                                            })}
                                        </Select>
                                    </>
                                )}/>
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
                                        }} disabled={this.state.flag==3?true:false}>
                                            {this.state.materialCodeList.map((item)=>{
                                                return(
                                                    <Option value={item.materialCode} key={item.id}>{item.materialName}</Option>
                                                )
                                            })}
                                        </Select>
                                    </>
                                )}/>
                                <Column width={200} title="桶数" dataIndex="bucketNum" key="bucketNum" align="center" render={(text, record)=>(
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
                                <Column width={200} title="箱数" dataIndex="boxNum" key="boxNum" align="center" render={(text, record)=>(
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
                                <Column title="单位" dataIndex="measurement" key="measurement" align="center" width={100}/>
                                <Column width={200} title="数量" dataIndex="number" key="number" align="center" render={(text, record)=>(
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
                                <Column width={200} title="单价" dataIndex="unitPrice" key="unitPrice" align="center" render={(text, record)=>(
                                    <>
                                        <InputNumber value={text} onChange={(e)=>{
                                            this.state.modalData.forEach((item)=>{
                                                if(item.id == record.id) {
                                                    item.unitPrice = e;
                                                }
                                            })
                                            this.setState({modalData: this.state.modalData})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </>
                                )}/>
                                {/*<Column title="金额" dataIndex="stock" key="stock" align="center" width={200}/>*/}
                                <Column width={200} title="发货仓库" dataIndex="deliveryWarehouseId" key="deliveryWarehouseId" align="center" render={(text, record)=>(
                                    <>
                                        <Select style={{width: '100%', textAlign: "left"}} value={text} onChange={(e)=>{
                                            this.state.modalData.forEach((item)=>{
                                                if(item.id == record.id) {
                                                    item.deliveryWarehouseId = e;
                                                }
                                            })
                                            this.setState({
                                                modalData: this.state.modalData
                                            })
                                        }} disabled={this.state.flag==3?true:false}>
                                            {this.state.deliveryWarehouseIdList.map((item)=>{
                                                return(
                                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </>
                                )}/>
                                <Column title="库存" dataIndex="stock" key="stock" align="center" width={200}/>
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
                            </Table>
                        </div>

                        <ul className="salesInvoiceUl salesInvoiceUl1">
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">制单</span>
                                <div className="salesInvoiceDiv1">
                                    <Input allowClear value={this.state.createName} disabled/>
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">审核</span>
                                <div className="salesInvoiceDiv1">
                                    <Input allowClear value={this.state.check} disabled/>
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">审核日期</span>
                                <div className="salesInvoiceDiv1">
                                    <Input allowClear value={this.state.checkTime} disabled/>
                                </div>
                            </li>
                        </ul>
                        <ul className="salesInvoiceUl salesInvoiceUl1">
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">发货</span>
                                <div className="salesInvoiceDiv1">
                                    <Select className="input3" style={{width: '100%'}} value={this.state.deliveryEmpno}
                                            disabled={this.state.flag==3?true:false}
                                            onChange={(e)=>{this.setState({deliveryEmpno: e})}}>
                                        {this.state.deliveryEmpnoList.map((item)=>{
                                            return(
                                                <Option value={item.empno} key={item.empno}>{item.realname}</Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">领料</span>
                                <div className="salesInvoiceDiv1">
                                    <Select className="input3" style={{width: '100%'}} value={this.state.materialGetter}
                                            disabled={this.state.flag==3?true:false}
                                            onChange={(e)=>{this.setState({materialGetter: e})}}>
                                        {this.state.deliveryEmpnoList.map((item)=>{
                                            return(
                                                <Option value={item.empno} key={item.empno}>{item.realname}</Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                            </li>
                            <li className="salesInvoiceLi">
                                <span className="salesInvoiceSpan">记账</span>
                                <div className="salesInvoiceDiv1">
                                    <Select className="input3" disabled style={{width: '100%'}}
                                            disabled={this.state.flag==3?true:false}
                                            onChange={(e)=>{this.setState({salesTypeId: e})}}>
                                        {this.state.salesTypeIdList.map((item)=>{
                                            return(
                                                <Option value={item.valueId} key={item.valueId}>{item.value}</Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="div4">
                        <li className="li4">
                            <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>取消</Button>
                        </li>
                        {this.state.flag==3?(null):(
                            <li className="li4">
                                <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                            </li>
                        )}
                    </div>
                </Modal>
            </div>
        )
    }
    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            searchType: this.state.searchType,
            status: this.state.status
        }
        Axios.post("/self/erp/warehouse/queryOtherOutbound", params).then((res)=>{
            if(res.data.success) {
                res.data.data.otherOutbounds.forEach((item)=>{
                    item.key = item.id;
                })
                this.setState({
                    dataSource: res.data.data.otherOutbounds,
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
    searchMethods() {
        this.initData(this.state.currentPage);
    }
    add() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let day = now.getDate();
        this.setState({
            visible: true,
            flag: 1,
            msg: '新增',

            deliveryDate: year+"-"+month+"-"+day,
            modalData: [
                {id: new Date().getTime(), key: new Date().getTime()}
            ],

            supplierId: "",
            deliveryEmpno: "",
            materialGetter: "",
            getterDeptId: "",
            deliveryWarehouseId: "",
            clientId: "",
            purpose: "",
            currentIndex: 0
        })
        this.createCode();
        this.initList();
    }
    donload() {

    }
    changes(row) {
        this.initList();
        this.setState({
            visible: true,
            flag: 2,
            id: row.id,
            msg: "修改"
        })
        this.queryId(row);
    }
    details(row) {
        this.initList();
        this.setState({
            visible: true,
            flag: 3,
            id: row.id,
            msg: "详情"
        })
        this.queryId(row);
    }
    queryId(row) {
        Axios.post("/self/erp/warehouse/queryOtherOutboundById", {id: row.id}).then((res)=>{
            if(res.data.success) {
                let obj = res.data.data.otherOutbound;
                let modalData = [];
                obj.salesDeliveryOrderItems.forEach((item)=>{
                    modalData.push({
                        key: item.id,
                        materialCode: ","+item.materialName+","+item.measurement+","+item.stock+","+item.materialCode+","+item.baseInfoType,
                        materialName: item.materialName,
                        number: item.number,
                        boxNum: item.boxNum,
                        bucketNum: item.bucketNum,
                        unitPrice: Number(item.unitPrice) / 100,
                        deliveryWarehouseId: item.deliveryWarehouseId,
                        packagingLayout: item.packagingLayout,
                        turnoverType: item.turnoverType,
                        measurement: item.measurement,
                        note: item.note,
                        baseInfoType: item.baseInfoType
                    })
                })
                this.setState({
                    code: obj.code,
                    supplierId: obj.supplierId,
                    deliveryEmpno: obj.deliveryEmpno,
                    materialGetter: obj.materialGetter,
                    getterDeptId: obj.getterDeptId,
                    deliveryWarehouseId: obj.deliveryWarehouseId,
                    clientId: obj.clientId,
                    purpose: obj.purpose,
                    currentIndex: obj.redBlueMark=="red"?1:0,
                    deliveryDate: obj.deliveryDate,
                    createName: obj.createName,
                    check: obj.auditName,
                    checkTime: obj.auditTime,
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
                Axios.post('/self/erp/warehouse/deleteOtherOutbound', params).then((res)=>{
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
                Axios.post('/self/erp/warehouse/auditOtherOutbound', params).then((res)=>{
                    if(res.data.success) {
                        message.success("审核成功");
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
                Axios.post('/self/erp/warehouse/auditOtherOutbound', params).then((res)=>{
                    if(res.data.success) {
                        message.success("反审核成功");
                        that.initData(that.state.currentPage);
                    }else{
                        message.warning(res.data.message);
                    }
                })
            },
            onCancel() {},
        });
    }
    changePages(val) {
        this.setState({
            currentPage: val
        })
        this.initData(val);
    }
    handleOk() {
        let otherOutboundItems = []
        this.state.modalData.forEach((item)=>{
            otherOutboundItems.push({
                materialCode: item.materialCode!=null || item.materialCode!= undefined || item.materialCode != '' ? item.materialCode.split(",")[4] :"",
                materialName: item.materialName,
                number: item.number,
                boxNum: item.boxNum,
                bucketNum: item.bucketNum,
                totalPrice: Number(item.unitPrice) * Number(item.number) * 100,
                unitPrice: Number(item.unitPrice) * 100,
                deliveryWarehouseId: item.deliveryWarehouseId,
                packagingLayout: item.packagingLayout,
                turnoverType: item.turnoverType,
                measurement: item.measurement,
                note: item.note,
                baseInfoType: item.materialCode!=null || item.materialCode!= undefined || item.materialCode != '' ? item.materialCode.split(",")[5] :""
            })
        })
        let params = {
            code: this.state.code,
            supplierId: this.state.supplierId,
            deliveryEmpno: this.state.deliveryEmpno,
            materialGetter: this.state.materialGetter,
            deliveryDate: this.state.deliveryDate,
            getterDeptId: this.state.getterDeptId,
            deliveryWarehouseId: this.state.deliveryWarehouseId,
            clientId: this.state.clientId,
            purpose: this.state.purpose,
            redBlueMark: this.state.currentIndex==0?"blue":"red",
            otherOutboundItems
        }
        if(this.state.flag == 1) {
            Axios.post("/self/erp/warehouse/addOtherOutbound", params).then((res)=>{
                if(res.data.success) {
                    message.success("新增成功");
                    this.setState({
                        visible: false
                    });
                    this.initData(this.state.currentPage);
                }else{
                    message.warning(res.data.message);
                }
            })
        }else if(this.state.flag == 2) {
            params.id = this.state.id;
            Axios.post("/self/erp/warehouse/updateOtherOutbound", params).then((res)=>{
                if(res.data.success) {
                    message.success("修改成功");
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
    addModalData() {
        let str = new Date().getTime();
        this.state.modalData.push({id: str, key: str});
        this.setState({
            modalData: [...this.state.modalData]
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
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
    createCode() {
        Axios.post("/self/erp/warehouse/generateOtherOutboundCode", {}).then((res)=>{
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
    initList() {
        Axios.post("/self/erp/dept/queryDept", {}).then((res)=>{
            if(res.data.success) {
                this.again(res.data.data.deptList);
            }else{
                this.setState({
                    getterDeptIdList: []
                })
            }
        })
        Axios.post("/self/erp/sales/queryClients", {}).then((res)=>{
            if(res.data.success) {
                this.again2(res.data.data.clients);
            }else{
                this.setState({
                    clientIdList: []
                })
            }
        })

        Axios.post("/self/erp/purchaseOrder/querySupplier", {}).then((res)=>{
            if(res.data.success) {
                this.again3(res.data.data.suppliers);
            }else{
                this.setState({
                    supplierIdList: []
                })
            }
        })

        Axios.post("/self/erp/baseinfo/queryWarehouseAreas", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    deliveryWarehouseIdList: res.data.data.warehouseAreas
                })
                // this.again3(res.data.data.suppliers);
            }else{
                this.setState({
                    deliveryWarehouseIdList: []
                })
            }
        })

        Axios.post("/self/erp/baseinfo/queryUser", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    deliveryEmpnoList: res.data.data.users
                })
            }else{
                this.setState({
                    deliveryEmpnoList: []
                })
            }
        })

        Axios.post("/self/erp/baseinfo/queryMaterialInfoItems", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    materialCodeList: res.data.data.materialInfos
                })
            }else{
                this.setState({
                    materialCodeList: []
                })
            }
        })
    }
    again3(array) {
        array.forEach((item)=>{
            item.title = item.fullName;
            item.value = item.id;
            if(item.children != undefined) {
                this.again3(item.children);
            }
        })
        this.setState({
            supplierIdList: array
        })
    }
    again2(array) {
        array.forEach((item)=>{
            item.title = item.clientName;
            item.value = item.id;
            if(item.children != undefined) {
                this.again2(item.children);
            }
        })
        this.setState({
            clientIdList: array
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
            getterDeptIdList: array
        })
    }
    /**
     * 点击红色蓝色的切换按钮
     */
    handleClickLi(item) {
        this.setState({
            currentIndex: item
        })
    }
}
export default OtherWarehouseOut;