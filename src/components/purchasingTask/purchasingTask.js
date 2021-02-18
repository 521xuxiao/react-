import React, { Component } from 'react';
import Axios from 'axios';
import './purchasingTask.scss';

import { Table, Input,Space, Button,message, Pagination , Modal, Select, InputNumber} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const {Column} = Table;
const {Option} = Select;
const { confirm } = Modal;
class PurchasingTask extends Component {
    constructor(props) {
        super(props);
        this.addBtn = "";  this.changeBtn= "";   this.finishBtn = "";   this.donloadBtn = "";
        this.state = {
            planCode: '',
            dataSource: [],
            currentPage: 1,
            pageSize: 10,
            pageTotle: 0,
            msg: '',
            visible: false,
            code: '',
            plancode: '',
            plancodeList: [],
            bowie: null,
            tietong: null,
            makeNameIdList: [],   makeNameId: '',
            modalData: [],
            flag: 0,
            innerList: [],
            selectedRowKeys: [],
            planID: ''
        };
    }
    render() {
        return (
            <div id="purchasingTask">
                <div className="purchasingTask">
                    <div className="placeSearch">
                        <span className="span1">任务编码</span>
                        <Input className="input1" allowClear onChange={(e)=>{this.setState({planCode: e.target.value})}}/>
                        <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                    </div>
                    <div className="bg">
                        <button className="searchs" onClick={this.add.bind(this)}
                            style={this.addBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >分配任务</button>
                        <button className="searchs searchs1" onClick={this.donload.bind(this)}
                            style={this.donloadBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >导出</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                            )}/>
                            <Column title="任务名称" dataIndex="taskName" key="taskName" align="center"/>
                            <Column title="代办" dataIndex="supplierName" key="supplierName" align="center"/>
                            <Column title="制单人" dataIndex="createdName" key="createdName" align="center"/>
                            <Column title="状态" dataIndex="status" key="status" align="center" render={(text)=>(
                                <>
                                    <span>{text==0?"未完成":"完成"}</span>
                                </>
                            )}/>
                            <Column title="修改时间" dataIndex="modifiedTime" key="modifiedTime" align="center"/>
                            <Column title="操作" align="center" key="records" dataIndex="records" width="220px"
                                render={(text, record) => (
                                    <>
                                        <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes span11"
                                              style={record.status==0 && this.changeBtn ==1 ? {display: "inlineBlock"}:{display: 'none'}}
                                        >编辑</span>
                                        <span key={"deletes"} onClick={this.finishes.bind(this, record)} className="deletes span11"
                                              style={record.status==0 && this.finishBtn ==1 ?{display: "inlineBlock"}:{display: 'none'}}
                                        >完成</span>
                                        <span key={"details"} onClick={this.details.bind(this, record)} className="details span11">详情</span>
                                    </>
                                )}
                            />
                        </Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={()=>`共 ${this.state.pageTotle} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotle} showSizeChanger={false}/>
                    </div>

                    <Modal title={this.state.msg} width="60%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                        <div className="modal1">
                            <div className="div3">
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*任务编码</span>
                                        <Input allowClear disabled value={this.state.code} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*计划编码</span>
                                        <Select  className={"input3"} disabled={this.state.flag==1?false:true} allowClear onChange={this.plancodeMethods.bind(this)} value={this.state.plancode}>
                                            {
                                                this.state.plancodeList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.id} key={index}>{item.planName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*木桶</span>
                                        <InputNumber allowClear min={0} onChange={(e)=>{this.setState({bowie: e})}} value={this.state.bowie} className={"input3"}
                                                     disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*铁桶</span>
                                        <InputNumber allowClear min={0} onChange={(e)=>{this.setState({tietong: e})}} value={this.state.tietong} className={"input3"}
                                                     disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*代办人</span>
                                        <Select disabled={this.state.flag==1?false:true} className={"input3"} allowClear onChange={(e)=>{this.setState({makeNameId: e})}} value={this.state.makeNameId}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } showSearch>
                                            {
                                                this.state.makeNameIdList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.id} key={index}>{item.supplierName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <div className="placeChangeTable">
                                    <Table pagination={false} dataSource={this.state.modalData} rowSelection={{
                                         type: "checkbox",
                                         selectedRowKeys: this.state.selectedRowKeys,
                                         onChange: this.changeTableSelstor.bind(this),
                                         getCheckboxProps: ()=>(
                                             {disabled: this.state.flag==3?true:false}
                                         )
                                    }}>
                                        <Column title="原料规格" dataIndex="standard" key="standard" align="center"/>
                                        <Column title="原料等级" dataIndex="level" key="level" align="center"/>
                                        <Column title="采购量" dataIndex="weight" key="weight" align="center" render={(text, record)=>(
                                            <div>
                                                <InputNumber min={0} style={{width: '60%'}} value={text} onChange={(e)=>{
                                                    if(this.state.modalData && this.state.modalData.length) {
                                                        this.state.modalData.forEach((item)=>{
                                                            if(item.id == record.id) {
                                                                item.weight = e;
                                                                this.setState({
                                                                    weight: e
                                                                })
                                                            }
                                                        })
                                                    }
                                                }} disabled={this.state.flag==3?true:false}/>kg
                                            </div>
                                        )}/>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className="div4">
                            <li className="li4">
                                <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>取消</Button>
                            </li>
                            <li className="li4" style={this.state.flag==3?{display: 'none'}:{display: 'block'}}>
                                <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)} >确定</Button>
                            </li>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            taskCode: this.state.planCode
        };
        Axios.post('/self/erp/purchaseTask/queryPurchaseTask', params).then((res)=>{
            if(res.data.success) {
                res.data.data.purchaseTasks.forEach((item)=>{
                    item.key = item.id;
                });
                this.setState({
                    dataSource: res.data.data.purchaseTasks,
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
        this.initData(1);
        this.setState({
            currentPage: 1
        })
    }
    plancodeMethods(e) {
        this.setState({
            plancode: e
        });
        if(e != undefined) {
            this.modalTableList(e);
        }
    }
    // 模态框里面的table数据
    modalTableList(planId) {
        let params = {
            planId
        };
        Axios.post('/self/erp/purchaseTask/queryPlanMaterialsByPlanId', params).then((res)=>{
            if(res.data.success) {
                if(res.data.data.materials && res.data.data.materials.length) {
                    res.data.data.materials.forEach((item)=>{
                        item.key = item.id
                    })
                }
                this.setState({
                    modalData: res.data.data.materials
                })
            }else{
                this.setState({
                    modalData: []
                })
            }
        })
    }
    add() {
        this.setState({
            visible: true,
            msg: '分配任务',
            flag: 1,
            code: '',
            plancode: '',
            bowie: '',
            tietong: '',
            makeNameId: '',
            modalData: [],
        });
        this.renwuCode();
        this.planmodl();
    }
    changes(row) {  // 表格编辑
        this.setState({
            flag: 0,
            visible: true,
            msg: '修改任务',
            code: row.taskCode,
            plancode: row.planCode,
            bowie: row.woodBucketNo,
            tietong: row.ironBucketNo,
            makeNameId: row.supplierId,
            planID: row.id
            // selectedRowKey
        });
        this.planmodl();
        this.modalChecked(row.id);
    }
    details(row) {
        this.setState({
            flag: 3,
            visible: true,
            msg: '详情',
            code: row.taskCode,
            plancode: row.planCode,
            bowie: row.woodBucketNo,
            tietong: row.ironBucketNo,
            makeNameId: row.supplierId,
            planID: row.id
            // selectedRowKey
        });
        this.planmodl();
        this.modalChecked(row.id);
    }
    // 模态框里面的表格 复选矿的回显默认打钩和列表数据
    modalChecked(id) {
        Axios.post('/self/erp/purchaseTask/queryPurchaseTaskById', {id}).then((res)=>{
            if(res.data.success) {
                this.setState({
                    selectedRowKeys: [],
                    modalData: []
                });
                let arr = [];
                if(res.data.data.purchaseTask.planRawMaterials && res.data.data.purchaseTask.planRawMaterials.length) { // 修改渲染表格
                    res.data.data.purchaseTask.planRawMaterials.forEach((outItem)=>{
                        outItem.key = outItem.id;
                        if(res.data.data.purchaseTask.taskRawMaterials && res.data.data.purchaseTask.taskRawMaterials.length) { // 回显默认打钩
                            res.data.data.purchaseTask.taskRawMaterials.forEach((item)=>{
                                if(outItem.id == item.planMaterialId) {
                                    outItem.weight = item.weight;
                                    arr.push(item.planMaterialId);
                                }
                            })
                        }
                    })
                }

                this.setState({
                    selectedRowKeys: arr,
                    modalData: res.data.data.purchaseTask.planRawMaterials
                });
            }else{
                this.setState({
                    selectedRowKeys: [],
                    modalData: []
                });
            }
        })
    }
    finishes(row) {  // 表格完成
        let that = this;
        confirm({
            title: '你确定要继续吗?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                let params = {
                    id: row.id
                };
                Axios.post('/self/erp/purchaseTask/completePurchaseTask', params).then((res)=>{
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
    changePages(val) {  // 分页
        this.setState({
            currentPage: val
        });
        this.initData(val);
    }
    donload() {

    }

    // 模态框
    // 任务编码
    renwuCode() {
        Axios.post("/self/erp/purchaseTask/generateTaskCode").then((res)=>{
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
    // 计划编码下拉框和代办人下拉框
    planmodl() {
        Axios.post("/self/erp/purchaseTask/queryPurchasePlans").then((res)=>{
            if(res.data.success) {
                this.setState({
                    plancodeList: res.data.data.purchasePlans
                })
            }else{
                this.setState({
                    plancodeList: []
                })
            }
        });
        Axios.post('/self/erp/purchaseTask/querySupplier').then((res)=>{
            if(res.data.success) {
                this.setState({
                    makeNameIdList: res.data.data.suppliers
                })
            }else{
                this.setState({
                    makeNameIdList: []
                })
            }
        })
    }
    handleOk() {
        let arr = [];
        if(this.state.selectedRowKeys && this.state.selectedRowKeys.length) {
            this.state.selectedRowKeys.forEach((outItem)=>{
                if(this.state.modalData && this.state.modalData.length) {
                    this.state.modalData.forEach((innerItem)=>{
                        if(outItem == innerItem.id) {
                            arr.push({planMaterialId: innerItem.id, id:innerItem.id, key:innerItem.key,standardId: innerItem.standardId,levelId:innerItem.levelId,
                                standard: innerItem.standard,level:innerItem.level,weight:innerItem.weight});
                        }
                    })
                }
            })
        }
        console.log(this.state.modalData);
        // return false;
        if(this.state.flag == 1) {  // 新增
            let params = {
                taskCode: this.state.code,
                supplierId: this.state.makeNameId,
                planId: this.state.plancode,
                woodBucketNo: this.state.bowie,
                ironBucketNo: this.state.tietong,
                rawMaterials: arr
            };
            Axios.post('/self/erp/purchaseTask/addPurchaseTask', params).then((res)=>{
                if(res.data.success) {
                    this.initData(this.state.currentPage);
                    message.success("成功");
                    this.setState({
                        visible: false
                    })
                }else{
                    message.warning(res.data.message);
                }
            })
        }else{ // 修改
            let params = {
                id: this.state.planID,
                woodBucketNo: this.state.bowie,
                ironBucketNo: this.state.tietong,
                rawMaterials: arr
            };
            Axios.post('/self/erp/purchaseTask/updatePurchaseTask', params).then((res)=>{
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
    // 模态框表格里面的复选框
    changeTableSelstor(selectedRowKeys, selectedRows) {
        this.setState({
            innerList: [...selectedRows],
            selectedRowKeys
        })
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
    componentWillMount() {
        let buttonList = JSON.parse(sessionStorage.getItem("buttonList"));
        // console.log(buttonList);
        if(buttonList && buttonList.length) {
            buttonList.forEach((item)=>{
                if(item.localIndex == "1-2-1") {
                    this.addBtn = item.flag;
                }
                if(item.localIndex == "1-2-2") {
                    this.changeBtn = item.flag;
                }
                if(item.localIndex == "1-2-3") {
                    this.finishBtn = item.flag;
                }
                if(item.localIndex == "1-2-4") {
                    this.donloadBtn = item.flag;
                }
            })
        }
    }
}
export default PurchasingTask;
