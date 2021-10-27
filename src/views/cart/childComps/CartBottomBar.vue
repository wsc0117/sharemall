<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button @click.native="checkClick" :is-checked="isSelectAll" class="check-button" />
      <span>全选</span>
    </div>
    <div class="price">合计: {{totalPrice}}</div>
    <div class="right" @click="calc">去结算({{totalCount}})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import { mapGetters } from "vuex";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    totalCount() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      // return !(this.cartList.filter(item=>!item.checked).length)
      return !this.cartList.find(item => !item.checked);
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(item => (item.checked = false));
      } else {
        this.cartList.forEach(item => (item.checked = true));
      }
      // this.cartList.forEach(item => (item.checked = !this.isSelectAll));
    },
    calc() {
      if (!this.isSelectAll) {
        this.$toast.show("请选择要购买的商品", 2000);
      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  font-size: 14px;
  line-height: 40px;
}
.check-content {
  height: 20px;
  display: flex;
  width: 80px;
}
.check-content span {
  padding-left: 40px;
}
.check-button {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 10px;
  height: 20px;
  width: 20px;
}
.price {
  flex: 1;
}
.right {
  text-align: center;
  background-color: var(--color-high-text);
  width: 100px;
}
</style>