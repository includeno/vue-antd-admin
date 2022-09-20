<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form
        id="verify-update-form"
        :form="form"
        @submit="handleSubmit"
    >

      <a-form-item
          :label="$t('url')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input disabled v-model="url"
        />
      </a-form-item>

      <a-form-item
          :label="$t('comment')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input disabled v-model="comment"
        />
      </a-form-item>

      <a-form-item
          :label="$t('createTime')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input disabled v-model="createTime"
        />
      </a-form-item>

      <a-form-item
          :label="$t('updateTime')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input disabled v-model="updateTime"
        />
      </a-form-item>

      <a-form-item
          :label="$t('deleted')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input disabled v-model="deleted"
        />
      </a-form-item>

      <a-form-item
          :label="$t('status')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
          :required="true"
      >
      <a-select
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="true"
          :filter-option="false"
          :not-found-content="null"
          v-decorator="[
              'status',
              { rules: [{ required: true, message: $t('status') }] },
            ]"
      >
        <a-select-option v-for="d in statuslist" :key="d.value">
          {{ d.text }}
        </a-select-option>
      </a-select>
      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" html-type="submit">{{ $t('submit') }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import {CopyrightCommitService} from '../../../services'
import dateutil from "../../../utils/dateutil";

export default {
  name: 'VerifyUpdateForm',
  i18n: require('./i18n'),
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'update'});
  },
  async mounted() {
    this.loadCopyrightCommitInfo();
  },
  data() {
    return {
      userId:null,
      value: undefined,
      statuslist:[{text:"审核通过",value:1},{text:"审核不通过",value:-1}],

      url: null,
      comment: null,
      status: null,
      createTime: null,
      updateTime: null,
      deleted: null,
    }
  },
  methods: {
    loadCopyrightCommitInfo() {

      let id = this.$route.params.id;
      CopyrightCommitService.getCopyrightCommit(id).then(response => {
        let copyrightcommit = response.data.data;
        this.url = copyrightcommit.url;
        this.comment = copyrightcommit.comment;

        if (copyrightcommit.deleted == 0) {
          this.deleted = "有效";
        } else {
          this.deleted = "无效";
        }
        this.createTime = dateutil.getDateStringFromTimestamp(copyrightcommit.createTime);
        this.updateTime = dateutil.getDateStringFromTimestamp(copyrightcommit.updateTime);
      })
    },
    async handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields(async (err, values) => {
        if (!err) {
          let user=this.$store.getters["account/user"];
          this.userId=user.id;
          console.log("this.status:"+values.status)
          console.log("this.userId:"+this.userId)
          let response = await CopyrightCommitService.audit(this.$route.params.id, this.userId,values.status)
          if (response != null && response.data != null) {
            if (response.data.code < 0) {
              this.$message.error(response.data.message);
              this.form.resetFields("status")
            } else {
              this.$message.info(response.data.message);
            }
          } else {
            this.$message.error('服务器错误')
          }
        }
      });

    },

    handleSearch(value) {
      this.value = value;
    },
    handleChange(value) {
      this.value = value;
    },
  },
  computed: {}
}
</script>

<style scoped>

</style>
