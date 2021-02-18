import React, {Component} from "react";
import {Input, Select, Table, Space, Pagination, Modal, InputNumber, Button, DatePicker, Cascader, message, Switch, TreeSelect,Radio,
    Checkbox, Divider,Upload} from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { ExclamationCircleOutlined ,PlusOutlined} from '@ant-design/icons';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./notifyPost.scss";
const {Option} = Select;
const {Column} = Table;
const {TextArea} = Input;
const { confirm } = Modal;
const {Search} = Input; const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
class NotifyPost extends Component{
    constructor(props) {
        super(props);
        this.state  = {
            statusList: [],
            dataSource: [],
            currentPage: 1, pageSize: 10, pageTotal: 0,
            msg: '',
            flag: 1,
            visible: false,
            radioValue: 1,
            indeterminate: false,
            checkAll: false,
            plainOptions: [],
            checkedList: [],
            fileList: [],
            uploadButton: true,
            roleList: [],  deptList: []
        }
    }
    render() {
        return(
            <div className="notifyPost">
                <div className="placeSearch">
                    <span className="span1">发送日期</span>
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
                    <span className="span1 span2">标题</span>
                    <Input className="input1" allowClear onChange={(e)=>{this.setState({title: e.target.value})}}/>
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
                </div>
                <div className="placeTable">
                    <Table pagination={false} dataSource={this.state.dataSource} locale={{emptyText: '暂无数据'}}>
                        <Column title="序号" align="center" key="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                            <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                        )}/>
                        <Column title="日期" dataIndex="createdTime" key="createdTime" align="center"/>
                        <Column title="标题" dataIndex="messageTitle" key="messageTitle" align="center"/>
                        <Column title="发文人" dataIndex="createdName" key="createdName" align="center"/>
                        <Column title="发送时间" dataIndex="modifiedTime" key="modifiedTime" align="center" render={(text, record)=>(
                            <span>{record.messageType==1?"":text}</span>
                        )}/>
                        <Column title="状态" dataIndex="messageType" key="messageType" align="center" render={(text)=>(
                            <span>{text==1?"草稿":text==2?"已发送":"-"}</span>
                        )}/>
                        <Column title="操作" align="center" key="records" dataIndex="records" width="240px"
                            render={(text, record) => (
                                <Space size="large">
                                    {record.messageType == 1?(
                                        <span key={"changes"} onClick={this.changes.bind(this, record)} className="changes">编辑</span>
                                    ):null}
                                    <span key={"deletes"} onClick={this.deletes.bind(this, record)} className="deletes">删除</span>
                                    {/*<span key={"details"} onClick={this.details.bind(this, record)} className="details span11">详情</span>*/}
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
                        <div className="div3">
                            <ul className="notifyPostUl1">
                                <li className="notifyPostLi1">
                                    <span className="notifyPostSpan">标题</span>
                                    <div className="notifyPostDiv1">
                                        <Input allowClear value={this.state.titles} onChange={(e)=>{this.setState({titles:e.target.value})}} className={"input3"}
                                               disabled={this.state.flag==3?true:false}/>
                                    </div>
                                </li>
                                <li className="notifyPostLi1 notifyPostLi2">
                                    <span className="notifyPostSpan">发送部门</span>
                                    <div className="notifyPostDiv1 notifyPostDiv2">
                                        <Radio.Group onChange={(e)=>{
                                            this.setState({radioValue: e.target.value, indeterminate: false, checkAll: false, checkedList: []})
                                            if(e.target.value==1) {
                                                this.deptList();
                                            }else{
                                                this.roleList();
                                            }
                                        }} value={this.state.radioValue}>
                                            <Radio value={1}>部门</Radio>
                                            <Radio value={2}>角色</Radio>
                                        </Radio.Group>
                                    </div>
                                </li>
                                <li className="notifyPostLi1 notifyPostLi3">
                                    <span className="notifyPostSpan"></span>
                                    <div className="notifyPostDiv1 notifyPostDiv2">
                                        <Checkbox indeterminate={this.state.indeterminate} onChange={(e)=>{
                                            this.setState({
                                                checkAll: e.target.checked,
                                                indeterminate: false
                                            })
                                            if(e.target.checked){
                                                this.setState({checkedList: this.state.plainOptions})
                                            }else{
                                                this.setState({checkedList: []})
                                            }
                                        }} checked={this.state.checkAll}>
                                            全选
                                        </Checkbox> <br /><br />
                                        <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={(e)=>{
                                            this.setState({checkedList: e})
                                            if(e.length==0) {
                                                this.setState({indeterminate: false, checkAll: false})
                                            }else if(e.length>0 && e.length<this.state.plainOptions.length) {
                                                this.setState({indeterminate: true, checkAll: false})
                                            }else{
                                                this.setState({checkAll: true, indeterminate: false})
                                            }
                                        }} />
                                    </div>
                                </li>
                                <li className="notifyPostLi1 notifyPostLi2">
                                    <span className="notifyPostSpan">发送内容</span>
                                    <div className="notifyPostDiv1">
                                        <TextArea rows={14} value={this.state.text} onChange={(e)=>{
                                            this.setState({
                                                text: e.target.value
                                            })
                                        }} disabled={this.state.flag==3?true:false} allowClear/>
                                    </div>
                                </li>
                                <li className="notifyPostLi1 notifyPostLi2">
                                    <span className="notifyPostSpan">上传图片</span>
                                    <div className="notifyPostDiv1">
                                        <Upload
                                            action="/self/erp/message/uploadMessageFile"
                                            headers={{ContentType: 'multipart/form-data', "auth-token": JSON.parse(sessionStorage.getItem("userInfo"))["AUTH_TOKEN"]}}
                                            name="file"
                                            listType="picture-card"
                                            fileList={this.state.fileList}
                                            onPreview={this.handlePreview.bind(this)}
                                            onChange={this.handleChange.bind(this)}
                                            showUploadList={{showDownloadIcon: true}}
                                            onDownload={this.downLoad.bind(this)}
                                        >
                                            {this.state.fileList.length >= 8 ? null : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            )}
                                        </Upload>
                                        <Modal
                                            visible={this.state.previewVisible}
                                            title={this.state.previewTitle}
                                            footer={null}
                                            onCancel={this.handleCancel.bind(this)}
                                        >
                                            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                        </Modal>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="div4">
                        <li className="li4">
                            <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>取消</Button>
                        </li>
                        <li className="li4" style={this.state.flag==3?{display: 'none'}:{display: 'block'}}>
                            <Button className="btn4" type="primary" onClick={this.handleOk.bind(this)}>发送消息</Button>
                        </li>
                        <li className="li4" style={this.state.flag==3?{display: 'none'}:{display: 'block'}}>
                            <Button className="btn4" type="primary" onClick={this.handleSketch.bind(this)}>草稿</Button>
                        </li>
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
            title: this.state.title,
            status: this.state.status
        }
        Axios.post("/self/erp/message/queryMessages", params).then((res)=>{
            if(res.data.success) {
                res.data.data.messages.forEach((item)=>{
                    item.key = item.id;
                })
                this.setState({
                    dataSource: res.data.data.messages,
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
        this.setState({
            visible: true,
            flag: 1,
            msg: '新增',

            titles: "",
            text: "",
            radioValue: 1,
            checkedList: [],   indeterminate: false,      checkAll: false,    fileList: []
        })
        this.deptList();
    }
    changes(row) {
        this.setState({
            visible: true,
            flag: 2,
            msg: '修改',

            id: row.id,
            titles: row.messageTitle,
            text: row.messageContent,
            radioValue: Number(row.messageGroup)
        })
        if(row.messageGroup == 1) {
            this.deptList(row);
        }else{
            this.roleList(row);
        }
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
                Axios.post('/self/erp/message/deleteMessage', params).then((res)=>{
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
            currentPage:val
        })
    }
    handleOk() {
        this.isUpdate = false;
        this.submit("/self/erp/message/pushMessage");
    }

    /**
     * 下载
     */
    downLoad(file) {
        if(file.lastModified == undefined) { // 下载回显的文件
            window.location.href = file.url;
        }else{  // 下载上传后的文件
            if(file.response.success) {
                window.location.href = (JSON.parse(sessionStorage.getItem("userInfo"))).host + file.response.data.messageFile.fileAddr;
            }else {
                message.warning("文件上传不成功, 暂不能下载");
            }
        }
    }

    /**
     * 草稿
     */
    handleSketch() {
        this.isUpdate = true;
        this.submit("/self/erp/message/saveMessage");
    }

    submit(url) {
        let deptIds = [], roleIds = [];
        if(this.state.radioValue ==1) { //部门
            this.state.deptList.forEach((item)=>{
                this.state.checkedList.forEach((innerItem)=>{
                    if(item.deptName == innerItem) {
                        deptIds.push(item.deptId);
                    }
                })
            })
        }else{ // 角色
            this.state.roleList.forEach((item)=>{
                this.state.checkedList.forEach((innerItem)=>{
                    if(item.name == innerItem) {
                        roleIds.push(item.id);
                    }
                })
            })
        }
        // 图片处理
        let fileAddrs = [];
        if(this.state.fileList.length !=0) {
            this.state.fileList.forEach((item)=>{
                if(item.lastModified == undefined) {
                    fileAddrs.push({
                        fileAddr: item.url.indexOf("/erp/messageFile") != -1 ? "/erp/messageFile"+item.url.split("/erp/messageFile")[1] : "",
                        fileName: item.name
                    })
                }else{
                    fileAddrs.push({
                        fileAddr: item.response.success ?  item.response.data.messageFile.fileAddr: "",
                        fileName: item.response.success ?  item.response.data.messageFile.fileName: ""
                    })
                }
            })
        }
        let params = {
            messageTitle: this.state.titles,
            messageContent: this.state.text,
            messageGroup: this.state.radioValue,
            deptIds,
            roleIds,
            files: fileAddrs,
            id: this.state.id
        }
        if(this.state.flag == 1) {
            Axios.post(url, params).then((res) => {
                if (res.data.success) {
                    message.success("消息发布成功");
                    this.initData(this.state.currentPage);
                    this.setState({
                        visible: false
                    })
                } else {
                    message.warning(res.data.message);
                }
            })
        }else if(this.state.flag == 2) {
            if(this.isUpdate) {
                Axios.post("/self/erp/message/updateMessage", params).then((res) => {
                    if (res.data.success) {
                        message.success("修改成功");
                        this.initData(this.state.currentPage);
                        this.setState({
                            visible: false
                        })
                    } else {
                        message.warning(res.data.message);
                    }
                })
            }else{
                Axios.post("/self/erp/message/pushMessage", params).then((res) => {
                    if (res.data.success) {
                        message.success("消息发布成功");
                        this.initData(this.state.currentPage);
                        this.setState({
                            visible: false
                        })
                    } else {
                        message.warning(res.data.message);
                    }
                })
            }
        }
    }


    componentDidMount() {
        this.initData(this.state.currentPage);
    }
    deptList(row) {
        Axios.post("/self/erp/dept/queryDepts", {}).then((res)=>{
            if(res.data.success) {
                let plainOptions = [];
                res.data.data.deptList.forEach((item)=>{
                    plainOptions.push(item.deptName)
                })
                this.setState({
                    plainOptions,
                    deptList: res.data.data.deptList
                })
                if(row != null) {
                    Axios.post("/self/erp/message/queryMessageById", {id: row.id}).then((ress)=>{
                        if(ress.data.success) {
                            let obj = ress.data.data.message;
                            this.setState({
                                checkedList: obj.deptNames
                            })
                            if(res.data.data.deptList.length != obj.deptNames.length) {
                                this.setState({
                                    indeterminate: true,
                                    checkAll: false
                                })
                            }else{
                                this.setState({
                                    indeterminate: false,
                                    checkAll: true
                                })
                            }
                            let host = JSON.parse((sessionStorage.getItem("userInfo"))).host;
                            let fileList = [];
                            obj.files.forEach((item)=>{
                                fileList.push({
                                    uid: item.id,
                                    name: item.fileName,
                                    status: "done",
                                    url: host+item.fileAddr
                                })
                            })
                            this.setState({
                                fileList
                            })
                        }
                    })
                }
            }else{
                this.setState({
                    plainOptions: []
                })
            }
        })
    }

    /**
     * 角色下拉框
     */
    roleList(row) {
        Axios.post("/self/erp/role/queryRoles", {}).then((res)=>{
            if(res.data.success) {
                let plainOptions = [];
                res.data.data.roleList.forEach((item)=>{
                    plainOptions.push(item.name);
                })
                this.setState({
                    plainOptions,
                    roleList: res.data.data.roleList

                })
                if(row != null) {
                    Axios.post("/self/erp/message/queryMessageById", {id: row.id}).then((ress)=>{
                        if(res.data.success) {
                            let obj = ress.data.data.message;
                            this.setState({
                                checkedList: obj.roleNames
                            })
                            if(res.data.data.roleList.length != obj.roleNames.length) {
                                this.setState({
                                    indeterminate: true,
                                    checkAll: false
                                })
                            }else{
                                this.setState({
                                    indeterminate: false,
                                    checkAll: true
                                })
                            }
                            let host = JSON.parse((sessionStorage.getItem("userInfo"))).host;
                            let fileList = [];
                            obj.files.forEach((item)=>{
                                fileList.push({
                                    uid: item.id,
                                    name: item.fileName,
                                    status: "done",
                                    url: host+item.fileAddr
                                })
                            })
                            this.setState({
                                fileList
                            })
                        }
                    })
                }
            }else{
                this.setState({
                    plainOptions: []
                })
            }
        })
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });

        function getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }
    };
    handleChange(file) {
        this.setState({
            fileList: file.fileList
        })
        if(file.file.status == "removed") {
            console.log("删除图片,,等待接口")
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
}
export default NotifyPost;