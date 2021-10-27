<template>
  <div id="home">
    <!-- 标题 -->
    <nav-bar class="home-nav">
      <div slot="center">畅享购</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      ref="tabcontrol1"
      class="tab-control"
      @tabClick="tabClick"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 轮播 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <!-- 推荐信息 -->
      <recommend-view :recommends="recommends" />
      <!-- 本周流行 -->
      <feature-view />
      <!-- 导航 -->
      <tab-control :titles="['流行','新款','精选']" ref="tabcontrol2" @tabClick="tabClick" />
      <!-- 商品数据 -->
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultiData, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins:[itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消全局事件监听
    this.$bus.$off("itemImageLoad", this.itemLImgistener);
  },
  created() {
    //1.请求多个数据
    this.getHomeMultiData();
    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    
  },
  methods: {
    /**
     * 事件监听方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabcontrol1.currentIndex = index;
      this.$refs.tabcontrol2.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      //判断backtop是否显示
      this.isShowBackTop = -position.y > 1000;
      //2.决定tabcontol是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      //获取tabcontrol的offsetTop
      this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop;
    },

    /*
     *网络请求相关方法
     */
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}
</style>