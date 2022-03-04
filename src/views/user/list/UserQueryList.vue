<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" @submit="onSubmit" :form="form">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="用户名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-decorator="['username', {rules: [{ required: false, message: '请输入用户名称', whitespace: true}]}]"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item
                  label="用户邮箱"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-decorator="['email', {rules: [{ required: false, message: '请输入邮箱', whitespace: true}]}]"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item
                  label="用户状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select v-decorator="['deleted', {rules: [{ required: false, message: '请选择', whitespace: true}]}]">
                  <a-select-option value="0">有效</a-select-option>
                  <a-select-option value="1">无效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" htmlType="submit">查询</a-button>
<!--          <a-button style="margin-left: 8px">重置</a-button>-->
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'up' : 'down'"/>
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
          {{ text }}
        </div>
        <div slot="action" slot-scope="{text, record}">
          <router-link :to="`/user/detail/${record.id}`">详情</router-link>
          <a style="margin-right: 8px">
            <a-icon type="edit"/>
            <router-link :to="`/user/update/${record.id}`">编辑</router-link>
          </a>
          <a @click="deleteRecord(record.id)">
            <a-icon type="delete"/>
            删除
          </a>

        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {UserService} from '../../../services'
import dateutil from "../../../utils/dateutil";

const columns = [
  {
    title: '用户名称',
    dataIndex: 'username'
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    scopedSlots: {customRender: 'description'}
  },
  {
    title: '用户创建时间',
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

function getUserListByPage(callback,current,size,{username,email,deleted}) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  function loadData(current,size,{username,email,deleted}) {
    UserService.getUserListByPage(current,size,{username,email,deleted}).then((response)=>{
      if(response!=null && response.data.code>0){
        const records=response.data.data.records;
        const totals=response.data.data.total;
        const data = [];
        records.forEach(r => {
          data.push({
            id: r["id"],
            username: r["username"],
            email: r["email"],
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
  timeout = setTimeout(loadData(current,size,{username:username,email:email,deleted:deleted}), 300);
}

export default {
  name: 'UserQueryList',
  components: {StandardTable},
  data() {
    return {
      form: this.$form.createForm(this),
      username:undefined,
      email:undefined,
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
  // authorize: {
  //   deleteRecord: 'delete'
  // },
  mounted() {
    this.loadData(null,null,null);
  },
  methods: {
    loadData(username,email,deleted){
      getUserListByPage((data,totals) => {
        this.dataSource=data;
        this.total=totals;
        this.pagination={
          total:this.total,
          pageSize:10,
          showTotal: total => `Total ${total} items`, // 显示总数
        }
      },this.current,this.pageSize,{username:username,email:email,deleted:deleted});
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          const username = this.form.getFieldValue('username');
          const email = this.form.getFieldValue('email');
          const deleted = this.form.getFieldValue('deleted');
          if(username!=""){
            this.username=username;
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
          this.deleted=deleted;
          this.loadData(this.username,this.email,this.deleted);
        }
      })
    },
    deleteRecord(id) {
      this.dataSource = this.dataSource.filter(item => item.id !== id)
      this.selectedRows = this.selectedRows.filter(item => item.id !== id)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear(data) {
      this.$message.info('您清空了勾选的所有行')
      console.log("onClear(data):"+JSON.stringify(data));
    },
    onStatusTitleClick(data) {
      this.$message.info('你点击了状态栏表头')
      console.log("onStatusTitleClick:"+JSON.stringify(data));
    },
    onChange({current,pageSize}) {
      this.current=current;
      this.pageSize=pageSize;
      this.loadData();
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    addNew() {
      this.dataSource.unshift({
        key: this.dataSource.length,
        username: 'username ' + this.dataSource.length,
        description: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: '2018-07-26'
      })
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
