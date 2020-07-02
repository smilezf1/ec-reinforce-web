<template>
  <div class="recommend">
    <div class="recommendHeader">
      <p>当前位置: 系统介绍</p>
    </div>
    <div class="recommendContent">
      <div class="recommendContentTitle">平台简介</div>
      <div class="recommendContentBody">
        <div class="section">
          <div class="left">
            <p class="name">
              <span> 平台名称:</span>
              <span>{{ listItem.companyName }}</span>
            </p>
            <p class="version">
              <span>版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span>
              <span>{{ listItem.version }}</span>
            </p>
            <p class="describe">
              <span>内容描述:</span>
              <span>{{ listItem.description }}</span>
            </p>
            <p class="copyright">
              <span>版权所有:</span>
              <span>{{ listItem.copyright }}</span>
            </p>
            <p class="phone">
              <span>客服电话:</span>
              <span>{{ listItem.servicePhone }}</span>
            </p>
            <p class="address">
              <span>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址:</span>
              <span>{{ listItem.address }}</span>
            </p>
          </div>
          <div class="right">
            <img src="../../assets/logo.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "recommend",
  data() {
    return {
      listItem: {}
    };
  },
  created() {
    let baseUrl = this.api.baseUrl,
      _this = this;
    https.fetchGet(baseUrl + "/api/system/about/findAbout").then(res => {
      _this.listItem = res.data.data;
    });
  }
};
</script>
<style>
.recommend {
  color: #45494c;
}
.recommendHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  padding-left: 30px;
}
.recommendContentTitle {
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  border-bottom: 1px solid #ebedf0;
  padding-left: 30px;
}
.recommendContentBody {
  padding: 30px 20px 30px 30px;
  border-bottom: 1px solid #ebedf0;
}
.recommendContentBody .section {
  display: flex;
  justify-content: space-around;
}
.recommendContentBody .left {
  padding-right: 30px;
  border-right: 1px solid #dadee2;
  flex: 2;
}
.recommendContentBody .right {
  flex: 2;
  position: relative;
}
.recommendContentBody .right img {
  width: 400px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.recommendContentBody p {
  font-size: 14px;
  margin: 20px 0;
  text-align: justify;
}
.recommendContentBody p span:first-child {
  font-weight: bold;
  text-align: justify;
}
.recommendContentBody .nameText {
  font-weight: bold;
}
.recommendContentBody span {
  font-weight: normal;
}
.recommendContentBody .describe {
  line-height: 30px;
}
</style>
