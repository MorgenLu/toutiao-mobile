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
    </van-tabs>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  computed: {
    currentChannel () {
      return this.channels[this.active]
    }
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      data.data.channels.forEach(channel => {
        channel.loading = false
        channel.finished = false
        channel.articles = []
        channel.timestamp = null
        channel.isLoading = false
      })
      console.log(data)
      this.channels = data.data.channels
    },
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
    this.loadAllChannels()
  }
}
</script>

<style lang="less" >
.home {
  .van-tabs {
    .van-tabs__content {
      margin-bottom: 50px;
      margin-top: 90px;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
  }
}
</style>
