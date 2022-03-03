import {LOGIN,REGISTER,ROLES, USER_LIST,ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param username 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(email, password) {
  let formdata=new FormData();
  formdata.append("email",email);
  formdata.append("password",password);
  return request(LOGIN, METHOD.POST, formdata);
}

/**
 * 管理员注册服务
 * @param username 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function register(username, password,email,roleId) {
  let formdata=new FormData();
  formdata.append("username",username);
  formdata.append("email",email);
  formdata.append("password",password);
  formdata.append("roleId",roleId);
  return request(REGISTER, METHOD.POST, formdata);
}

/**
 * 普通用户注册服务
 * @param username 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function registercommon(username, password,email) {
  let formdata=new FormData();
  formdata.append("username",username);
  formdata.append("email",email);
  formdata.append("password",password);
  return request(REGISTER, METHOD.POST, formdata);
}

/**
 * 获取所有角色
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getRoleList() {
  return request(ROLES, METHOD.GET);
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

export async function getUserListByPage(page,size,{username,email}) {
  return request(USER_LIST, METHOD.GET,{
    page:page,
    size:size,
    username:username,
    email:email,
  })
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  register,
  registercommon,
  getRoleList,
  getUserListByPage,
  logout,
  getRoutesConfig
}
