<template>
  <div class="payment">
    <!-- payment method section -->
    <section>
      <div class="payment-method">
        <h6>
          <router-link :to="`/table/public/order`">
            <i class="material-icons">arrow_back_ios</i>
          </router-link>
          {{app_conf.preorder_confirm_text}}
        </h6>
      </div>
    </section>
    <!-- payment methdo seciton end -->
    <!-- QR Code Section -->
    <section>
      <vue-qr
        v-if="app_conf.QrCodeImage"
        :logoSrc="app_conf.QrImageUrl"
        :text="QrValue"
        :margin="0"
        class="qrcode"
        :size="200"
      ></vue-qr>
      <vue-qr v-if="!app_conf.QrCodeImage" :text="QrValue" :margin="0" class="qrcode" :size="200"></vue-qr>
    </section>
    <!-- QR Code Section End -->
    <!-- order section -->
    <section>
      <h6>
        <span>{{app_conf.your_order_title}}</span>
      </h6>
      <div>
        <!-- list of order_items -->
        <ul>
          <li v-for="(orderItem,index) in orderList" :key="index">
            <div class="orderItem-img">
              <img :src="`/table/public/images/items/${orderItem.item.image}`" alt>
            </div>
            <div class="orderItem-info-container">
              <div class="orderItem-name-quantity">
                <div class="orderItem-name">
                  <h5>{{orderItem.item.name}}</h5>
                </div>
                <div class="orderItem-quantity">
                  <p>X {{orderItem.quantity}}</p>
                </div>
              </div>
              <div class="orderItem-choice-price">
                <ul class="choice-list" v-if="app_conf.show_option">
                  <li
                    v-for="(choice,index2) in orderItem.item.choices"
                    :key="index2"
                  >{{choice.type}} {{choice.pickedChoice}}</li>
                </ul>
                <div class="orderItem-price">
                  <p>{{app_conf.currency}} ${{orderItem.item.price}}</p>
                </div>
              </div>
            </div>
            <!-- list of choice for each order_item -->
          </li>
        </ul>
      </div>
    </section>
    <!-- order section end -->
    <!-- payment detail section -->
    <section>
      <h6>{{app_conf.payment_detail_title}}</h6>
      <div class="payment-detail-container">
        <div>
          <span>{{app_conf.price}}</span>
          <span class="number">{{app_conf.currency}} ${{totalPriceOfOrder}}</span>
        </div>
        <div class="bold">
          <span>{{app_conf.total}}</span>
          <span class="number">{{app_conf.currency}} ${{totalPriceOfOrder}}</span>
        </div>
      </div>
    </section>
    <!-- payment detail section end -->
  </div>
</template>


<script>
import { mapState, mapGetters, mapActions } from "vuex";
import QrcodeVue from "qrcode.vue";
import VueQr from "vue-qr";

export default {
  data() {
    return {
      paymentMethod: "cash",
      QrValue: "https://www.google.com",
      imgURL: "/table/public/images/"
    };
  },
  mounted() {
    /**qrcode order command: barcode 1, qty1, sizeLevel 1;barcode2, qty2,sizeLevel2
     * example: 106,2.5,0
     */
    this.delay(800).then(res => {
      let newList;
      if (
        localStorage.getItem("preorderList") &&
        localStorage.getItem("preorderList").length > 0
      ) {
        this.replaceList(localStorage.getItem("preorderList"));
      }
      let qr = "=QROD=";
      if (this.orderList !== null || this.orderList.length !== 0) {
        this.orderList.forEach(el => {
          qr = qr + el.item.upc + ",";
          qr = qr + el.quantity + ",";
          qr = qr + "0" + ";";
          el.item.choices.forEach(choice => {
            qr = qr + choice.barcode + "," + el.quantity + "," + 0 + ";";
          });
          el.item.options.forEach(option => {
            qr = qr + option.option_name + "," + option.pickedOption + ",";
          });
          //qr = qr + "0" + ";";
        });

        this.QrValue = qr.substr(0, qr.length - 1);
      } else {
        this.QrValue = qr;
      }
    });
  },
  computed: {
    ...mapGetters([
      "orderId",
      "orderList",
      "totalPriceOfOrder",
      "table_number",
      "pathFrom",
      "store_id",
      "totalPriceOfOrder",
      "store_name",
      "store_url",
      "app_conf",
      "v",
      "cdt",
      "lang",
      "isConfirmed"
    ])
  },
  methods: {
    ...mapActions(["setSpinnerStatus", "replaceList", "setIsConfirmed"]),
    back() {
      this.$router.push("/table/public/order");
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
    QrcodeVue,
    VueQr
  }
};
</script>


<style lang="scss" scoped>
.payment {
  padding-bottom: 100px;
  margin: 0;
  width: 100%;
  background-color: #e5e3e3;
  .qrcode {
    display: flex;
    justify-content: center;
    padding: 10px 0px 0px 0px;
  }
  section {
    margin-bottom: 10px;
    background-color: white;
    padding-bottom: 10px;
  }
  h6 {
    padding: 10px;
    font-weight: bold;
    color: #9b9b9b;
    border-bottom: 1px solid #e9e6e6;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      padding: 0;
      margin: 0;
      display: flex;
      margin-bottom: 10px;
      .orderItem-img {
        width: 20%;
        display: flex;
        justify-content: center;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .orderItem-info-container {
        display: flex;
        flex-direction: column;
        padding: 0px 10px;
        width: 80%;
        .orderItem-name-quantity {
          display: flex;
          justify-content: space-between;
          .orderItem-name .orderItem-quantity {
            display: inline-block;
          }
          .orderItem-name {
            width: 90%;
          }
          p {
            margin: 0;
          }
          h5 {
            margin: 0;
            font-weight: bold;
            font-size: 16px;
            letter-spacing: 3px;
          }
        }
        .orderItem-choice-price {
          display: flex;
          justify-content: space-between;
          ul {
            li {
              padding: 0;
              margin: 0;
              font-size: 10px;
              color: #9b9b9b;
              max-width: 160px;
            }
          }
          .orderItem-price {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          p {
            margin: 0;
            font-weight: bold;
            color: #f83f3a;
          }
        }
      }
    }
  }
  .payment-method {
    display: flex;
    flex-direction: column;
    .icon-group {
      display: flex;
      justify-content: space-around;
      .payment-choice {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        img {
          width: 60px;
          height: 37.95px;
        }
        input {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
          font-size: 14px;
        }
      }
      p {
        margin: 0;
        text-align: center;
      }
    }
  }
  .payment-detail-container {
    display: table;
    width: 90%;
    margin: auto;
    .bold {
      font-weight: bold;
    }
    div {
      display: table-row;
      span {
        display: table-cell;

        &.number {
          text-align: right;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #ffc24a;
    box-shadow: 0px -2px 3px #00000038;
    .footer-content-container {
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
      margin: 5px 0px;
      .footer-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 3px;
        }
        span {
          text-shadow: 1px 1px 1px black;
          color: white;
          padding: 2px 3px 2px 0px;
          margin: 0px 1px;
          font-weight: bold;
          border-radius: 3px;
        }
      }
      .footer-detail {
        flex: 1;
        padding: 0 20px;
        justify-content: center;
        display: flex;
        flex-direction: column;
        .footer-detail-info {
          font-size: 10px;
          color: #9b9b9b;
        }
        .footer-detail-total {
          font-size: 20px;
          text-align: right;
          font-weight: 700;
        }
      }
      .footer-button {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 47px;
        background-color: #eb4d4b;
        text-align: center;
        color: #ffc24a;
        box-shadow: 0px 2px 3px #9b9b9b;
        border-radius: 8px;

        .animated.infinite.pulse {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
}
</style>
