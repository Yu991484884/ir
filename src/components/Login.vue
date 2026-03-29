<template>
  <div class="loginBodyTwo">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">ようこそ</h1>
        <p class="login-subtitle">IR 管理システムへようこそ</p>
        <el-form :model="loginForm" label-width="0px"
                 :rules="rules" ref="loginForm">
          <el-form-item prop="id">
            <el-input class="modern-input" type="text" v-model="loginForm.id"
                      placeholder="ユーザーID" 
                      autocomplete="off"
                      prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="modern-input" type="password" v-model="loginForm.password"
                      placeholder="パスワード"
                      show-password autocomplete="off" 
                      prefix-icon="el-icon-lock"
                      @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="confirm" :disabled="confirm_disabled">ログイン</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
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
  left: 25%;
  transform: translate(-50%, -50%);
  width: 420px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 0 40px rgba(100, 150, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.login-title {
  margin: 0 0 10px 0;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
}

.login-content {
  width: 100%;
}

.modern-input /deep/ .el-input__inner {
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px 12px 45px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f5f7fa 0%, #f9fafb 100%);
  color: #333;
}

.modern-input /deep/ .el-input__inner::placeholder {
  color: #bbb;
}

.modern-input /deep/ .el-input__inner:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.modern-input /deep/ .el-input__inner:focus {
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15),
              0 4px 16px rgba(102, 126, 234, 0.15);
  outline: none;
}

.modern-input /deep/ .el-input__prefix {
  color: #667eea;
}

.modern-input /deep/ .el-input__suffix {
  color: #667eea;
}

.login-btn /deep/ button {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.login-btn /deep/ button:hover:not(:disabled) {
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3),
              0 6px 16px rgba(118, 75, 162, 0.2);
  transform: translateY(-2px);
}

.login-btn /deep/ button:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn /deep/ button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loginBodyTwo {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
  background-image: url('../assets/2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>