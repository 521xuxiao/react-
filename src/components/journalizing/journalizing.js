import React, {Component} from 'react'
import Axios from 'axios';
import {Input, Table, DatePicker, Pagination} from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './journalizing.scss'
const {Column} =  Table;
const {RangePicker } =  DatePicker;
class Journalizing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modles1: '',  details1: '',
            persons1: '', ips1: '',
            dataSource: [],
            pageSize: 10,
            currentPage: 1,
            pageTotle: 30,
            startTime: '',   endTime: '',
            visible: false,

        }
    }
    render() {
        return(
            <div id="journalizing">
                <div className="journalizing">
                    <div className="placeSearch">
                        <div className="left1">
                            <span className="span1">操作模块</span>
                            <Input onChange={this.modles.bind(this)} className="input1" allowClear/>
                        </div>
                        <div className="left1">
                            <span className="span1">操作详情</span>
                            <Input onChange={this.details.bind(this)} className="input1" allowClear/>
                        </div>
                        <div className="left1">
                            <span className="span1">操作人</span>
                            <Input onChange={this.persons.bind(this)} className="input1" allowClear/>
                        </div>
                        <div className="left1">
                            <span className="span1">IP</span>
                            <Input onChange={this.ips.bind(this)} className="input1" allowClear/>
                        </div>
                        <div className="btn">
                            <button className="searchs" onClick={this.searchMethods.bind(this)}>查询</button>
                        </div>
                    </div>
                    <div className="placeSearch2">
                        <div className="left2">
                            <span className="span1">操作时间</span>
                            <RangePicker renderExtraFooter={() => 'extra footer'} className="input2" showTime locale={locale} onChange={this.timePick.bind(this)}/>
                        </div>
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}
                            // rowSelection={{
                            //      type: "checkbox",
                            //      onChange: this.changeTableSelstor.bind(this),
                            // }}
                        >
                            <Column title="序号" align="center" width="100px" render={(text, record, index)=>(
                                <span>{(index+1) + (this.state.currentPage-1)*this.state.pageSize}</span>
                            )}/>
                            <Column title="操作模块" dataIndex="module" key="module" align="center"/>
                            <Column title="操作内容" dataIndex="operation" key="operation" align="center"/>
                            <Column title="操作人" dataIndex="realname" key="realname" align="center"/>
                            <Column title="操作IP" dataIndex="ip" key="ip" align="center"/>
                            <Column title="操作时间" dataIndex="createdTime" key="createdTime" align="center"/>
                        </Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={()=>`共 ${this.state.pageTotle} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotle} showSizeChanger={false}/>
                    </div>
                </div>
            </div>
        )
    }
    modles(e) {
         this.setState({
             modles1: e.target.value
         })
    }
    details(e) {
        this.setState({
            details1: e.target.value
        })
    }
    persons(e) {
        this.setState({
            persons1: e.target.value
        })
    }
    ips(e) {
        this.setState({
            ips1: e.target.value
        })
    }
    timePick(dates, pickys) {
        if(pickys[0]) {
            this.setState({
                startTime: pickys[0],
                endTime: pickys[1]
            })
        }else{
            this.setState({
                startTime: "",
                endTime: ""
            })
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
    initData(currentPage) {
         let params = {
             realname: this.state.persons1,
             ip: this.state.ips1,
             module: this.state.modles1,
             operation: this.state.details1,
             pageSize: this.state.pageSize,
             currentPage,
             startTime: this.state.startTime,
             endTime: this.state.endTime
         };
         Axios.post('/self/erp/system/querySysLog', params).then((res)=>{
             // console.log(res.data);
             if(res.data.success) {
                 res.data.data.sysLogList.forEach((item)=>{
                     item.key = item.id;
                 });
                 this.setState({
                     dataSource: res.data.data.sysLogList,
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
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
}
export default Journalizing;
