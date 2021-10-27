<template>
  <swiper class="dswiper">
    <swiper-item v-for="(item,index) in topImages" :key="index">
      <img :src="item" alt="详情轮播" />
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";
export default {
  name: "DetailSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.dswiper {
  height: 300px;
  overflow: hidden;
}
</style>