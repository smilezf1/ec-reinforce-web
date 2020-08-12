<template>
  <div class="channelStrategy">
    <div class="channelStrategyHeader">
      <p>当前位置:渠道策略</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            size="small"
            placeholder="请输入渠道名称"
            v-model="ruleForm.channelStrategyName"
          ></el-input>
        </el-form>
      </div>
      <div class="operateBox">
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchChannelStrategyName()"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            @click="refresh()"
          ></el-button>
        </el-tooltip>
        <el-button type="primary" size="small" @click="createChannelStrategy()"
          >新建渠道</el-button
        >
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="channelStrategyBody">
      <template> </template>
    </div>
  </div>
</template>
<script>
import https from "../../http";
export default {
  name: "channelStrategy",
  data() {
    return {
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: [],
      ruleForm: {
        channelStrategyName: ""
      }
    };
  },
  inject: ["reload"],
  beforeMount() {
    let _this = this,
      baseUrl = this.api.baseUrl;
    /*  https.fetchPost(
      baseUrl + "/api/channel/strategy/findChannelStrategyByPage",
      { pn: this.curPage, limit: this.limit }
    ); */
    _this.getData();
  },
  methods: {
    //获取表格数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(
          baseUrl + "/api/channel/strategy/findChannelStrategyByPage",
          { pn: this.curPage, limit: this.limit, queryInfo }
        )
        .then(res => {
          console.log(res, "res");
          if (res.data.code === "00") {
            let data = res.data.data;
            this.listItem = data.items;
            this.dataCount = data.count;
            console.log(data);
          }
        });
    },
    beforeMount() {},
    //查询渠道策略名称
    searchChannelStrategyName() {
      console.log(this.ruleForm.channelStrategyName);
    },
    //新建渠道
    createChannelStrategy() {}
  }
};
</script>
<style>
.channelStrategyHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.channelStrategy .searchForm {
  display: flex;
}
.channelStrategy .operateBox {
  margin-left: 10px;
}
</style>
