<template>
  <div class="confirm-vue">
    <h3>Your Order Is Submitted!</h3>
    <div class="icon-wrapper">
      <i @click="close()" class="material-icons">done_outline</i>
    </div>
    <ul>
      <div class="order-list">
        <!-- add a history ordered items list 😓 -->
        <li v-for="(orderItem) in historyOrderList" :key="orderItem.order_item_id">
          <OrderedCartItem :orderItem="orderItem"></OrderedCartItem>
        </li>
        <!-- just a list of order item 😃 -->
        <li v-for="(orderItem) in orderList" :key="orderItem.order_item_id">
          <CartItem :orderItem="orderItem"></CartItem>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";

import OrderedCartItem from "./OrderedCartItem";
import CartItem from "./CartItem";

export default {
  computed: {
    ...mapGetters([
      "historyOrderList",
      "orderList",
      "isConfirmed",
      "orderId",
      "cdt",
      "v",
      "lang",
      "table_number",
      "pathFrom"
    ])
  },
  mounted() {
    this.delay(1000).then(res => {
      this.updateOrderList();
    });
    Echo.channel("tableOrder").listen("newOrderItemAdded", e => {
      if (this.orderId === e.orderId) {
        this.updateOrderList();
      }
    });
  },
  methods: {
    ...mapActions(["setIsConfirmed", "setSpinnerStatus", "replaceList"]),
    close() {
      this.$router.push(this.pathFrom);
    },
    updateOrderList() {
      this.setSpinnerStatus(true);
      axios
        .post("/table/public/api/initcart", {
          order_id: this.orderId,
          cdt: this.cdt,
          v: this.v,
          table_id: this.table_number,
          lang: this.lang,
          preorder: this.app_conf.preorder
        })
        .then(res => {
          this.replaceList(res.data);
          this.setSpinnerStatus(false);
        });
    },
    delay(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve("resolved");
        }, time);
      });
    }
  },
  components: {
    OrderedCartItem,
    CartItem
  }
};
</script>

<style lang="scss" scoped>
.confirm-vue {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000000;
  background-color: white;
  overflow: scroll;
}
h3 {
  width: 90%;
  font-size: 20px;
  margin: auto;
  text-align: center;
  margin-top: 12%;
}
i.material-icons {
  font-size: 60px;
  color: green;
  border: solid;
  padding: 10px;
  border-radius: 50%;
}
.icon-wrapper {
  margin-top: 30px;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0px 2px;
  overflow: scroll;
  background-color: white;
  margin: 0;
  margin-top: 20px;
  padding-bottom: 50px;
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
</style>

