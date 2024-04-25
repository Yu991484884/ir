<template>
  <div style="text-align: center;background-color: 255,255,255;height: 100%;padding: 0px;margin: 0px;">
    <h1 style="font-size: 50px;">{{  user.name }}</h1>
    <el-descriptions title="個人設定" :column="2" size="40" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          ID
        </template>
        {{ user.id }}
      </el-descriptions-item>
      
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-place"></i>
          営業所
        </template>
       {{ 
        user.unitcode == 1 ? "管理本部" : 
        user.unitcode==3 ? "業務本部": 
        user.unitcode==4 ? "人事室": 
        user.unitcode==2 ? "エリアM": 
        "不明"}}


      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-place"></i>
          組織
        </template>

        {{ 
        user.organizationcode == 1 ? "北王流通株式会社" : 
        user.organizationcode==2 ? "北王デリバリー": 
        user.organizationcode==3 ? "北王フドベース": 
        user.organizationcode==4 ? "北王Gurop": 
        "不明"
        }}

      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          権限
        </template>

          {{ user.roleid == 0 ? "Super管理者" : (user.roleid == 1 ? "管理者" : "ユーザー") }}


      </el-descriptions-item>
      
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-star-off"></i>
          職種
        </template>

        
        {{ 
        user.occupationcode== 6 ? "情報システム室" : "不明"
        }}

      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-help"></i>
          役職
        </template>

        
        {{ 
        user.jobtitlecode== 3 ? "チーフ" : 
        user.jobtitlecode== 2 ? "クルー" : 
        user.jobtitlecode== 4 ? "リーダー" : 
        "不明"}}

      </el-descriptions-item>
    </el-descriptions>

    <DateUtils></DateUtils>
  </div>
</template>

<script>
import DateUtils from "./DateUtils";

export default {
  name: "Home",
  components: {DateUtils},
  data() {
    return {
      user: {}
    }
  },
  computed: {},
  methods: {
    init() {
      this.user = JSON.parse(sessionStorage.getItem('CurUser'))
    }
  },
  created() {
    this.init()
  }
}
</script>

<style scoped>
.el-descriptions {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}
</style>