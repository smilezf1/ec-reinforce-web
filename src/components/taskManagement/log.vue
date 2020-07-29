<template>
  <div class="Log">
    <div class="logHeader">
      <p>当前位置:加固日志</p>
    </div>
    <div class="logOperate">
      <el-button type="primary" size="small" @click="back()">返回</el-button>
    </div>
    <div class="logBody">
      <div class="logBodyTitle">
        <span
          >加固应用:&nbsp;&nbsp;{{
            titleItem.appName
          }}&nbsp;&nbsp;</span
        >
        <span
          >加固状态:&nbsp;&nbsp;
          <span v-if="titleItem.status == 3">加固成功</span>
        </span>
      </div>
      <div class="logBodyContent">
        {{ listItem }}
      </div>
    </div>
  </div>
</template>
<script>
import https from "../../http";
export default {
  name: "Log",
  data() {
    return {
      listItem: null,
      titleItem: null
    };
  },
  mounted() {
    let baseUrl = this.api.baseUrl,
      id = parseInt(this.$route.params.id),
      _this = this;
    _this.titleItem = this.$route.query;
    https
      .fetchGet(baseUrl + "/api/reinforce/info/findLogoByReinforceId/" + id)
      .then(res => {
        _this.listItem = res.data.data;
      });
  },
  methods: {
    back() {
      window.history.back();
    }
  }
};
</script>
<style>
.logHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.logBody {
  box-shadow: 0px 0px 10px #00000029;
  margin: 10px 10px 0 0;
  padding: 20px;
}
.logBodyTitle {
  font-size: 16px;
}
.logBodyContent {
  white-space: pre-line;
  font-size: 14px;
  color: #45494c;
  line-height: 25px;
}
</style>
