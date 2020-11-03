<template>
  <div class="Detail">
    <div class="detailHeader">
      <p>当前位置:详情页面</p>
    </div>
    <div class="detailOperate">
      <el-button type="primary" size="small" @click="back()">返回</el-button>
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
                >包&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.appPackage
                }}</el-col
              >
              <el-col :span="12"
                >文件大小:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.appMbSize
                }}
                MB</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="12"
                >文件MD5:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.md5 }}</el-col
              >
              <el-col :span="12"
                >版本信息:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.appVersion }}</el-col
              >
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="2.策略信息" name="2">
          <div v-for="item in strategyItem" :key="item.id">
            <el-row>
              <el-col :span="12"
                >策略名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceStrategyName
                }}</el-col
              >
              <el-col :span="12"
                >已使用的加固功能:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceStrategyCount
                }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="24"
                >策略描述:&nbsp;&nbsp;&nbsp;&nbsp;{{
                  item.reinforceDescribe
                }}</el-col
              >
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-collapse>
                  <el-collapse-item title="2-1.加固项">
                    <div v-for="item in reinforceListItem" :key="item.id">
                      <el-row>
                        <el-col :span="24">
                          {{ item.reinforceItemName }}
                          <el-tree
                            v-if="item.reinforceItemName == 'SO高级加固'"
                            :data="soItemList"
                            default-expand-all
                            style="height:200px;overflow-y:auto"
                          >
                          </el-tree>
                          <el-tree
                            v-if="item.reinforceItemName == 'H5文件加固'"
                            :data="h5ItemList"
                            default-expand-all
                            style="height:200px;overflow-y:auto"
                          ></el-tree>
                        </el-col>
                      </el-row>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <template v-if="data">
          <el-collapse-item
            title="3.多渠道策略信息"
            name="3"
            v-if="data.channelStrategyDto"
          >
            <div v-for="item in multipleChannel" :key="item.id">
              <el-row>
                <el-col :span="12"
                  >策略名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                    item.channelStrategyName
                  }}</el-col
                >
                <el-col :span="12"
                  >策略描述:&nbsp;&nbsp;&nbsp;&nbsp;{{
                    item.channelStrategyDescribe
                  }}</el-col
                >
              </el-row>
              <el-row>
                <el-col :span="12"
                  >策略数量:&nbsp;&nbsp;&nbsp;&nbsp;{{
                    item.channelStrategyCount
                  }}</el-col
                >
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-collapse-item title="3-1.多渠道策略列表">
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
                          >渠道状态:&nbsp;&nbsp;&nbsp;&nbsp;
                          <span v-if="subItem.status == 1">已完成</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
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
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
export default {
  name: "Detail",
  data() {
    return {
      data: null,
      listItem: [],
      signatureItem: [],
      strategyItem: [],
      multipleChannel: [],
      reinforceListItem: {},
      h5ItemList: [],
      soItemList: [],
      activeNames: ["1", "2", "3", "4"]
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
      const data = res.data;
      this.data = data;
      if (res.code == "00") {
        if (data.reinforceInfo) {
          this.listItem.push(data.reinforceInfo);
        }
        if (data.reinforceSign) {
          this.signatureItem.push(data.reinforceSign);
        }
        if (data.reinforceStrategyDetail) {
          this.strategyItem.push(data.reinforceStrategyDetail);
        }
        if (data.channelStrategyDto) {
          this.multipleChannel.push(data.channelStrategyDto);
        }
        if (data.reinforceStrategyDetail) {
          this.reinforceListItem =
            data.reinforceStrategyDetail.reinforceItemList;
          this.h5ItemList = data.reinforceStrategyDetail.h5ItemList;
          this.soItemList = data.reinforceStrategyDetail.soItemList;
        }
      }
    });
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
.Detail .el-collapse-item__wrap {
  border-bottom: none;
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
  color: #515a6e !important;
}
.el-collapse-item {
  font-size: 16px !important;
}
.detailBody .el-collapse img {
  width: 50px;
  border-radius: 3px;
  vertical-align: middle;
  margin-left: 15px;
}
.detailBody .el-row {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}
.detailBody .el-input__inner {
  border: none;
}
.detailOperate {
  margin-bottom: 15px;
}
</style>
