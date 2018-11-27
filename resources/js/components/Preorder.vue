<template>
  <div>
    <Head></Head>
    <div class="bodyContainer">
      <CategoryList></CategoryList>
      <ProductList></ProductList>
      <PreorderShoppingCart></PreorderShoppingCart>
    </div>
  </div>
</template>

<script>
import CategoryList from "./CategoryList";
import ProductList from "./ProductList";
import ShoppingCart from "./ShoppingCart";
import PreorderShoppingCart from "./PreorderShoppingCart";
import Head from "./Head";
export default {
  name: "app-order",
  components: { CategoryList, ProductList, Head, PreorderShoppingCart }
};
</script>

<style lang="scss" scoped>
.bodyContainer {
  display: flex;
  flex-direction: row;
}
</style>

