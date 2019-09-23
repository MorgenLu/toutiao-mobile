<template>
  <div class="home">
    <van-nav-bar fixed title="首页" />
    <van-tabs v-model="active">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <van-pull-refresh v-model="channel.isLoading" @refresh="onRefresh">
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <div slot="nav-right" class="wap-nav" @click="isChannelEditShow = true">
        <van-icon name="wap-nav" size="24" />
      </div>
    </van-tabs>
    <van-popup v-model="isChannelEditShow" position="bottom" :style="{ height: '95%' }" round>
      <div>
        <van-cell title="我的频道">
          <van-button type="primary" size="mini" round>编辑</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="channel in channels" :key="channel.id" :text="channel.name" />
        </van-grid>
      </div>
      <div>
        <van-cell title="频道推荐"></van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="value in 8" :key="value" text="文字" />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserOrDefaultChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { getItem } from '@/utils/storage'
// 引入mapstate
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  data () {
    return {
      // 控制频道选择的数据
      active: 0,
      // 频道列表
      channels: [],
      // 向上弹窗控制
      isChannelEditShow: true
    }
  },

  computed: {
    // 使用容器中的user数据(本地的token数据)
    ...mapState(['user']),
    // 设置计算属性返回选中的频道
    currentChannel () {
      return this.channels[this.active]
    }
  },
  methods: {
    // 获取用户频道列表
    async loadUserOrDefaultChannels () {
      let channels = []
      if (this.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        const localChannels = getItem('channels')
        if (localChannels) {
          channels = localChannels
        } else {
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }

      channels.forEach(channel => {
        channel.loading = false
        channel.finished = false
        channel.articles = []
        channel.timestamp = null
        channel.isLoading = false
      })
      this.channels = channels
    },
    // 获取对应频道内容
    async onLoad () {
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      console.log(data)
      const { pre_timestamp: preTimestamp, results } = data.data
      currentChannel.articles.push(...results)

      currentChannel.loading = false

      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        currentChannel.timestamp = preTimestamp
      }
    },

    // 下拉获取数据
    async onRefresh () {
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      currentChannel.articles.unshift(...data.data.results)

      currentChannel.isLoading = false
    }
  },

  created () {
    this.loadUserOrDefaultChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  .van-tabs {
    /deep/.van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
    }
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
  }
  .article-info {
    .meta span {
      margin-right: 10px;
    }
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
}
</style>
