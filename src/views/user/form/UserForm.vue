<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form
        id="user-add-form"
        :form="form"
        @submit="handleSubmit"
    >
      <a-form-item
        :label="$t('username')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('usernameInput')" v-decorator="[
          'username',
          { rules: [{ required: true, message: $t('usernameInput') }] },
        ]"
        />
      </a-form-item>

      <a-form-item
        :label="$t('password')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('passwordInput')" v-decorator="[
          'password',
          { rules: [{ required: true, message: $t('passwordInput') }] },
        ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('email')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('emailInput')" v-decorator="[
          'email',
          { rules: [{ required: true, message: $t('emailInput') }] },
        ]"
        />
      </a-form-item>

      <a-form-item
        :label="$t('role')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="true"
        :help="$t('roleSelect')"
      >
        <a-select

            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="true"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch"
            @change="handleChange"
            v-decorator="[
              'roleId',
              { rules: [{ required: true, message: $t('roleSelect') }] },
            ]"
        >
          <a-select-option v-for="d in data" :key="d.value">
            {{ d.text }}
          </a-select-option>
        </a-select>

      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" html-type="submit">{{$t('submit')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import {UserService} from '../../../services'
let timeout;

function getRoleList(callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function loadData() {
    UserService.getRoleList().then((response)=>{
      const result = response.data.data;
      console.log("result:"+JSON.stringify(result))
      const data = [];
      result.forEach(r => {
        data.push({
          value: r["roleId"],
          text: r["rolename"],
        });
      });
      callback(data);
    });
  }
  timeout = setTimeout(loadData, 300);
}

export default {
  name: 'UserForm',
  i18n: require('./i18n'),
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'normal_login'});
  },
  mounted() {
    getRoleList(data => (this.data = data));
  },
  data () {
    return {
      data: [],
      value: undefined,
    }
  },
  methods:{
    async handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response=await UserService.register(values.username,values.password,values.email,values.roleId)
          if(response!=null && response.data!=null){
            if(response.data.code<0){
              this.$message.error(response.data.message);
              this.form.resetFields("password")
            }
            else{
              this.$message.info(response.data.message);
              this.form.resetFields("username")
              this.form.resetFields("password")
              this.form.resetFields("email")
              this.form.resetFields("roleId")
            }
          }
          else{
            this.$message.error('服务器错误')
          }
        }
      });

    },

    handleSearch(value) {
      this.value=value;
    },
    handleChange(value) {
      this.value=value;
    },
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
