/**
 * 获取路由需要的权限
 * @param permissions
 * @param route
 * @returns {Permission}
 */
const getRoutePermission = (permissions, route) => {
  //console.log("getRoutePermission "+JSON.stringify(permissions))
  //console.log("route.meta.authority "+JSON.stringify(route.meta.authority))
  return permissions.find(permission => permission.operation === route.meta.authority.permission)
}
/**
 * 获取路由需要的角色
 * @param roles
 * @param route
 * @returns {Array[Role]}
 */
const getRouteRole = (roles, route) => {
  const requiredRoles = route.meta.authority.role

  //TODO 修改角色判断方案
  return requiredRoles ? roles.filter(role => requiredRoles.findIndex(required => required === role.code) !== -1) : []
}
/**
 * 判断是否已为方法注入权限认证
 * @param method
 * @returns {boolean}
 */
const hasInjected = (method) => method.toString().indexOf('//--auth-inject') !== -1

/**
 * 操作权限校验
 * @param authConfig
 * @param permission
 * @param role
 * @param permissions
 * @param roles
 * @returns {boolean}
 */
const auth = function(authConfig, permission, role, permissions, roles) {
  console.log("auth authConfig"+JSON.stringify(authConfig))
  console.log("auth permission"+JSON.stringify(permission))
  console.log("auth role"+JSON.stringify(role))
  console.log("auth permissions"+JSON.stringify(permissions))
  console.log("auth roles"+JSON.stringify(roles))
  const {check, type} = authConfig
  if (check && typeof check === 'function') {
    return check.apply(this, [permission, role, permissions, roles])
  }
  if (type === 'permission') {
    return checkFromPermission(check, permission)
  } else if (type === 'role') {
    return checkFromRoles(check, roles)
  } else {
    return checkFromPermission(check, permission) || checkFromRoles(check, roles)
  }
}

/**
 * 检查权限是否有操作权限
 * @param check 需要检查的操作权限
 * @param permission 权限
 * @returns {boolean}
 */
const checkFromPermission = function(check, permission) {
  return permission && permission.operation && permission.operation.indexOf(check) !== -1
  //TODO 修改权限判断方案
}

/**
 * 检查 roles 是否有操作权限
 * @param check 需要检查的操作权限
 * @param roles 角色数组
 * @returns {boolean}
 */
const checkFromRoles = function(check, roles) {
  if (!roles) {
    return false
  }
  console.log("checkFromRoles roles:"+JSON.stringify(roles));
  console.log("checkFromRoles check:"+JSON.stringify(check));
  //let rolesSet=new Set(roles);
  console.log("checkFromRoles roles:"+JSON.stringify(new Set(roles.map(a=>a.code))));
  console.log("checkFromRoles check:"+JSON.stringify(new Set(check)));

  for (let role of roles) {
    console.log("checkFromRoles role:"+JSON.stringify(role));
    for(let item in check){
      if(check[item]==role.code){
        console.log("=====")
        return true;
      }
    }
  }
  return false
}

const checkInject = function (el, binding,vnode) {
  const type = binding.arg
  const check = binding.value
  const instance = vnode.context
  const $auth = instance.$auth
  if (!$auth || !$auth(check, type)) {
    addDisabled(el)
  } else {
    removeDisabled(el)
  }
}

const addDisabled = function (el) {
  if (el.tagName === 'BUTTON') {
    el.disabled = true
  } else {
    el.classList.add('disabled')
  }
  el.setAttribute('title', '无此权限')
}

const removeDisabled = function (el) {
  el.disabled = false
  el.classList.remove('disabled')
  el.removeAttribute('title')
}

const AuthorityPlugin = {
  install(Vue) {
    Vue.directive('auth', {
      bind(el, binding,vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10)
      },
      componentUpdated(el, binding,vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10)
      },
      unbind(el) {
        removeDisabled(el)
      }
    })
    Vue.mixin({
      beforeCreate() {
        if (this.$options.authorize) {
          const authorize = this.$options.authorize
          console.log("authorize:"+JSON.stringify(authorize));
          Object.keys(authorize).forEach(key => {
            if (this.$options.methods[key]) {
              const method = this.$options.methods[key]
              if (!hasInjected(method)) {
                let authConfig = authorize[key]
                if(typeof authConfig === 'string'){
                  authConfig={check: authConfig}
                }
                else if(Array.isArray(authConfig)){
                  authConfig={check:authConfig}
                }
                else if(authConfig.role!=null){
                  authConfig={check:authConfig.role,type:'role'}
                }
                else if(authConfig.permission!=null){
                  authConfig={check:authConfig.permission,type:'permission'}
                }
                const {check, type, onFailure} = authConfig
                console.log("authConfig:"+JSON.stringify(authConfig));
                console.log("check:"+JSON.stringify(check));
                console.log("type:"+JSON.stringify(type));
                this.$options.methods[key] = function () {
                  //--auth-inject
                  if (this.$auth(check, type)) {
                    return method.apply(this, arguments)
                  } else {
                    if (onFailure && typeof onFailure === 'function') {
                      this[`$${check}Failure`] = onFailure
                      this.$message.error(`对不起，您没有操作权限222：${check}`)
                      return this[`$${check}Failure`](check)
                    } else {
                      this.$message.error(`对不起，您没有操作权限：${check}`)
                    }
                    return 0
                  }
                }
              }
            }
          })
        }
      },
      methods: {
        /**
         * 操作权限校验
         * @param check 需要校验的操作名
         * @param type 校验类型，通过 permission 校验，还是通过 role 校验。
         * 如未设置，则自动识别，如匹配到当前路由 permission 则 type = permission，否则 type = role
         * @returns {boolean} 是否校验通过
         */
        $auth(check, type) {
          const permissions = this.$store.getters['account/permissions']
          const roles = this.$store.getters['account/roles']
          //console.log("$auth:"+JSON.stringify(permissions))
          //console.log("$auth:"+JSON.stringify(roles))
          const permission = getRoutePermission(permissions, this.$route)
          const role = getRouteRole(roles, this.$route)
          return auth.apply(this, [{check, type}, permission, role, permissions, roles])
        }
      }
    })
  }
}

export default AuthorityPlugin
