<template>
    <div>
      <a-card :bordered="false">

        <detail-list title="用户信息">
          <detail-list-item term="用户名" >{{username}}</detail-list-item>
          <a-divider style="margin-bottom: 32px"/>
          <detail-list-item term="Email" >{{email}}</detail-list-item>
          <a-divider style="margin-bottom: 32px"/>
          <detail-list-item term="身份" >{{roles}}</detail-list-item>
          <a-divider style="margin-bottom: 32px"/>
          <detail-list-item term="是否有效" >{{deleted}}</detail-list-item>
          <a-divider style="margin-bottom: 32px"/>
          <detail-list-item term="创建日期">{{createTime}}</detail-list-item>
          <a-divider style="margin-bottom: 32px"/>
          <detail-list-item term="更新日期">{{updateTime}}</detail-list-item>
        </detail-list>
      </a-card>
    </div>
</template>

<script>
import DetailList from '@/components/tool/DetailList'
import {UserService} from '../../../services'
import dateutil from "../../../utils/dateutil";
//import PageLayout from '@/layouts/PageLayout'

const DetailListItem = DetailList.Item

export default {
  name: 'UserDetail',
  components: {DetailListItem, DetailList},
  data () {
    return {
      username:"",
      email:"",
      roles:[],
      deleted:"",
      createTime:null,
      updateTime:null,
    }
  },
  mounted() {
    this.loadUserInfo();
  },
  methods:{
    loadUserInfo(){
      let id=this.$route.params.id;
      UserService.getUser(id).then(response=>{
        let user=response.data.data;
        if(user.deleted==0){
          this.deleted="有效";
        }
        else{
          this.deleted="无效";
        }
        this.username=user.username;
        this.email=user.email;

        let str=""
        for(let index in user.roles){
          str=str+user.roles[index].name+" ";
        }
        this.roles=str;

        this.createTime=dateutil.getDateStringFromTimestamp(user.createTime);
        this.updateTime=dateutil.getDateStringFromTimestamp(user.updateTime);
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    color: @title-color;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
