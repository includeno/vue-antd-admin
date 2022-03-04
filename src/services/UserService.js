import {USER,LOGIN,REGISTER,ROLES, USER_LIST,ROUTES} from '@/services/api'
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
 * 获取用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getUser(id) {
  return request(USER, METHOD.GET,{id:id});
}

/**
 * 更新用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function updaterUser(id,username, password,roleId) {
  let formdata=new FormData();
  formdata.append("id",id);
  formdata.append("username",username);
  formdata.append("password",password);
  formdata.append("roleId",roleId);
  return request(USER, METHOD.PUT,formdata);
}

/**
 * 删除用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function deleteUser(id) {
  return request(USER, METHOD.DELTET,{id:id});
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

export async function getUserListByPage(page,size,{username,email,deleted}) {
  return request(USER_LIST, METHOD.GET,{
    page:page,
    size:size,
    username:username,
    email:email,
    deleted:deleted,
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
  getUser,
  updaterUser,
  deleteUser,
  getRoleList,
  getUserListByPage,
  logout,
  getRoutesConfig
}
