<template>
  <div class="loginBodyTwo">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">Login</h1>
        <el-form :model="loginForm" label-width="100px"
                 :rules="rules" ref="loginForm">
          <el-form-item label="ID" prop="id">
            <el-input style="width: 200px" type="text" v-model="loginForm.id"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="パスワード" prop="password">
            <el-input style="width: 200px" type="password" v-model="loginForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm" :disabled="confirm_disabled">ログイン</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      confirm_disabled: false,
      loginForm: {
        id: '',
        password: ''
      },
      rules: {
        id: [
          {required: true, message: 'ID入力してください', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Pass入力してください', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    confirm() {
      this.confirm_disabled = true;
      this.$refs.loginForm.validate((valid) => {
        if (valid) { //valid成功为true，失败为false
          //去后台验证用户名密码
          this.$axios.post(this.$httpUrl + '/user/login', this.loginForm).then(res => res.data).then(res => {
            if (res.code == 200) {
              //存储
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
              console.log(res.data.menu)
              this.$store.commit("setMenu", res.data.menu)
              //跳转到主页
              this.$router.replace('/Index');
            } else {
              this.confirm_disabled = false;
              alert('Loginエラー，正確IDとPassword入力してください！');
              return false;
            }
          });
        } else {
          this.confirm_disabled = false;
          console.log('ログインエラー');
          return false;
        }
      });

    }
  }
}
</script>

<style scoped>
.loginBody {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 20%;
  margin-top: -200px;
  margin-left: -225px;
  width: 450px;
  height: 330px;
  background: #fff;
  border-radius: 5%;

}

.login-title {
  margin: 20px 0;
  text-align: center;
}

.login-content {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 25px;
  left: 25px;
}

.loginBodyTwo {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
  background-image: url('../assets/1.png'); /* 设置背景图片 */
  background-size: cover; /* 覆盖整个容器 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 图片不重复 */
}
</style>