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
          <!-- 登录方式1 -->
          <div class="tab1_login" v-if="tab1_login">
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
          <!-- 登录方式2 -->
          <div class="tab2_login" v-if="tab2_login">
            <div class="username_pane">
              <input
                type="text"
                class="input"
                autocomplete="off"
                placeholder="请输入邮箱"
                v-model="loginForm.user_email"
              />
              <div class="err" v-if="mail_err">{{ mail_err_Text }}</div>
            </div>
            <div class="code_pane">
              <div class="input_code">
                <div>
                  <input
                    type="text"
                    :class="!userCodeEnable ? 'input' : 'input input_enable'"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    maxlength="6"
                    v-model="loginForm.login_code"
                    :disabled="userCodeEnable"
                  />
                </div>
              </div>
              <div>
                <button
                  :class="
                    !userSendCodeBtnEnable
                      ? 'btn send_code_btn'
                      : 'btn send_code_btn btn_enable'
                  "
                  :disabled="userSendCodeBtnEnable"
                  @click="sendCode"
                >
                  {{ sendBtnText }}
                </button>
              </div>
            </div>
            <div class="err" v-if="user_code_err">验证码不能为空</div>
          </div>
          <div class="switch">
            <div class="txt" v-text="switchText" @click="switchLoginType"></div>
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
  // import { loginUser, getGlobalLanguageByArea,getCurrentUserIP,getDetailsUserGlobalInfo } from "@/api";
  
  export default {
    name: "LoginView",
    data() {    
      return {
        loginForm: {
          username: "",
          user_pass: "",
          user_email: "",
          login_ip: "",
          login_lan_ip: "",
          login_country: "",
          login_location: "",
          login_city: "",
          login_regionName: "",
          login_lat: "",
          login_lon: "",
          login_code: "",
        },      
        loading: false,
        formData: {
          in_language: "zh-CN",
        },
        loadpage: false,
        switchText: "邮箱验证登录",
        tab1_login: true,
        tab2_login: false,
        user_err: false, //用户名错误框提示
        user_pass_err: false, //密码错误框提示
        mail_err: false, //邮箱错误框提示
        mail_err_Text: "邮箱不能为空", //邮箱错误提示内容
        user_code_err: false, //验证码错误框提示
        userCodeEnable: true, //默认验证码输入框为不可用
        userSendCodeBtnEnable: false, //默认发送验证码按钮可用
        sec: 10, //倒计时
        sendBtnText: "发送验证码",
      };
    },
    created() {},
    mounted() {},
    beforeDestroy() {
      //离开页面销毁监听快捷键
      clearInterval(this.timer);
    },
    methods: {
      // 切换登录方式
      switchLoginType() {
        if (this.tab1_login) {
          this.tab1_login = false;
          this.tab2_login = true;
          this.switchText = "用户密码登录";
        } else {
          this.tab1_login = true;
          this.tab2_login = false;
          this.switchText = "邮箱验证登录";
        }
      },
      //验证邮箱格式
      validEmail(email) {
        // 正则表达式验证邮箱格式
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      },
      // 校验的时候 分别判断tab1和tab2两种
      validLoginForm() {
        //用户密码登录方式
        if (this.tab1_login) {
          let username = this.loginForm.username.trim();
          let user_pass = this.loginForm.user_pass.trim();
          let isLogin = false;
          if (!username) {
            isLogin = false;
            this.user_err = true;
          } else {
            this.user_err = false;
            isLogin = true;
          }
          if (!user_pass) {
            isLogin = false;
            this.user_pass_err = true;
          } else {
            this.user_pass_err = false;
            isLogin = true;
          }
          if (isLogin) {
            //验证通过,执行登录方法
            this.login();
          } else {
            return;
          }
        }
        //邮箱验证登录方式
        if (this.tab2_login) {
          let user_email = this.loginForm.user_email.trim();
          let login_code = this.loginForm.login_code.trim();
          let isLogin = false;
          if (!user_email) {
            isLogin = false;
            this.mail_err = true;
          } else {
            this.mail_err = false;
            isLogin = true;
          }
          if (!login_code) {
            isLogin = false;
            this.user_code_err = true;
          } else {
            this.user_code_err = false;
            isLogin = true;
          }
          if (isLogin) {
            //验证通过,执行登录方法
            this.login();
          } else {
            return;
          }
        }
      },
      sendCode() {
        let email = this.loginForm.user_email.trim();
        //发送验证码前,验证输入邮箱不能为空
        if (!email) {
          this.mail_err = true;
          this.mail_err_Text = "邮箱不能为空";
          return;
        } else {
          this.mail_err = false;
        }
        //验证邮箱格式
        if (!this.validEmail(email)) {
          this.mail_err = true;
          this.mail_err_Text = "邮箱格式不正确";
          return;
        } else {
          this.mail_err = false;
        }
        //开启输入验证码框可用
        this.userCodeEnable = false;
        // 倒计时开始,同时设置发送验证码按钮不可用
        //重置时间
        this.sec = 10;
        this.timer();
        this.userSendCodeBtnEnable = true;
        //执行发送方法
        this.$message({
          message: "发送成功",
          type: "success",
        });
      },
      //登录重置输入框
      resetLoginForm() {
        //分登录方式重置
        if (this.tab1_login) {
          this.loginForm.username = "";
          this.loginForm.user_pass = "";
        }
        if (this.tab2_login) {
          this.loginForm.login_code = "";
        }
      },
      //倒计时 60秒
      timer() {
        let that = this;
        if (that.sec == 0) {
          this.sendBtnText = "发送验证码";
          this.userSendCodeBtnEnable = false;
        } else {
          setTimeout(function () {
            that.sec--;
            that.sendBtnText = "已发送(" + that.sec + ")秒";
            that.timer();
          }, 1000);
        }
      },
      async login() {
        this.resetLoginForm();
        this.$message({
          message: "登录成功",
          type: "success",
        });
      },
    },
    gotoReg() {
      this.$router.push("/reg");
    },
  };
  </script>
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