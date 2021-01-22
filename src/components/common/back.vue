<template>
  <div class="back">
    <svg class="icon goBack" aria-hidden="true" @click="back()">
      <use xlink:href="#icon-fanhui"></use>
    </svg>
  </div>
</template>
<script>
export default {
  name: "back",
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>
<style>
.goBack {
  position: fixed;
  bottom: 70px;
  right: 30px;
  color: white;
  font-size: 26px;
  background: #3333338a;
  padding: 15px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
