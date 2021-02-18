import React, {Component} from 'react';
import {Input, Select, Table, Space, Pagination, Modal,DatePicker,Button,InputNumber,Cascader,message} from 'antd';
import Axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './production.scss';
const {Column} = Table;
const {Option} = Select; const { RangePicker } = DatePicker;
class Production extends Component{
    constructor(props) {
        super(props);
        this.downLoadBtn = "";  this.addBtn = "";  this.changeBtn = "";
        this.state = {
            taskCode: '',
            dataSource: [],  currentPage: 1,   pageSize: 10,  pageTotle: 0,
            msg: '',  flag: 0,
            visible: false,

            taskCodeModal: false,
            orderId: '',    orderIdList: [],
            workshop: [],
            qualityPeople: '',   qualityPeopleList: [],
            dataTime: [],
            modals: [],
            id: '',
            selectedRowKeys: [],
            workshopList: []
        }
    }
    render() {
        return(
            <div id="production">
                <div className="production">
                    <div className="placeSearch">
                        <span className="span1">任务编号</span>
                        <Input className="input1" allowClear onChange={(e)=>{this.setState({taskCode: e.target.value})}}/>
                        <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                    </div>
                    <div className="bg">
                        <button className="searchs" onClick={this.add.bind(this)}
                            style={this.addBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >新增</button>
                        <button className="searchs searchs1" onClick={this.donload.bind(this)}
                                style={this.downLoadBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >导出</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                            )}/>
                            <Column title="任务名称" dataIndex="taskName" key="taskName" align="center"/>
                            <Column title="负责人姓名" dataIndex="checkmanName" key="checkmanName" align="center"/>
                            <Column title="车间" dataIndex="workroomName" key="workroomName" align="center"/>
                            <Column title="开始时间" dataIndex="startTime" key="startTime" align="center"/>
                            <Column title="结束时间" dataIndex="entTime" key="entTime" align="center"/>
                            <Column title="状态" dataIndex="status" key="status" align="center" render={(text)=>(
                                <div>
                                    <span>{text==0?"待取料" : text==1?"生产中":text==2?"完成":""}</span>
                                </div>
                            )}/>
                            <Column title="操作" align="center" key="records" dataIndex="records"
                                render={(text, record) => (
                                    <Space size="large">
                                        <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes"
                                              style={this.changeBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                                        >编辑</span>
                                        <span key={"details"} onClick={this.details.bind(this, record)} className="details span11">详情</span>
                                        {/*<span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes">删除</span>*/}
                                        {/*<span key={"check"} onClick={this.check.bind(this, record)} className="check">审核</span>*/}
                                    </Space>
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
                                        <Input allowClear disabled value={this.state.taskCodeModal} className={"input3"}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*销售订单</span>
                                        <Select value={this.state.orderId} className="input3" style={{width: '60%'}} onChange={(e)=>{
                                            this.setState({orderId: e});
                                            this.modalTableData(e)
                                        } } disabled={this.state.flag==1?false: true}>
                                            {
                                                this.state.orderIdList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.id} key={index}>{item.orderName}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1">
                                        <span className="span1">*车间</span>
                                        <Select className="input3" disabled={this.state.flag==1?false: true} value={this.state.workshop} style={{width: '100%'}} onChange={(e)=>{this.setState({workshop: e})}}>
                                            {
                                                this.state.workshopList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.id} key={index}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*质检人</span>
                                        <Select value={this.state.qualityPeople} style={{width: '100%'}} onChange={(e)=>{this.setState({qualityPeople: e})}} className={"input3"}
                                                disabled={this.state.flag==3?true:false}>
                                            {
                                                this.state.qualityPeopleList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.empno} key={index}>{item.realname}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                </ul>
                                <ul className="ul1">
                                    <li className="li1 li3">
                                        <span className="span1">*工期</span>
                                        <RangePicker className="input3" onChange={(d1,d2)=>{this.setState({dataTime:d2})}}
                                                     value={this.state.dataTime!=''&&this.state.dataTime!=null&&this.state.dataTime!=undefined?
                                                     [moment(this.state.dataTime[0], "YYYY-MM-DD"), moment(this.state.dataTime[1],"YYYY-MM-DD")]: []}
                                                     locale={locale} allowClear={false}
                                                     disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                            </div>
                            <div className="rawMaterial">
                                <div className="placeChangeTable">
                                    <Table pagination={false} dataSource={this.state.modalData}
                                        rowSelection={{
                                             type: "checkbox",
                                             onChange: this.changeTableSelstor.bind(this),
                                             selectedRowKeys: this.state.selectedRowKeys,
                                             getCheckboxProps: (record)=>({
                                                 disabled: this.state.flag==3?true:false
                                             })
                                        }}>
                                        <Column title="成品名称" dataIndex="productName" key="productName" align="center"/>
                                        <Column title="任务量" dataIndex="purchaseNum" key="purchaseNum" align="center" render={(text, record)=>(
                                            <div>
                                                <InputNumber disabled={this.state.flag==3?true:false} min={0} style={{width: '60%'}} value={text} onChange={(e)=>{
                                                    if(this.state.modalData && this.state.modalData.length) {
                                                        this.state.modalData.forEach((item)=>{
                                                            if(item.key == record.key) {
                                                                item.purchaseNum = e;
                                                                this.setState({
                                                                    purchaseNum: e
                                                                })
                                                            }
                                                        })
                                                    }
                                                }}/>{record.measurement}
                                            </div>
                                        )}/>
                                        {
                                            this.isColumn()
                                        }
                                    </Table>
                                </div>
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
                </div>
            </div>
        )
    }
    componentWillMount() {
        let buttonList = JSON.parse(sessionStorage.getItem("buttonList"));
        console.log(buttonList);
        if(buttonList && buttonList.length) {
            buttonList.forEach((item)=>{
                if(item.localIndex == "5-1-1") {
                    this.addBtn = item.flag;
                }
                if(item.localIndex == "5-1-2") {
                    this.changeBtn = item.flag;
                }
                if(item.localIndex == "5-1-3") {
                    this.downLoadBtn = item.flag;
                }
            })
        }
    }

    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,
            taskCode: this.state.taskCode
        };
        Axios.post('/self/erp/productTask/queryProductTask', params).then((res)=>{
            if(res.data.success) {
                res.data.data.productTasks.forEach((item)=>{
                    item.key = item.id;
                });
                this.setState({
                    dataSource: res.data.data.productTasks,
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
    isColumn() {
        if(this.state.flag == 3) {
            return(
                <Column title="已生产" dataIndex="productedNum" key="productedNum" align="center" render={(text, record)=>(
                    <span>{text} {record.measurement}</span>
                )}/>
            )
        }
    }
    searchMethods() {
        this.initData(1);
        this.setState({
            currentPage: 1
        })
    }
    changePages(val) {
        this.initData(val);
        this.setState({
            currentPage: val
        })
    }
    donload() {

    }
    add() {
        this.taskCodeMethods();
        this.setState({
            visible: true,
            flag: 1,
            msg: '新增',
            orderId: '',
            workshop: [],
            qualityPeople: '',
            dataTime: [],
            modalData: []
        })
    }
    changes(row) {
        this.setState({
            visible: true,
            flag: 0,
            msg: '修改',
            id: row.id,
            taskCodeModal: row.taskCode,
            orderId: ''+row.orderId,
        });
        this.detailsXi(row);
    }
    detailsXi(row) {
        Axios.post('/self/erp/productTask/queryProductTaskById', {id: row.id}).then((res)=>{
            // console.log(row);
            if(res.data.success) {
                let object = res.data.data.productTask;
                this.setState({
                    workshop: object.workroomId,
                    qualityPeople:object.checkman,
                    dataTime:[object.startTime, object.entTime],
                });
                Axios.post('/self/erp/productTask/queryProductInfoByOrderId', {orderId: row.orderId}).then((res)=>{
                    if(res.data.success) {
                        let selectedRowKeys = [];
                        if(object.taskProducts && object.taskProducts.length){
                            object.taskProducts.forEach((item)=>{
                                if(res.data.data.products && res.data.data.products.length) {
                                    res.data.data.products.forEach((innerItem)=>{
                                        if(innerItem.productName == item.productName) {
                                            innerItem.purchaseNum = item.taskLoad;
                                            selectedRowKeys.push(innerItem.key);
                                        }
                                    })
                                }
                            })
                        }
                        this.setState({
                            modalData: res.data.data.products,
                            selectedRowKeys
                        })
                    }else{
                        this.setState({
                            modalData: []
                        })
                    }
                })
            }else{

            }
        })
    }
    details(row) {
        this.setState({
            visible: true,
            flag: 3,
            msg: '详情',
            id: row.id,
            taskCodeModal: row.taskCode,
            orderId: ''+row.orderId,
        });
        this.detailsXi(row);
    }
    // deletes(row) {
    //     let that = this;
    //     confirm({
    //         title: '你确定要删除吗?',
    //         icon: <ExclamationCircleOutlined />,
    //         content: '',
    //         onOk() {
    //             let params = {
    //                 id: row.id
    //             };
    //             Axios.post('/self/erp/qualityCheck/deleteCheckSheet', params).then((res)=>{
    //                 if(res.data.success) {
    //                     message.success("删除成功");
    //                     that.initData(that.state.currentPage);
    //                 }else{
    //                     message.warning(res.data.message);
    //                 }
    //             })
    //         },
    //         onCancel() {},
    //     });
    // }
    handleOk() {
        let arr = [];
        if(this.state.selectedRowKeys && this.state.selectedRowKeys.length) {
            this.state.selectedRowKeys.forEach((outItem)=>{
                if(this.state.modalData && this.state.modalData.length) {
                    this.state.modalData.forEach((innerItem)=>{
                        if(outItem == innerItem.key) {
                            arr.push({
                                orderProductInfoId:innerItem.id ,
                                orderId:innerItem.orderId,
                                productId:innerItem.productId,
                                productName:innerItem.productName,
                                totalPurchaseNum:innerItem.totalPurchaseNum,
                                taskLoad:innerItem.purchaseNum,
                                ramainingDeliveryNum:innerItem.ramainingDeliveryNum,
                                key:innerItem.key
                            })
                        }
                    })
                }
            })
        }
        let params = {
            taskCode: this.state.taskCodeModal,
            orderId: this.state.orderId,
            workroomId: this.state.workshop.length==undefined?this.state.workshop:"",
            checkman: this.state.qualityPeople,
            startTime: this.state.dataTime[0],
            endTime: this.state.dataTime[1],
            taskProducts: arr
        };
        if(this.state.flag == 1) {  // 新增
            Axios.post('/self/erp/productTask/addProductTask', params).then((res)=>{
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
        }else{
            params.id = this.state.id;
            Axios.post('/self/erp/productTask/updateProductTask', params).then((res)=>{
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
    // 模态框里面的下拉框里面的表格数据
    modalTableData(orderId) {
        Axios.post('/self/erp/productTask/queryProductInfoByOrderId', {orderId}).then((res)=>{
            if(res.data.success) {
                if(res.data.data.products && res.data.data.products.length) {
                    res.data.data.products.forEach((item)=>{
                        item.key = item.id;
                    })
                }
                this.setState({
                    modalData: res.data.data.products
                })
            }else{
                this.setState({
                    modalData: []
                })
            }
        })
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
        this.orderLIstMethods();
        this.carList();
        this.checkeMan();
    }
    // 任务编码
    taskCodeMethods() {
        Axios.post('/self/erp/productTask/generateTaskCode').then((res)=>{
            if(res.data.success) {
                this.setState({
                    taskCodeModal: res.data.data
                })
            }else{
                this.setState({
                    taskCodeModal: ''
                })
            }
        })
    }
    // 订单编号下拉列表
    orderLIstMethods() {
        Axios.post('/self/erp/productTask/querySalesOrders').then((res)=>{
            if(res.data.success) {
                this.setState({
                    orderIdList: res.data.data.salesOrders
                })
            }else{
                this.setState({
                    orderIdList: []
                })
            }
        })
    }
    carList() {   // 车间下拉框
        Axios.post('/self/erp/productTask/queryWorkroom').then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                this.setState({
                    workshopList: res.data.data.workrooms
                })
            }else{
                this.setState({
                    workshopList: []
                })
            }
        })
    }
    // 质检人
    checkeMan() {
        Axios.post('/self/erp/productTask/queryCheckman').then((res)=>{
            //console.log(res.data); // checkman
            if(res.data.success) {
                this.setState({
                    qualityPeopleList: res.data.data.checkman
                })
            }else{
                this.setState({
                    qualityPeopleList: []
                })
            }
        })
    }
    changeTableSelstor(item1, item2) {
         this.setState({
             modals: item2,
             selectedRowKeys: item1
         })
    }
}
export default Production;