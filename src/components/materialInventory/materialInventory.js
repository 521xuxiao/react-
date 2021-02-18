import React, {Component} from "react";
import {Input, Select, Table, Space, Pagination, Modal, InputNumber, Button, DatePicker, Cascader, message, Switch} from 'antd';
import Axios from 'axios';
import "./materialInventory.scss";
const {Option} = Select;
const {Column} = Table;
const {TextArea} = Input;
const { confirm } = Modal;
class MaterialInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            dataSource1: [],
            currentPage: 1,
            pageSize: 10,
            pageTotle: 0,
            visible: false
        }
    }
    render() {
        return(
            <div id="materialInventory">
                <div className="materialInventory">
                    <div className="bg">
                        <button className="searchs" onClick={this.search.bind(this)}>查询</button>
                        {/*<button className="searchs searchs1" onClick={this.donload.bind(this)}>导出</button>*/}
                    </div>
                    <div className="placeTable">
                        <Table pagination={false} dataSource={this.state.dataSource}>
                            <Column title="序号" align="center" id="index" dataIndex="index" width="100px" render={(text, record, index)=>(
                                <span>{(this.state.currentPage-1)*this.state.pageSize+index+1}</span>
                            )}/>
                            <Column title="规格" dataIndex="standard" id="standard" align="center"/>
                            <Column title="等级" dataIndex="level" id="level" align="center"/>
                            <Column title="品种" dataIndex="variety" id="variety" align="center"/>
                            <Column title="总储存量" dataIndex="totalStock" id="totalStock" align="center"/>
                            <Column title="操作" align="center" id="records" dataIndex="records"
                                render={(text, record) => (
                                    <Space size="large">
                                        <span key={"changes"} onClick={this.details.bind(this, record)} className="changes">详情</span>
                                    </Space>
                                )}
                            />
                        </Table>
                    </div>
                    <div className="placePagination">
                        <Pagination showTotal={()=>`共 ${this.state.pageTotle} 条`} current={this.state.currentPage} onChange={this.changePages.bind(this)} pageSize={this.state.pageSize} total={this.state.pageTotle} showSizeChanger={false}/>
                    </div>

                    <Modal title="详情" width="60%" footer={null} getContainer={false} closable={false}  visible={this.state.visible} centered={true}>
                        <div className="modal1">
                            <div className="placeTable">
                                <Table pagination={false} dataSource={this.state.dataSource1}>
                                    <Column title="序号" align="center" width="100px" render={(text, record, index)=>(
                                        <span>{index+1}</span>
                                    )}/>
                                    <Column title="规格" dataIndex="standard" index="standard" align="center"/>
                                    <Column title="等级" dataIndex="level" index="level" align="center"/>
                                    <Column title="品种" dataIndex="variety" index="variety" align="center"/>
                                    <Column title="总储存量" dataIndex="totalStock" index="totalStock" align="center"/>
                                    <Column title="库区名" dataIndex="warehouseAreaName" index="warehouseAreaName" align="center"/>
                                    <Column title="仓库名" dataIndex="warehouseName" index="warehouseName" align="center"/>
                                    <Column title="仓库储量" dataIndex="everyWarehouseStock" index="everyWarehouseStock" align="center"/>
                                </Table>
                            </div>
                        </div>
                        <div className="div4">
                            <li className="li4">
                                <Button className="btn4" type="danger" onClick={()=>{this.setState({visible: false})}}>返回</Button>
                            </li>
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
        Axios.post('/self/erp/stock/queryMaterialStock', param).then((res)=>{
            // console.log(res.data);
            if(res.data.success) {
                if(res.data.data.materialStocks && res.data.data.materialStocks.length) {
                    res.data.data.materialStocks.forEach((item)=>{
                        item.id = item.standardId+','+item.varietyId+','+item.levelId;
                    })
                }
                this.setState({
                    dataSource: res.data.data.materialStocks,
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
    search() {
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
    details(row) {
        this.detailList(row.standardId, row.levelId, row.varietyId);
    }
    detailList(standardId, levelId, varietyId){
        let param = {standardId,levelId, varietyId};
        Axios.post("/self/erp/stock/queryMaterialStockByStandardAndLevel", param).then((res)=>{
            if(res.data.success) {
                if(res.data.data.materialStock.everyWarehouseMaterialStock && res.data.data.materialStock.everyWarehouseMaterialStock.length) {
                    res.data.data.materialStock.everyWarehouseMaterialStock.forEach((item)=>{
                        item.standard = res.data.data.materialStock.standard;
                        item.level = res.data.data.materialStock.level;
                        item.totalStock = res.data.data.materialStock.totalStock;
                        item.index = res.data.data.materialStock.standardId;
                        item.variety = res.data.data.materialStock.variety;
                    })
                }
                this.setState({
                    dataSource1: res.data.data.materialStock.everyWarehouseMaterialStock,
                    visible: true
                })
            }else{
                this.setState({
                    dataSource1: []
                })
            }
        })
    }
    componentDidMount() {
        this.initData(this.state.currentPage);
    }
}
export default MaterialInventory;