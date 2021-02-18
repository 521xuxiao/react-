import React, {Component} from 'react';
import {Input, Table, Space, Pagination, Modal, Button, Select, message} from 'antd';
import Axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './distributor.scss';
const {Column} = Table;   const {Option} = Select;   const {confirm} = Modal;
class Distributor extends Component{
    constructor(props) {
        super(props);
        this.addBtn = "";  this.changeBtn = "";  this.deleteBtn = "";
        this.state = {
            orchardName: '',
            dataSource: [],
            pageTotle: 0,
            currentPage: 1,
            pageSize: 10,
            msg: '',
            visible: false,
            flag: 1,
            fruitsName: '',
            concatName: '',
            concatPhone: '',
            fruitsAdress: '',
            fruitIdList: [],   fruitId: '',
            id: '',
            registrationNumber: ''
        }
    }
    render() {
        return(
            <div id="distributor">
                <div className="distributor">
                    {/*<div className="placeSearch">*/}
                    {/*    <span>果园名称</span>*/}
                    {/*    <Input className="input1" allowClear onChange={(e)=>{this.setState({orchardName: e.target.value})}}/>*/}
                    {/*    <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>*/}
                    {/*</div>*/}
                    <div className="bg">
                        <button className="searchs" onClick={this.add.bind(this)}
                            style={this.addBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                        >新增</button>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}>
                            <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize + index+1}</span>
                            )}/>
                            <Column title="果园名称" dataIndex="orchardName" key="orchardName" align="center"/>
                            <Column title="果园注册号" dataIndex="registrationCode" key="registrationCode" align="center"/>
                            <Column title="果园联系人" dataIndex="orchardContactMan" key="orchardContactMan" align="center"/>
                            <Column title="联系方式" dataIndex="orchardContactInfo" key="orchardContactInfo" align="center"/>
                            <Column title="果园类型" dataIndex="orchardType" key="orchardType" align="center"/>
                            <Column title="操作" align="center" key="records" dataIndex="records"
                                render={(text, record) => (
                                    <Space size="large">
                                        <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes"
                                              style={this.changeBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                                        >编辑</span>
                                        <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes"
                                              style={this.deleteBtn == 1 ? {display: 'inlineBlock'} : {display: "none"}}
                                        >删除</span>
                                        <span key={"details"} onClick={this.details.bind(this, record)} className="details span11">详情</span>
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
                                        <span className="span1">*果园名称</span>
                                        <Input allowClear onChange={(e)=>{this.setState({fruitsName: e.target.value})}} value={this.state.fruitsName} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*联系人名</span>
                                        <Input allowClear onChange={(e)=>{this.setState({concatName: e.target.value})}} value={this.state.concatName} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1 ul2">
                                    <li className="li1">
                                        <span className="span1">*联系方式</span>
                                        <Input allowClear onChange={(e)=>{this.setState({concatPhone: e.target.value})}} value={this.state.concatPhone} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*果园地址</span>
                                        <Input allowClear onChange={(e)=>{this.setState({fruitsAdress: e.target.value})}} value={this.state.fruitsAdress} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </li>
                                </ul>
                                <ul className="ul1 ul2">
                                    <li className="li1">
                                        <span className="span1">*果园类型</span>
                                        <Select  className={"input3"} allowClear onChange={(e)=>{this.setState({fruitId: e})}} value={this.state.fruitId}
                                                 disabled={this.state.flag==3?true:false}>
                                            {
                                                this.state.fruitIdList.map((item, index)=>{
                                                    return(
                                                        <Option value={item.value} key={index}>{item.value}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </li>
                                    <li className="li1 li2">
                                        <span className="span1">*果园注册号</span>
                                        <Input allowClear onChange={(e)=>{this.setState({registrationNumber: e.target.value})}} value={this.state.registrationNumber} className={"input3"}
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
                </div>
            </div>
        )
    }
    componentWillMount() {
        let buttonList = JSON.parse(sessionStorage.getItem("buttonList"));
        // console.log(buttonList);
        if(buttonList && buttonList.length) {
            buttonList.forEach((item)=>{
                if(item.localIndex == "2-2-1") {
                    this.addBtn = item.flag;
                }
                if(item.localIndex == "2-2-2") {
                    this.changeBtn = item.flag;
                }
                if(item.localIndex == "2-2-3") {
                    this.deleteBtn = item.flag;
                }
            })
        }
    }

    initData(currentPage) {
        let params = {
            currentPage,
            pageSize: this.state.pageSize,

        };
        Axios.post('/self/erp/baseinfo/queryOrchard', params).then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                res.data.data.orchards.forEach((item)=>{
                    item.key = item.id;
                });
                this.setState({
                    dataSource: res.data.data.orchards,
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
    // 果园类型下拉框
    fruitSelect() {
        Axios.post('/self/erp/baseinfo/queryOrchardType').then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                this.setState({
                    fruitIdList: res.data.data.orchardType
                })
            }else{
                this.setState({
                    fruitIdList: []
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
    add() {
        this.setState({
            visible: true,
            msg: '新增',
            flag: 1,
            fruitsName: '',
            concatName: '',
            concatPhone: '',
            fruitsAdress: '',
            fruitId: '',
            registrationNumber: ''
        })
    }
    changes(row) {
        this.setState({
            visible: true,
            msg: '修改',
            flag: 0,
            fruitsName: row.orchardName,
            concatName: row.orchardContactMan,
            concatPhone: row.orchardContactInfo,
            fruitsAdress: row.orchardAddress,
            fruitId: row.orchardType,
            id: row.id,
            registrationNumber: row.registrationCode
        })
    }
    details(row) {
        this.setState({
            visible: true,
            msg: '详情',
            flag: 3,
            fruitsName: row.orchardName,
            concatName: row.orchardContactMan,
            concatPhone: row.orchardContactInfo,
            fruitsAdress: row.orchardAddress,
            fruitId: row.orchardType,
            id: row.id,
            registrationNumber: row.registrationCode
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
                Axios.post('/self/erp/baseinfo/deleteOrchard', params).then((res)=>{
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
    changePages(val) {
        this.initData(val);
        this.setState({
            currentPage: val
        })
    }
    handleOk() {
        let params = {
            orchardName: this.state.fruitsName,
            orchardContactMan: this.state.concatName,
            orchardContactInfo: this.state.concatPhone,
            orchardAddress: this.state.fruitsAdress,
            orchardType: this.state.fruitId,
            registrationCode: this.state.registrationNumber
        };
        if(this.state.flag == 1) {  // 新增
            Axios.post('/self/erp/baseinfo/addOrchard', params).then((res)=>{
                if(res.data.success) {
                    message.success("新增成功");
                    this.setState({
                        visible: false
                    });
                    this.initData(this.state.currentPage);
                }else{
                    message.success(res.data.message);
                }
            })
        }else{
            params.id = this.state.id;
            Axios.post('/self/erp/baseinfo/updateOrchard', params).then((res)=>{
                if(res.data.success) {
                    message.success("修改成功");
                    this.setState({
                        visible: false
                    });
                    this.initData(this.state.currentPage);
                }else{
                    message.success(res.data.message);
                }
            })
        }
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
        this.fruitSelect();
    }
}
export default Distributor;