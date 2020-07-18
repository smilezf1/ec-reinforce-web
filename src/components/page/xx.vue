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

    <!-- 测试 -->
    <el-table>
      <tr v-for="(item, index) in qualityLabel" :key="index">
        <td>{{ item.name }}</td>
        <td>
          <el-radio
            v-for="(option, idx) in item.labels"
            v-model="qualitySelect[index]"
            :label="option.id"
            :key="idx"
            >{{ option.value }}</el-radio
          >
        </td>
      </tr>
    </el-table>
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
        suggestions: [""], // 建议解决的方案
        //测试
        qualityLabel: [], // 数据
        qualityOption: [], // 分组名，对应表格第一列
        qualitySelect: [], // 默认选中值
        list: {
          label: [
            {
              name: "画面",
              typeId: 1,
              labels: [
                {
                  id: 1,
                  value: "高清",
                  checked: ""
                },
                {
                  id: 2,
                  value: "普通",
                  checked: ""
                },
                {
                  id: 3,
                  value: "抖动",
                  checked: ""
                },
                {
                  id: 4,
                  value: "模糊",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "场景画风",
              typeId: 2,
              labels: [
                {
                  id: 5,
                  value: "高级",
                  checked: ""
                },
                {
                  id: 6,
                  value: "日常",
                  checked: ""
                },
                {
                  id: 7,
                  value: "土味",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "内容画风",
              typeId: 3,
              labels: [
                {
                  id: 8,
                  value: "无问题",
                  checked: ""
                },
                {
                  id: 9,
                  value: "字幕缺失",
                  checked: ""
                },
                {
                  id: 10,
                  value: "字幕排版杂乱",
                  checked: ""
                },
                {
                  id: 11,
                  value: "标题党",
                  checked: ""
                },
                {
                  id: 12,
                  value: "感官不适",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "音质",
              typeId: 4,
              labels: [
                {
                  id: 13,
                  value: "高",
                  checked: ""
                },
                {
                  id: 14,
                  value: "低",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "泛低俗",
              typeId: 5,
              labels: [
                {
                  id: 15,
                  value: "0级",
                  checked: ""
                },
                {
                  id: 16,
                  value: "1级",
                  checked: ""
                },
                {
                  id: 17,
                  value: "2级",
                  checked: ""
                },
                {
                  id: 18,
                  value: "3级",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "内容可看性",
              typeId: 6,
              labels: [
                {
                  id: 19,
                  value: "高",
                  checked: ""
                },
                {
                  id: 20,
                  value: "中",
                  checked: ""
                },
                {
                  id: 21,
                  value: "略枯燥",
                  checked: ""
                },
                {
                  id: 22,
                  value: "低",
                  checked: ""
                }
              ],
              is_checked: 0
            },
            {
              name: "情绪",
              typeId: 7,
              labels: [
                {
                  id: 23,
                  value: "正",
                  checked: ""
                },
                {
                  id: 24,
                  value: "中",
                  checked: ""
                },
                {
                  id: 25,
                  value: "反",
                  checked: ""
                }
              ],
              is_checked: 0
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.qualityLabel = this.list.label; // 赋值
    list.qualityLabel.forEach(item => {
      this.qualityOption.push(item.name); // 向表头填数据
      this.qualitySelect.push(Number(item.is_checked)); // 存储回显数据
    });
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
          console.log("测试", this.conforderform.lastquestions);
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
