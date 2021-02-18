import React, {Component} from 'react'
import {Input, message, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';
import './login.scss'
import img1 from '../../common/img/fours.png';
class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            code: '',
            fourCode: '',
            loading: false
        }
    }
    render() {
        return(
            <div id="login">
                <div className="login">
                    <div className="login_left">
                        <img src={img1} className="img1"/>
                    </div>
                    <div className="login_right">
                        <div className="inner_login_right">
                            <p className="p1">欢迎登录</p>
                            <div className="div1">
                                <Input onChange={this.userName.bind(this)} size="large" allowClear prefix={<UserOutlined />} placeholder="请输入用户名"/>
                            </div>
                            <div className="div1">
                                <Input onChange={this.passWord.bind(this)} size="large" allowClear type="password" prefix={<LockOutlined />} placeholder="请输入密码"/>
                            </div>
                            <div className="div1 div2">
                                <div className="innerDiv">
                                    <Input onKeyUp={this.keyEnter.bind(this)} onChange={(e)=>{this.setState({fourCode: e.target.value})}} size="large" allowClear className="input3"/>
                                </div>
                                <span className="span3" onClick={this.handleCode.bind(this)}>{this.state.code}</span>
                            </div>
                            <Button onClick={this.handleClick.bind(this)} loading={this.state.loading} className="logins">登录</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    handleClick() {
        if(!this.state.username || !this.state.password) {
            message.warning("请输入用户名和密码");
            return false;
        }
        if(this.state.fourCode.toLowerCase() != this.state.code.toLowerCase()) {
            message.warning("输入的验证码不正确");
            this.handleCode();
            return false;
        }
        let params = {
            account: this.state.username,
            password: this.state.password
        };
        this.setState({
            loading: true
        })
        Axios.post('/self/erp/user/login', params).then((res)=>{
            if(res.data.success) {
                message.success("登录成功");
                sessionStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
                sessionStorage.setItem("menuList", JSON.stringify(res.data.data.menuList));
                sessionStorage.setItem("buttonList", JSON.stringify(res.data.data.buttonList));
                setTimeout(()=>{
                    this.props.history.push('/app/procurementPlan');
                }, 300);
                this.setState({
                    loading: false
                })
            }else{
                message.warning(res.data.message);
                this.setState({
                    loading: false
                })
            }
        }).catch((err)=>{
            if(err.request.status == 504) {
                this.setState({
                    loading: false
                })
            }
        })
    }
    keyEnter(e) {
        if (!e) e = window.event;
        if ((e.keyCode || e.which) == 13) {
            this.handleClick();
        }
    }
    userName(e) {
        this.setState({
            username: e.target.value
        })
    }
    passWord(e) {
        this.setState({
            password: e.target.value
        })
    }
    handleCode() {   //生成四位的code码
        let code = "";
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for(let i=0;i<4;i++) {
            let index = Math.floor(Math.random() * 62);
            code += str[index];
        }
        this.setState({
            code
        })
    }
    componentDidMount() {
        this.handleCode();
    }
}
export default withRouter(Login);
