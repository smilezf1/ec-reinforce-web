<template>
  <div class="Log">
    <div class="logHeader">
      <p>当前位置:加固日志</p>
    </div>
    <div class="logBody">
      <div class="logBodyTitle">
        <span>加固应用:&nbsp;&nbsp;{{ titleItem.appName }}&nbsp;&nbsp;</span>
        <span
          >加固状态:&nbsp;&nbsp;
          <span v-if="titleItem.status == 3">加固成功</span>
          <span v-if="titleItem.status == 4">加固失败</span>
        </span>
      </div>
      <div class="logBodyContent">
        {{ listItem }}
      </div>
    </div>
    <back></back>
  </div>
</template>
<script>
import api from "../../request/api";
import back from "../common/back";
export default {
  name: "Log",
  components: { back },
  data() {
    return {
      listItem: null,
      titleItem: null
    };
  },
  created() {
    const id = parseInt(this.$route.query.id),
      _this = this;
    _this.titleItem = this.$route.query;
    api.reinforceService.getReinforceLog(id).then(res => {
      if (res.code == "00") {
        _this.listItem = res.data;
      }
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
  width: 90%;
  box-shadow: 0px 0px 10px #00000021;
  margin: 10px 10px 0 0;
  padding: 20px;
}
.logBodyTitle {
  font-size: 14px;
  font-weight: 550;
  color: #606266;
}
.logBodyContent {
  white-space: pre-line;
  font-size: 14px;
  color: #606266;
  line-height: 25px;
}
</style>
