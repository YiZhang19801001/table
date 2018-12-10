<template>
  <div class="productList" v-scroll-spy="{offset: 50}" ref="listView">
    <!-- List:: show groups for products -->
    <div v-for="(product,index) in productList" :key="index" ref="cates">
      <!-- category title for separating different group of products -->
      <h4 :id="product.categorys.category_id">{{product.categorys.name}}</h4>
      <!-- List:: show products in certain group -->
      <div
        v-for="item in product.products"
        :key="item.product_id"
        class="product"
        v-bind:class="{activeProduct:item.product_id===selectProduct_id}"
        v-bind:style="{backgroundImage:item.product_id===selectProduct_id?`url(/table/public/images/items/${item.image})`:null}"
      >
        <span
          class="orderQty"
          :class="[
            {activeOrderQty:item.product_id===selectProduct_id},
            {unactiveOrderQty:item.product_id!==selectProduct_id}
            ]"
          v-if="getOrderQty(item.product_id)!==0"
        >{{getOrderQty(item.product_id)}}</span>
        <!-- static info show for each product -->
        <!-- product cover -->
        <!-- <transition>
                <div v-if="item.product_id===selectProduct_id" class="product-background"></div>


        </transition>-->
        <!-- product footer cover  -->
        <div v-if="item.product_id===selectProduct_id" class="product-background-footer"></div>
        <transition>
          <img
            :src="`/table/public/images/items/${item.image}`"
            alt
            v-bind:class="{activeimg:item.product_id===selectProduct_id}"
          >
        </transition>
        <div
          class="text-container"
          @click="selectItem(item.product_id)"
          :class="{activeTextContainer:item.product_id===selectProduct_id}"
        >
          <h5 v-bind:class="{activeH5:item.product_id===selectProduct_id}">{{item.name}}</h5>
          <div
            v-if="item.product_id===selectProduct_id"
            class="product-description"
          >{{item.description}}</div>
          <div class="price" :class="{activePrice:item.product_id===selectProduct_id}">
            <p>${{item.price}}</p>
          </div>
        </div>
        <!-- button to control folder or expand each product -->
        <transition>
          <div
            class="button"
            v-if="table_number || app_conf.preorder"
            v-bind:class="{active:item.product_id===selectProduct_id,unactive:item.product_id!==selectProduct_id}"
            @click="wandOrder(item)"
          >
            <img src="/table/public/images/layout/plus_button.png" alt>
          </div>
        </transition>
        <!-- button to add new product to cart -->
        <button
          class="button active close-button"
          @click="selectItem(item.product_id)"
          v-if="item.product_id===selectProduct_id"
        >
          <i class="material-icons">close</i>
        </button>

        <!-- popup pannel for taste choices & options-->
        <div v-if="wantOrder==true && item.product_id===selectProduct_id" class="cover"></div>

        <template v-if="wantOrder==true && item.product_id===selectProduct_id">
          <ChoiceForm
            key="mykey"
            v-bind:item="item"
            @addToOrder="addToOrder"
            @closeChoiceForm="closeChoiceForm"
          ></ChoiceForm>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ChoiceForm from "./ChoiceForm.vue";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "app-product-list",

  data() {
    return {
      //flag for expand or not
      selectProduct_id: 0,
      //flag for popup choices pannel
      wantOrder: false
    };
  },
  computed: {
    ...mapGetters([
      "productList",
      "orderList",
      "scrollPositionId",
      "app_conf",
      "table_number",
      "historyOrderList"
    ])
  },
  watch: {
    section: function() {
      let sum = 0;
      for (let index = 0; index < scrollPositionId; index++) {
        const element = this.$refs.cates[index];
        sum = sum + element.scrollHeight;
      }
      window.scrollY = sum + 50;
    }
  },
  mounted() {
    this.$nextTick(() => this.getProductList());
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapMutations(["updateProductList", "updateOrderList"]),
    ...mapActions([
      "getProductList",
      "addNewItemToOrderList",
      "setScrollPositionId"
    ]),
    selectItem(id) {
      /**
       * In Order To toggle the product detail in one button
       * check the id if same with selectProduct_id => dismiss, else set selectProdcut_id = id
       **/
      this.wantOrder = false;
      if (this.selectProduct_id === id) {
        this.selectProduct_id = 0;
      } else {
        this.selectProduct_id = id;
      }
    },
    closeItem() {
      this.selectProduct_id = 0;
    },

    /** use for choice pannel open or close*/
    wandOrder(item) {
      if (this.app_conf.show_option) {
        if (item.choices.length < 1 && item.options < 1) {
          let newItem = JSON.parse(JSON.stringify(item));
          this.addNewItemToOrderList(newItem);
        } else {
          this.selectProduct_id = item.product_id;
          this.wantOrder = true;
        }
      } else {
        let newItem = JSON.parse(JSON.stringify(item));
        this.addNewItemToOrderList(newItem);
      }
    },
    closeChoiceForm() {
      this.wantOrder = false;
      this.selectProduct_id = 0;
    },
    /**choice pannel end */

    addToOrder(newItem) {
      /**
       * add a new item into order
       * 1. should check is there any duplicate item
       * 2. if have, increate the quantity only
       * 3. if not, this item is new to the order so create new obj and insert to the array
       * 4. final result the array will be like this
       * [{item:{},quantity:number}]*/

      this.wantOrder = false;

      this.addNewItemToOrderList(newItem);
      this.selectProduct_id = 0;
    },
    handleScroll() {
      let sum = 0;
      /** loop the elements check the height to find out which category section now is showing */
      for (let index = 0; index < this.$refs.cates.length; index++) {
        const element = this.$refs.cates[index];
        sum = sum + element.scrollHeight;
        //**ToDo: why here is - 50 I thoungh should be + 50 */
        if (sum - 50 > window.scrollY) {
          this.setScrollPositionId(index);
          /**new step let category list change base on this scrollPostionId */
          break;
        }
      }
    },
    getOrderQty(id) {
      let qty = 0;
      if (this.orderList === null || this.orderList.length === 0) {
        return 0;
      }
      this.orderList.forEach(el => {
        if (el.item.product_id === id) {
          qty += el.quantity;
        }
      });
      this.historyOrderList.forEach(el => {
        if (el.item.product_id === id) {
          qty += el.quantity;
        }
      });
      return qty;
    }
  },
  components: { ChoiceForm }
};
</script>

<style lang="scss" scoped>
.cover {
  position: fixed;
  height: 100vh;
  background: #0000009c;
  width: 100vw;
  z-index: 600;
  top: 0;
  left: 0;
}
span.orderQty {
  position: absolute;
  background-color: #eb4d4b;
  color: white;
  border-radius: 50%;
  width: 20px;
  text-align: center;
  height: 20px;
  font-weight: 800;
  line-height: 18px;
  text-shadow: 1px 1px 1px black;
  box-shadow: inset 0px 0px 1px white;
  z-index: 2;
  &.activeOrderQty {
    bottom: 0;
    left: 10px;
    width: 40px;
    height: 40px;
    line-height: 38px;
    font-size: 24px;
  }
  &.unactiveOrderQty {
    right: -15px;
    top: -8px;
  }
}
.productList {
  margin-top: 10vh;
  margin-bottom: 9vh;
  width: 70%;
  padding-left: 12px;
  background-color: #f1f1f1;
  overflow: scroll;
  height: 81vh;
  h4 {
    height: 24px;
    font-size: 20px;
    font-weight: 600;
    color: #333333;
  }
  .product {
    color: #444444;
    border-bottom: 3px solid white;
    width: calc(100% - 7px);
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 9px;
    margin-right: 7px;
    img {
      width: 20vw;
      height: 7vh;
      border-radius: 4px;
      transition: all 0.5s;
      &.activeimg {
        display: none;
        border-radius: 8px;
        width: 50%;
        left: 25%;
        top: 55%;
        z-index: 10;
        box-shadow: 0px 2px 5px rgba(75, 73, 73, 0.6);
        transition: all 0.5s;
      }
    }
    .text-container {
      display: flex;
      width: 80%;
      margin: 0 auto;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 7px;
      &.activeTextContainer {
        width: 95%;
        z-index: 3;
      }

      h5 {
        height: 26px;
        font-size: 10px;
        color: #444444;
        margin-bottom: 0px;
        line-height: 26px;
        &.activeH5 {
          color: #fff;
          font-size: 20px;
          text-shadow: 2px 2px 6px #000;
        }
      }
      .price {
        margin: 0;
        font-weight: 600;
        font-size: 12px;
        opacity: 0.9;
        height: 15px;
        line-height: 17px;
        padding-right: 10px;
        color: #333;
        &.activePrice {
          font-weight: 700;
        }
      }
    }

    .product-background {
      width: 100%;
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      background: #00000038;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
    }
    .product-background-footer {
      width: 100%;
      position: absolute;
      height: 30px;
      bottom: 0;
      left: 0;
      background: #ffffffc9;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
      z-index: 1;
    }

    .button {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      img {
        width: 16px;
        height: 16px;
      }
      &.active {
        bottom: 0px;
        transition: all 0.5s;
        &.close-button {
          top: 0;
          transition: all 0.5s;
        }
      }
      &.unactive {
        top: 20px;
        transition: all 0.5s;
      }
    }
    .choice-form {
      position: fixed;
      z-index: 800;
      width: 80%;
      top: 30%;
      left: 10%;
      border-radius: 3px;
      background-color: #c7eceef0;
      transition: all 0.5s;
      .choice-form-title {
        font-size: 16px;
        font-weight: bold;
        color: #1e1e1e;
        display: flex;
        justify-content: space-between;
        padding: 2px 10px;
      }
      .choice-group {
        box-shadow: 0px 2px 2px #00000094;
        padding: 8px;
        border-radius: 3px;
        background-color: #ffffff91;
        min-height: 100px;
        width: 80%;
        margin: auto;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        h4 {
          font-size: 14px;
          text-align: center;
          margin: 0;
          text-shadow: 1px 1px 1px #c9c2c2;
          font-weight: bold;
        }
        ul {
          list-style-type: none;
          padding: 0;
          display: flex;
          justify-content: space-around;
          margin: 0;
          margin-bottom: 4px;
          li {
            color: black;
            vertical-align: middle;
            font-size: 11px;
            input {
              box-sizing: border-box;
              padding: 0;
              vertical-align: middle;
            }
            span {
              vertical-align: middle;
            }
          }
        }
      }
    }
    .form_button_container {
      text-align: right;
      display: flex;
      justify-content: center;
      .addButton {
        color: red;
        padding: 5px 10px;
        margin: 12px;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        background: #ffbe76;
        border: 1px solid #ffbe76;
        box-shadow: 0px 0px 4px #00000040;
      }
    }
  }
  .activeProduct {
    color: black;
    height: 200px;

    background-size: cover;
    h5 {
      color: white;
      font-size: 18px;
    }
    h4 {
      color: black;
    }
    p {
      max-height: none;
      float: none;
    }
  }

  .product-description {
    font-size: 10px;
    font-weight: 800;
    padding: 3px 10px;
    line-height: 1rem;
    color: black;
    overflow: scroll;
    background-color: #ffffffcc;
    border-radius: 3px;
    max-height: 80px;
    /* box-shadow: inset 0px 0px 1px #fff; */
  }
  p {
    margin: 0;
  }
}
</style>

