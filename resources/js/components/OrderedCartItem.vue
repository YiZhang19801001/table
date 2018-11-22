<template>
    <div class="cart-item">
        <span class="shoppingCart-item-name">
            <p class="orderItem-name">
                <span class="orderItem-name-text">{{orderItem.item.name}}</span>
            </p>
            <ul v-if="app_conf.show_option">
                <li class="orderItem-choice" v-for="(choice,index) in orderItem.item.choices" :key="`choice${index}`">
                    {{choice.type}} : {{choice.pickedChoice}} {{choice.price}}
                </li>
                <li class="orderItem-choice" v-for="(option,index2) in orderItem.item.options" :key="`option${index2}`">
                    <span>{{option.option_name}}</span>
                    <span>{{option.pickedOption}}</span>
                    <span>{{app_conf.currency}} ${{option.price}}</span>
                </li>
            </ul>
        </span>
        <span class="shoppingCart-item-price">
            {{totalPrice}}
        </span>
        <div class="quantity-wrap">
            <span class="ordered-label">{{app_conf.order_label}}</span>
            <span class="orderItem-quantity">{{orderItem.quantity}}</span>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "app-ordered-cart-item",
  props: {
    orderItem: {}
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
      this.orderItem.quantity *
      (parseFloat(this.orderItem.item.price) + optionPrice)
    ).toFixed(2);
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
  border-bottom: 1px solid #e4e0e0;
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
          color: #9d9a9a;
          flex: 4;
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
    }
    .quantity-wrap {
      border: 1px solid gray;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      margin: auto;
      padding: 0;
      margin-bottom: 3px;
      .ordered-label {
        background-color: #ffc24a;
        color: white;
        padding: 0px 3px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        text-shadow: 1px 1px 1px black;
      }
      .orderItem-quantity {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
span.orderItem-quantity {
  display: flex;
  justify-content: center;
  //   box-shadow: inset 0px 0px 1px black;
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
