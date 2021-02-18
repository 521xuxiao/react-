import loadable from './loadable.js'
const ProcurementPlan = loadable(()=>import('../components/procurementPlan/procurementPlan.js'));
const PurchasingTask = loadable(()=>import('../components/purchasingTask/purchasingTask.js'));
const QualityOrder = loadable(()=>import('../components/qualityOrder/qualityOrder.js'));
const PurchaseOrder = loadable(()=>import('../components/purchaseOrder/purchaseOrder.js'));
const Dictionary0peration = loadable(()=>import('../components/dictionary0peration/dictionary0peration.js'));
const Journalizing = loadable(()=>import('../components/journalizing/journalizing.js'));
const UserBu = loadable(()=>import('../components/userBu/userBu.js'));
const Branch = loadable(()=>import('../components/branch/branch.js'));
const Provider = loadable(()=>import('../components/provider/provider.js'));
const RoleList = loadable(()=>import('../components/roleList/roleList.js'));
const StoreManagement = loadable(()=>import('../components/storeManagement/storeManagement.js'));
const Distributor = loadable(()=>import('../components/distributor/distributor.js'));
const InList = loadable(()=>import('../components/inList/inList.js'));
const Exception = loadable(()=>import('../components/exception/exception.js'));
const ProductManagement = loadable(()=>import('../components/productManagement/productManagement.js'));
const ShopManagement = loadable(()=>import('../components/shopManagement/shopManagement.js'));
// const CustomerGroups = loadable(()=>import('../components/customerGroups/customerGroups.js'));
const Client = loadable(()=>import('../components/client/client.js'));
const OutboundDeliveryOrder = loadable(()=>import('../components/outboundDeliveryOrder/outboundDeliveryOrder.js'));
const SalesOrder = loadable(()=>import('../components/salesOrder/salesOrder.js'));
const Production = loadable(()=>import('../components/production/production.js'));
const MaterialInventory = loadable(()=>import('../components/materialInventory/materialInventory.js'));
const SalesInvoice = loadable(()=>import('../components/salesInvoice/salesInvoice.js'));
const MaterialManagement = loadable(()=>import('../components/materialManagement/materialManagement.js'));
const Billboard = loadable(()=>import('../components/billboard/billboard.js'));
const ProductionManagement = loadable(()=>import('../components/productionManagement/productionManagement.js'));
const DeviceSetting = loadable(()=>import('../components/deviceSetting/deviceSetting.js'));
const Lot = loadable(()=>import('../components/lot/lot.js'));
const BarrelsManagement = loadable(()=>import('../components/barrelsManagement/barrelsManagement.js'));
const WeighManeger = loadable(()=>import('../components/weighManeger/weighManeger.js'));
const FinishedProductsStorage = loadable(()=>import('../components/finishedProductsStorage/finishedProductsStorage.js'));
const FinishedProductOut = loadable(()=>import('../components/finishedProductOut/finishedProductOut.js'));
const LabelAccessRecord = loadable(()=>import('../components/labelAccessRecord/labelAccessRecord.js'));
const ProcurementSampling = loadable(()=>import('../components/procurementSampling/procurementSampling.js'));
const WeighingBuckles = loadable(()=>import('../components/weighingBuckles/weighingBuckles.js'));
const Home = loadable(()=>import('../components/home/home.js'));
const Materiel = loadable(()=>import('../components/materiel/materiel.js'));
const PurchasingStorage = loadable(()=>import('../components/purchasingStorage/purchasingStorage.js'));
const Cachet = loadable(()=>import('../components/cachet/cachet.js'));
const Currency = loadable(()=>import('../components/currency/currency.js'));
const RawMaterials = loadable(()=>import('../components/rawMaterials/rawMaterials.js'));
const FinishedStatistics = loadable(()=>import('../components/finishedStatistics/finishedStatistics.js'));
const WarehouseAllotting = loadable(()=>import('../components/warehouseAllotting/warehouseAllotting.js'));
const WarehouseManagement = loadable(()=>import('../components/warehouseManagement/warehouseManagement.js'));
const BorrowLendReturn = loadable(()=>import('../components/borrowLendReturn/borrowLendReturn.js'));
const OtherWarehouseIn = loadable(()=>import('../components/otherWarehouseIn/otherWarehouseIn.js'));
const OtherWarehouseOut = loadable(()=>import('../components/otherWarehouseOut/otherWarehouseOut.js'));
const NotifyPost = loadable(()=>import('../components/notifyPost/notifyPost.js'));
const MessageLists = loadable(()=>import('../components/messageLists/messageLists.js'));



const MenuConfig = loadable(()=>import('../components/menuConfig/menuConfig.js'));
export default [
	{
		name: "首页",
		path: "/home",
		component: Home,
		id: "0"
	},
	{
	    name: "采购计划",
	    path: "/app/procurementPlan",
	    component: ProcurementPlan,
	    id: "1-1"
	},
	{
	    name: "采购任务",
	    path: "/app/purchasingTask",
	    component: PurchasingTask,
	    id: "1-2"
	},
	{
	    name: "采购评级",
	    path: "/app/qualityOrder",
	    component: QualityOrder,
	    id: "1-3"
	},
	{
	    name: "采购订单",
	    path: "/app/purchaseOrder",
	    component: PurchaseOrder,
	    id: "1-4"
	},
	{
		name: "采购抽检",
		path: "/app/procurementSampling",
		component: ProcurementSampling,
		id: "1-5"
	},
	{
		name: "称重扣称",
		path: "/app/weighingBuckles",
		component: WeighingBuckles,
		id: "1-6"
	},
	{
		name: "采购入库",
		path: "/app/purchasingStorage",
		component: PurchasingStorage,
		id: "1-7"
	},
	{
	    name: "字典管理",
	    path: "/app/dictionary0peration",
	    component: Dictionary0peration,
	    id: "8-1"
	},
	{
	    name: "日志操作",
	    path: "/app/journalizing",
	    component: Journalizing,
	    id: "8-2"
	},
	{
	    name: "用户设置",
	    path: "/app/userBu",
	    component: UserBu,
	    id: "8-3"
	},
	{
	    name: "部门设置",
	    path: "/app/branch",
	    component: Branch,
	    id: "8-4"
	},
	{
	    name: "供应商管理",
	    path: "/app/provider",
	    component: Provider,
	    id: "2-1"
	},
	{
	    name: "角色设置",
	    path: "/app/roleList",
	    component: RoleList,
	    id: "8-5"
	},
	{
	    name: "仓库管理",
	    path: "/app/storeManagement",
	    component: StoreManagement,
	    id: "2-3"
	},
	{
	    name: "果园管理",
	    path: "/app/distributor",
	    component: Distributor,
	    id: "2-2"
	},
	{
	    name: "入库单",
	    path: "/app/inList",
	    component: InList,
	    id: "3-1"
	},

	{
		name: "原料领取",
		path: "/app/rawMaterials",
		component: RawMaterials,
		id: "3-12"
	},
	{
		name: "成品统计",
		path: "/app/finishedStatistics",
		component: FinishedStatistics,
		id: "3-13"
	},
	{
		name: "仓库调拨",
		path: "/app/warehouseAllotting",
		component: WarehouseAllotting,
		id: "3-14"
	},
	{
		name: "虚仓管理",
		path: "/app/warehouseManagement",
		component: WarehouseManagement,
		id: "3-15"
	},
	{
		name: "借出/归还",
		path: "/app/borrowLendReturn",
		component: BorrowLendReturn,
		id: "3-16"
	},
	{
		name: "其它入库",
		path: "/app/otherWarehouseIn",
		component: OtherWarehouseIn,
		id: "3-17"
	},
	{
		name: "其它出库",
		path: "/app/otherWarehouseOut",
		component: OtherWarehouseOut,
		id: "3-18"
	},
	{
		name: "异常处理单",
		path: "/app/exception",
		component: Exception,
		id: "3-9"
	},
	{
	    name: "成品管理",
	    path: "/app/productManagement",
	    component: ProductManagement,
	    id: "2-4"
	},
	{
	    name: "车间管理",
	    path: "/app/shopManagement",
	    component: ShopManagement,
	    id: "2-5"
	},
	{
	    name: "客户管理",
	    path: "/app/client",
	    component: Client,
	    id: "2-7"
	},
	{
		name: "设备管理",
		path: "/app/deviceSetting",
		component: DeviceSetting,
		id: "2-8"
	},
	{
		name: "批次管理",
		path: "/app/lot",
		component: Lot,
		id: "2-9"
	},
	{
		name: "桶管理",
		path: "/app/barrelsManagement",
		component: BarrelsManagement,
		id: "2-10"
	},
	{
		name: "称重管理",
		path: "/app/weighManeger",
		component: WeighManeger,
		id: "2-11"
	},
	{
		name: "物料管理",
		path: "/app/materiel",
		component: Materiel,
		id: "2-12"
	},
	{
		name: "币别",
		path: "/app/currency",
		component: Currency,
		id: "2-13"
	},

	{
	    name: "出库单",
	    path: "/app/outboundDeliveryOrder",
	    component: OutboundDeliveryOrder,
	    id: "3-2"
	},
	{
		name: "原料库存",
		path: "/app/materialInventory",
		component: MaterialInventory,
		id: "3-3"
	},
	{
		name: "成品入库单",
		path: "/app/finishedProductsStorage",
		component: FinishedProductsStorage,
		id: "3-4"
	},

	{
		name: "成品出库单",
		path: "/app/finishedProductOut",
		component: FinishedProductOut,
		id: "3-5"
	},
	{
		name: "标签出入记录",
		path: "/app/labelAccessRecord",
		component: LabelAccessRecord,
		id: "3-6"
	},

	{
		name: "原料库存",
		path: "/app/finishedProductsStorage",
		component: FinishedProductsStorage,
		id: "3-4"
	},
	{
	    name: "销售发货单",
	    path: "/app/salesInvoice",
	    component: SalesInvoice,
	    id: "4-2"
	},
	{
		name: "销售订单",
		path: "/app/salesOrder",
		component: SalesOrder,
		id: "4-1"
	},
	{
	    name: "生产任务",
	    path: "/app/production",
	    component: Production,
	    id: "5-1"
	},
	{
		name: "用料管理",
		path: "/app/materialManagement",
		component: MaterialManagement,
		id: "5-2"
	},
	{
		name: "生产管理",
		path: "/app/productionManagement",
		component: ProductionManagement,
		id: "5-4"
	},
	{
		name: "生产看板",
		path: "/app/billboard",
		component: Billboard,
		id: "5-3"
	},
	{
		name: "公章管理",
		path: "/app/cachet",
		component: Cachet,
		id: "6-1"
	},
	{
		name: "通知发文",
		path: "/app/notifyPost",
		component: NotifyPost,
		id: "6-2"
	},
	{
		name: "我的消息",
		path: "/app/messageLists",
		component: MessageLists,
		id: "6-3"
	},
	{
	    name: "页面配置",
	    path: "/app/menuConfig",
	    component: MenuConfig,
	    id: "21"
	}
]