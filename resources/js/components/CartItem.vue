<template>
  <div class="cart-item">
    <span class="shoppingCart-item-name">
      <p class="orderItem-name">
        <span class="orderItem-name-text">
          <span>{{orderItem.item.name}}</span>
          <span>${{totalPrice}}</span>
        </span>
      </p>
      <ul v-if="app_conf.show_option">
        <li
          class="orderItem-choice"
          v-for="(choice,index) in orderItem.item.choices"
          :key="`choice${index}`"
        >{{choice.type}} : {{choice.pickedChoice}} ${{choice.price}}</li>
        <li
          class="orderItem-choice"
          v-for="(option,index2) in orderItem.item.options"
          :key="`option${index2}`"
        >
          <span>{{option.option_name}}</span>
          <span>{{option.pickedOption}}</span>
          <span>{{app_conf.currency}} ${{option.price}}</span>
        </li>
      </ul>
    </span>
    <div class="quantity-wrap">
      <span class="decrease-button" @click="decrease()">
        <img src="/table/public/images/layout/cart_sub.png" alt>
      </span>
      <span class="orderItem-quantity">
        <span class="number">{{orderItem.quantity}}</span>
      </span>
      
      <span class="increase-button" @click="increase()">
        <img src="/table/public/images/layout/cart_plus.png" alt>
      </span>
    </div>

    <span class="shoppingCart-item-price">
      <span>${{(totalPrice * orderItem.quantity).toFixed(2)}}</span>
    </span>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "app-cart-item",
  props: {
    orderItem: {},
    index: 0
  },
  data() {
    return {
      totalPrice: 0
    };
  },
  computed: {
    ...mapGetters([
      "orderList",
      "totalPriceOfOrder",
      "totalQuantityOfOrder",
      "orderId",
      "table_number",
      "app_conf"
    ])
  },
  mounted() {
    let optionPrice = 0;
    if (this.app_conf.show_option) {
      this.orderItem.item.options.forEach(option => {
        optionPrice = optionPrice + parseFloat(option.price);
      });
    }

    this.totalPrice = (
      parseFloat(this.orderItem.item.price) + optionPrice
    ).toFixed(2);
  },
  methods: {
    ...mapActions([
      "increaseItemQuantityInOrderList",
      "decreaseItemQuantityInOrderList",
      "removeItemQuantityFromOrderList"
    ]),
    /**methods to control only this component */
    toggle() {
      this.isExpand = !this.isExpand;
    },
    increase() {
      if (this.app_conf.preorder) {
        this.increaseItemQuantityInOrderList(this.index);
      } else {
        this.increaseItemQuantityInOrderList(this.orderItem);
      }
    },
    decrease() {
      if (this.app_conf.preorder) {
        this.decreaseItemQuantityInOrderList(this.index);
      } else {
        this.decreaseItemQuantityInOrderList(this.orderItem);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cart-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: scroll;
  margin: 2px 0px;
  min-height: 60px;
  border-bottom: 1px solid #e4e0e0;
}
.quantity-wrap {
  display: flex;
  justify-content: space-between;
  width: 70px;
  .decrease-button,
  .increase-button,
  .orderItem-quantity {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .orderItem-quantity {
    display: flex;
    justify-content: center;
    .number {
      height: 22px;
      line-height: 22px;
      font-size: 18px;
      font-weight: 600;
      color: #f55747;
    }
  }
}

ul {
  list-style-type: none;
  padding: 0;
  overflow: scroll;
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    overflow: scroll;
    .shoppingCart-item-name {
      flex: 4;
      overflow: scroll;
      padding-left: 2px;
      .orderItem-name {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        overflow: scroll;
        .orderItem-quantity {
          flex: 1;
        }
        .orderItem-name-text {
          flex: 4;
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          padding-right: 15px;
        }
      }
      .orderItem-choice {
        margin: 0;
        font-size: 10px;
        color: #9d9a9a;
        overflow: scroll;
      }
    }

    .shoppingCart-item-price {
      flex: 1;
      text-align: right;
      padding-right: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      span {
        height: 15px;
        opacity: 0.9;

        font-size: 12px;
        font-weight: 500;

        color: #333333;
      }
    }
  }
}

.shoppingCart-confirm-button {
  width: 100%;
  border: none;
  background-color: #f6e58d;
  color: #f0932b;
  font-weight: bold;
  box-shadow: 0px -1px 3px #00000045;
}

.expand {
  max-height: 40px;
}
</style>
