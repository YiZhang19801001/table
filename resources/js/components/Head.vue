<template>
  <div class="header">
    <div class="wrapper">
      <h2>{{app_conf.preorder? app_conf.preorder_title:app_conf.app_header_title + table_number}}</h2>
    </div>

    <div class="languageSwitchButtonGroup">
      <span class="button-wrapper">
        <span v-if="lang==2" @click="setToCN" class="languageButton">{{app_conf.lang_switch_cn}}</span>
        <span v-if="lang==1" @click="setToEN" class="languageButton">{{app_conf.lang_switch_en}}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["table_number", "app_conf", "lang", "pathFrom"])
  },
  methods: {
    ...mapActions(["setLang"]),
    setToCN() {
      localStorage.language_id = 1;
      this.setLang(1);
      this.$router.go();
    },
    setToEN() {
      localStorage.language_id = 2;
      this.setLang(2);
      this.$router.go();
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  background-image: url("/table/public/images/banner.png");
  background-size: cover;
  color: #fff;
  z-index: 200;
  border-bottom: 3px solid white;
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 6;
    h2 {
      font-weight: bold;
      font-size: 32px;
      text-transform: uppercase;
      margin: 0;
      margin-top: 3px;
      margin-left: 20px;
    }
  }
  /*language switch button :yin_yang:*/
  .languageSwitchButtonGroup {
    text-align: right;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    .button-wrapper {
      text-align: center;
      width: 24px;
      height: 24px;
      border-radius: 3px;
      border: 1px solid #fff;
      margin-top: 3px;
    }
    .languageButton {
      color: white;
      font-weight: 500;
      font-size: 14px;
      height: 20px;
    }
  }
}
</style>

