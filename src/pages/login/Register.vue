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

        <a-tab-pane tab="账户注册" key="1">
          <a-form @submit="onRegister" :form="registerform">

            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                     style="margin-bottom: 24px;"/>
            <a-form-item>
              <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="username"
                  v-decorator="['username', {rules: [{ required: true, message: '请输入用户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user"/>
              </a-input>
            </a-form-item>
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
                  placeholder="请输入密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password1', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-input
                  size="large"
                  placeholder="请再次输入密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-decorator="['password2', {rules: [{ required: true, message: '请再次输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit"
                        type="primary">注册
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
import {registercommon} from '@/services/UserService'

export default {
  name: 'Register',
  components: {CommonLayout},
  data() {
    return {
      logging: false,
      error: '',
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'login'});
    this.registerform = this.$form.createForm(this, {name: 'register'});
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    }
  },
  methods: {

    onRegister(e){
      e.preventDefault()
      this.registerform.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const username = this.registerform.getFieldValue('username');
          const email = this.registerform.getFieldValue('email');
          const password1 = this.registerform.getFieldValue('password1');
          const password2 = this.registerform.getFieldValue('password2');
          if(password1!=password2){
            this.$error("两次密码不一致");
          }
          else{
            registercommon(username,email, password1).then(this.afterRegister)
          }
        }
      })
    },
    afterRegister(res) {
      this.logging = false;
      const loginRes = res.data
      if (loginRes.code >= 0) {
        this.registerform.resetFields("username")
        this.registerform.resetFields("email")
        this.registerform.resetFields("password1")
        this.registerform.resetFields("password2")
        this.$info("注册成功")
        this.$router.push('/login');
      } else {
        this.registerform.resetFields("password1")
        this.registerform.resetFields("password2")
        this.$error(loginRes.message);
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
