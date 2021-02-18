import 'core-js/es'
import 'mutation-observer'
import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
import './polyfill.js';


import React from 'react';
import ReactDOM from 'react-dom';
import MyRouter from './router/router.js';
import Axios from 'axios';
import {message} from 'antd';
import './index.css';
import 'antd/dist/antd.css';
import "./common/UnidreamLED/UnidreamLED.css";

import * as serviceWorker from './serviceWorker';
Axios.interceptors.request.use(function (config) {
    let token = JSON.parse(sessionStorage.getItem("userInfo")) == null ? '' : JSON.parse(sessionStorage.getItem("userInfo")).AUTH_TOKEN;
    if (token) {
        config.headers["auth-token"] = token;
        config.headers["Request-Source"] = "pc";
        return config;
    }
    return config
}, function (error) {
    // 请求失败的处理
    return Promise.reject(error)
})
Axios.interceptors.response.use(
    (response) => {
        if(response.data.login == "false") {
            message.warning("登录已过期，请重新登录");
            setTimeout(()=>{
                window.location.href = window.location.href.split('/#/')[0] + "/#/login";
                sessionStorage.clear();
            }, 1000);
        }
        return response;
    },
    (error) => {
        console.log(error.response.status);
        if(error.response.status == '504') {
            message.error("服务器挂了");
        }
        return Promise.reject(error);
    }
);
ReactDOM.render(
  <MyRouter />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
