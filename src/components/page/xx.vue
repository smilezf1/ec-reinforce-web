<template>
  <div class="xx">
    <template>
      <el-checkbox-group v-model="checkedCities" :min="0" :max="1">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{
          city
        }}</el-checkbox>
      </el-checkbox-group>
    </template>
  </div>
</template>
<script>
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  data() {
    return {
      checkedCities: [],
      cities: cityOptions
    };
  }
};
</script>
