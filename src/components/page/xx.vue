<template>
  <div class="xx">
    <el-form>
      <el-form-item label="上次所提议题">
        <!-- 渲染问题列表 -->
        <section
          v-for="(value, index) in conforderform.lastquestions"
          :key="index"
        >
          <section v-if="index === 0">
            <el-row>
              <el-col :span="15">
                <el-input
                  v-model="conforderform.lastquestions[index]"
                  placeholder="请输入上次所提议题"
                  clearable
                  @keyup.enter.native="addlastitems(index, '1')"
                />
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  plain
                  style="margin-left:10px;"
                  circle
                  @click="addlastitems(index, '1')"
                />
              </el-col>
            </el-row>
          </section>
          <section v-if="index > 0">
            <!-- 添加的子项目 -->
            <el-row style="margin-top:10px;">
              <el-col :span="15">
                <el-input
                  v-model="conforderform.lastquestions[index]"
                  placeholder="请输入上次所提议题"
                  clearable
                  @keyup.enter.native="addlastitems(index, '1')"
                />
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  style="margin-left:10px;"
                  circle
                  @click="rmlastitems(index, '1')"
                />
              </el-col>
            </el-row>
          </section>
        </section>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "xx",
  data() {
    return {
      conforderform: {
        confname: "", // 会议名称
        conflevel: "", // 会议级别
        confattrs: [], // 会议属性
        startdate: "", // 会议开始日期
        starttime: "", // 会议开始时间
        enddate: "", // 会议结束日期
        endtime: "", // 会议结束时间
        lastquestions: [""], // 上次所提议题
        curquesttions: [""], // 待解决的问题
        suggestions: [""] // 建议解决的方案
      }
    };
  },
  methods: {
    addlastitems(index, type) {
      if (type === "1") {
        const lastitem = this.conforderform.lastquestions[
          this.conforderform.lastquestions.length - 1
        ];
        if (lastitem.trim() === "") {
          this.$message.error("请您填写完一项后继续追加");
        } else {
          this.conforderform.lastquestions.push("");
          console.log("执行了吗", this.conforderform.lastquestions);
        }
      } else if (type === "2") {
        const lastitem = this.conforderform.curquesttions[
          this.conforderform.curquesttions.length - 1
        ];
        if (lastitem.trim() === "") {
          this.$message.error("请您填写完一项后继续追加");
        } else {
          this.conforderform.curquesttions.push("");
        }
      } else if (type === "3") {
        const lastitem = this.conforderform.suggestions[
          this.conforderform.suggestions.length - 1
        ];
        if (lastitem.trim() === "") {
          this.$message.error("请您填写完一项后继续追加");
        } else {
          this.conforderform.suggestions.push("");
        }
      }
    }
  },
  rmlastitems(index, type) {
    switch (type) {
      case "1":
        this.conforderform.lastquestions.splice(index, 1);
        break;
      case "2":
        this.conforderform.curquesttions.splice(index, 1);
        break;
      case "3":
        this.conforderform.suggestions.splice(index, 1);
        break;
      default:
        break;
    }
    this.$message.success("移除成功");
  }
};
</script>
