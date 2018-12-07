<template>
  <div class="header">
    <div class="wrapper">
      <h2>{{app_conf.preorder? app_conf.preorder_title:app_conf.app_header_title + table_number}}</h2>
    </div>

    <div class="languageSwitchButtonGroup">
      <span class="button-wrapper">
        <span
          v-if="lang==1"
          @click="setToCN"
          class="languageButton"

        >{{app_conf.lang_switch_cn}}</span>
        <span
          v-if="lang==2"
          @click="setToEN"
          class="languageButton"

        >{{app_conf.lang_switch_en}}</span>
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
      localStorage.language_id = 2;
      this.setLang(2);
      this.$router.go();
    },
    setToEN() {
      localStorage.language_id = 1;
      this.setLang(1);
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
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: space-between;
  background-color: rgb(235, 77, 75);
  color: #f8fafc;
  //   padding: 6px;
  box-shadow: 0px 5px 5px #00000038;
  z-index: 200;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 6;
}
h2 {
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 6px #000;
}
/*language switch button :yin_yang:*/
.languageSwitchButtonGroup {
  text-align: right;
  background-color: #ffc24a;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  .button-wrapper {
    text-align: center;
    font-size: 22px;
  }
  .languageButton {
    color: white;
    font-weight: 500;
    text-shadow: 1px 1px 3px black;
    &.languageButtonInactive {
      background-color: #933b38;
      padding: 0px 5px;
      box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>

