/*
<template>
  <div class="Detail">
    <div class="detailHeader">
      <p>
        当前位置:详情页面
      </p>
    </div>
    <div class="detailBody">
      <header>
        <div class="basicInfo" v-if="basicInfoItem">
          <p class="title">基本信息</p>
          <div class="basicInfoBody">
            <div class="basicInfoImg">
              <img :src="'data:image/jpg;base64,' + basicInfoItem.appIcon" />
            </div>
            <div class="basicInfoText">
              <el-row>
                <el-col :span="12">
                  <span>应用名称:{{ basicInfoItem.appName }}</span>
                </el-col>
                <el-col :span="12">
                  <span>应用包名:{{ basicInfoItem.appPackage }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <span>应用大小:{{ basicInfoItem.appMbSize }}MB</span>
                </el-col>
                <el-col :span="12">
                  <span>应用版本:{{ basicInfoItem.appVersion }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <span>MD5:{{ basicInfoItem.md5 }}</span>
                </el-col>
                <el-col :span="12">
                  <span>文件名:{{ basicInfoItem.appFileName }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </header>
      <div class="cradBox">
        <el-tabs type="border-card">
          <el-tab-pane
            label="加固策略信息"
            class="reinforceStrategyInfoItemTabPane"
            v-if="reinforceStrategyInfoItem"
          >
            <div class="reinforceStrategy">
              <el-row type="flex">
                <el-col :span="2"><span>策略名称</span></el-col>
                <el-col :span="22"
                  ><span>
                    {{ reinforceStrategyInfoItem.reinforceStrategyName }}
                  </span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>策略描述</span></el-col>
                <el-col :span="22"
                  ><span>{{
                    reinforceStrategyInfoItem.reinforceDescribe
                  }}</span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>加固功能</span></el-col>
                <el-col :span="22"
                  ><span>{{
                    reinforceStrategyInfoItem.reinforceStrategyCount
                  }}</span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>创建人</span></el-col>
                <el-col :span="22">{{
                  reinforceStrategyInfoItem.userName
                }}</el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>创建时间</span></el-col>
                <el-col :span="22">{{
                  reinforceStrategyInfoItem.createTime
                }}</el-col>
              </el-row>
            </div>
            <div class="reinforceItem">
              <p class="reinforceItemTitle">加固项</p>
              <div class="reinforceItemContent">
                <template v-if="reinforceItem">
                  <el-table
                    v-if="reinforceItem"
                    :data="reinforceItem"
                    row-key="id"
                    :tree-props="{ children: 'children' }"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                    ></el-table-column>
                    <el-table-column
                      label="加固项"
                      property="reinforceItemName"
                    ></el-table-column>
                    <el-table-column
                      label="描述"
                      property="reinforceItemDescribe"
                    ></el-table-column>
                    <el-table-column label="结果">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-duigou"></use>
                      </svg>
                    </el-table-column>
                    <el-table-column label="自定义" property="custom">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.custom">无</span>
                        <span v-else>
                          <el-tree
                            :data="scope.row.custom"
                            default-expand-all
                            style="height:70px;overflow:auto"
                          ></el-tree>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="多渠道策略信息"
            class="multipleChannelStrategyInfoTabPane"
            v-if="multipleChannelStrategyItem"
          >
            <div class="multipleChannelStrategyBasicInfo">
              <el-row type="flex">
                <el-col :span="2"><span>多渠道名称</span></el-col>
                <el-col :span="22"
                  ><span>{{
                    multipleChannelStrategyItem.channelStrategyName
                  }}</span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>多渠道描述</span></el-col>
                <el-col :span="22"
                  ><span>{{
                    multipleChannelStrategyItem.channelStrategyDescribe
                  }}</span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>多渠道数量</span></el-col>
                <el-col :span="22"
                  ><span>{{
                    multipleChannelStrategyItem.channelStrategyCount
                  }}</span></el-col
                >
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>包名</span></el-col>
                <el-col :span="22">{{
                  multipleChannelStrategyItem.appPackage
                }}</el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="2"><span>创建时间</span></el-col>
                <el-col :span="22">{{
                  multipleChannelStrategyItem.createTime
                }}</el-col>
              </el-row>
            </div>
            <div class="multipleChannelStrategyDetailInfo">
              <h3 class="title">多渠道详细</h3>
              <div class="content">
                <ul
                  v-for="item in multipleChannelStrategyItem.itemDetailDtoList"
                  :key="item.id"
                >
                  <p>
                    <span>渠道名称:</span><span>{{ item.channelName }}</span>
                  </p>
                  <li
                    v-for="parameterItem in item.channelDetails"
                    :key="parameterItem.id"
                  >
                    <p>
                      <span>key:</span
                      ><span>{{ parameterItem.channelKey }}</span>
                    </p>
                    <p>
                      <span>value:</span
                      ><span>{{ parameterItem.channelValue }}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="签名信息"
            class="signatureInfoTabPane"
            v-if="reinforceSignItem"
          >
            <el-row type="flex">
              <el-col :span="2"><span>签名名称</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.signName }}</span></el-col
              >
            </el-row>
            <el-row type="flex">
              <el-col :span="2"><span>签名密码</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.signPwd }}</span></el-col
              >
            </el-row>
            <el-row type="flex">
              <el-col :span="2"><span>签名别名</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.signAliasName }}</span></el-col
              >
            </el-row>
            <el-row type="flex">
              <el-col :span="2"><span>别名密码</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.signAliasPwd }}</span></el-col
              >
            </el-row>
            <el-row type="flex">
              <el-col :span="2"><span>创建人</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.userName }}</span></el-col
              >
            </el-row>
            <el-row type="flex">
              <el-col :span="2"><span>创建时间</span></el-col>
              <el-col :span="22"
                ><span>{{ reinforceSignItem.createTime }}</span></el-col
              >
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <back></back>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import back from "../common/back";
export default {
  name: "Detail",
  components: { back },
  data() {
    return {
      basicInfoItem: null,
      reinforceStrategyInfoItem: null,
      reinforceItem: null,
      reinforceSignItem: null,
      multipleChannelStrategyItem: null
    };
  },
  methods: {
    back() {
      window.history.back();
    }
  },
  mounted() {
    const id = this.$route.query.id,
      params = { reinforceTaskId: id };
    api.reinforceService.getReinforceDetail(params).then(res => {
      const data = res.data,
        reinforceStrategyDetail = data.reinforceStrategyDetail;
      if (res.code == "00") {
        if (data.reinforceInfo) {
          this.basicInfoItem = data.reinforceInfo;
        }
        if (reinforceStrategyDetail) {
          const soItemList = reinforceStrategyDetail.soItemList,
            h5ItemList = reinforceStrategyDetail.h5ItemList;
          this.reinforceStrategyInfoItem = reinforceStrategyDetail;
          this.reinforceItem = reinforceStrategyDetail.reinforceItemList;
          this.reinforceSignItem = data.reinforceSign;
          this.multipleChannelStrategyItem = data.channelStrategyDto;
          this.arrayAddProperty(this.reinforceItem, "custom");
          this.setMd5OrH5Value(this.reinforceItem, "custom", soItemList, "SO");
          this.setMd5OrH5Value(this.reinforceItem, "custom", h5ItemList, "H5");
        }
      }
    });
  },
  methods: {
    arrayAddProperty(array, property, value, type) {
      array.forEach(item => {
        this.$set(item, property, "");
      });
      return array;
    },
    //设置h5,md5值
    setMd5OrH5Value(array, property, value, type) {
      array.forEach(item => {
        if (value && value[0]) {
          if (
            value[0].label.indexOf(type) != -1 &&
            item.reinforceItemName.indexOf(type) != -1
          ) {
            this.$set(item, property, value);
          }
        }
      });
      return array;
    }
  }
};
</script>
<style>
.detailBody {
  width: 90%;
  color: #333;
}
.detailBody header {
  padding: 20px;
  margin-top: 10px;
  font-size: 14px;
  box-shadow: 0px 0px 10px #00000021;
  display: flex;
  color: #545454;
  justify-content: space-between;
}
.detailBody .basicInfo,
.detailBody .reinforceStrategyInfo {
  flex-grow: 1;
}
.detailBody header .basicInfoBody {
  display: flex;
  align-items: center;
}
.detailBody header .basicInfoBody .el-row {
  margin: 20px 0;
}
.detailBody header .basicInfoBody .basicInfoImg {
  margin-right: 40px;
}
.detailBody header .basicInfoBody .basicInfoImg img {
  width: 150px;
  margin-right: 10px;
}
.detailBody header .basicInfoText {
  flex-grow: 2;
}
.detailBody header .title {
  font-weight: 700;
  font-size: 16px;
  color: #353535;
  display: inline-block;
  margin-bottom: 20px;
}
.detailBody .cradBox {
  margin-top: 20px;
}
.detailBody content .title {
  margin: 20px 0;
  text-align: center;
  color: #4a4a4a;
  font-weight: 300;
  font-size: 22px;
}
.detailBody .el-tabs__content {
  font-size: 12px;
}
.detailBody .reinforceItemTabPane .el-table__row {
  height: 70px;
}
.detailBody .reinforceItemTitle {
  margin: 20px 0;
  font-size: 16px;
  font-weight: 700;
}
.detailBody .reinforceStrategy,
.detailBody .multipleChannelStrategyBasicInfo,
.detailBody .signatureInfoTabPane {
  border: 1px solid rgb(220, 222, 226);
}
.detailBody .multipleChannelStrategyDetailInfo .content p {
  margin: 20px 0;
  font-size: 14px;
}
.detailBody .multipleChannelStrategyDetailInfo .content ul {
  width: 45%;
  display: inline-block;
}
.detailBody .multipleChannelStrategyDetailInfo .title {
  margin: 15px 0px 10px 0px;
  font-size: 16px;
  font-weight: 700;
}
.detailBody .el-tabs__content {
  margin: 10px;
}
.detailBody .el-tabs__content .el-row:not(:last-child) {
  border-bottom: 1px solid rgb(230, 230, 230);
}
.detailBody .el-tabs__content .el-col {
  padding: 10px 0;
  line-height: 20px;
}
.detailBody .el-tabs__content .el-row {
  display: flex;
  align-items: center;
}
.detailBody .el-tabs__content .el-row .el-col:first-of-type {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  color: rgb(0, 0, 0);
  font-size: 12px;
  border-right: 1px solid rgb(220, 222, 226);
}
.detailBody .el-tabs__content .el-row .el-col:last-of-type {
  margin-left: 15px;
  font-size: 12px;
  color: #525252;
}
</style>
