<template>
  <div class="listContainer" v-scroll-spy-active v-scroll-spy-link>
    <div class="categoryContainer">
      <a
        v-for="(category,index) in categoryList"
        :key="index"
        class="categoryList"
        :class="{customActive:index===scrollPositionId}"
        @click="select(index)"
      >{{category.name}}</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
export default {
  name: "app-category-list",
  computed: {
    ...mapGetters(["categoryList", "scrollPositionId"])
  },
  mounted() {
    this.$nextTick(() => this.getCategoryList());
  },
  methods: {
    ...mapMutations(["updateCategoryList"]),
    ...mapActions(["getCategoryList", "setScrollPositionId"]),
    select(index) {
      //   window.scrollY = 56;
      //   console.log("scroll Y", window.scrollY);
      //   console.log("screen Y", window.screenY);
      //   this.setScrollPositionId(index);
      //var name = $(this).attr("data-row-id");
      //var id = "#" + name;
      //var top = $(id).first().offset().top -60;
    }
  }
};
</script>

<style lang="scss" scoped>
.listContainer {
  justify-content: space-between;
  display: flex;
  height: 100vh;
  width: 30vw;
  flex-direction: column;
  position: relative;
  font-weight: bold;
  letter-spacing: 0.4px;
  margin-top: 10vh;
  //
  .categoryContainer {
    position: fixed;
    width: 30%;
    overflow: scroll;
    height: 81vh;
    margin-bottom: 9vh;
    display: flex;
    flex-direction: column;
    .categoryList {
      text-align: center;
      padding: 18px 9px;
      width: 100%;
      color: #444;
      transition: all 0.5s;
      border-bottom: 0.5px solid #b4b4b4;
    }
    .customActive {
      border-left: 4px solid #f55747;
      background-color: #f1f1f1;
      border-bottom: none;
    }
  }
}
</style>

