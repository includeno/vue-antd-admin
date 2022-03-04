<template>
  <page-layout >
    <div slot="headerContent">
      <div class="title">{{welcome.timeFix[lang]}}，{{currUser.username}}</div>
<!--      <div>{{currUser.position[lang]}}</div>-->
    </div>
<!--    <template slot="extra">-->
<!--      <head-info class="split-right" :title="$t('project')" content="56"/>-->
<!--      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>-->
<!--      <head-info class="split-right" :title="$t('visit')" content="2,223"/>-->
<!--    </template>-->

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
//import HeadInfo from '@/components/tool/HeadInfo'
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'WorkPlace',
  components: {  PageLayout},//HeadInfo,
  i18n: require('./i18n'),
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {
    request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    request('/work/activity', METHOD.GET).then(res => this.activities = res.data)
    request('/work/team', METHOD.GET).then(res => this.teams = res.data)
    request('/project', METHOD.GET).then(res => {
        this.projects = res.data
        this.loading = false
      })
  }
}
</script>

<style lang="less">
@import "index";
</style>
