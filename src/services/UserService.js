import {LOGIN,REGISTER,ROLES, ROUTES} from '@/services/api'
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
 * 注册服务
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
 * 获取所有角色
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getRoleList() {
  return request(ROLES, METHOD.GET);
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
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
  getRoleList,
  logout,
  getRoutesConfig
}
