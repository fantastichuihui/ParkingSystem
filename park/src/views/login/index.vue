<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">鞍钢智慧物流园区管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === &quot;password&quot; ? &quot;eye&quot; : &quot;eye-open&quot;" />
        </span>
      </el-form-item>
      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width:45%;float:left;font-weight:bold"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <div>
          <el-button
            type="primary"
            style="width:45%;float:right;"
          >
            <a href="http://datav.aliyuncs.com/share/9a8f7339c372739d36cf4b8fe85513e2" target="_blank" style="color:white">大屏展示</a>
          </el-button>
        </div>
      </div>
      <div class="tips" />
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import axios from 'axios'
import { setToken } from '@/utils/auth'
import { resetRouter } from '@/router/index'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      tokenData: '',
      result: []
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          //  this.$store.dispatch('user/login', this.loginForm).then(() => {
          // 登陆时拿到uaa的令牌
          axios
            .get(
              `api/uaa/oauth/token?client_id=zhisenclient&client_secret=zhisensecret&grant_type=password&username=${this.loginForm.username}&password=${this.loginForm.password}`
            )
            .then(uaa => {
              this.tokenData = uaa.data.access_token
              setToken(this.tokenData)
              this.$store.state.user.name = this.loginForm.username
              // 设置默认请求头
              axios.defaults.headers.common['Authorization'] = 'bearer ' + uaa.data.access_token
              // 将令牌放入请求头，并访问A01的接口，获取当前用户登陆菜单
              axios
                .post(
                  'api/a01auth/pageres/selectPageresByPersonAccount',
                  this.loginForm
                )
                .then(loginData => {
                  // 将数据存入sessionStorage
                  sessionStorage.setItem(
                    'routeData',
                    JSON.stringify(loginData.data.resultData)
                  )
                  this.result = loginData.data.resultData
                  resetRouter()
                  this.$router.push({ path: this.redirect || '/' })
                  this.loading = false
                })
              // 查询角色
              //  获取当前登陆用户，账号id,姓名，所属组织编码
              axios
                .get('api/s01/account/selectInfoByAccount', {
                  params: {
                    username: this.loginForm.username
                  }
                })
                .then(res => {
                  if (res.data.status === 1) {
                    // console.log(res.data.resultData.result.resultData)
                    // console.log(res)
                    this.$store.commit('save_userInfo', res.data.resultData.result.resultData)
                    res.data.resultData.roleList.forEach(item => {
                      this.$store.commit('save_role', item)
                    })
                  } else {
                    this.actionData = res.data.resultData
                    this.msg = res.data.msg
                  }
                })

              //  }).catch(() => {
              //    this.loading = false
              //  })
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss'>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https:// github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    height: 100%;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang='scss' scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-top: 150px;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
