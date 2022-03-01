<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" @submit="onSubmit" :form="form">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="网页链接"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-decorator="['url', {rules: [{ required: false, message: '请输入网页链接', whitespace: true}]}]"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24" v-if="userId===-1">
              <a-form-item
                  label="用户邮箱"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-decorator="['email', {rules: [{ required: false, message: '请输入邮箱', whitespace: true}]}]"/>
              </a-form-item>
            </a-col>
        </a-row>
          <a-row v-if="advanced">
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="状态"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select placeholder="请选择" v-decorator="['status', {rules: [{ required: false, message: '请输入网页链接', whitespace: true}]}]">
                <a-select-option value="0">待审核</a-select-option>
                <a-select-option value="1">审核通过</a-select-option>
                <a-select-option value="-1">审核不通过</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="删除"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择" v-decorator="['deleted', {rules: [{ required: false, message: '请输入网页链接', whitespace: true}]}]">
                  <a-select-option value="0">有效</a-select-option>
                  <a-select-option value="1">无效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

        </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" htmlType="submit">查询</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <standard-table
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        :pagination="pagination"
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <div slot="description" slot-scope="{text}">
          {{text}}
        </div>
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px">
            <a-icon type="edit"/>编辑
          </a>
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />删除1
          </a>
          <router-link :to="`/list/query/detail/${record.key}`" >详情</router-link>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import dateutil from "../../../utils/dateutil";
import {CopyrightCommitService} from "../../../services";

const columns = [
  {
    title: '网页链接',
    dataIndex: 'url',
    scopedSlots: {customRender: 'description'}
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '平台',
    dataIndex: 'platform',
  },
  {
    title: '平台Hash',
    dataIndex: 'platformHash',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    sorter: true
  },

  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]
let timeout;

function getCopyrightCommitListByPage(callback,current,size,{url,email,userId,status,deleted}) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  function loadData(current,size,{url,email,userId,status,deleted}) {
    CopyrightCommitService.getCopyrightRequestListByPage(current,size,{url,email,userId,status,deleted}).then((response)=>{
      if(response!=null && response.data.code>0){
        const records=response.data.data.records;
        const totals=response.data.data.total;
        const data = [];
        records.forEach(r => {
          data.push({
            id: r["id"],
            userId: r["userId"],
            url: r["url"],
            platform: r["platform"],
            platformHash: r["platformHash"],
            status: r["status"],
            createTime: dateutil.getDateStringFromTimestamp(r["createTime"]),
            updateTime: dateutil.getDateStringFromTimestamp(r["updateTime"]),
          });
        });
        callback(data,totals)
      }
      else{
        callback([],0)
      }
    });
  }
  timeout = setTimeout(loadData(current,size,{url:url,email:email,userId:userId,status:status,deleted:deleted}), 300);
}

export default {
  name: 'CopyrightCommitQueryList',
  components: {StandardTable},
  data () {
    return {
      user:this.$store.getters["account/user"],
      form: this.$form.createForm(this),
      url:undefined,
      email:undefined,
      userId:-1,
      status:undefined,
      deleted:undefined,

      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      current:1,
      pageSize:10,
      total:0,
      pagination: {
        pageSize:10,
        showTotal: total => `Total ${total} items`, // 显示总数
      }
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  beforeCreate() {

    console.log("beforeCreate this.userId=:"+this.userId);
  },
  mounted() {
    let roles=this.$store.getters["account/roles"];
    console.log(JSON.stringify(roles))
    let rolecode=""
    for(let index in roles){
      if(roles[index].code=='admin'||roles[index].code=='audit'){

        rolecode=roles[index].code;
        break;
      }
    }
    if(rolecode!=""){
      this.userId=-1;
    }
    else{
      let user=this.$store.getters["account/user"];
      this.userId=user.id;
    }
    console.log("mounted this.userId=:"+this.userId);
    this.loadData(null,null,this.userId,null,null);
    console.log("CopyrightCommitQueryList.vue");
  },
  methods: {
    loadData(url,email,userId,status,deleted){
      console.log("loadData userId:"+userId)
      if(userId==-1){
        userId=null;
      }
      getCopyrightCommitListByPage((data,totals) => {
        this.dataSource=data;
        this.total=totals;
        this.pagination={
          total:this.total,
          pageSize:10,
          showTotal: total => `Total ${total} items`, // 显示总数
        }
      },this.current,this.pageSize,{url:url,email:email,userId:userId,status:status,deleted:deleted});
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          const url = this.form.getFieldValue('url');
          const email = this.form.getFieldValue('email');
          const status = this.form.getFieldValue('status');
          const deleted = this.form.getFieldValue('deleted');

          if(url!=""){
            this.url=url;
          }
          else{
            this.username=null;
          }
          if(email!=""){
            this.email=email;
          }
          else{
            this.email=null;
          }
          if(status!=""){
            this.status=status;
          }
          else{
            this.status=null;
          }
          if(deleted!=""){
            this.deleted=deleted;
          }
          else{
            this.deleted=null;
          }
          this.loadData(this.url,this.email,this.userId,this.status,this.deleted);
        }
      })
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange({current,pageSize}) {
      this.current=current;
      this.pageSize=pageSize;
      this.loadData();
    },
    onSelectChange(data) {
      console.log(JSON.stringify(data))
      this.$message.info('选中行改变了')
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
