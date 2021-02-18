import React, {Component} from 'react'
import Axios from 'axios';
import store  from '../../store/store'
import action  from '../../store/action'
import { Table, Input,Space, Button,message, Pagination , Modal, Select, InputNumber, DatePicker, Tree, TreeSelect, Cascader, Tag, Checkbox} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import './purchaseOrder.scss'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const {Column} = Table;
const {Search} = Input;
const {Option} = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class PurchaseOrder extends Component{
    constructor(props) {
        super(props);
        this.row = [];
        this.state = {
            distributorList: [{label: '张三', value: 1}, {label: '李四', value: 2}],   distributor: null,
            touchingList: [{label: '张三', value: 1}, {label: '李四', value: 2}],   touching: null,
            inventoryStatusList: [{label: '张三', value: 1}, {label: '李四', value: 2}],   inventoryStatus: null,
            startTime: "",   endTime: "",
            treeData: [],
            materialTypes: null,
            placeOrderCode: '',
            currentPage: 1,
            pageSize: 10,
            pageTotle: 0,
            dataSource: [],
            dateStrings: "",

            orderCode: '', plancode: '',plancodeList: [],   supplierList: [],   supplierId: undefined,   orderPrice: '',
            msg: '',   visible: false,
            modalData: [{boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0, id: 'dfsdfs543534534gdfgdfg543534gdfg4353'},{
                flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                unitNetWeight: '',    number: 0,      unitPrice: '',       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
            }],
            handleData: [],
            stantIdList: [],  stantId: undefined,
            levelsList: [],  levels: undefined,
            visible1: false,
            flag: 1,
            selectedRows: [],
            currentPage1: 1,
            pageSize1: 10,
            pageTotal1: 0,
            id: '',   checklist: [],  price: '',
            name: '',
            keys: '',
            isShow: false,
            orderName: '', supplierName: '',
            providerValue: undefined,
            treeDataProvider: [],
            deptList: [],    deptId: '',
            materialCodeList: [],
            materialNameList: [],
            zhidan: '',  riqi:'', shenhe: '', shenheriqi: '',
            providerName: '',    providerId: '',
            selectDataSource: [],
            selectedRowKeys: [],
            modalBottomList: [],
            saleId: '',
            defaultSelectedKeys: [],
            loading: false,
            isProviderValue: false
        }
    }
    render() {
        return (
            <div id="purchaseOrder">
                <div className="purchaseOrder">
                    <div className="placeSearch">
                        <div className="li1">
                            <span className="span0">供应商</span>
                            <Select value={this.state.distributor} onChange={(e) => {
                                this.setState({distributor: e})
                            }} allowClear className="input0">
                                {this.state.distributorList.map((item) => {
                                    return (
                                        <Option value={item.value}>{item.label}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className="li1">
                            <span className="span0">制单</span>
                            <Select value={this.state.touching} onChange={(e) => {
                                this.setState({touching: e})
                            }} allowClear className="input0">
                                {this.state.touchingList.map((item) => {
                                    return (
                                        <Option value={item.value}>{item.label}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className="li1">
                            <span className="span0">入库状态</span>
                            <Select value={this.state.inventoryStatus} onChange={(e) => {
                                this.setState({inventoryStatus: e})
                            }} allowClear className="input0">
                                {this.state.inventoryStatusList.map((item) => {
                                    return (
                                        <Option value={item.value}>{item.label}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className="li1 li01">
                            <span className="span0">日期</span>
                            <RangePicker showTime className="input0" allowClear placeholder="" locale={locale}
                                         onChange={this.dateTime.bind(this)}
                                         value={
                                             this.state.startTime ? [moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')] : ''
                                         }/>
                        </div>
                        <div className="placeBtn">
                            <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                        </div>
                    </div>
                    <div className="bg">
                        <button className="searchs" onClick={this.add.bind(this)}>新增</button>
                        <button className="searchs" onClick={this.clearInput.bind(this)}>清空</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px"
                                    render={(text, record, index) => (
                                        <span>{(this.state.currentPage - 1) * this.state.pageSize + index + 1}</span>
                                    )}/>
                            <Column title="日期" dataIndex="deliveryDate" key="deliveryDate" align="center"/>
                            <Column title="供应商" dataIndex="supplierName" key="supplierName" align="center"/>
                            <Column title="订单编码" dataIndex="code" key="code" align="center"/>
                            <Column title="金额" dataIndex="totalPrice" key="totalPrice" align="center" render={(text)=>(
                                <span>{text / 100}</span>
                            )}/>
                            <Column title="制单" dataIndex="createdName" key="createdName" align="center"/>
                            <Column title="审核" dataIndex="auditStatus" key="auditStatus" align="center" render={(text)=>(
                                <span>{text==0?"未审核":"已审核"}</span>
                            )}/>
                            <Column title="入库状态" dataIndex="status" key="status" align="center" render={(text)=>(
                                <span>{text==1?"未入库":text==2?"部分入库":text==3?"全部入库":"-"}</span>
                            )}/>
                            <Column title="操作" align="center" key="records" dataIndex="records"
                                    render={(text, record) => (
                                        <Space size="large">
                                            {record.status == 0?(
                                                <>
                                                    <span onClick={this.changes.bind(this, record)} className="changes">编辑</span>
                                                    <span onClick={this.deletesTable.bind(this, record)} className="changes">删除</span>
                                                </>
                                            ):(
                                                null
                                            )}
                                            {record.auditStatus==1?(
                                                <span onClick={this.checks.bind(this, record)}
                                                      className="deletes" >反审核</span>
                                            ):(
                                                <span onClick={this.checks.bind(this, record)}
                                                      className="deletes">审核</span>
                                            )}
                                            <span onClick={this.details.bind(this, record)} className="details span11">查看</span>
                                        </Space>
                                    )}
                            />
                        </Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={() => `共 ${this.state.pageTotle} 条`} current={this.state.currentPage}
                                    onChange={this.changePages.bind(this)} pageSize={this.state.pageSize}
                                    total={this.state.pageTotle} showSizeChanger={false}/>
                    </div>

                    <Modal title={this.state.msg} width="90%" footer={null} getContainer={false} closable={false}
                           visible={this.state.visible} centered={true}>
                        <div className="modal1">
                            <div className="div3">
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*订单编码</span>
                                        <Input allowClear disabled value={this.state.orderCode} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*供应商</span>
                                        <TreeSelect
                                            treeDataSimpleMode
                                            style={{width: '100%'}}
                                            value={this.state.providerValue}
                                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                            placeholder="选择供应商"
                                            onChange={(value) => {
                                                this.setState({
                                                    providerValue: value,
                                                    isProviderValue: true
                                                })
                                            }}
                                            disabled={this.state.flag==3?true:false}
                                            loadData={this.onLoadData.bind(this)}
                                            treeData={this.state.treeDataProvider}
                                            className={"input3"}
                                            onSelect={this.treeSelect.bind(this)}
                                        />
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*送货日期</span>
                                        <DatePicker onChange={this.delivery.bind(this)} className={"input3"}
                                                    locale={locale} disabled={this.state.flag==3?true:false} value={
                                            this.state.dateStrings ? moment(this.state.dateStrings, 'YYYY-MM-DD') : ""
                                        }/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*部门</span>
                                        <TreeSelect showSearch className={"input3"} value={this.state.deptId}
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    placeholder=""  allowClear treeDefaultExpandAll onChange={this.handleDept.bind(this)}
                                                    treeData={this.state.deptList}
                                                    disabled={this.state.flag==3?true:false}>
                                        </TreeSelect>
                                        {/*<Cascader options={this.state.deptList} onChange={this.handleDept.bind(this)}*/}
                                        {/*          value={this.state.deptId} placeholder="选择部门" className={"input3"}/>*/}
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*业务员</span>
                                        <Select className={"input3"} onChange={
                                            (e) => {
                                                this.setState({supplierId: e, isSupplierId: true})
                                            }
                                        } value={this.state.supplierId} disabled={this.state.flag == 3 ? true : false}>
                                            {
                                                this.state.supplierList.map((item, index) => {
                                                    return (
                                                        <Option value={item.empno} key={index}>{item.realname}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <div className="placeChangeTable">
                                    <Table pagination={false} dataSource={this.state.modalData}
                                           locale={{emptyText: '暂无数据'}} scroll={{x: 2000}}>
                                        <Column title="" align="center" key="records" dataIndex="records" width={120}
                                                fixed='left'
                                                render={(text, record) => (
                                                    <>
                                                        <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                            <span className="span_img1 span_img"
                                                                  onClick={this.addModalData.bind(this)}>+</span>
                                                            <span className="span_img2 span_img"
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
                                                                    // console.log(arr)
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
                                                <Select style={{width: '100%', textAlign: "left"}} value={text} allowClear
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
                                            </>
                                        )}/>
                                        <Column title="箱数" dataIndex="boxNum" key="boxNum" align="center"
                                                render={(text, record) => (
                                                    <>
                                                        <InputNumber value={text} onChange={(e) => {
                                                            this.commonZone(e,record, "boxNum");
                                                        }} disabled={record.flag=="notShow" || this.state.flag==3 ?true:false}/>
                                                    </>
                                                )}/>
                                        <Column title="桶数" dataIndex="bucketNum" key="bucketNum" align="center"
                                                render={(text, record) => (
                                                    <>
                                                        <InputNumber value={text} onChange={(e) => {
                                                            this.commonZone(e,record, "bucketNum");
                                                        }} disabled={record.flag=="notShow" || this.state.flag==3 ?true:false}/>
                                                    </>
                                                )}/>
                                        <Column title="单位" dataIndex="measurement" key="measurement" align="center" render={(text, record)=>(
                                            <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                        )}/>
                                        <Column title="单位净重" dataIndex="unitNetWeight" key="unitNetWeight"
                                                align="center" render={(text, record) => (
                                            <>
                                                <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                <InputNumber value={text} disabled={this.state.flag==3?true:false} onChange={(e) => {
                                                    this.state.modalData.forEach((item) => {
                                                        if (item.id == record.id) {
                                                            item.unitNetWeight = e;
                                                            this.setState({modalData: this.state.modalData})
                                                        }
                                                    })
                                                    // this.initTableData("name4");
                                                }}/>
                                                </div>
                                            </>
                                        )}/>
                                        <Column title="数量" dataIndex="number" key="number" align="center" width={160}
                                                render={(text, record) => (
                                                    <>
                                                        <InputNumber value={text} onChange={(e) => {
                                                            this.state.modalData.forEach((item)=>{
                                                                if(item.id == record.id) {
                                                                    item.totalPrice = Number(record.unitPrice) * Number(e)
                                                                    console.log(item.totalPrice);
                                                                }
                                                            })
                                                            this.commonZone(e,record, "number");
                                                        }} disabled={record.flag=="notShow" || this.state.flag==3?true:false}/>
                                                    </>
                                                )}/>
                                        <Column title="单价" dataIndex="unitPrice" key="unitPrice" align="center"
                                                render={(text, record) => (
                                                    <>
                                                        <div style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>
                                                        <InputNumber value={text} disabled={this.state.flag==3?true:false} onChange={(e) => {
                                                            this.state.modalData.forEach((item) => {
                                                                if (item.id == record.id) {
                                                                    item.totalPrice = Number(record.number) * Number(e)
                                                                    item.taxUnitPrice = item.unitPrice = e;
                                                                    this.setState({modalData: this.state.modalData})
                                                                }
                                                            })
                                                            // this.initTableData("name4");
                                                        }}/>
                                                        </div>
                                                    </>
                                                )}/>
                                        <Column title="金额" dataIndex="totalPrice" key="totalPrice" align="center"
                                                render={(text, record) => (
                                                    <>
                                                        <InputNumber value={text} onChange={(e) => {
                                                            this.commonZone(e,record, "totalPrice");
                                                        }} disabled={record.flag=="notShow"|| this.state.flag==3?true:false}/>
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
                                                        <Input value={text} disabled={this.state.flag==3?true:false} onChange={(e) => {
                                                            this.state.modalData.forEach((item) => {
                                                                if (item.id == record.id) {
                                                                    item.note = e.target.value;
                                                                    this.setState({modalData: this.state.modalData})
                                                                }
                                                            })
                                                        }}/>
                                                        </div>
                                                    </>
                                                )}/>
                                        <Column title="规格型号" dataIndex="standard" key="standard" align="center" render={(text, record)=>(
                                            <span style={record.flag=="notShow"?{display: 'none'}:{display: "block"}}>{text}</span>
                                        )}/>
                                    </Table>
                                </div>
                                <ul className="ul1" style={{marginTop: '40PX'}}>
                                    <li className="li1">
                                        <span className="span1">*制单</span>
                                        <Input disabled value={this.state.zhidan} className="input3"/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*日期</span>
                                        <Input disabled value={this.state.riqi} className="input3"/>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*审核</span>
                                        <Input disabled value={this.state.shenhe} className="input3"/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*审核日期</span>
                                        <Input disabled value={this.state.shenheriqi} className="input3"/>
                                    </li>
                                </ul>
                                <div className="div7"
                                     style={this.state.isShow ? {display: 'block'} : {display: 'none'}}>
                                    <span className="span7"></span>
                                    <ol className="ol1">
                                        <div className="olDiv">
                                            <li className="li4">品种</li>
                                            <li className="li4">规格</li>
                                            <li className="li4">等级</li>
                                            <li className="li4">桶数</li>
                                            <li className="li4">单价(元)</li>
                                            <li className="li4">单桶重量(kg)</li>
                                        </div>
                                    </ol>
                                    <ol className="ol1">
                                        {
                                            this.state.checklist.map((item) => {
                                                return (
                                                    <div className="olDiv" key={item.id}>
                                                        <li className="li4">{item.variety}</li>
                                                        <li className="li4">{item.standard}</li>
                                                        <li className="li4">{item.level}</li>
                                                        <li className="li4">{item.number}</li>
                                                        <li className="li4">
                                                            <InputNumber allowClear value={item.unitPrice}
                                                                         onChange={(e) => {
                                                                             this.state.checklist.forEach((itemArr) => {
                                                                                 if (itemArr.id == item.id) {
                                                                                     itemArr.unitPrice = e;
                                                                                 }
                                                                                 this.setState({
                                                                                     unitPrice: e
                                                                                 })
                                                                             })
                                                                         }}/>
                                                        </li>
                                                        <li className="li4">
                                                            <InputNumber allowClear value={item.netWeight}
                                                                         onChange={(e) => {
                                                                             this.state.checklist.forEach((itemArr) => {
                                                                                 if (itemArr.id == item.id) {
                                                                                     itemArr.netWeight = e;
                                                                                 }
                                                                                 this.setState({
                                                                                     netWeight: e
                                                                                 })
                                                                             })
                                                                         }}/>
                                                        </li>
                                                    </div>
                                                )
                                            })
                                        }
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div className="div4">
                            <li className="li4">
                                <Button className="btn4" type="danger" onClick={() => {
                                    this.setState({visible: false});
                                    this.initData(this.state.currentPage)
                                }}>取消</Button>
                            </li>
                            {this.state.flag==3?(null):(
                                <li className="li4">
                                    <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                                </li>
                            )}
                        </div>
                    </Modal>

                    <Modal title="选择物料" width="100%" footer={null} getContainer={false} closable={false} visible={this.state.visible1} centered={true}>
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
        );
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
    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            orderName: this.state.orderName,
            supplierName: this.state.supplierName
        };
        Axios.post('/self/erp/purchaseOrder/queryPurchaseOrder', params).then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                if(res.data.data.purchaseOrders && res.data.data.purchaseOrders.length) {
                    res.data.data.purchaseOrders.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                this.setState({
                    dataSource: res.data.data.purchaseOrders,
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
                    selectDataSource: [],
                    loading: false
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
     * 物料编码下拉框
     */
    materialCodeMethod() {
        Axios.post('/self/erp/baseinfo/queryMaterialInfoItems', {}).then((res)=>{
            // console.log(res.data.data.materialInfos)
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
     * 查询部门列表
     */
    deptMethod() {
        Axios.post("/self/erp/dept/queryDept", {}).then((res)=>{
            if(res.data.success) {
                //console.log(res.data.data.deptList);// deptName   deptId   children
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
            item.label = item.deptName;
            item.value = item.deptId;
            if(item.children != undefined) {
                this.again(item.children);
            }
        })
        this.setState({
            deptList: array
        })
    }

    clearInput() {
        this.setState({
            inventoryStatus: "",
            distributor: "",
            touching: "",
            startTime: "",
            endTime: ""
        })
    }

    /**
     * 点击选择按钮
     * @param e
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

    handleDept(e) {
        this.setState({
            deptId: e,
            supplierId: ""
        })
        this.banList(e);
    }

    treeSelect(node, nodeTree) {
        this.setState({
            providerName: nodeTree.title,
            providerId: nodeTree.id
        })
    }

    /**
     * 统计表格的数据的公共方法
     * @param str
     */
    initTableData(str) {
        if(str == "name4") {
            let num4 = 0;
            this.state.modalData.forEach((item)=>{
                num4 = num4+Number(item.name4);
            })
            console.log(num4)
            console.log(this.state.modalData);
        }
    }
    delivery(date, dateString) {
        this.setState({
            dateStrings: dateString
        })
    }
    searchMethods() {
        this.setState({
            currentPage: 1
        });
        this.initData(1);
    }

    /**
     * 模态框里面的加法按钮
     * @param row
     */
    addModalData() {
        let str = new Date().getTime();
        this.state.modalData.splice(this.state.modalData.length-1, 0, {id: str, boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0, unitPrice: 0});
        this.setState({
            modalData: [...this.state.modalData]
        })
    }

    /**
     * 模态框里面的减法按钮
     * @param row
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
    changes(row) {
        this.setState({
            saleId: row.id,
            visible: true,
            msg: '修改',
            handleData: [],

            flag: 2,
            isShow: false,
            providerName: '',
            providerId: '',
            dateStrings: row.deliveryDate,
            deptId: row.deptId,
            isProviderValue: false,
            isSupplierId: false,
            orderCode: row.code,
            providerValue: row.supplierName,  // 供应商
            supplierId: row.salesman,    // 业务员
            zhidan: row.createdName,
            riqi: row.createdTime,
            shenhe: row.auditName,
            shenheriqi: row.auditTime
        });
        this.row = [];
        this.levelStart();
        this.deptMethod();
        this.materialCodeMethod();
        this.providerList();
        //   内层表格作为回显用的
        this.detailById(row);
    }
    detailById(row) {
        Axios.post("/self/erp/purchaseOrder/queryPurchaseOrderById", {id: row.id}).then((res)=>{
            if(res.data.success) {
                let arr2 = [];
                res.data.data.purchaseOrder.purchaseOrderItems.forEach((item)=>{
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
                    unitNetWeight: '',    number,      unitPrice: 0,       totalPrice,      note: ''   ,   taxUnitPrice: '', standard: '',
                    id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn',
                    key: "sdkjfhk424hrkefh83249823hfejdf3284723fjn"
                })
                this.setState({
                    modalData: arr2
                })
            }else{
                this.setState({
                    modalData: [{boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0, id: 'dfsdfs543534534gdfgdfg543534gdfg4353',key: 'dfsdfs543534534gdfgdfg543534gdfg4353'},{
                        flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                        unitNetWeight: '',    number: 0,      unitPrice: 0,       totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                        id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn', key: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
                    }]
                })
            }
        })
    }
    deletesTable(row) {
        let that = this;
        confirm({
            title: '你确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id
                };
                Axios.post('/self/erp/purchaseOrder/deletePurchaseOrder', params).then((res)=>{
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
    checks(row) {
        let that = this;
        confirm({
            title: '你确定要继续吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id,
                    version: row.version,
                    auditStatus: row.auditStatus==0?1:0
                };
                Axios.post('/self/erp/purchaseOrder/auditPurchaseOrder', params).then((res)=>{
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
    changePages(val) {
        this.setState({
            currentPage: val
        });
        this.initData(val);
    }
    changePages1(val) {
        this.setState({
            currentPage1: val
        });
        this.modalTableList1(this.state.id);
    }
    add() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let day = now.getDate();
        let dateStrings = year+"-"+month+"-"+day;
        this.setState({
            visible: true,
            msg: '新增',
            handleData: [],
            supplierId: [],
            flag: 1,
            isShow: false,
            providerName: '',
            providerId: '',
            dateStrings,
            deptId: null,
            providerValue: undefined,
            modalData: [{boxNum: 0, bucketNum: 0, number: 0, totalPrice: 0,unitPrice: 0,   id: 'dfsdfs543534534gdfgdfg543534gdfg4353'},{
                flag: "notShow",  materialCode: '',    materialName: '',    turnoverType: '',    boxNum: 0,    bucketNum: 0,    measurement: '',
                unitNetWeight: '',    number: 0,      unitPrice: 0,      totalPrice: 0,      note: ''   ,   taxUnitPrice: '', standard: '',
                id: 'sdkjfhk424hrkefh83249823hfejdf3284723fjn'
            }]
        });
        this.row = [];
        this.purchaseOrderCode();
        this.levelStart();
        this.deptMethod();
        this.materialCodeMethod();
        this.providerList();
    }

    /**
     * 查询供应商下拉框
     */
    providerList() {
        Axios.post("/self/erp/baseinfo/querySupplierGroup", {}).then((res)=>{
            if(res.data.success) {
                //console.log(res.data.data.supplierGroups);   // fullName    id
                let arr = [];
                res.data.data.supplierGroups.forEach((item)=>{
                    arr.push({
                        title: item.fullName,
                        id: item.id,
                        value: item.id,
                        pId: item.parentId,
                        isLeaf: false
                    })
                })
                this.setState({
                    treeDataProvider: arr
                })
            }else{
                this.setState({
                    treeDataProvider: []
                })
            }
        })
    }

    /**
     * treeSelect 异步加载数据
     * @param treeNode
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
                                    isLeaf: boolean
                                }
                            )
                        })
                    }
                    this.setState({
                        treeDataProvider: this.state.treeDataProvider.concat(arr)
                    })
                } else {
                    this.setState({
                        treeDataProvider: this.state.treeDataProvider.concat([])
                    })
                }
                resolve();
            });
    })
    /**
     * 查询抽检单列表
     * @param id
     */
    checkList(row) {
        this.setState({
            name: row.supplierName,
            keys: row.id
        });
        Axios.post('/self/erp/purchaseOrder/queryRandomCheckSheetById', {id: row.id}).then((res)=>{
            if(res.data.success) {
                res.data.data.randomCheckSheet.samplingItems.forEach((item)=>{
                    item.unitPrice = item.unitPrice / 100;
                })
                this.setState({
                    checklist: res.data.data.randomCheckSheet.samplingItems,
                    isShow: true
                })
            }else{
                this.setState({
                    checklist: [],
                    isShow: false
                });
                message.warning(res.data.message);
            }
        })
    }
    // 查询原谅和等级的下拉框
    levelStart() {
        Axios.post('/self/erp/purchasePlan/queryStandardAndLevel').then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                this.setState({
                    stantIdList: res.data.data.standard,
                    levelsList: res.data.data.level
                })
            }else{
                this.setState({
                    stantIdList: [],
                    levelsList: []
                })
            }
        })
    }
    deletes(row) {
        let that = this;
        confirm({
            title: '你确定要继续吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id
                };
                Axios.post('/self/erp/purchaseOrder/deletePurchaseOrder', params).then((res)=>{
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
    details(row) {
        this.setState({
            saleId: row.id,
            visible: true,
            msg: '详情',
            handleData: [],

            flag: 3,
            isShow: false,
            providerName: '',
            providerId: '',
            dateStrings: row.deliveryDate,
            deptId: row.deptId,
            isProviderValue: false,
            isSupplierId: false,
            orderCode: row.code,
            providerValue: row.supplierName,  // 供应商
            supplierId: row.salesman,    // 业务员
            zhidan: row.createdName,
            riqi: row.createdTime,
            shenhe: row.auditName,
            shenheriqi: row.auditTime
        });
        this.row = [];
        this.levelStart();
        this.deptMethod();
        this.materialCodeMethod();
        this.providerList();
        //   内层表格作为回显用的
        this.detailById(row);
    }

    /**
     * 详情数据
     * @param id
     */
    initDetail(id) {
        Axios.post('/self/erp/purchaseOrder/queryPurchaseOrderById', {id}).then((res)=>{
            if(res.data.success) {
                let obj = res.data.data.purchaseOrder;
                obj.orderStandardVarietyLevels.forEach((item)=>{
                    item.key = item.id;
                })
                this.setState({
                    pageTotal1: obj.orderStandardVarietyLevels.length
                })
            }else{
                this.setState({
                    pageTotal1: 0
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
            code: this.state.orderCode,
            supplierName: this.state.providerName,
            supplierId: this.state.isProviderValue?this.state.providerId:"",
            empno: this.state.isSupplierId?this.state.supplierId:"",
            deliveryDate: this.state.dateStrings,
            deptId: this.state.deptId,
            purchaseOrderItems: newParams
        }
        if(this.state.flag == 1) {
            Axios.post('/self/erp/purchaseOrder/addPurchaseOrder', params).then((res)=>{
                if(res.data.success) {
                    message.success("操作成功");
                    this.initData(this.state.currentPage);
                    this.setState({
                        isShow: false,
                        visible: false
                    })
                }else{
                    message.warning(res.data.message);
                    this.setState({
                        isShow: true
                    })
                }
            })
        }else if(this.state.flag == 2) {
            params.id = this.state.saleId;
            Axios.post('/self/erp/purchaseOrder/updatePurchaseOrder', params).then((res)=>{
                if(res.data.success) {
                    message.success("操作成功");
                    this.initData(this.state.currentPage);
                    this.setState({
                        isShow: false,
                        visible: false
                    })
                }else{
                    message.warning(res.data.message);
                    this.setState({
                        isShow: true
                    })
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
    // 模态框里面的表格-复选框
    changeTableSelstor(selectedRowKeys, selectedRows) {
        this.setState({
            handleData: selectedRowKeys,
            selectedRows
        })
    }
    // 模态框表格数据
    modalTableList1(id) {
        this.setState({
            id
        });
        let params = {
            supplierId: id,
            currentPage: this.state.currentPage1,
            pageSize: this.state.pageSize1
        };
        Axios.post('/self/erp/purchaseOrder/queryRandomCheckSheet', params).then((res)=>{
            if(res.data.success) {
                if(res.data.data.randomCheckSheets && res.data.data.randomCheckSheets.length) {
                    res.data.data.randomCheckSheets.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                this.setState({
                    pageTotal1: res.data.data.num
                });
            }else{
                this.setState({
                    pageTotal1: 0
                })
            }
        })
    }
    // 采购单编码
    purchaseOrderCode() {
        Axios.post('/self/erp/purchaseOrder/generatePurchaseOrderCode').then((res)=>{
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
    }
    // 供应商下拉框
    banList(id) {
        Axios.post('/self/erp/dept/queryDeptUsers', {deptId: id}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    supplierList: res.data.data.userList
                })
            }else{
                this.setState({
                    supplierList: []
                })
            }
        })
    }
    dateTime(date, dateString) {
        console.log(date);
        console.log(dateString);
        if(dateString[0]) {
            this.setState({
                startTime: dateString[0],
                endTime: dateString[1]
            })
        }else{
            this.setState({
                startTime: "",
                endTime: ""
            })
        }
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
}
export default PurchaseOrder;
