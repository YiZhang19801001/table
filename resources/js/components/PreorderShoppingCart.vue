<template>
  <transition>
    <!-- check orderlist is empty or not, to decide show or hide the shopping cart -->
    <div class="shoppingCart" :class="{expand:isExpand}">
      <div class="cover" @click="toggle" v-if="isExpand"></div>
      <!-- header will always show when shopping cart is not empty -->
      <div class="shoppingCart-header" :class="{expandHeader:isExpand}" @click="toggle">
        <div class="shoppingIcon">
          <img src="/table/public/images/layout/shopping_cart.png" alt>
          <span class="badge">{{totalQuantityOfOrder}}</span>
        </div>
        <div class="shoppingCart-header-text">
          <span class="text-wrapper">
            <span class="text">{{app_conf.total}}</span>
          </span>
          <span class="text-wrapper">
            <span class="number">${{totalPriceOfOrder}}</span>
          </span>
        </div>
        <!-- <div v-if="isExpand" @click="toggle" class="close-btn-wrap">
          <i @click="toggle" class="material-icons">close</i>
        </div>-->
      </div>
      <!-- toggle the list of order on clicking the header -->
      <ul v-if="isExpand">
        <!-- just a list of order item 😃 -->
        <li v-for="(orderItem,index) in orderList" :key="index">
          <CartItem :index="index" :orderItem="orderItem"></CartItem>
        </li>
      </ul>
      <!-- confirm order -->
      <div v-if="isExpand" class="button-pannel">
        <div class="shoppingCart-confirm-button" @click="confirmOrder">{{app_conf.confirm_order}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import CartItem from "./CartItem.vue";
import OrderedCartItem from "./OrderedCartItem";
import simpleStorage from "simplestorage.js";

export default {
  name: "app-shopping-cart",
  data() {
    return {
      isExpand: false
    };
  },
  components: {
    CartItem,
    OrderedCartItem
  },
  computed: {
    ...mapGetters([
      "localOrderList",
      "totalPriceOfOrder",
      "totalQuantityOfOrder",
      "orderList",
      "app_conf",
      "lang"
    ])
  },
  mounted() {
    this.delay(800).then(res => {
      let newList = [];
      if (localStorage.getItem("preorderList")) {
        newList = localStorage.getItem("preorderList");
        this.replaceList(newList);
      }
    });
  },
  methods: {
    ...mapActions([
      "increaseItemQuantityInOrderList",
      "decreaseItemQuantityInOrderList",
      "removeItemQuantityFromOrderList",
      "setSpinnerStatus",
      "replaceList"
    ]),
    /**methods to control only this component */
    toggle() {
      this.isExpand = !this.isExpand;
    },
    increase(orderItem) {
      this.setSpinnerStatus(true);
      this.increaseItemQuantityInOrderList(orderItem);
    },
    decrease(orderItem) {
      this.setSpinnerStatus(true);
      this.decreaseItemQuantityInOrderList(orderItem);
    },
    //ToDo:: save data in database.
    confirmOrder() {
      this.$router.push(`/table/public/confirm`);
    },
    delay(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve("resolved");
        }, time);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cover {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #0000009c;
  z-index: -1;
}
.close-btn-wrap {
  position: absolute;
  right: 10px;
  top: 10px;
}
.shoppingCart {
  position: fixed;
  bottom: 0;
  width: 100vw;
  left: 0;
  z-index: 200;

  .shoppingCart-header {
    display: flex;
    position: relative;
    width: 100%;
    height: 8.5vh;
    background-color: #f55747;
    transition: all 0.3s;
    padding-bottom: 10px;
    &.expandHeader {
      transition: all 0.3s;
    }
    .shoppingIcon {
      flex: 1;
      z-index: 250;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-left: 30px;
      img {
        width: 33px;
        height: 30px;
      }
    }
    .badge {
      border-radius: 50%;
      position: absolute;
      top: 9px;
      left: 49px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 16.2px;
      font-weight: 600;
      padding: 0;
      color: #f55747;
      background-color: white;
    }
    .shoppingCart-header-text {
      display: flex;
      flex: 1;
      font-weight: 600;
      font-size: 18px;
      color: white;
      justify-content: center;
      padding-right: 12px;
      padding-bottom: 3px;
      .text-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex: 1;
        .text {
          height: 18px;
          font-size: 14px;
          font-weight: 300;
          color: #ffffff;
          text-align: right;
          padding-right: 10px;
        }
        .number {
          height: 29px;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
  ul {
    list-style-type: none;
    padding: 0px 2px;
    min-height: 60vh;
    max-height: 80vh;
    overflow: scroll;
    background-color: white;
    margin: 0;
    padding-bottom: 15vh;
    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 5px;
      .shoppingCart-item-name {
        flex: 4;
        .orderItem-name {
          margin: 0;
        }
        .orderItem-choice {
          margin: 0;
          font-size: 10px;
          color: #9d9a9a;
        }
      }
      .shoppingCart-button-group {
        flex: 2;
        text-align: center;
        .button-group-container {
          border: 1px solid #dff9fb;
          display: flex;
          align-items: flex-start;
          justify-content: space-around;
          justify-items: center;
          span {
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            text-align: center;
          }
        }
      }
      .shoppingCart-item-price {
        flex: 1;
        text-align: right;
        padding-right: 10px;
      }
    }
  }

  .button-pannel {
    width: 100vw;
    background-color: white;
    height: 15vh;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .shoppingCart-confirm-button {
      width: 212px;
      height: 35px;
      border-radius: 3px;
      background-color: #ffba2d;
      margin: auto;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 35px;
    }
  }
}
.expand {
  width: 100%;
  left: 0;
  bottom: 0;
  transition: all 0.3s;
}
i.material-icons {
  color: white;
  text-shadow: 0px 0px 1px black;
  font-size: 20px;
}
</style>
