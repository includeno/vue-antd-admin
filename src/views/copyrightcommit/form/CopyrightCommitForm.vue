<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form
        :form="form"
        @submit="handleSubmit"
    >
<!--      email,url,platform,platformHash,comment-->
      <a-form-item
          :label="$t('url')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('urlInput')" v-decorator="[
          'url',
          { rules: [{ required: true, message: $t('urlInput') }] },
        ]"
        />
      </a-form-item>
      <a-form-item
          :label="$t('platform')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('platformInput')" v-decorator="[
          'platform',
          { rules: [{ required: true, message: $t('platformInput') }] },
        ]"
        />
      </a-form-item>
      <a-form-item
          :label="$t('platformHash')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('platformHashInput')" v-decorator="[
          'platformHash',
          { rules: [{ required: true, message: $t('platformHashInput') }] },
        ]"
        />
      </a-form-item>
      <a-form-item
          :label="$t('comment')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('commentInput')" v-decorator="[
          'comment',
          { rules: [{ required: true, message: $t('commentInput') }] },
        ]"
        />
      </a-form-item>

      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" html-type="submit">{{$t('submit')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import CopyrightRequestService from "../../../services/CopyrightCommitService";
export default {
  name: 'CopyrightCommitForm',
  i18n: require('./i18n'),
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'CopyrightCommitForm'});
  },
  data () {
    return {
      value: 1
    }
  },
  methods:{
    async handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields(async (err, values) => {
        let user=this.$store.getters["account/user"];
        if (!err) {
          let response=await CopyrightRequestService.addCopyrightRequest(user.id,values.url,values.platform,values.platformHash,values.comment)
          if(response!=null && response.data!=null){
            if(response.data.code<0){
              this.$message.error(response.data.message);
            }
            else{
              this.$message.info(response.data.message);
              this.form.resetFields("url")
              this.form.resetFields("platform")
              this.form.resetFields("platformHash")
              this.form.resetFields("comment")
            }
          }
          else{
            this.$message.error('服务器错误')
          }
        }
      });

    },
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
