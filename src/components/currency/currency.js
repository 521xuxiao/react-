import React, {Component} from "react";
import {Button, Table, Space, Pagination, Modal, Input, message,Select,Cascader,InputNumber} from 'antd';
import Axios from 'axios';
import "./currency.scss"
const {Column} = Table;
const {Option} = Select;
class Currency extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            msg: '',
            flag: 1,
            visible: false,

            code: '',
            name: '',
            exchangeRate: '',
            decimalPlaces: '',
            convertType: '',     convertTypeList: [
                {label: '原币×汇率=本位币', value: 1},
                {label: '原币÷汇率=本位币', value: 2}
            ],
            exchangeRateType: '', exchangeRateTypeList: [
                {label: '固定', value: "fix"},
                {label: '浮动', value: "float"}
            ],
            id: ''
        }
    }
    render() {
        return(
            <div className="currency">
                <div className="bg">
                    <button className="searchs" onClick={this.add.bind(this)}>新增</button>
                </div>
                <div className="placeTable">
                    <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: '暂无数据'}}>
                        <Column title="序号" align="center" id="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                            <span>{index+1}</span>
                        )}/>
                        <Column title="代码" dataIndex="code" id="code" align="center"/>
                        <Column title="名称" dataIndex="name" id="name" align="center"/>
                        <Column title="汇率" dataIndex="exchangeRate" id="exchangeRate" align="center" render={(text, record)=>(
                            <span>{text / Math.pow(10, record.decimalPlaces)}</span>
                        )}/>
                        <Column title="小数位数" dataIndex="decimalPlaces" id="decimalPlaces" align="center"/>
                        <Column title="操作" align="center" id="records" dataIndex="records"
                            render={(text, record) => (
                                <Space size="large">
                                    <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes">编辑</span>
                                </Space>
                            )}
                        />
                    </Table>
                </div>

                <Modal title={this.state.msg} width="60%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                    <div className="modal1">
                        <div className="div3">
                            <ul className="ul1">
                                <li className="li1">
                                    <span className="span1">*币别代码</span>
                                    <Input allowClear onChange={(e)=>{this.setState({code: e.target.value})}} value={this.state.code} className={"input3"}
                                                 disabled={this.state.flag==3?true:false}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">*币别名称</span>
                                    <Input allowClear onChange={(e)=>{this.setState({name: e.target.value})}} value={this.state.name} className={"input3"}
                                           disabled={this.state.flag==3?true:false}/>
                                </li>
                            </ul>
                            <ul className="ul1">
                                <li className="li1">
                                    <span className="span1">*记账汇率</span>
                                    <Input allowClear onChange={(e)=>{this.setState({exchangeRate: e.target.value})}} value={this.state.exchangeRate} className={"input3"}
                                           disabled={this.state.flag==3?true:false}/>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">*小数位数</span>
                                    <Input allowClear onChange={(e)=>{this.setState({decimalPlaces: e.target.value})}} value={this.state.decimalPlaces} className={"input3"}
                                           disabled={this.state.flag==3?true:false}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1">
                                    <span className="span1">*折算方式</span>
                                    <Select  className="input3" allowClear onChange={(e)=>{this.setState({convertType: e})}} value={this.state.convertType}
                                             disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.convertTypeList.map((item, index)=>{
                                                return(
                                                    <Option value={item.value} key={index}>{item.label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </li>
                                <li className="li1 li2">
                                    <span className="span1">*汇率制</span>
                                    <Select  className="input3" allowClear onChange={(e)=>{this.setState({exchangeRateType: e})}} value={this.state.exchangeRateType}
                                             disabled={this.state.flag==3?true:false}>
                                        {
                                            this.state.exchangeRateTypeList.map((item, index)=>{
                                                return(
                                                    <Option value={item.value} key={index}>{item.label}</Option>
                                                )
                                            })
                                        }
                                    </Select>
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
        )
    }
    initData() {
        Axios.post("/self/erp/baseinfo/queryCurrency", {}).then((res)=>{
            if(res.data.success) {
                res.data.data.currencys.forEach((item)=>{
                    item.key = item.id;
                })
                this.setState({
                    dataSource: res.data.data.currencys
                })
            }else{
                this.setState({
                    dataSource: []
                })
            }
        })
    }
    add() {
        this.setState({
            visible: true,
            msg: '新增',
            flag: 1,
            code: '',
            name: '',
            exchangeRate: '',
            convertType: '',
            exchangeRateType: '',
            decimalPlaces: ''
        })
    }
    changes(row) {
        this.setState({
            visible: true,
            msg: '修改',
            flag: 2,
            code: row.code,
            name: row.name,
            exchangeRate: row.exchangeRate / Math.pow(10, row.decimalPlaces),
            convertType: Number(row.convertType),
            exchangeRateType: row.exchangeRateType,
            decimalPlaces: row.decimalPlaces,
            id: row.id
        })
    }
    handleOk() {
        let parms = {
            code: this.state.code,
            name: this.state.name,
            exchangeRate: this.state.exchangeRate * Math.pow(10, this.state.decimalPlaces),
            convertType: this.state.convertType,
            exchangeRateType: this.state.exchangeRateType,
            decimalPlaces: this.state.decimalPlaces
        }
        if(this.state.flag == 1) {   // 新增
            Axios.post("/self/erp/baseinfo/addCurrency", parms).then((res) => {
                if (res.data.success) {
                    message.success("成功");
                    this.setState({
                        visible: false
                    })
                    this.initData();
                } else {
                    message.warning(res.data.message);
                }
            })
        }
    }
    componentDidMount() {
        this.initData();
    }
}
export default Currency;