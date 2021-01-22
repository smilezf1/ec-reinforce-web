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
      <!--  <content>
        <p class="title">加固功能</p>
        <template v-if="reinforceItem">
          <el-table
            v-if="reinforceItem"
            :data="reinforceItem"
            style="width:100%"
            row-key="id"
            :tree-props="{ children: 'children' }"
          >
            <el-table-column
              label="序号"
              type="index"
              width="60"
            ></el-table-column>
            <el-table-column
              label="加固项"
              property="reinforceItemName"
              width="150"
            ></el-table-column>
            <el-table-column
              label="描述"
              property="reinforceItemDescribe"
              width="700"
            ></el-table-column>
            <el-table-column label="结果">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-duigou"></use>
              </svg>
            </el-table-column>
            <el-table-column label="备注">
            </el-table-column>
          </el-table>
        </template>
      </content> -->
      <div class="cradBox">
        <el-tabs type="border-card">
          <el-tab-pane label="加固项" class="reinforceItemTabPane">
            <template v-if="reinforceItem">
              <el-table
                v-if="reinforceItem"
                :data="reinforceItem"
                style="width:100%"
                row-key="id"
                :tree-props="{ children: 'children' }"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="60"
                ></el-table-column>
                <el-table-column
                  label="加固项"
                  property="reinforceItemName"
                  width="150"
                ></el-table-column>
                <el-table-column
                  label="描述"
                  property="reinforceItemDescribe"
                  width="700"
                ></el-table-column>
                <el-table-column label="结果">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-duigou"></use>
                  </svg>
                </el-table-column>
                <el-table-column label="备注"> </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
          <el-tab-pane label="加固策略信息">
            <template v-if="reinforceStrategyInfoItem">
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
            </template>
          </el-tab-pane>
          <el-tab-pane label="多渠道策略信息">多渠道策略信息</el-tab-pane>
          <el-tab-pane label="签名信息">签名信息</el-tab-pane>
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
      reinforceItem: null
    };
  },
  methods: {
    back() {
      window.history.back();
    },
    //将数据转化为树形结构
    listToTree(array) {
      let map = {};
      array.forEach(item => {
        if (!map[item.id]) {
          map[item.id] = item;
        }
      });
      array.forEach(item => {
        item.remark = "";
        if (map[item.parentId]) {
          map[item.parentId].children
            ? map[item.parentId].children.push(item)
            : (map[item.parentId].children = [item]);
        }
      });
      return array.filter(item => {
        if (!item.parentId) {
          return item;
        }
      });
    }
  },
  mounted() {
    const id = this.$route.query.id,
      params = { reinforceTaskId: id };
    api.reinforceService.getReinforceDetail(params).then(res => {
      const data = res.data;
      console.log(data, "data数据");
      if (res.code == "00") {
        if (data.reinforceInfo) {
          this.basicInfoItem = data.reinforceInfo;
        }
        if (data.reinforceStrategyDetail) {
          this.reinforceStrategyInfoItem = data.reinforceStrategyDetail;
          this.reinforceItem = data.reinforceStrategyDetail.reinforceItemList;
          /*  this.listToTree(this.reinforceItem); */
          /* console.log(this.reinforceItem, "reinforceItem"); */
          console.log(this.reinforceStrategyInfoItem, "111");
        }
      }
    });
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
.detailBody .el-row {
  margin: 20px 0;
}
.detailBody header .basicInfoBody {
  display: flex;
  align-items: center;
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
  font-weight: 550;
  font-size: 20px;
  color: #353535;
  display: inline-block;
  margin-bottom: 20px;
  font-weight: 300;
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
.detailBody .el-tabs__content {
  /*  border: 1px solid rgb(220, 222, 226);
  margin: 10px 0px 0px 15px; */
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
  font-weight: bolder;
  color: rgb(0, 0, 0);
  font-size: 12px;
  border-right: 1px solid rgb(220, 222, 226);
  margin-left: 20px;
}
.detailBody .el-tabs__content .el-row .el-col:last-of-type {
  margin-left: 15px;
  font-size: 12px;
  color: #525252;
}
</style>
