<template>
  <div class="login">
    <van-nav-bar title="登录"></van-nav-bar>
    <van-field required clearable label="手机号" placeholder="请输入手机号" v-model="user.mobile" />
    <van-field v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required />
    <div class="login-wrap">
      <van-button type="info" :loading="isLoginLoading" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onLogin () {
      this.isLoginLoading = true
      try {
        const res = await login(this.user)
        console.log(res)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      this.isLoginLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .login-wrap {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>
