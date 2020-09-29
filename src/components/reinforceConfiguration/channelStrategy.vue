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
          >新建渠道策略</el-button
        >
      </div>
      <!-----新建渠道Drawer开始--- -->
      <el-drawer
        title="新建渠道"
        :visible.sync="createChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        ref="createChannelStrategyDrawer"
        size="40%"
      >
        <!-- 新建渠道Drawer头部-->
        <div class="el-drawer-header">
          <h3>新建渠道策略</h3>
        </div>
        <!-- 新建渠道Drawer主体-->
        <div class="el-drawer-content createChannelStrategyContent ">
          <el-upload
            class="upload"
            drag
            action="/"
            :limit="1"
            :http-request="createChannelStrategyFile"
            :file-list="createChannelStrategyFileItem"
            accept=".apk"
            ref="createChannelStrategyUpload"
            v-if="createChannelStrategyUploadShow"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处,或<em>点击上传</em>
            </div>
            <div class="el-upload_tip" slot="tip">点击上传.apk文件</div>
          </el-upload>
          <!-- 创建渠道策略的列表 -->
          <div
            v-for="(item, index) in createChannelStrategyFileItem"
            :key="index"
          >
            <!-- 上传文件的信息 -->
            <el-form
              :model="channelStrategyForm"
              class="channelStrategyForm"
              ref="channelStrategyForm"
              :rules="rules"
            >
              <div class="channelStrategyItem">
                <h3 class="channelStrategyItemTitle">
                  <div class="channelStrategyItemTitleLeft">
                    <i class="channelStrategyItemIcon"> </i>
                    <span>应用信息</span>
                  </div>
                </h3>
                <div class="channelStrategyItemContent">
                  <el-row>
                    <el-col :span="6">
                      <img :src="'data:image/jpg;base64,' + item.appIcon"
                    /></el-col>
                    <el-col :span="18">
                      <p class="appName">{{ item.appName }}</p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;{{ item.appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px">
                          版本:&nbsp;&nbsp;{{ item.appVersion }}
                        </span>
                        <span>大小:&nbsp;&nbsp;{{ item.appMbSize }}MB</span>
                      </p>
                      <p class="strategyName">
                        <el-form-item label="策略名称" prop="strategyName">
                          <el-input
                            size="small"
                            style="width:50%"
                            v-model="channelStrategyForm.strategyName"
                          ></el-input>
                        </el-form-item>
                      </p>
                      <p class="strategyDescribe">
                        <el-form-item
                          label="策略描述"
                          prop="strategyDescribe"
                          style="margin-left:10px"
                        >
                          <el-input
                            size="small"
                            style="width:50%"
                            v-model="channelStrategyForm.strategyDescribe"
                          ></el-input>
                        </el-form-item>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="channelStrategyItem">
                <h3 class="channelStrategyItemTitle">
                  <div class="channelStrategyItemTitleLeft">
                    <i class="channelStrategyItemIcon"></i>
                    <span>渠道配置</span>
                  </div>
                  <div class="channelStrategyItemTitleRight">
                    <el-tooltip
                      content="最多只能添加50个渠道"
                      placement="top-start"
                    >
                      <img
                        src="../../assets/question.png"
                        class="questionImg"
                      />
                    </el-tooltip>
                  </div>
                </h3>
                <div class="channelStrategyItemContent">
                  <el-row>
                    <el-col :span="24">
                      <div class="channelStrategyBox">
                        <el-form-item label="渠道名称" prop="channelName">
                          <el-input
                            size="small"
                            v-model="channelStrategyList[0].channelName"
                            placeholder="请输入渠道名称"
                            style="width:40%"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="渠道参数"
                          prop="channelStrategyParameter"
                        >
                          <el-select
                            v-model="
                              channelStrategyList[0]
                                .channelStrategyParameteList[0].channelKey
                            "
                            placeholder="channelKey"
                            size="small"
                            :popper-append-to-body="false"
                            style="width:30%"
                            @change="changeChannelKey('createChannel', 0)"
                            @focus="focusChannelKey('createChannel', 0)"
                          >
                            <el-option
                              v-for="(channelKeyItem,
                              channelKeyIndex) in channelStrategyList[0]
                                .channelKeyData"
                              :key="channelKeyIndex"
                              :value="channelKeyItem.value"
                              :disabled="channelKeyItem.disabled"
                            ></el-option>
                          </el-select>
                          <el-input
                            size="small"
                            v-model="
                              channelStrategyList[0]
                                .channelStrategyParameteList[0].channelValue
                            "
                            placeholder="channelValue"
                            style="width:40%"
                          ></el-input>
                          <el-button
                            style="margin-left:15px"
                            type="primary"
                            size="mini"
                            icon="el-icon-plus"
                            @click="
                              addChannelStrategyParameter(
                                'createChannel',
                                0,
                                item.appPath,
                                0
                              )
                            "
                          ></el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-delete"
                            :disabled="
                              channelStrategyList[0].channelStrategyParameteList
                                .length == 1
                            "
                            @click="
                              deleteChannelStrategyParameter(
                                'createChannel',
                                0,
                                0
                              )
                            "
                          ></el-button>
                        </el-form-item>
                        <!-- 渠道参数列表 -->
                        <div
                          v-for="(channelSubItem,
                          channelSubIndex) in channelStrategyList[0]
                            .channelStrategyParameteList"
                          :key="channelSubIndex"
                          v-show="channelSubIndex"
                        >
                          <el-form-item
                            label="渠道参数"
                            prop="channelStrategyParameter"
                          >
                            <el-select
                              v-model="channelSubItem.channelKey"
                              placeholder="channelKey"
                              size="small"
                              :popper-append-to-body="false"
                              style="width:30%"
                              @change="changeChannelKey('createChannel', 0)"
                              @focus="focusChannelKey('createChannel', 0)"
                            >
                              <el-option
                                v-for="(channelKeyItem,
                                channelKeyIndex) in channelStrategyList[0]
                                  .channelKeyData"
                                :key="channelKeyIndex"
                                :value="channelKeyItem.value"
                                :disabled="channelKeyItem.disabled"
                              ></el-option>
                            </el-select>
                            <el-input
                              size="small"
                              v-model="channelSubItem.channelValue"
                              placeholder="channelValue"
                              style="width:40%"
                            ></el-input>
                            <el-button
                              style="margin-left:15px"
                              type="primary"
                              size="mini"
                              icon="el-icon-plus"
                              @click="
                                addChannelStrategyParameter(
                                  'createChannel',
                                  0,
                                  item.appPath,
                                  channelSubIndex
                                )
                              "
                            ></el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              icon="el-icon-delete"
                              :disabled="channelSubItem.length == 1"
                              @click="
                                deleteChannelStrategyParameter(
                                  'createChannel',
                                  0,
                                  channelSubIndex
                                )
                              "
                            ></el-button>
                          </el-form-item>
                        </div>
                        <el-button
                          class="deleteChannelStrategyButton"
                          type="text"
                          icon="el-icon-error"
                          :disabled="channelStrategyList.length == 1"
                          @click="deleteChannel(0, 'createChannel')"
                          plain
                        ></el-button>
                      </div>
                      <!-- 渠道列表 -->
                      <template>
                        <div
                          class="channelStrategyBox"
                          v-for="(channelItem,
                          channelIndex) in channelStrategyList"
                          :key="channelIndex"
                          v-show="channelIndex"
                        >
                          <el-form-item label="渠道名称" prop="channelName">
                            <el-input
                              size="small"
                              v-model="channelItem.channelName"
                              placeholder="请输入渠道名称"
                              style="width:40%"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="渠道参数"
                            prop="channelStrategyParameter"
                          >
                            <el-select
                              v-model="
                                channelItem.channelStrategyParameteList[0]
                                  .channelKey
                              "
                              placeholder="channelKey"
                              size="small"
                              :popper-append-to-body="false"
                              style="width:30%"
                              @change="
                                changeChannelKey('createChannel', channelIndex)
                              "
                              @focus="
                                focusChannelKey('createChannel', channelIndex)
                              "
                            >
                              <el-option
                                v-for="(channelKeyItem,
                                channelKeyIndex) in channelItem.channelKeyData"
                                :key="channelKeyIndex"
                                :value="channelKeyItem.value"
                                :disabled="channelKeyItem.disabled"
                              ></el-option>
                            </el-select>
                            <el-input
                              size="small"
                              v-model="
                                channelItem.channelStrategyParameteList[0]
                                  .channelValue
                              "
                              placeholder="channelValue"
                              style="width:40%"
                            ></el-input>
                            <el-button
                              style="margin-left:15px"
                              type="primary"
                              size="mini"
                              icon="el-icon-plus"
                              @click="
                                addChannelStrategyParameter(
                                  'createChannel',
                                  channelIndex,
                                  item.appPath,
                                  0
                                )
                              "
                            ></el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              icon="el-icon-delete"
                              :disabled="
                                channelItem.channelStrategyParameteList
                                  .length == 1
                              "
                              @click="
                                deleteChannelStrategyParameter(
                                  'createChannel',
                                  channelIndex,
                                  channelIndex
                                )
                              "
                            ></el-button>
                          </el-form-item>
                          <!-- 渠道参数列表 -->
                          <div
                            v-for="(channelSubItem,
                            channelSubIndex) in channelStrategyList[
                              channelIndex
                            ].channelStrategyParameteList"
                            :key="channelSubIndex"
                            v-show="channelSubIndex"
                          >
                            <el-form-item
                              label="渠道参数"
                              prop="channelStrategyParameter"
                            >
                              <el-select
                                v-model="channelSubItem.channelKey"
                                placeholder="channelKey"
                                size="small"
                                :popper-append-to-body="false"
                                style="width:30%"
                                @change="
                                  changeChannelKey(
                                    'createChannel',
                                    channelIndex
                                  )
                                "
                                @focus="
                                  focusChannelKey('createChannel', channelIndex)
                                "
                              >
                                <el-option
                                  v-for="(channelKeyItem,
                                  channelKeyIndex) in channelStrategyList[
                                    channelIndex
                                  ].channelKeyData"
                                  :key="channelKeyIndex"
                                  :value="channelKeyItem.value"
                                  :disabled="channelKeyItem.disabled"
                                ></el-option>
                              </el-select>
                              <el-input
                                size="small"
                                v-model="channelSubItem.channelValue"
                                placeholder="channelValue"
                                style="width:40%"
                              ></el-input>
                              <el-button
                                style="margin-left:15px"
                                type="primary"
                                size="mini"
                                icon="el-icon-plus"
                                @click="
                                  addChannelStrategyParameter(
                                    'createChannel',
                                    channelIndex,
                                    item.appPath,
                                    channelSubIndex
                                  )
                                "
                              ></el-button>

                              <el-button
                                type="primary"
                                size="mini"
                                icon="el-icon-delete"
                                :disabled="
                                  channelItem.channelStrategyParameteList
                                    .length == 1
                                "
                                @click="
                                  deleteChannelStrategyParameter(
                                    'createChannel',
                                    channelIndex,
                                    channelSubIndex
                                  )
                                "
                              ></el-button>
                            </el-form-item>
                          </div>
                          <el-button
                            class="deleteChannelStrategyButton"
                            type="text"
                            icon="el-icon-error"
                            :disabled="channelStrategyList.length == 1"
                            @click="
                              deleteChannel(channelIndex, 'createChannel')
                            "
                            plain
                          ></el-button>
                        </div>
                      </template>
                      <el-button
                        type="primary"
                        plain
                        size="small"
                        class="addChannelStrategy"
                        @click="addChannelStrategy('createChannel')"
                        >添加渠道</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 新建渠道Drawer尾部-->
        <div class="el-drawer-footer">
          <el-button
            type="primary"
            @click="saveChannelStrategy()"
            :disabled="showSaveChannelStrategy"
            >保存</el-button
          >
          <el-button @click="cancelChannelStrategy()" plain>取消</el-button>
        </div>
      </el-drawer>
      <!-- 新建渠道Drawer结束 -->
      <!-- 修改渠道Drawer开始 -->
      <el-drawer
        title="修改渠道"
        :visible.sync="amendChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :destroy-on-cloase="true"
        ref="amendChannelStrategyDrawer"
        size="40%"
      >
        <div class="el-drawer-header">
          <h3>修改渠道</h3>
        </div>
        <div class="el-drawer-content">
          <el-form :model="channelStrategyForm">
            <div class="channelStrategyItem">
              <h3 class="channelStrategyItemTitle">
                <div class="channelStrategyItemTitleLeft">
                  <i class="channelStrategyItemIcon"> </i>
                  <span>应用信息</span>
                </div>
              </h3>
              <div class="channelStrategyItemContent">
                <el-row v-if="channelStrategyParticulars">
                  <el-col :span="6">
                    <img
                      :src="
                        'data:image/jpg;base64,' +
                          channelStrategyParticulars.reinforceInfo.appIcon
                      "
                  /></el-col>
                  <el-col :span="18">
                    <p class="appName">
                      {{ channelStrategyParticulars.reinforceInfo.appName }}
                    </p>
                    <p class="appPackage">
                      包名:&nbsp;&nbsp;{{
                        channelStrategyParticulars.reinforceInfo.appPackage
                      }}
                    </p>
                    <p>
                      <span style="margin-right:10px">
                        版本:&nbsp;&nbsp;{{
                          channelStrategyParticulars.reinforceInfo.appVersion
                        }}
                      </span>
                      <span
                        >大小:&nbsp;&nbsp;{{
                          channelStrategyParticulars.reinforceInfo.appMbSize
                        }}MB</span
                      >
                    </p>
                    <p class="strategyName">
                      <span
                        >策略名称:&nbsp;&nbsp;{{
                          channelStrategyParticulars.channelStrategyName
                        }}</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="channelStrategyItem">
              <h3 class="channelStrategyItemTitle">
                <div class="channelStrategyItemTitleLeft">
                  <i class="channelStrategyItemIcon"></i>
                  <span>渠道配置</span>
                </div>
                <div class="channelStrategyItemTitleRight">
                  <el-tooltip content="最多只能添加50个渠道" placement="top">
                    <img src="../../assets/question.png" class="questionImg" />
                  </el-tooltip>
                </div>
              </h3>
              <div class="channelStrategyItemContent">
                <!-- 渠道列表 -->
                <template v-if="channelStrategyParticulars">
                  <div
                    class="channelStrategyBox"
                    v-for="(detailItem,
                    detailIndex) in channelStrategyParticulars.itemDetailDtoList"
                    :key="detailItem.id"
                  >
                    <el-form-item label="渠道名称" prop="channelName">
                      <el-input
                        size="small"
                        v-model="detailItem.channelName"
                        style="width:40%"
                      ></el-input>
                    </el-form-item>
                    <div
                      class="channelStrategyParameterList"
                      v-for="(parameterItem,
                      parameterIndex) in detailItem.channelDetails"
                      :key="parameterItem.id"
                    >
                      <el-form-item
                        label="渠道参数"
                        prop="channelStrategyParameter"
                      >
                        <el-select
                          v-model="parameterItem.channelKey"
                          size="small"
                          :popper-append-to-body="false"
                          style="width:30%"
                          @change="
                            changeChannelKey('amendChannel', detailIndex)
                          "
                          @focus="focusChannelKey('amendChannel', detailIndex)"
                        >
                          <el-option
                            v-for="(channelKeyItem,
                            channelKeyIndex) in detailItem.channelKeyData"
                            :key="channelKeyIndex"
                            :value="channelKeyItem.value"
                            :disabled="channelKeyItem.disabled"
                          ></el-option>
                        </el-select>
                        <el-input
                          size="small"
                          v-model="parameterItem.channelValue"
                          style="width:40%"
                        ></el-input>
                        <el-button
                          style="margin-left:15px;"
                          type="primary"
                          size="mini"
                          icon="el-icon-plus"
                          @click="
                            addChannelStrategyParameter(
                              'amendChannel',
                              detailIndex,
                              channelStrategyParticulars.reinforceInfo.appPath,
                              parameterIndex
                            )
                          "
                        ></el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          icon="el-icon-delete"
                          @click="
                            deleteChannelStrategyParameter(
                              'amendChannel',
                              detailIndex,
                              parameterIndex
                            )
                          "
                          :disabled="detailItem.channelDetails.length == 1"
                        ></el-button>
                      </el-form-item>
                    </div>
                    <el-button
                      class="deleteChannelStrategyButton"
                      type="text"
                      icon="el-icon-error"
                      plain
                      :disabled="
                        channelStrategyParticulars.itemDetailDtoList.length == 1
                      "
                      @click="deleteChannel(detailIndex, 'amendChannel')"
                    ></el-button>
                  </div>
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    class="addChannelStrategy"
                    @click="addChannelStrategy('amendChannel')"
                    >添加渠道</el-button
                  >
                </template>
              </div>
            </div>
          </el-form>
        </div>
        <div class="el-drawer-footer">
          <el-button
            type="primary"
            @click="saveAmendChannelStrategy(channelStrategyParticulars.id)"
            >修改</el-button
          >
          <el-button plain @click="cancelAmendChannelStrategy()"
            >取消</el-button
          >
        </div>
      </el-drawer>
      <!-- 修改渠道Drawer结束 -->
      <!-- 详细渠道Drawer开始 -->
      <el-drawer
        title="渠道详细"
        :visible.sync="detailChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :destroy-on-cloase="true"
        ref="detailChannelStrategyDrawer"
        size="40%"
        class="detailChannelStrategyDrawer"
      >
        <div class="el-drawer-header">
          <h3>渠道详细</h3>
        </div>
        <div class="el-drawer-content">
          <!-- 渠道详细 -->
          <el-form :model="channelStrategyParticulars">
            <div class="channelStrategyItem">
              <h3 class="channelStrategyItemTitle">
                <div class="channelStrategyItemTitleLeft">
                  <i class="channelStrategyItemIcon"> </i>
                  <span>应用信息</span>
                </div>
              </h3>
              <div class="channelStrategyItemContent">
                <el-row v-if="channelStrategyParticulars">
                  <el-col :span="6">
                    <img
                      :src="
                        'data:image/jpg;base64,' +
                          channelStrategyParticulars.reinforceInfo.appIcon
                      "
                  /></el-col>
                  <el-col :span="18">
                    <p class="appName">
                      {{ channelStrategyParticulars.reinforceInfo.appName }}
                    </p>
                    <p class="appPackage">
                      包名:&nbsp;&nbsp;{{
                        channelStrategyParticulars.reinforceInfo.appPackage
                      }}
                    </p>
                    <p>
                      <span style="margin-right:10px">
                        版本:&nbsp;&nbsp;{{
                          channelStrategyParticulars.reinforceInfo.appVersion
                        }}
                      </span>
                      <span
                        >大小:&nbsp;&nbsp;{{
                          channelStrategyParticulars.reinforceInfo.appMbSize
                        }}MB</span
                      >
                    </p>
                    <p class="strategyName">
                      <span
                        >策略名称:&nbsp;&nbsp;{{
                          channelStrategyParticulars.channelStrategyName
                        }}</span
                      >
                    </p>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="channelStrategyItem">
              <h3 class="channelStrategyItemTitle">
                <div class="channelStrategyItemTitleLeft">
                  <i class="channelStrategyItemIcon"></i>
                  <span>渠道配置</span>
                </div>
              </h3>
              <div class="channelStrategyItemContent ">
                <!-- 渠道列表 -->
                <template v-if="channelStrategyParticulars">
                  <div
                    class="channelStrategyBox"
                    v-for="detailItem in channelStrategyParticulars.itemDetailDtoList"
                    :key="detailItem.id"
                  >
                    <el-form-item label="渠道名称">
                      <span>{{ detailItem.channelName }}</span></el-form-item
                    >
                    <div
                      class="channelStrategyParameterList"
                      v-for="parameterItem in detailItem.channelDetails"
                      :key="parameterItem.id"
                    >
                      <el-form-item label="渠道参数">
                        <el-row>
                          <el-col :span="9">{{
                            parameterItem.channelKey
                          }}</el-col>
                          <el-col :span="6">{{
                            parameterItem.channelValue
                          }}</el-col>
                        </el-row>
                      </el-form-item>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-form>
        </div>
        <div class="el-drawer-footer">
          <el-button plain @click="cancelChannelStrategyDetail()"
            >取消</el-button
          >
        </div>
      </el-drawer>
      <!-- 详细渠道Drawer结束 -->
    </div>
    <!-- 表格内容 -->
    <div class="channelStrategyBody">
      <el-table
        :data="listItem"
        v-loading="loading"
        element-loading-text="加载中"
      >
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_strategy_name"
          label="渠道策略名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!--  <el-table-column
          prop="channel_strategy_describe"
          label="渠道策略描述"
          :show-overflow-tooltip="true"
        ></el-table-column> -->
        <el-table-column
          prop="channel_strategy_count"
          label="渠道策略数量"
        ></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column
          prop="user_name"
          label="创建人
        "
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top-start">
              <i
                class="el-icon-edit-outline editIcon"
                @click="amendChannelStrategy(scope.row.id)"
              ></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="详细" placement="top-start">
              <i
                class="el-icon-tickets detailIcon"
                @click="channelStrategyDetail(scope.row.id)"
              ></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start">
              <i
                class="el-icon-delete deletIcon"
                @click="
                  deleteChannelStrategy(
                    scope.row.id,
                    scope.row.channel_strategy_name
                  )
                "
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格底部 分页 -->
    <div class="channelStrategyBase">
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import { set, template, values } from "xe-utils/methods";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "channelStrategy",
  components: { pagination },
  mixins: [pageMixins],
  data() {
    return {
      curPage: 1,
      limit: 10,
      listItem: [],
      ruleForm: {
        channelName: ""
      },
      loading: false,
      createChannelStrategyDrawer: false,
      amendChannelStrategyDrawer: false,
      detailChannelStrategyDrawer: false,
      createChannelStrategyFileItem: [],
      createChannelStrategyUploadShow: true,
      channelStrategyForm: {
        strategyName: "",
        strategyDescribe: "",
        channelName: "",
        channelKey: "",
        channelValue: ""
      },
      rules: {
        strategyName: [
          { required: true, message: "请输入策略名称", tirgger: "blur" }
        ]
      },
      channelStrategyList: [
        {
          channelName: "",
          channelStrategyParameteList: [{ channelKey: "", channelValue: "" }],
          channelKeyData: []
        }
      ],
      channelKeyData: [],
      showSaveChannelStrategy: true,
      channelStrategyParticulars: null
    };
  },
  inject: ["reload"],
  beforeMount() {
    const _this = this;
    _this.getData();
  },
  methods: {
    //去除select选项同一级不能选重复的值
    removeRepetitionChannelKeyData(typeChannel, index) {
      const _this = this;
      if (typeChannel == "createChannel") {
        const dropDownList = _this.channelStrategyList[index].channelKeyData,
          parameteList =
            _this.channelStrategyList[index].channelStrategyParameteList;
        for (var i = 0; i < dropDownList.length; i++) {
          _this.$set(dropDownList[i], "disabled", false);
        }
        for (var j = 0; j < parameteList.length; j++) {
          for (var k = 0; k < dropDownList.length; k++) {
            if (parameteList[j].channelKey == dropDownList[k].value) {
              _this.$set(dropDownList[k], "disabled", true);
            }
          }
        }
      }
      if (typeChannel == "amendChannel") {
        const dropDownList =
            _this.channelStrategyParticulars.itemDetailDtoList[index]
              .channelKeyData,
          parameteList =
            _this.channelStrategyParticulars.itemDetailDtoList[index]
              .channelDetails;
        for (var i = 0; i < dropDownList.length; i++) {
          _this.$set(dropDownList[i], "disabled", false);
        }
        for (var j = 0; j < parameteList.length; j++) {
          for (var k = 0; k < dropDownList.length; k++) {
            if (parameteList[j].channelKey == dropDownList[k].value) {
              _this.$set(dropDownList[k], "disabled", true);
            }
          }
        }
      }
    },
    changeChannelKey(typeChannel, index) {
      this.removeRepetitionChannelKeyData(typeChannel, index);
    },
    focusChannelKey(typeChannel, index) {
      this.removeRepetitionChannelKeyData(typeChannel, index);
    },
    async getData() {
      const params = {};
      params.queryInfo = this.ruleForm;
      this.getDataItem(this.addPageInfo(params));
    },
    //获取表格数据
    getDataItem(params) {
      api.multipleChannelService.getChannelList(params).then(res => {
        if (res.code == "00") {
          const data = res.data,
            count = data.count,
            number = params.pn,
            size = params.limit;
          this.listItem = data.items;
          this.curPage = number;
          this.limit = size;
          this.onGotPageData({ totalElements: count, size, number });
        }
      });
    },
    //刷新
    refresh() {
      this.reload();
    },
    //获取渠道策略具体的内容
    getChannelStrategy(id) {
      const _this = this;
      let appPath = null;
      api.multipleChannelService.getChannelStrategyDetail(id).then(res => {
        if (res.code == "00") {
          let data = res.data,
            appPath = data.reinforceInfo.appPath;
          _this.channelStrategyParticulars = data;
          api.multipleChannelService.getChannelKeyList(appPath).then(res => {
            if (res.code == "00") {
              let channelKeyData = [];
              res.data.forEach(v => {
                channelKeyData.push({ value: v, disabled: false });
              });
              _this.channelStrategyParticulars.itemDetailDtoList.forEach(v => {
                _this.$set(v, "channelKeyData", channelKeyData);
              });
              _this.channelKeyData = channelKeyData;
            }
          });
        }
      });
    },
    //渠道策略详细
    channelStrategyDetail(id) {
      this.detailChannelStrategyDrawer = true;
      this.getChannelStrategy(id);
    },
    //删除渠道策略
    deleteChannelStrategy(id, channelStrategyName) {
      const _this = this;
      new this.$messageTips(({ confirm }) => {
        confirm({
          content: `确定要删除${channelStrategyName}渠道吗?`
        });
      }).then(() => {
        api.multipleChannelService.deleteChannelStrategy(id).then(res => {
          if (res.code == "00") {
            _this.$message({
              message: "删除成功!",
              type: "success",
              duration: 1000
            });
            _this.reload();
          }
        });
      });
    },
    //查询渠道策略名称
    searchChannelStrategyName() {
      const _this = this;
      _this.getData();
      _this.loading = true;
      setTimeout(() => {
        _this.loading = false;
      }, 500);
    },
    //新建渠道
    createChannelStrategy() {
      this.createChannelStrategyDrawer = true;
    },
    //上传渠道策略开始
    createChannelStrategyFile(file) {
      const _this = this;
      let params = new FormData();
      params.append("file", file.file);
      //进度条配置
      let config = {
        onUploadProgress: ProgressEvent => {
          let progressEvent =
            ((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0;
          file.onProgress({ percent: progressEvent });
        }
      };
      api.uploadService.uploadFile(params, config).then(res => {
        if ((res.code === "01" && res.code === "99") || res.code === "500") {
          _this.createChannelStrategyDrawer = false;
          _this.$refs.createChannelStrategyUpload.clearFiles();
        }
        if (res.code === "00") {
          _this.createChannelStrategyUploadShow = false;
          _this.showSaveChannelStrategy = false;
          let data = res.data,
            appPath = data.appPath,
            channelKeyData = [];
          api.multipleChannelService.getChannelKeyList(appPath).then(res => {
            if (res.code === "00") {
              res.data.forEach(v => {
                channelKeyData.push({ value: v, disabled: false });
              });
              _this.channelKeyData = channelKeyData;
              _this.channelStrategyList[0].channelKeyData = channelKeyData;
            }
          });
          _this.createChannelStrategyFileItem.push(data);
        }
      });
    },
    //保存创建的渠道策略
    saveChannelStrategy() {
      const _this = this;
      let formItem = _this.createChannelStrategyFileItem[0],
        channelStrategyName = _this.channelStrategyForm.strategyName,
        channelStrategyDescribe = _this.channelStrategyForm.strategyDescribe,
        allValid = true,
        checkChannelValueType = null;
      _this.$refs["channelStrategyForm"][0].validate(valid => {
        if (!valid) {
          allValid = false;
        }
      });
      const itemDetailDtoList = _this.channelStrategyList.map((item, index) => {
        if (item.channelName == "") {
          _this.$message.error("渠道名称不能为空哦!");
          allValid = false;
        }
        item.channelStrategyParameteList.forEach(v => {
          if (v.channelKey == "") {
            _this.$message.error("渠道参数 channelKey不能为空!");
            allValid = false;
          }
          if (v.channelValue == "") {
            _this.$message.error("渠道参数 channelValue不能为空!");
            allValid = false;
          }
          if (v.channelKey && v.channelValue) {
            checkChannelValueType = api.multipleChannelService
              .checkChannelValueType(
                v.channelKey,
                v.channelValue,
                formItem.appPath
              )
              .then(res => {
                if (res.code == "500") {
                  return false;
                }
                if (res == true) {
                  return true;
                }
              });
          }
        });
        let result = {
          channelName: item.channelName,
          channelDetails: item.channelStrategyParameteList
        };
        return result;
      });
      let checkChannelStrategyName = api.multipleChannelService
        .checkChannelStrategyName({ channelStrategyName })
        .then(res => {
          if (res == true) {
            return true;
          } else {
            _this.$message.error("策略名称已存在");
            return false;
          }
        });
      let channelStrategyDto = {
        channelStrategyName,
        channelStrategyDescribe,
        itemDetailDtoList,
        reinforceInfo: {
          appName: formItem.appName,
          appIcon: formItem.appIcon,
          appPackage: formItem.appPackage,
          appFileName: formItem.appFileName,
          appPath: formItem.appPath,
          appSize: formItem.appSize,
          appVersion: formItem.appVersion
        }
      };
      Promise.all([checkChannelValueType, checkChannelStrategyName]).then(
        values => {
          let valid = values.every(item => item);
          if (allValid && valid) {
            api.multipleChannelService
              .saveChannelStrategy(channelStrategyDto)
              .then(res => {
                if (
                  res.code === "01" ||
                  res.code == "99" ||
                  res.code === "500"
                ) {
                  _this.createChannelStrategyDrawer = false;
                  _this.$refs.createChannelStrategyUpload.clearFiles();
                }
                if (res.code === "00") {
                  _this.createChannelStrategyDrawer = false;
                  _this.$notify({
                    message: "新增渠道成功!",
                    type: "success",
                    duration: 1000
                  });
                  _this.reload();
                }
              });
          }
        }
      );
    },
    //取消保存创建的渠道策略
    cancelChannelStrategy() {
      const _this = this;
      if (_this.createChannelStrategyFileItem.length) {
        new this.$messageTips(({ confirm }) => {
          confirm({ content: "会清空当前上传的文件,是否继续?" });
        }).then(() => {
          
          _this.reload();
          _this.createChannelStrategyDrawer = false;
          _this.$refs.createChannelStrategyUpload.clearFiles();
        });
      } else {
        _this.createChannelStrategyDrawer = false;
      }
    },
    //添加渠道参数
    addChannelStrategyParameter(typeChannel, index, appPath, parameterIndex) {
      const _this = this,
        fileKey = appPath;
      let parameterIsValid = true,
        parameterDetailIsValid = true;
      if (typeChannel == "amendChannel") {
        let channelDetailList =
            _this.channelStrategyParticulars.itemDetailDtoList[index]
              .channelDetails,
          checkChannelValueType = null;
        channelDetailList.forEach(v => {
          if (!v.channelValue) {
            _this.$message.error("渠道参数 channelValue不能为空!");
            parameterDetailIsValid = false;
          }
          if (!v.channelKey) {
            _this.$message.error("渠道参数 channelKey不能为空!");
            parameterDetailIsValid = false;
          }
          if (parameterDetailIsValid) {
            checkChannelValueType = api.multipleChannelService
              .checkChannelValueType(v.channelKey, v.channelValue, fileKey)
              .then(res => {
                if (res.code == "500") {
                  parameterIsValid = false;
                  return false;
                }
                if (res == true) {
                  return true;
                }
              });
          }
        });
        Promise.all([checkChannelValueType]).then(res => {
          if (res[0] == true && parameterDetailIsValid) {
            if (channelDetailList.length <= 4) {
              channelDetailList.push({
                channelKey: "",
                channelValue: ""
              });
            } else {
              this.$message({
                message: "最多只能添加5个渠道参数哦!",
                type: "warning"
              });
            }
          }
        });
      }
      if (typeChannel == "createChannel") {
        let channelList =
            _this.channelStrategyList[index].channelStrategyParameteList,
          channelKey = channelList[parameterIndex].channelKey,
          channelValue = channelList[parameterIndex].channelValue;
        if (!channelValue) {
          _this.$message.error("渠道参数 channelValue不能为空!");
          parameterIsValid = false;
        }
        if (!channelKey) {
          _this.$message.error("渠道参数 channelKey不能为空!");
          parameterIsValid = false;
        }
        if (parameterIsValid) {
          api.multipleChannelService
            .checkChannelValueType(channelKey, channelValue, fileKey)
            .then(res => {
              if (res.code == "500") {
                parameterIsValid = false;
              }
              if (res == true) {
                if (
                  _this.channelStrategyList[index].channelStrategyParameteList
                    .length <= 4
                ) {
                  _this.channelStrategyList[
                    index
                  ].channelStrategyParameteList.push({
                    channelKey: "",
                    channelValue: ""
                  });
                } else {
                  this.$message({
                    message: "最多只能添加5个渠道参数哦!",
                    type: "warning"
                  });
                }
              }
            });
        }
      }
    },
    //删除渠道参数
    deleteChannelStrategyParameter(typeChannel, index, subIndex) {
      if (typeChannel == "createChannel") {
        this.channelStrategyList[index].channelStrategyParameteList.splice(
          subIndex,
          1
        );
      }
      if (typeChannel == "amendChannel") {
        this.channelStrategyParticulars.itemDetailDtoList[
          index
        ].channelDetails.splice(subIndex, 1);
      }
    },
    //添加渠道
    addChannelStrategy(typeChannel) {
      this.channelKeyData.forEach(v => {
        v.disabled = false;
      });
      if (typeChannel == "amendChannel") {
        if (this.channelStrategyParticulars.itemDetailDtoList.length < 50) {
          this.channelStrategyParticulars.itemDetailDtoList.push({
            channelName: "",
            channelDetails: [{ channelKey: "", channelValue: "" }],
            channelKeyData: this.channelKeyData
          });
        } else {
          this.$message({
            message: "最多只能添加50个渠道哦!",
            type: "warning"
          });
        }
      }
      if (typeChannel == "createChannel") {
        if (this.channelStrategyList.length < 50) {
          this.channelStrategyList.push({
            channelName: "",
            channelStrategyParameteList: [{ channelKey: "", channelValue: "" }],
            channelKeyData: this.channelKeyData
          });
        } else {
          this.$message({
            message: "最多只能添加50个渠道哦!",
            type: "warning"
          });
        }
      }
    },
    //删除渠道
    deleteChannel(index, typeChannel) {
      if (typeChannel == "amendChannel") {
        this.channelStrategyParticulars.itemDetailDtoList.splice(index, 1);
      }
      if (typeChannel == "createChannel") {
        this.channelStrategyList.splice(index, 1);
      }
    },
    //修改渠道策略
    amendChannelStrategy(id) {
      this.amendChannelStrategyDrawer = true;
      this.getChannelStrategy(id);
    },
    //保存修改的渠道
    saveAmendChannelStrategy(id) {
      const _this = this;
      let channelStrategyParticulars = _this.channelStrategyParticulars,
        channelStrategyName = channelStrategyParticulars.channelStrategyName,
        channelStrategyDescribe =
          channelStrategyParticulars.channelStrategyDescribe,
        itemDetailDtoList = channelStrategyParticulars.itemDetailDtoList,
        reinforceInfo = channelStrategyParticulars.reinforceInfo,
        appPath = reinforceInfo.appPath,
        allValid = true,
        checkChannelValueType = null;
      itemDetailDtoList = itemDetailDtoList.filter(v => {
        _this.$delete(v, "createTime");
        _this.$delete(v, "updateTime");
        return v;
      });
      let channelStrategyDto = {
        id,
        channelStrategyName,
        channelStrategyDescribe,
        itemDetailDtoList,
        reinforceInfo: {
          appName: reinforceInfo.appName,
          appIcon: reinforceInfo.appIcon,
          appPackage: reinforceInfo.appPackage,
          appFileName: reinforceInfo.appFileName,
          appPath: reinforceInfo.appPath,
          appSize: reinforceInfo.appSize,
          appVersion: reinforceInfo.appVersion
        }
      };
      itemDetailDtoList.map((item, index) => {
        if (item.channelName == "") {
          _this.$message.error("渠道名称不能为空!");
          allValid = false;
        }
        item.channelDetails.forEach(v => {
          if (v.channelKey == "") {
            _this.$message.error("渠道参数channelKey不能为空!");
            allValid = false;
          }
          if (v.channelValue == "") {
            _this.$message.error("渠道参数channelValue不能为空!");
            allValid = false;
          }
          if (v.channelKey && v.channelValue) {
            checkChannelValueType = api.multipleChannelService
              .checkChannelValueType(v.channelKey, v.channelValue, appPath)
              .then(res => {
                if (res.code == "500") {
                  return false;
                }
                if (res == true) {
                  return true;
                }
              });
          }
        });
      });
      Promise.all([checkChannelValueType]).then(value => {
        let valid = value.every(item => item);
        if (allValid && valid) {
          api.multipleChannelService
            .saveChannelStrategy(channelStrategyDto)
            .then(res => {
              if (res.code == "01" || res.code == "99" || res.code == "500") {
                _this.amendChannelStrategyDrawer = false;
              }
              if (res.code == "00") {
                _this.$notify({
                  message: "修改渠道成功",
                  type: "success",
                  duration: 1000
                });
                _this.amendChannelStrategyDrawer = false;
                _this.reload();
              }
            });
        }
      });
    },
    //取消保存修改的渠道
    cancelAmendChannelStrategy() {
      this.amendChannelStrategyDrawer = false;
    },
    //取消查看渠道详细
    cancelChannelStrategyDetail() {
      this.detailChannelStrategyDrawer = false;
    }
  }
};
</script>
<style>
.detailChannelStrategyDrawer .el-select-dropdown {
  position: absolute !important;
  top: 35px !important;
  left: 0 !important;
  min-height: 100% !important;
  overflow-y: auto !important;
}
.el-collapse-item__wrap {
  overflow: visible;
}
.channelStrategyBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.channelStrategyBody .el-table thead {
  color: #515a6a;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.channelStrategyHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.channelStrategy .searchForm {
  display: flex;
  margin-bottom: 15px;
}
.channelStrategy .operateBox {
  margin-left: 10px;
}
.channelStrategy .el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.channelStrategy .el-drawer-header h3 {
  color: #333;
  font-size: 16px;
}
.el-upload {
  width: 100%;
}
.el-upload_tip {
  text-align: center;
  font-size: 14px;
  margin-top: 5px;
  color: #a3a9b1;
}
.el-upload-dragger {
  width: 100%;
  height: 230px;
  margin-top: 20px;
}
.channelStrategy .el-drawer-content {
  position: relative;
  padding: 0 20px 40px 20px;
  margin: 60px 0 40px 0;
}
.channelStrategyItemContent .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.channelStrategyItemContent .appInfo {
  display: flex;
  margin: 30px 0;
}
.channelStrategyItemContent .el-row:first-child p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
  font-size: 13px;
}
.channelStrategy .channelStrategyItemContent img {
  width: 55%;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.el-select-dropdown__item {
  font-size: 12px !important;
}
.channelStrategy .el-drawer-footer {
  width: 40%;
  position: fixed;
  bottom: 0;
  background: white;
  z-index: 9;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
  right: 0;
  text-align: right;
}
.editIcon,
.detailIcon,
.deletIcon,
.delIcon,
.addIcon {
  font-size: 22px;
  color: #409eff;
  cursor: pointer;
  margin-right: 10px;
}
.delIcon,
.addIcon {
  font-size: 18px;
  margin-left: 5px;
}
.channelStrategyItemIcon {
  width: 3px;
  height: 15px;
  background: #409eff;
  display: inline-block;
  position: relative;
  top: 2px;
}
.channelStrategyItemTitle {
  position: relative;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.channelStrategyItemTitleRight .questionImg {
  width: 26px;
  cursor: pointer;
}
.channelStrategyItemTitle > span {
  color: #333;
  margin-left: 10px;
  font-weight: 530;
}
.channelStrategyBox {
  background: #409eff1c;
  padding: 20px;
  font-size: 12px;
  margin-top: 10px;
  position: relative;
}
.deleteChannelStrategyButton {
  position: absolute;
  right: 5px;
  top: 1px;
  cursor: pointer;
  color: #33333369;
  font-size: 15px;
  border: none !important;
  background: transparent !important;
}
.addChannelStrategyParameterButton,
.deleteChannelStrategyParameterButton {
  width: 15px;
  border: none !important;
  background: transparent !important;
}
.addChannelStrategy {
  margin-top: 15px !important;
}
.el-drawer {
  box-sizing: border-box !important;
  overflow-y: auto !important;
}
.el-form-item__content {
  font-size: 12px;
}
.channelStrategyBase {
  margin-top: 20px;
}
</style>
