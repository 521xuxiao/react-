import React, {Component} from 'react';
import {Input, Select, Table, Space, Pagination, Modal, InputNumber, Button, DatePicker, Upload, message, Switch, TreeSelect} from 'antd';
import { ExclamationCircleOutlined ,UploadOutlined} from '@ant-design/icons';
import Axios from 'axios';
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './salesInvoice.scss';
const {Option} = Select;
const {Column} = Table;
const {TextArea} = Input;
const { confirm } = Modal;
class SalesInvoice extends Component{
    constructor(props) {
        super(props);
        this.pic = [];
        this.state = {
            dataSource: [],
            currentPage: 1,
            pageSize: 10,
            pageTotle: 0,
            msg: '', flag: 1,  visible:false,
            marketList: [],  market: '',
            obj: {},
            dateTime: '',
            deliveryAddress: '',
            picPaths: [],
            selectedRowKeys: [],
            /////////////////////////////////////  查询 ////////////////////////////////////////
            providerList: [],   placeProvider: '',
            placeCode: '',
            placeCreateName: '',   placeCreateNameList: [],
            placeCheckStatusList: [],   placeCheckStatus: '',
            placeBill: '',    placeBillList: [],
            //////////////////////////////  模态框里面的数据     //////////////////////////////////////////
            code: '',                  //编码
            deliveryDate: '',          // 日期
            registrationCode: '',      // 果园号
            batchNumber: '',           // 批次号
            salesTypeId: '',  salesTypeIdList: [],   // 销售方式
            clientId: '',     clientIdList: [],      // 购货单位
            modalData: [],             // 表格数据
            materialCodeList: [],      // 产品编码下拉框
            turnoverTypeList: [],      // 周转物类型
            packagingLayoutList: [],   // 包装版面
            deliveryWarehouseIdList: [],// 发货仓库
            deliveryLocationIdList: [], deliveryLocationId: '',    // 交货地点
            destination: '',        // 目的港
            collectionDate: '',     // 收款日期
            contractNumber: '',     // 合同号
            invoiceNo: '',          // 发票号
            customsNo: '',          // 报关单号
            voyageInfo: '',         // 航名/航次
            sourceSheetType: null, sourceSheetTypeList: [{value: '无', valueId:''}, {value: '销售订单', valueId:'xsdd'}],   // 原单类型
            containerNo: '',    // 柜号
            ladingNo: '',       // 提单号
            sealNo: '',         // 铅封号
            carNo: '',          // 车号
            deliveryEmpnoList: [],  deliveryEmpno: '',    // 发货
            empno: '',   empnoList: [],                   // 业务员
            createName: '',            // 制单人
            check: '',    // 审核
            checkTime: '',  // 审核日期
            tally: '',     // 记账
            keeperEmpno: '', keeperEmpnoList: [],   // 保管
            deptId: '',    deptIdList: [],          // 部门
            liList: ["篮字", "红字"],
            current: 0,
            id: ''
        }
    }
    render() {
        return(
            <div id="salesInvoice">
                <div className="salesInvoice">
                    <div className="placeSearch">
                        <span className="span1">供应商</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({placeProvider: e})}}>
                            {
                                this.state.providerList.map((item)=>{
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>

                        <span className="span1 span2">编码</span>
                        <Input className="input1" allowClear onChange={(e)=>{this.setState({placeCode: e.target.value})}}/>

                        <span className="span1 span2">制单</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({placeCreateName: e})}}>
                            {
                                this.state.placeCreateNameList.map((item)=>{
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>

                        <span className="span1 span2">审核状态</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({placeCheckStatus: e})}}>
                            {
                                this.state.placeCheckStatusList.map((item)=>{
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>

                        <span className="span1 span2">发票</span>
                        <Select allowClear className="input1" onChange={(e)=>{this.setState({placeBill: e})}}>
                            {
                                this.state.placeBillList.map((item)=>{
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
                        <button className="searchs searchs2" onClick={this.allAdd.bind(this)}>批量生成发票</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource} rowSelection={{
                            type: "checkbox",
                            selectedRowKeys: this.state.selectedRowKeys,
                            onChange: this.changeTableSelstor.bind(this),
                        }}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                            )}/>
                            <Column title="时间" dataIndex="deliveryDate" key="deliveryDate" align="center"/>
                            <Column title="供应单位" dataIndex="clientName" key="clientName" align="center"/>
                            <Column title="出库编码" dataIndex="code" key="code" align="center"/>
                            <Column title="实发数量" dataIndex="number" key="number" align="center"/>
                            <Column title="金额" dataIndex="totalPrice" key="totalPrice" align="center" render={(text)=>(
                                <span>{text/100}</span>
                            )}/>
                            <Column title="业务员" dataIndex="empno" key="empno" align="center"/>
                            <Column title="审核状态" dataIndex="auditStatus" key="auditStatus" align="center" render={(text)=>(
                                <span>{text==0?"未审核":"已审核"}</span>
                            )}/>
                            <Column title="发票" dataIndex="invoiceNo" key="invoiceNo" align="center"/>

                            <Column title="操作" align="center" key="records" dataIndex="records"
                                render={(text, record) => (
                                    <Space size="large">
                                        <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes">编辑</span>
                                        <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes">删除</span>
                                        {record.auditStatus==0?(
                                            <span key={"details"} onClick={this.check.bind(this, record)} className="details span11">审核</span>
                                        ):(
                                            <span key={"details"} onClick={this.notCheck.bind(this, record)} className="details span11">反审核</span>
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
                        <div className="modal9">
                            <ol className="salesInvoiceOl">
                                {this.state.liList.map((item, index)=>{
                                    return(
                                        <li key={index} onClick={()=>{this.setState({current: index})}}
                                        className={this.state.current==index?"active salesInvoiceLi":"salesInvoiceLi"}>{item}</li>
                                    )
                                })}
                            </ol>
                        </div>
                        <div className="modal1">
                            <ul className="salesInvoiceUl">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">编码</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.code} disabled/>
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
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">果园号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.registrationCode} onChange={(e)=>{
                                            this.setState({registrationCode: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">批次号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.batchNumber} onChange={(e)=>{
                                            this.setState({batchNumber: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">销售方式</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.salesTypeId}
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
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">购货单位</span>
                                    <div className="salesInvoiceDiv1">
                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            value={this.state.clientId}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.clientIdList}
                                            placeholder=""
                                            treeDefaultExpandAll
                                            onChange={(e, note)=>{
                                                this.setState({clientId: e})
                                            }}
                                            disabled={this.state.flag==3?true:false}
                                        />
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">交货地点</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.deliveryLocationId}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({deliveryLocationId: e})}}>
                                            {this.state.deliveryLocationIdList.map((item)=>{
                                                return(
                                                    <Option value={item.valueId} key={item.valueId}>{item.value}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">目的港</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.destination} onChange={(e)=>{
                                            this.setState({destination: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">收款日期</span>
                                    <div className="salesInvoiceDiv1">
                                        <DatePicker style={{width: '100%'}} onChange={(e, time)=>{
                                            this.setState({collectionDate: time})
                                        }}
                                        value={this.state.collectionDate==undefined || this.state.collectionDate=='' ?"":moment(this.state.collectionDate, 'YYYY-MM-DD')} locale={locale}
                                        disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">合同号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.contractNumber} onChange={(e)=>{
                                            this.setState({contractNumber: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">发票号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.invoiceNo} onChange={(e)=>{
                                            this.setState({invoiceNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">报关单号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.customsNo} onChange={(e)=>{
                                            this.setState({customsNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">船名/航次</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.voyageInfo} onChange={(e)=>{
                                            this.setState({voyageInfo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">源单类型</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.sourceSheetType}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({sourceSheetType: e})}}>
                                            {this.state.sourceSheetTypeList.map((item)=>{
                                                return(
                                                    <Option value={item.valueId} key={item.valueId}>{item.value}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">发货仓库</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.deliveryWarehouseId}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{
                                                    this.state.modalData.forEach((item)=>{
                                                        item.deliveryWarehouseId =  e;
                                                    })
                                                    this.setState({
                                                        deliveryWarehouseId: e,
                                                        modalData: this.state.modalData
                                                    })}
                                                }
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } showSearch>
                                            {this.state.deliveryWarehouseIdList.map((item)=>{
                                                return(
                                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">柜号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.containerNo} onChange={(e)=>{
                                            this.setState({containerNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">提单号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.ladingNo} onChange={(e)=>{
                                            this.setState({ladingNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">铅封号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.sealNo} onChange={(e)=>{
                                            this.setState({sealNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                            </ul>
                            <ul className="salesInvoiceUl salesInvoiceUl1">
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">车号</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.carNo} onChange={(e)=>{
                                            this.setState({carNo: e.target.value})
                                        }} disabled={this.state.flag==3?true:false}/>
                                    </div>
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
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    } showSearch
                                                    disabled={this.state.flag==3?true:false}
                                                    onChange={(e)=>{
                                                        this.state.modalData.forEach((item)=>{
                                                            if(item.id == record.id) {
                                                                item.materialCode = e;
                                                                if(record.materialCode != undefined && record.materialCode.indexOf(",")!=-1) {
                                                                    item.materialName = item.materialCode.split(",")[1];
                                                                    item.measurement = item.materialCode.split(",")[2];
                                                                    item.stock = item.materialCode.split(",")[3];
                                                                    let str = item.materialCode.split(",")[4];
                                                                    item.baseInfoType = str == "material"?item.materialCode.split(",")[5]: str=="accessories"?item.materialCode.split(",")[6] :item.materialCode.split(",")[7];
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
                                                    }}>
                                                {this.state.materialCodeList.map((item)=>{
                                                    return(
                                                        <Option value={","+item.materialName+","+item.measurement+","+item.materialCode+","+item.baseInfoType+
                                                        ","+item.materialStandard+","+item.accessoriesStandard+","+item.productStandard} key={item.id}>
                                                            {item.materialCode+"  "+item.materialName}</Option>
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
                                            }}
                                                    disabled={this.state.flag==3?true:false}
                                                    filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch>
                                                {this.state.turnoverTypeList.map((item)=>{
                                                    return(
                                                        <Option value={item.materialCode} key={item.materialCode}>{item.materialName}</Option>
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
                                            }} filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch disabled={this.state.flag==3?true:false}>
                                                {this.state.packagingLayoutList.map((item)=>{
                                                    return(
                                                        <Option value={item.materialCode} key={item.id}>{item.materialName}</Option>
                                                    )
                                                })}
                                            </Select>
                                        </>
                                    )}/>
                                    <Column title="单位" dataIndex="measurement" key="measurement" align="center" width={100}/>
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
                                    <Column title="应发数量" dataIndex="deliveriableNumber" key="deliveriableNumber" align="center" width={200} render={(text, record)=>(
                                        <>
                                            <InputNumber value={text} disabled/>
                                        </>
                                    )}/>
                                    <Column title="实发数量" dataIndex="number" key="number" align="center" width={200} render={(text, record)=>(
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
                                    <Column title="销售单价" dataIndex="unitPrice" key="unitPrice" align="center" width={200} render={(text, record)=>(
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
                                    <Column width={200} title="发货仓库" dataIndex="deliveryWarehouseId" key="deliveryWarehouseId" align="center" render={(text, record)=>(
                                        <>
                                            <Select style={{width: '100%'}} value={text} onChange={(e)=>{
                                                this.state.modalData.forEach((item)=>{
                                                    if(item.id == record.id) {
                                                        item.deliveryWarehouseId = e;
                                                    }
                                                })
                                                this.setState({
                                                    modalData: this.state.modalData
                                                })
                                            }} filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch disabled={this.state.flag==3?true:false}>
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
                                    <Column title="规格型号" dataIndex="baseInfoType" key="baseInfoType" align="center" width={200}/>
                                    <Column title="开票数量" dataIndex="invoiceNumber" key="invoiceNumber" align="center" width={200}/>
                                    <Column title="单位成本" dataIndex="unitCost" key="unitCost" align="center" width={200}/>
                                    <Column title="成本" dataIndex="cost" key="cost" align="center" width={200}/>
                                    <Column title="源单单号" dataIndex="sourceSheetCode" key="sourceSheetCode" align="center" width={200} render={(text, record)=>(
                                        <>
                                            <Input value={text} onChange={(e)=>{
                                                this.state.modalData.forEach((item)=>{
                                                    if(item.id == record.id) {
                                                        item.sourceSheetCode = e.target.value;
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
                                    <span className="salesInvoiceSpan">发货</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.deliveryEmpno}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({deliveryEmpno: e})}}>
                                            {this.state.deliveryEmpnoList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">部门</span>
                                    <div className="salesInvoiceDiv1">
                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            value={this.state.deptId}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.deptIdList}
                                            placeholder=""
                                            treeDefaultExpandAll
                                            onChange={(e, note)=>{
                                                this.setState({deptId: e})
                                            }}
                                            disabled={this.state.flag==3?true:false}
                                        />
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">业务员</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.empno}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({empno: e})}}>
                                            {this.state.deliveryEmpnoList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
                                                )
                                            })}
                                        </Select>
                                    </div>
                                </li>
                            </ul>
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
                                    <span className="salesInvoiceSpan">记账</span>
                                    <div className="salesInvoiceDiv1">
                                        <Input allowClear value={this.state.tally} onChange={(e)=>{
                                            this.setState({tally: e.target.value})
                                        }} disabled/>
                                    </div>
                                </li>
                                <li className="salesInvoiceLi">
                                    <span className="salesInvoiceSpan">保管</span>
                                    <div className="salesInvoiceDiv1">
                                        <Select className="input3" style={{width: '100%'}} value={this.state.keeperEmpno}
                                                disabled={this.state.flag==3?true:false}
                                                onChange={(e)=>{this.setState({keeperEmpno: e})}}>
                                            {this.state.deliveryEmpnoList.map((item)=>{
                                                return(
                                                    <Option value={item.empno} key={item.id}>{item.realname}</Option>
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
            </div>
        )
    }
    initData(currentPage) {
        let param = {
            currentPage,
            pageSize: this.state.pageSize
        };
        Axios.post('/self/erp/salesDelivery/querySalesDeliveryOrder', param).then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                if(res.data.data.salesDeliveryOrders && res.data.data.salesDeliveryOrders.length) {
                    res.data.data.salesDeliveryOrders.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                this.setState({
                    dataSource: res.data.data.salesDeliveryOrders,
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
    searchMethods() {

    }
    add() {
        let id = new Date().getTime();
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let day = now.getDate();
        let deliveryDate = year+"-"+month+"-"+day;
        this.setState({
            visible: true,
            flag: 1,
            msg: '新增',
            market: '',
            dateTime: '',
            obj: {},
            deliveryAddress: '',
            modalData: [{id, key: id, boxNum: 0, bucketNum: 0}],

            deliveryLocationId: '',
            deliveryDate,
            clientId: '',
            salesTypeId: '',
            registrationCode: '',
            batchNumber: '',
            destination: '',
            collectionDate: '',
            contractNumber: '',
            invoiceNo: '',
            customsNo: '',
            voyageInfo: '',
            sourceSheetType: '',
            deliveryWarehouseId: '',
            containerNo: '',
            ladingNo: '',
            sealNo: '',
            carNo: '',
            empno: '',
            bookkeeperEmpno: '',
            keeperEmpno: '',
            deliveryEmpno: '',
            deptId: '',
            current: 0
        });
        this.newCode();
        this.selectDataList();
        this.pic = [];
    }

    /**
     * 新增表格数据
     */
    addModalData() {
        let str = new Date().getTime();
        let deliveryWarehouseId = "";
        if(this.state.deliveryWarehouseId) {
            deliveryWarehouseId = this.state.deliveryWarehouseId;
        }
        this.state.modalData.push({id: str, key: str, bucketNum: 0, boxNum: 0, deliveryWarehouseId});
        this.setState({
            modalData: [...this.state.modalData]
        })
    }

    /**
     * 减少表格的数据
     * @param row
     */
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

    /**
     * 批量生成发票
     * @param val
     */
    allAdd() {

    }
    changePages(val) {
        this.initData(val);
        this.setState({
            currentPage: val
        })
    }
    donload() {

    }
    changes(row) {
        this.setState({
            visible: true,
            flag: 2,
            msg: '修改',
            id: row.id
        })
        this.selectDataList();
        this.queryId(row);
    }
    queryId(row) {
        Axios.post("/self/erp/salesDelivery/querySalesDeliveryOrderById", {id: row.id}).then((res)=>{
            if(res.data.success) {
                console.log(res.data.data);
                let obj = res.data.data.salesDeliveryOrder;
                let modalData = [];
                obj.salesDeliveryOrderItems.forEach((item)=>{
                    modalData.push({
                        id: item.id,
                        key:item.id,
                        boxNum:item.boxNum,
                        bucketNum:item.bucketNum,
                        deliveriableNumber:item.deliveriableNumber,
                        deliveryWarehouseId:item.deliveryWarehouseId,
                        materialName:item.materialName,
                        measurement:item.measurement,
                        note:item.note,
                        number:item.number,
                        packagingLayout:item.packagingLayout,
                        salesDeliveryOrderId:item.salesDeliveryOrderId,
                        sourceSheetId:item.sourceSheetId,
                        totalPrice:item.totalPrice,
                        turnoverType:item.turnoverType,
                        unitNetWeight:item.unitNetWeight,
                        unitPrice:item.unitPrice,
                        baseInfoType: item.baseInfoType=="material"?item.materialStandard:item.baseInfoType=="accessories"?item.accessoriesStandard:item.productStandard,
                        invoiceNumber: item.invoiceNumber,
                        unitCost: item.unitCost,
                        cost: item.cost,
                        materialCode: ","+item.materialName+","+item.measurement+","+item.materialCode+","+item.baseInfoType+
                            ","+item.materialStandard+","+item.accessoriesStandard+","+item.productStandard
                    })
                })
                this.setState({
                    code: obj.code,
                    deliveryLocationId: obj.deliveryLocationId,
                    deliveryDate: obj.deliveryDate,
                    clientId: obj.clientId,
                    salesTypeId: obj.salesTypeId,
                    registrationCode: obj.registrationCode,
                    batchNumber: obj.batchNumber,
                    destination: obj.destination,
                    collectionDate: obj.collectionDate,
                    contractNumber: obj.contractNumber,
                    invoiceNo: obj.invoiceNo,
                    customsNo: obj.customsNo,
                    voyageInfo: obj.voyageInfo,
                    sourceSheetType: obj.sourceSheetType,
                    deliveryWarehouseId: obj.deliveryWarehouseId,
                    containerNo: obj.containerNo,
                    ladingNo: obj.ladingNo,
                    sealNo: obj.sealNo,
                    carNo: obj.carNo,
                    empno: obj.empno,
                    bookkeeperEmpno: '',
                    keeperEmpno: obj.keeperEmpno,
                    deliveryEmpno: obj.deliveryEmpno,
                    deptId: obj.deptId,
                    current: obj.redBlueMark=="red"?1:0,
                    createdName: obj.createdName,
                    check: obj.auditName,
                    checkTime: obj.auditTime,
                    tally: obj.bookkeeper,
                    modalData
                })
                // modalData: [{id, key: id}],


            }
        })
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
                Axios.post('/self/erp/salesDelivery/auditSalesDeliveryOrder', params).then((res)=>{
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
                Axios.post('/self/erp/salesDelivery/auditSalesDeliveryOrder', params).then((res)=>{
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
            visible: true,
            flag: 3,
            msg: '详情',
            id: row.id
        })
        this.selectDataList();
        this.queryId(row);
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
                Axios.post('/self/erp/salesDelivery/deleteSalesDeliveryOrder', params).then((res)=>{
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
    // 上传图片
    beforeUpload(file) {
        let formdata = new FormData();
        formdata.append("file",file);
        const config = {
            headers: { "Content-Type": "multipart/form-data" }
        };
        Axios.post('/self/erp/salesDelivery/uploadProductPicture', formdata, config).then((res)=>{
            if(res.data.success) {
                message.success("上传成功");
                this.pic.push(res.data.data.picture);
                this.setState({
                    picPaths: this.pic
                })
            }else{
                message.warning(res.data.message);
            }
        })
    }
    handleOk() {
        let salesDeliveryOrderItems = [];
        this.state.modalData.forEach((item)=>{
            salesDeliveryOrderItems.push({
                materialCode: item.materialCode!=undefined?item.materialCode.split(",")[3] :"",
                materialName: item.materialCode!=undefined?item.materialCode.split(",")[1] :"",
                turnoverType: item.turnoverType,
                packagingLayout: item.packagingLayout,
                boxNum: item.boxNum,
                bucketNum: item.bucketNum,
                measurement: item.measurement,
                baseInfoType: item.baseInfoType,
                number: item.number,
                deliveriableNumber: 0,
                totalPrice: Number(item.number) * Number(item.unitPrice),   // 金额,待算
                unitPrice: item.unitPrice,
                deliveryWarehouseId: item.deliveryWarehouseId,
                note: item.note,
                taxUnitPrice: this.state.note,
                sourceSheetCode: item.sourceSheetCode,
                sourceSheetId: "",
                invoiceNumber: "",
                unitCost: "",
                cost: ""
            })
        })
        let param = {
            code: this.state.code,
            deliveryLocationId: this.state.deliveryLocationId,
            deliveryDate: this.state.deliveryDate,
            clientId: this.state.clientId,
            salesTypeId: this.state.salesTypeId,
            registrationCode: this.state.registrationCode,
            batchNumber: this.state.batchNumber,
            destination: this.state.destination,
            collectionDate: this.state.collectionDate,
            contractNumber: this.state.contractNumber,
            invoiceNo: this.state.invoiceNo,
            customsNo: this.state.customsNo,
            voyageInfo: this.state.voyageInfo,
            sourceSheetType: this.state.sourceSheetType,
            deliveryWarehouseId: this.state.deliveryWarehouseId,
            containerNo: this.state.containerNo,
            ladingNo: this.state.ladingNo,
            sealNo: this.state.sealNo,
            carNo: this.state.carNo,
            empno: this.state.empno,
            bookkeeperEmpno: this.state.bookkeeperEmpno,
            keeperEmpno: this.state.keeperEmpno,
            deliveryEmpno: this.state.deliveryEmpno,
            deptId: this.state.deptId,
            redBlueMark: this.state.current==0? "blue":"red",
            salesDeliveryOrderItems,
            picPaths: []
        };
        if(this.state.flag == 1) {
            Axios.post('/self/erp/salesDelivery/addSalesDeliveryOrder', param).then((res)=>{
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
        }else if(this.state.flag == 2){
            param.id = this.state.id;
            Axios.post('/self/erp/salesDelivery/updateSalesDeliveryOrder', param).then((res)=>{
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
    componentDidMount() {
        this.initData(this.state.currentPage);
        this.scaleList();
    }
    // 销售单编码下拉框
    scaleList() {
        // Axios.post("/self/erp/salesDelivery/querySalesOrder").then((res)=>{
        //     // console.log(res.data.data);
        //     if(res.data.success) {
        //         this.setState({
        //             marketList: res.data.data.salesOrders
        //         })
        //     }else{
        //         this.setState({
        //             marketList: []
        //         })
        //     }
        // })
    }
    // 销售订单编码的详情展示
    marketDetail(id) {
        Axios.post('/self/erp/sales/querySalesOrderById', {id}).then((res)=>{
            if(res.data.success) {
                if(res.data.data.salesOrder.products && res.data.data.salesOrder.products.length) {
                    res.data.data.salesOrder.products.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                this.setState({
                    modalData: res.data.data.salesOrder.products,
                    obj: res.data.data.salesOrder
                })
            }else{
                this.setState({
                    obj: {},
                    modalData: []
                })
            }
        })
    }
    newCode() {
        Axios.post('/self/erp/salesDelivery/generateSalesDeliveryCode', {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    code: res.data.data
                })
            }else{
                this.setState({
                    code: ''
                })
            }
        })
    }

    /**
     * 查询下拉矿李阿敏的数据
     * @param selectedRowKeys
     * @param selectedRows
     */
    selectDataList() {
        Axios.post("/self/erp/baseinfo/queryDictTypeAndValue", {}).then((res)=>{
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
        })
        Axios.post("/self/erp/sales/queryClients", {}).then((res)=>{
            if(res.data.success) {
                this.again(res.data.data.clients);
            }else{
                this.setState({
                    clientIdList: []
                })
            }
        })
        Axios.post("/self/erp/baseinfo/queryWarehouseAreas", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    deliveryWarehouseIdList: res.data.data.warehouseAreas
                })
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
        Axios.post("/self/erp/dept/queryDept", {}).then((res)=>{
            if(res.data.success) {
                this.gain(res.data.data.deptList);
            }else{
                this.setState({
                    deptIdList: []
                })
            }
        })
        //产品编码下拉框
        Axios.post("/self/erp/baseinfo/queryMaterialInfoItems", {}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    materialCodeList: res.data.data.materialInfos,
                    turnoverTypeList: res.data.data.materialInfos,
                    packagingLayoutList: res.data.data.materialInfos
                })
            }else{
                this.setState({
                    materialCodeList: [],
                    turnoverTypeList: [],
                    packagingLayoutList: []
                })
            }
        })
    }
    gain(deptIdList) {
        deptIdList.forEach((item)=>{
            item.title = item.deptName;
            item.value = item.deptId;
            if(item.children != undefined) {
                this.gain(item.children);
            }
        })
        this.setState({
            deptIdList
        })
    }
    again(arr) {
        arr.forEach((item)=>{
            item.title = item.fullName;
            item.value = item.id;
            if(item.children!= undefined) {
                this.again(item.children);
            }
        })
        this.setState({
            clientIdList: arr
        })
    }
    // 表格复选
    changeTableSelstor(selectedRowKeys, selectedRows) {
        // console.log(selectedRowKeys);
        // console.log(selectedRows);
        this.setState({
            selectedRowKeys
        })
    }
}
export default SalesInvoice;