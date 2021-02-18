import state from "./state";
// import * as types from "./actionsTypes"
export default (prevState = state, actions)=>{
    let newData = JSON.parse(JSON.stringify(prevState))
    // 根据actions x修改数据
    let {type, params} = actions
    switch (type) {
        case "SET_TOKEN_MODAL":
            newData.data1 = params
            break;
        case 'HH':
            newData.hh = params;
            break;
        case 'MODALSHION':
            newData.modalshion = params;
            break;
        default:
            break;
    }
    return newData
}
