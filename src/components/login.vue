<template>
  <div
    class="flex-container"
    v-loading="loading"
    element-loading-text="正在登录，请稍后....."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="login_panel card">
      <div class="loginTitle">
        <!-- 欢迎登录 -->
        <div class="title">欢迎登录</div>
        <div class="reg_pane">
          没有账号？ <a href="#" class="goreg">点此注册</a>
        </div>
      </div>
      <!-- 登录框 -->
      <div class="login_form">
        <div class="tab1_login">
          <div class="username_pane">
            <input
              type="text"
              class="input"
              autocomplete="off"
              placeholder="请输入用户名/邮箱"
              v-model="loginForm.username"
            />
            <div class="err" v-if="user_err">用户名/邮箱不能为空</div>
          </div>
          <div class="pass_pane">
            <input
              type="password"
              class="input"
              autocomplete="off"
              placeholder="请输入密码"
              v-model="loginForm.user_pass"
            />
            <div class="err" v-if="user_pass_err">密码不能为空</div>
          </div>
        </div>
        <!-- 登录按钮 -->
        <div class="login_btn_pane">
          <button class="btn login_btn" @click="validLoginForm">登 录</button>
        </div>
        <!-- 忘记密码 -->
        <div class="forgot_pane">
          <a class="link" href="#">已有帐号，忘记密码？</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
export default {
  name: "LoginView",
  data() {    
    return {
      loginForm: {
        username: "",
        user_pass: ""
      },      
      loading: false,
      user_err: false, // 用户名错误框提示
      user_pass_err: false // 密码错误框提示
    };
  },
  methods: {
    // 校验登录表单
    validLoginForm() {
      let username = this.loginForm.username.trim();
      let user_pass = this.loginForm.user_pass.trim();

      if (!username) {
        this.user_err = true;
        return;
      } else {
        this.user_err = false;
      }

      if (!user_pass) {
        this.user_pass_err = true;
        return;
      } else {
        this.user_pass_err = false;
      }
       console.log("login前")
      // 验证通过, 执行登录方法
      this.login();
    },

    // 模拟登录方法
    login() {
      const username = this.loginForm.username.trim();
      const password = this.loginForm.user_pass.trim();
      console.log("进login")
      // 关闭加载状态
      this.loading = false;
      
      // 简单模拟登录验证
      if (username === 'zhangsan' && password === '123456') {
        console.log(username);
        this.$message({
          message: "登录成功",
          type: "success",
        });
        console.log("main前");
        // 跳转到 /main 页面
        this.$router.push("/main");

      } else {
        this.$message.error('用户名或密码错误');
        this.resetLoginForm(); // 清空输入框
        return;
      }
    },

    // 登录重置输入框
    resetLoginForm() {
      this.loginForm.username = "";
      this.loginForm.user_pass = "";
    }
  }
};
</script>

<style scoped>
/* 你可以根据需要添加样式 */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login_panel {
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.loginTitle .title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.reg_pane {
  text-align: center;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.err {
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
}

.login_btn_pane {
  text-align: center;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #66b1ff;
}

.forgot_pane {
  text-align: center;
  margin-top: 10px;
}

.link {
  color: #409EFF;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
  <style scoped>
  
  .flex-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("../assets/img/bg01.jpg") center center no-repeat;
    background-size: cover;
    height: 100vh;
  }
  
  .login_panel {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    min-width: 340px;
  }
  
  .card {
    border-radius: 6px;
    background: rgba(247, 245, 245, 0.8);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    transform: scale(1);
    transition: all 0.3s;
  }
  
  .loginTitle {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 30px 0;
  }
  
  .loginTitle .title {
    font-size: 24px;
    font-weight: 700;
    color: #40485b;
  }
  
  .loginTitle .reg_pane {
    display: flex;
    align-items: flex-end;
    margin-bottom: 0;
  }
  
  a.goreg {
    color: #005980;
  }
  
  /* 登录框 */
  .tab1_login,
  .tab2_login {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .username_pane,
  .pass_pane {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
  }
  
  .code_pane {
    display: flex;
    margin: 10px 0;
  }
  
  .code_pane {
    justify-content: space-between;
  }
  
  .input_code {
    width: 50%;
  }
  
  /* 输入框不可用 */
  .input_enable {
    cursor: no-drop;
  }
  
  .login_form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .login_form .switch {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .switch .txt {
    cursor: pointer;
    color: #005980;
  }
  
  .login_btn_pane {
    display: flex;
    width: 100%;
    margin-top: 20px;
  }
  
  .forgot_pane {
    display: flex;
    width: 100%;
    margin: 30px 0;
  }
  
  a.link {
    color: #005980;
  }
  
  .err {
    height: 10px;
    color: #d95c5c;
  }
  
  /* 通用输入框样式 */
  .input {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  
  /* 通用按钮样式 */
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }
  
  .login_btn {
    color: #fff;
    letter-spacing: 0;
    text-align: center;
    background-color: #f56c6c;
    border-color: #f56c6c;
    width: 100%;
  }
  
  .send_code_btn {
    color: #f56c6c;
    letter-spacing: 0;
    text-align: center;
    border-color: #f56c6c;
    width: 100%;
  }
  
  .btn_enable {
    cursor: no-drop;
  }
  </style>