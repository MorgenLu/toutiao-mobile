<template>
  <div class="home">
    <van-nav-bar fixed>
      <van-button
        class="search-btn"
        type="info"
        slot="title"
        round
        size="small"
        @click="$router.push('/search')"
      >搜索</van-button>
    </van-nav-bar>
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
          <van-button type="primary" size="mini" round @click="isEdit=!isEdit">{{isEdit? '完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="(channel, index) in channels"
            :key="channel.id"
            :text="channel.name"
            @click="onUserChannelClick(channel,index) "
          >
            <van-icon name="clear" slot="icon" class="close-icon" v-show="isEdit" />
          </van-grid-item>
        </van-grid>
      </div>
      <div>
        <van-cell title="频道推荐" />
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in remainingChannels"
            :key="channel.id"
            :text="channel.name"
            @click="onAddChannel(channel)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getAllChannels,
  getUserOrDefaultChannels,
  resetUserChannels,
  deleteUserChannel
} from '@/api/channel'
import { getArticles } from '@/api/article'
import { getItem, setItem } from '@/utils/storage'
// 引入mapstate
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  data () {
    return {
      // 控制频道选择的数据
      active: 0,
      // 用户频道列表
      channels: [],
      // 向上弹窗控制
      isChannelEditShow: false,
      // 所有频道列表
      allChannels: [],
      // 控制删除图标
      isEdit: false
    }
  },

  computed: {
    // 使用容器中的user数据(本地的token数据)
    ...mapState(['user']),
    // 设置计算属性返回选中的频道
    currentChannel () {
      return this.channels[this.active]
    },
    // 通过计算属性获取剩余的频道推荐列表
    remainingChannels () {
      const channels = []
      // 如果我的频道不包含当前遍历频道，那它就是剩余的频道
      // find 方法：遍历数组，查找满足 item.id === channel.id 的元素，找到就返回该元素
      // 如果直到遍历结束都没有，则返回 undefined
      // findIndex 获取满足条件的元素，如果有，则返回该元素对应的索引
      // 如果没有满足的元素，则返回 -1
      this.allChannels.forEach(channel => {
        const index = this.channels.findIndex(item => {
          return item.id === channel.id
        })
        if (index === -1) {
          channels.push(channel)
        }
      })
      // 为剩余的频道添加需要的数据
      channels.forEach(channel => {
        channel.loading = false
        channel.finished = false
        channel.articles = []
        channel.timestamp = null
        channel.isLoading = false
      })
      return channels
    }
  },
  methods: {
    // 设置编辑编辑状态下删除用户频道,完成状态下关闭弹窗显示对应频道内容
    async onUserChannelClick (channel, index) {
      if (this.isEdit) {
        this.channels.splice(index, 1)
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          setItem('channels', this.channels)
        }
      } else {
        this.active = index
        this.isChannelEditShow = false
      }
    },
    // 设置新增用户频道
    async onAddChannel (channel) {
      this.channels.push(channel)
      if (this.user) {
        const channels = []
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        await resetUserChannels(channels)
      } else {
        setItem('channels', this.channels)
      }
    },
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
    // 获取剩余的频道推荐列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
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
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  .search-btn {
    width: 100%;
    background: #5babfb;
  }
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
  .close-icon {
    position: absolute;
    right: -5px;
    top: -5px;
    z-index: 2;
  }
}
</style>
