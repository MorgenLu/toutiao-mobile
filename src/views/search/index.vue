<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <van-cell-group>
      <van-cell v-for="item in 5" :key="item" icon="search">
        <div slot="title">{{item}}</div>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell>
        <div slot="title">历史记录</div>
        <span style="margin-right: 10px;">全部删除</span>
        <span>完成</span>
        <van-icon name="delete" slot="right-icon" style="line-height: inherit;" />
      </van-cell>
      <van-cell v-for="item in 5" :key="item">
        <div slot="title">{{item}}</div>
        <van-icon slot="right-icon" name="close" style="line-height: inherit;" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    onSearch () {},
    onCancel () {}
  }
}
</script>

<style>
</style>
