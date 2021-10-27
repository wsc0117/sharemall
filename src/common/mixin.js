import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
  data() {
    return {
      itemLImgistener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemLImgistener = () => {
      this.refresh();
    };
    this.$bus.$on("itemImgLoad", this.itemLImgistener);
    // console.log("混入内容");
  },
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    demo(position) {
      this.isShowBackTop = -position.y > 1000;
    }
  },
}
