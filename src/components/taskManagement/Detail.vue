<template>
  <div class="Detail">
    <div class="detailHeader">
      <p>当前位置:详情页面</p>
    </div>
    <div class="detailOperate">
      <el-tooltip effect="dark" content="返回" placement="top-start">
        <el-button
          type="primary"
          icon="el-icon-back"
          size="small"
          @click="back()"
        ></el-button>
      </el-tooltip>
    </div>
    <div class="detailBody">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="1.基本信息" name="1">
          <div v-for="item in listItem" :key="item.id">
            <el-row>
              <el-col :span="12"
                >应用名称:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.appName }}</el-col
              >
              <el-col :span="12"
                >应用头像:&nbsp;&nbsp;&nbsp;&nbsp;<img
                  :src="'data:image/jpg;base64,' + item.appIcon"
              /></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >包名:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.appPackage }}</el-col
              >
              <el-col :span="12"
                >文件大小:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.appSize }}KB</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="12"
                >文件MD5:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.md5 }}</el-col
              >
              <el-col :span="12"
                >加固厂商:&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="item.status == 1">已完成</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >签名信息:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.signature }}</el-col
              >
              <el-col :span="12"
                >签名类型:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.signatureType
                }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="12"
                >版本信息:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.appVersion }}</el-col
              >
              <el-col :span="12"
                >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.createTime }}</el-col
              >
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="2.签名信息" name="2">
          <div v-for="item in signatureItem" :key="item.id">
            <el-row>
              <el-col :span="12"
                >签名名称:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.signName }}</el-col
              >
              <el-col :span="12"
                >签名密码:&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input
                  v-model="item.signPwd"
                  show-password
                  readonly
                  size="small"
                  style="width:20%"
                ></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >签名别名:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.signAliasName
                }}</el-col
              >
              <el-col :span="12"
                >别名密码:&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input
                  v-model="item.signAliasPwd"
                  readonly
                  size="small"
                  style="width:20%"
                  show-password
                ></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >签名状态:&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="item.status == 1">已完成</span>
              </el-col>
              <el-col :span="12"
                >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.createTime }}</el-col
              >
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="3.策略信息" name="3">
          <div v-for="item in strategyItem" :key="item.id">
            <el-row>
              <el-col :span="12"
                >策略名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceStrategyName
                }}</el-col
              >
              <el-col :span="12"
                >策略描述:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceDescribe
                }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="12"
                >策略数量:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceStrategyCount
                }}</el-col
              >
              <el-col :span="12"
                >状态:&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="item.status == 1">已完成</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.createTime }}</el-col
              >
              <el-col :span="12"
                >更新时间:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.updateTime }}</el-col
              >
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="4.多渠道策略信息" name="4">
          <div v-for="item in multipleChannel" :key="item.id">
            <el-row>
              <el-col :span="12"
                >多渠道策略名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.channelStrategyName
                }}</el-col
              >
              <el-col :span="12"
                >多渠道策略描述:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.channelStrategyDescribe
                }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="12"
                >多渠道策略数量:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.channelStrategyCount
                }}</el-col
              >
              <el-col :span="12">
                <!-- 多渠道策略列表:{{ item.itemDetailDtoList }} -->
                <el-collapse-item title="多渠道策略列表">
                  <div
                    v-for="subItem in item.itemDetailDtoList"
                    :key="subItem.id"
                  >
                    <el-row>
                      <el-col :span="12"
                        >渠道名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                          subItem.channelName
                        }}</el-col
                      >
                      <el-col :span="12"
                        >渠道创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{
                          subItem.createTime
                        }}</el-col
                      >
                    </el-row>
                    <el-row>
                      <el-col :span="12"
                        >渠道状态:&nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-if="subItem.status == 1">已完成</span>
                      </el-col>
                      <el-col :span="12">
                        <el-collapse-item title="渠道详细">
                          <div
                            v-for="grandItem in subItem.channelDetails"
                            :key="grandItem.id"
                          >
                            <el-row>
                              <el-col :span="12"
                                >渠道关键字:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                  grandItem.channelKey
                                }}</el-col
                              >
                              <el-col :span="12"
                                >渠道值:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                  grandItem.channelValue
                                }}</el-col
                              >
                            </el-row>
                          </div>
                        </el-collapse-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-collapse-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                >多渠道策略状态:&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="item.status == 1">已完成</span>
              </el-col>
              <el-col :span="12"
                >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.createTime }}</el-col
              >
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "Detail",
  data() {
    return {
      listItem: [],
      signatureItem: [],
      strategyItem: [],
      multipleChannel: [],
      activeNames: ["1", "2", "3", "4"] //测试
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    let baseUrl = this.api.baseUrl,
      id = parseInt(this.$route.params.id);
    https
      .fetchGet(baseUrl + "/api/reinforce/info/findReinforceDetailById", {
        reinforceId: id
      })
      .then(res => {
        let data = res.data.data;
        this.listItem.push(data.reinforceInfo);
        this.signatureItem.push(data.reinforceSign);
        this.strategyItem.push(data.reinforceStrategyDetail);
        this.multipleChannel.push(data.channelStrategyDto);
      });
  },
  destroyed() {
    console.log("离开了当前页面");
  }
};
</script>
<style>
.detailHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.el-collapse {
  width: 90%;
}
.el-collapse-item__header {
  font-size: 17px;
  background: #f2f5f7;
  color: #515a6e;
  font-size: 14px;
  padding-left: 10px;
}
.el-collapse-item__content {
  padding-left: 10px;
}
.el-collapse-item {
  font-size: 16px !important;
}
.detailBody .el-collapse img {
  width: 50px;
  border: 1px solid #eaeaea;
  border-radius: 3px;
  vertical-align: middle;
  margin-left: 15px;
}
.detailBody .el-row{
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  padding: 20px 0;
}
.detailBody .el-input__inner {
  border: none;
}
.detailOperate {
  margin-bottom: 15px;
}
.el-button--primary {
  background: #207ba6;
  border-color: #207ba6;
}
.el-button--primary:hover {
  background: #207ba6bd;
  border-color: #207ba6bd;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent;
}
.el-table thead {
  color: #515a6e;
  font-size: 12px;
}
.el-table__header-wrapper {
  background: #f8f8f9;
}
.el-table__header-wrapper th {
  background: #f2f5f7;
}
.el-table ::before {
  background: white;
}
</style>
