<template>
  <div class="Detail">
    详情页面呀
  </div>
</template>
<script>
export default {
  name: "Detail",
  mounted() {
    console.log(this.$route.params.id);
  }
};
</script>
