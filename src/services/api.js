//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  //user
  LOGIN: `${BASE_URL}/user/login`,
  REGISTER: `${BASE_URL}/user/register`,
  USER_LIST: `${BASE_URL}/users/page`,
  //role
  ROLES: `${BASE_URL}/roles`,//仅获取

  //copyright
  COPYRIGHT_REQUEST: `${BASE_URL}/copyrightrequest`,//添加请求 修改请求 删除请求
  COPYRIGHT_REQUEST_LIST:`${BASE_URL}/copyrightrequests/page`,//查询请求
  COPYRIGHT_LIST: `${BASE_URL}/copyrights/page`,//查询记录

  ROUTES: `${BASE_URL}/routes`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,
}
