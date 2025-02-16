<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png"/>
        <span class="title">{{ systemName }}</span>
      </div>
    </div>
    <div class="login">
      <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
        <a-tab-pane tab="账户密码登录" key="1">
          <a-form @submit="onSubmit" :form="form">

            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                     style="margin-bottom: 24px;"/>
            <a-form-item>
              <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="email"
                  v-decorator="['email', {rules: [{ required: true, message: '请输入邮箱', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user"/>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                  size="large"
                  placeholder="password"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit"
                        type="primary">登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>

      </a-tabs>

    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {login, getRoutesConfig} from '@/services/UserService'
import {setAuthorization} from '@/utils/request'
import {loadRoutes} from '@/utils/routerUtil'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data() {
    return {
      logging: false,
      error: '',
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'login'});
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const email = this.form.getFieldValue('email');
          const password = this.form.getFieldValue('password');
          login(email, password).then(this.afterLogin)
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      if (loginRes.code >= 0) {
        const {user, permissions, roles} = loginRes.data
        this.setUser(user)
        this.setPermissions(permissions)
        this.setRoles(roles)
        this.$store.commit('account/setPermissions', permissions)
        this.$store.commit('account/setRoles', roles)
        this.$store.commit('account/setUser', user)

        setAuthorization({
          token: 'Authorization:' + Math.random(),
          expireAt: new Date(new Date().getTime() + 60 * 5 * 1000)
        })
        // 获取路由配置
        getRoutesConfig().then(result => {
          const routesConfig = result.data.data
          loadRoutes(routesConfig)
          this.$router.push('/dashboard/workplace')
          this.$message.success(loginRes.message, 3)
        })
      } else {
        this.error = loginRes.message
      }
    },

  }
}
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
