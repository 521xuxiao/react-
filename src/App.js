import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';

import Axios from 'axios';
import Slider from './components/slider/slider.js';
import './App.scss';
import imgSrc from './common/img/logo_s.png';
import { Menu, Dropdown, Tabs ,message,Modal, Input, Button, Badge, Popover} from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
class App extends Component {
    constructor (props) {
        super(props)
        this.newTabIndex = 0;
        const panes = [{title: '首页', key: 0}];
        this.state = {
            activeKey: "",
            panes,
            userName: '',
            visible: false,
            oldPassword: '',
            newPassword: '',
            aginPassword: '',
            count: 3
        };
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.outLogin.bind(this)}>
                        退出登录
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.changePassword.bind(this)}>
                        修改密码
                    </a>
                </Menu.Item>
            </Menu>
        );
        const content = (
            <div>
                <p>1</p>
                <p>2</p>
                <p>3</p>
            </div>
        )
        return(
            <div id="app">
                <div className="header">
                    <div className="header_left">
                        <img src={imgSrc}/>
                    </div>
                    <div className="header_right">
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                欢迎 {this.state.userName} 来到齐鲁泉源 <DownOutlined />
                            </a>
                        </Dropdown>
                    </div>
                    <div className="header_leftRight">
                        <Badge count={this.state.count}>
                            <Popover content={content} title="详细通知">
                                消息通知
                            </Popover>
                        </Badge>
                    </div>
                </div>
                <div className="main">
                    <div className="main_left">
                        <Slider giveAppData={this.handleData.bind(this)} giveSliderData={this.state.activeKey}></Slider>
                    </div>
                    <div className="main_right">
                        <div className="div1">
                            <Tabs hideAdd onChange={this.onChange.bind(this)} activeKey={this.state.activeKey} type="editable-card"
                                onEdit={this.onEdit.bind(this)}>
                                {this.state.panes.map(pane => (
                                    <TabPane tab={pane.title} key={pane.key} closeIcon={<CloseOutlined />}></TabPane>
                                ))}
                            </Tabs>
                        </div>
                        <div className="div1Bottom">
                            {this.props.children}
                        </div>
                    </div>
                </div>

                <Modal title="修改密码" width="60%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                    <div className="modal1">
                        <div className="div3">
                            <ul className="ul1">
                                <li className="li3 li1">
                                    <span className="span1">*旧密码</span>
                                    <Input allowClear onChange={(e)=>{this.setState({oldPassword: e.target.value})}} value={this.state.oldPassword} className={"input3"}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1 li3">
                                    <span className="span1">*新密码</span>
                                    <Input allowClear onChange={(e)=>{this.setState({newPassword: e.target.value})}} value={this.state.newPassword} className={"input3"}/>
                                </li>
                            </ul>
                            <ul className="ul1 ul2">
                                <li className="li1 li3">
                                    <span className="span1">*确定密码</span>
                                    <Input allowClear onChange={(e)=>{this.setState({aginPassword: e.target.value})}} value={this.state.aginPassword} className={"input3"}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="div4">
                        <li className="li4">
                            <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>取消</Button>
                        </li>
                        <li className="li4">
                            <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                        </li>
                    </div>
                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.initDomHeight();
        this.initDom();
        window.onresize = ()=>{
            this.initDomHeight();
            this.initDom();
        };
        this.tableName();
        this.websocket();
    }
    tableName() {
        let obj = JSON.parse(sessionStorage.getItem("userInfo"));
        if(obj) {
            this.setState({
                userName: obj.realname
            })
        }
    }
    websocket() {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo").toString());
        let host = userInfo.host;
        // host.split("//")
        let host1 = "";
        if(host.indexOf("//") != -1) {
            host1 = host.split("//")[1]
        }
        let userId = userInfo.id;

        let websocket = null;

        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            //连接WebSocket节点
            // websocket = new WebSocket("ws://localhost:8088/erp/websocket/0001");
            websocket = new WebSocket(`ws://${host1}/erp/websocket/${userId}`);
        } else {
            message.warning("您的浏览器不支持websocket")
        }

        //连接发生错误的回调方法
        websocket.onerror = function() {
            console.log("连接失败");
        };

        //连接成功建立的回调方法
        websocket.onopen = function(event) {
            console.log("连接成功");
        }

        //接收到消息的回调方法
        websocket.onmessage = (event)=> {
            console.log(event)
        }

        //连接关闭的回调方法
        websocket.onclose = function() {
            console.log("关闭连接")
        }


        window.onbeforeunload = function() {
            websocket.close();
        }
    }
    // 初始化的头部下面的高度
    initDomHeight() {
        $('.main').css({
            height: $('#app').height()
        })
    }
    // tabs中的width
    initDom() {
        $('.ant-tabs-nav-wrap').css({
            width: '500px'
        })

        $(".div1Bottom").css({
            height: $(".main_right").height() - 66
        })
    }
    outLogin() {
        console.log("退出登录");
        let params = {

        };
        Axios.post('/self/erp/user/logout', params).then((res)=>{
            if(res.data.success) {
                message.success("退出成功, 请稍等...");
                setTimeout(()=>{
                    this.props.history.replace('/login');
                }, 1800);
                sessionStorage.clear();
            }else{
                message.warning(res.data.message);
            }
        })
    }
    changePassword() {
        this.setState({
            visible: true
        })
    }
    handleOk() {
        if(!this.state.oldPassword) {
            message.warning("填写旧密码");
            return false;
        }
        if(!this.state.newPassword) {
            message.warning("填写新密码");
            return false;
        }
        if(!this.state.aginPassword) {
            message.warning("填写确认密码");
            return false;
        }
        if(this.state.newPassword != this.state.aginPassword) {
            message.warning("两次密码不一致");
            return false;
        }
        let params = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        };
        Axios.post('/self/erp/user/modifyPassword', params).then((res)=>{
            if(res.data.success) {
                message.success("成功");
                this.setState({
                    visible: false
                })
            }else{
                message.warning(res.data.message);
            }
        })
    }

    onChange = activeKey => {
        this.setState({ activeKey });
        switch(activeKey) {
            case '0':
                this.props.history.push('/home');
                break;
            case '1-1':
                this.props.history.push('/app/procurementPlan');
                break;
            case '1-2':
                this.props.history.push('/app/purchasingTask');
                break;
            case '1-3':
                this.props.history.push('/app/qualityOrder');
                break;
            case '1-4':
                this.props.history.push('/app/purchaseOrder');
                break;
            case '1-5':
                this.props.history.push('/app/procurementSampling');
                break;
            case '1-6':
                this.props.history.push('/app/weighingBuckles');
                break;
            case '1-7':
                this.props.history.push('/app/purchasingStorage');
                break;
            case '2-1':
                this.props.history.push('/app/provider');
                break;
            case '2-2':
                this.props.history.push('/app/distributor');
                break;
            case '2-3':
                this.props.history.push('/app/storeManagement');
                break;
            case '2-4':
                this.props.history.push('/app/productManagement');
                break;
            case '2-5':
                this.props.history.push('/app/shopManagement');
                break;
            case '2-6':
                this.props.history.push('/app/customerGroups');
                break;
            case '2-7':
                this.props.history.push('/app/client');
                break;
            case '2-8':
                this.props.history.push('/app/deviceSetting');
                break;
            case '2-9':
                this.props.history.push('/app/lot');
                break;
            case '2-10':
                this.props.history.push('/app/barrelsManagement');
                break;
            case '2-11':
                this.props.history.push('/app/weighManeger');
                break;
            case '2-13':
                this.props.history.push('/app/currency');
                break;
            case '3-1':
                this.props.history.push('/app/inList');
                break;
            case '3-2':
                this.props.history.push('/app/outboundDeliveryOrder');
                break;
            case '3-3':
                this.props.history.push('/app/materialInventory');
                break;
            case '3-4':
                this.props.history.push('/app/finishedProductsStorage');
                break;
            case '3-5':
                this.props.history.push('/app/finishedProductOut');
                break;
            case '3-6':
                this.props.history.push('/app/labelAccessRecord');
                break;
            case '3-12':
                this.props.history.push('/app/rawMaterials');
                break;
            case '3-13':
                this.props.history.push('/app/finishedStatistics');
                break;
            case '3-14':
                this.props.history.push('/app/warehouseAllotting');
                break;
            case '3-15':
                this.props.history.push('/app/warehouseManagement');
                break;
            case '3-16':
                this.props.history.push('/app/borrowLendReturn');
                break;
            case '3-17':
                this.props.history.push('/app/otherWarehouseOut');
                break;
            case '3-18':
                this.props.history.push('/app/otherWarehouseIn');
                break;
            case '4-1':
                this.props.history.push('/app/salesOrder');
                break;
            case '4-2':
                this.props.history.push('/app/salesInvoice');
                break;
            case '5-1':
                this.props.history.push('/app/production');
                break;
            case '5-2':
                this.props.history.push('/app/materialManagement');
                break;
            case '5-3':
                this.props.history.push('/app/billboard');
                break;
            case '5-4':
                this.props.history.push('/app/productionManagement');
                break;
            case '6-1':
                this.props.history.push('/app/cachet');
                break;
            case '6-2':
                this.props.history.push('/app/notifyPost');
                break;
            case '6-3':
                this.props.history.push('/app/messageLists');
                break;
            case '8-1':
                this.props.history.push('/app/dictionary0peration');
                break;
            case '8-2':
                this.props.history.push('/app/journalizing');
                break;
            case '8-4':
                this.props.history.push('/app/userBu');
                break;
            case '8-3':
                this.props.history.push('/app/branch');
                break;
            case '8-5':
                this.props.history.push('/app/roleList');
                break;
        }
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
    };
    handleData(objects) {
        let arr = [{title: '首页', key: 0}],
        obj = {};
        let item = objects.items;
        if(item && item.length) {
            item.forEach((item)=>{
                if(!obj[item.key]) {
                    arr.push(item);
                    obj[item.key] = true;
                }
            })
        }
        this.setState({
            panes: arr,
            activeKey: ''+objects.currentItems
        })
    }
}

export default withRouter(App);
