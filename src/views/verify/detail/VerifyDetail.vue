<template>
  <div>
    <a-card :bordered="false">

      <detail-list >

        <detail-list-item term="网页链接">{{ url }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="平台">{{ platform }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="平台Hash">{{ platformHash }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="评论">{{ comment }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="审核状态">{{ status }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="创建时间">{{ createTime }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="更新时间">{{ updateTime }}</detail-list-item>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list-item term="是否有效">{{ deleted }}</detail-list-item>
      </detail-list>
    </a-card>
  </div>
</template>

<script>
import DetailList from '@/components/tool/DetailList'
import {CopyrightCommitService} from '../../../services'
import dateutil from "../../../utils/dateutil";
//import PageLayout from '@/layouts/PageLayout'

const DetailListItem = DetailList.Item

export default {
  name: 'CopyrightCommitDetail',
  components: {DetailListItem, DetailList},
  data() {
    return {
      url: null,
      platform: null,
      platformHash: null,
      comment: null,
      status: null,
      createTime: null,
      updateTime: null,
      deleted: null,
    }
  },
  mounted() {
    this.loadCopyrightCommitInfo();
  },
  methods: {
    loadCopyrightCommitInfo() {
      let id = this.$route.params.id;
      CopyrightCommitService.getCopyrightRequest(id).then(response => {
        let copyrightcommit = response.data.data;
        this.url = copyrightcommit.url;
        this.platform = copyrightcommit.platform;
        this.platformHash = copyrightcommit.platformHash;
        this.comment = copyrightcommit.comment;

        if (copyrightcommit.deleted == 0) {
          this.deleted = "有效";
        } else {
          this.deleted = "无效";
        }

        if(copyrightcommit.status==1){
          this.status ='已通过审核'
        }
        else if(copyrightcommit.status==-1){
          this.status ='未通过审核'
        }
        else{
          this.status ='待审核'
        }

        this.createTime = dateutil.getDateStringFromTimestamp(copyrightcommit.createTime);
        this.updateTime = dateutil.getDateStringFromTimestamp(copyrightcommit.updateTime);
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
