<template>
  <div style="display: flex;line-height: 60px">
    <div style="margin-top: 8px;">
      <i :class="icon" style="font-size: 20px;cursor: pointer;" @click="collapse"></i>
    </div>
    <div style="flex: 1;text-align: center;font-size: 34px;">
      <span></span>
    </div>
    <el-dropdown>
      <span>{{ user.name }}</span>
      <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">個人設定</el-dropdown-item>
        <el-dropdown-item @click.native="logout">ログアウト</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      user: sessionStorage.getItem('CurUser') && JSON.parse(sessionStorage.getItem('CurUser'))
    }
  },
  props: {
    icon: String
  },
  methods: {
    toUser() {
      alert("個人設定詳細")
      this.$router.push("/Home")
    },
    logout() {
      this.$confirm('ログアウトしますか?', '提示', {
        confirmButtonText: '确定',  //确认按钮的文字显示
        type: 'warning',
        center: true, //文字居中显示
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'ログアウトしました'
        })
        this.$router.push("/")
        sessionStorage.clear()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'ログアウトキャンセルしました'
        })
      })
    },
    collapse() {
      this.$emit('doCollapse')
    }
  },
  created() {
    this.$router.push("/Home")
  }
}
</script>

<style scoped>

</style>