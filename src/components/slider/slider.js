import React, {Component} from 'react';
import { withRouter, Link } from 'react-router-dom'
import { Menu ,Button} from 'antd';
import './slider.scss';
import ciagou from '../../common/img/ciagou.png'
import systems from '../../common/img/system.png'
import cangku from '../../common/img/cangku.png'
import jichu from '../../common/img/jichu.png'
import mai from  '../../common/img/mai.png';
import {
    createFromIconfontCN,
    DiffOutlined
} from '@ant-design/icons';
const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
    ],
});
const { SubMenu } = Menu;
class Slider extends Component {
    constructor(props) {
        super(props);
        this.light = this.props.giveSliderData;
        this.state = {
            defaultActive: '',
            defaultSelectedKeys: this.props.giveSliderData,  // 默认高亮
            defaultOpenKeys: ['1'],   // 默认打开
            openKeys: [],
            menuList: [],
            tabsArr: []
        }
    }
    render() {
        this.light = this.props.giveSliderData;
        return(
            <div className="slider" id="slider">
                <Menu theme="dark" onClick={this.handleClick.bind(this)} style={{ width: "100%" }} defaultSelectedKeys={[this.state.defaultSelectedKeys]}
                      defaultOpenKeys={this.state.defaultOpenKeys} mode="inline" selectedKeys={[this.light]}>
                    {this.renderItem(this.state.menuList)}
                </Menu>
            </div>
        )
    }
    renderItem(data){  // 动态渲染侧边导航栏
        let result = data.map((item,index)=>{
            if(item.children){
                return(
                    <SubMenu title={<span><img src={item.icon} className="img1"/>{item.name}</span>} key={item.key}>
                        {this.renderItem(item.children)}
                    </SubMenu>
                )
            }else{
                return(
                    <Menu.Item key={item.key}>
                        <Link to={item.path}>
                            <span>{item.name}</span>
                        </Link>
                    </Menu.Item>
                )
            }
        });
        return result
    }
    componentDidMount () {
        this.dynamicRouting();
    }
    dynamicRouting() {  // 动态路由渲染
    	let menuList = sessionStorage.getItem("menuList");
    	if(menuList) {
    		let obj = JSON.parse(menuList);
    		if(obj && obj.length) {
    			obj.forEach((item)=>{
    				switch(item.key) {
    					case "1":
    						item.icon = ciagou;
    						break;
						case "2":
							item.icon = jichu;
							break;
						case "3":
							item.icon = cangku;
							break;
						case "4":
							item.icon = mai;
							break;
						case "5":
							item.icon = systems;
							break;
                        case "6":
                            item.icon = cangku;
                            break;
						case "8":
							item.icon = systems;
							break;
    				}
    			})
    		}
    		this.setState({
    			menuList: obj
    		})
    	}else{
    		this.setState({
    			menuList: []
    		})
    	}
    }
    componentWillMount() {  // 此方法里面做的刷新页面导航栏保持高亮显示
        let items = sessionStorage.getItem("menuKey");
        if(items) {
            let str = null;
            if(items.indexOf('-') !== -1) {
                str = items.split('-')[0]
            }
            let defaultSelectedKeys = [items];
            let defaultOpenKeys = [str];
            this.setState({
                defaultSelectedKeys,
                defaultOpenKeys
            });
            this.light = items;
        }
    }

    handleClick({item, key}) {
        sessionStorage.setItem("menuKey", key);
        switch(key) {
            case '0':
                this.state.tabsArr.push({title: '首页', key: '0'});
                break;
            case '1-1':
                this.state.tabsArr.push({title: '采购计划', key: '1-1'});
                break;
            case '1-2':
                this.state.tabsArr.push({title: '采购任务', key: '1-2'});
                break;
            case '1-3':
                this.state.tabsArr.push({title: '采购评级', key: '1-3'});
                break;
            case '1-4':
                this.state.tabsArr.push({title: '采购订单', key: '1-4'});
                break;
            case '1-5':
                this.state.tabsArr.push({title: '采购抽检', key: '1-5'});
                break;
            case '1-6':
                this.state.tabsArr.push({title: '称重扣称', key: '1-6'});
                break;
            case '1-7':
                this.state.tabsArr.push({title: '采购入库', key: '1-7'});
                break;
            case '2-1':
                this.state.tabsArr.push({title: '供应商管理', key: '2-1'});
                break;
            case '2-2':
                this.state.tabsArr.push({title: '果园管理', key: '2-2'});
                break;
            case '2-3':
                this.state.tabsArr.push({title: '仓库管理', key: '2-3'});
                break;
            case '2-4':
                this.state.tabsArr.push({title: '成品管理', key: '2-4'});
                break;
            case '2-5':
                this.state.tabsArr.push({title: '车间管理', key: '2-5'});
                break;
            case '2-7':
                this.state.tabsArr.push({title: '客户管理', key: '2-7'});
                break;
            case '2-8':
                this.state.tabsArr.push({title: '设备管理', key: '2-8'});
                break;
            case '2-9':
                this.state.tabsArr.push({title: '批次管理', key: '2-9'});
                break;
            case '2-10':
                this.state.tabsArr.push({title: '桶管理', key: '2-10'});
                break;
            case '2-11':
                this.state.tabsArr.push({title: '称重管理', key: '2-11'});
                break;
            case '2-12':
                this.state.tabsArr.push({title: '物料管理', key: '2-12'});
                break;
            case '2-13':
                this.state.tabsArr.push({title: '币别', key: '2-13'});
                break;
            case '3-1':
                this.state.tabsArr.push({title: '入库单', key: '3-1'});
                break;
            case '3-2':
                this.state.tabsArr.push({title: '出库单', key: '3-2'});
                break;
            case '3-3':
                this.state.tabsArr.push({title: '原料库存', key: '3-3'});
                break;
            case '3-4':
                this.state.tabsArr.push({title: '成品入库单', key: '3-4'});
                break;
            case '3-5':
                this.state.tabsArr.push({title: '成品出库单', key: '3-5'});
                break;
            case '3-6':
                this.state.tabsArr.push({title: '标签出入记录', key: '3-6'});
                break;
            case '3-9':
                this.state.tabsArr.push({title: '异常出库单', key: '3-9'});
                break;
            case '3-12':
                this.state.tabsArr.push({title: '原料领取', key: '3-12'});
                break;
            case '3-13':
                this.state.tabsArr.push({title: '成品统计', key: '3-13'});
                break;
            case '3-14':
                this.state.tabsArr.push({title: '仓库调拨', key: '3-14'});
                break;
            case '3-15':
                this.state.tabsArr.push({title: '虚仓管理', key: '3-15'});
                break;
            case '3-16':
                this.state.tabsArr.push({title: '借出/归还', key: '3-16'});
                break;
            case '3-17':
                this.state.tabsArr.push({title: '其它入库', key: '3-17'});
                break;
            case '3-18':
                this.state.tabsArr.push({title: '其它出库', key: '3-18'});
                break;
            case '4-1':
                this.state.tabsArr.push({title: '销售订单', key: '4-1'});
                break;
            case '4-2':
                this.state.tabsArr.push({title: '销售发货单', key: '4-2'});
                break;
            case '5-1':
                this.state.tabsArr.push({title: '生产任务', key: '5-1'});
                break;
            case '5-2':
                this.state.tabsArr.push({title: '用料管理', key: '5-2'});
                break;
            case '5-3':
                this.state.tabsArr.push({title: '生产看板', key: '5-3'});
                break;
            case '5-4':
                this.state.tabsArr.push({title: '生产管理', key: '5-4'});
                break;
            case '6-1':
                this.state.tabsArr.push({title: '公章管理', key: '6-1'});
                break;
            case '6-2':
                this.state.tabsArr.push({title: '通知发文', key: '6-2'});
                break;
            case '6-3':
                this.state.tabsArr.push({title: '我的消息', key: '6-3'});
                break;
            case '8-1':
                this.state.tabsArr.push({title: '字典管理', key: '8-1'});
                break;
            case '8-2':
                this.state.tabsArr.push({title: '日志操作', key: '8-2'});
                break;
            case '8-3':
                this.state.tabsArr.push({title: '部门设置', key: '8-3'});
                break;
            case '8-4':
                this.state.tabsArr.push({title: '用户设置', key: '8-4'});
                break;
            case '8-5':
                this.state.tabsArr.push({title: '角色设置', key: '8-5'});
                break;
        }
        this.props.giveAppData({items: this.state.tabsArr, currentItems: key});
    }
}
export default withRouter(Slider);
