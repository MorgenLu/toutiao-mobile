<template>
  <div class="login">
    <van-nav-bar title="登录"></van-nav-bar>
    <ValidationObserver tag="form" ref="loginForm">
      <ValidationProvider tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
        <van-field
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          v-model="user.mobile"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{ errors }">
        <van-field
          v-model="user.code"
          type="password"
          label="验证码"
          placeholder="请输入验证码"
          required
          :error-message="errors[0]"
        />
      </ValidationProvider>
    </ValidationObserver>
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
        mobile: '13919874561',
        code: '246810'
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onLogin () {
      try {
        const isValid = await this.$refs.loginForm.validate()

        // 验证失败，则什么都不做
        if (!isValid) {
          return
        }
        this.isLoginLoading = true
        const res = await login(this.user)
        console.log(res)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        this.$router.push({ path: '/' })
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
