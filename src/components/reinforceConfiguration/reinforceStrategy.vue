<template>
  <div class="reinforceStrategy">
    <div class="reinforceStrategyHeader">
      <p>当前位置:加固策略</p>
    </div>
    <!-- 查询 -->
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入策略名称"
            size="small"
            v-model="ruleForm.reinforceStrategyName"
          ></el-input>
        </el-form>
      </div>
      <div class="operateBox">
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search()"
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
        <el-button type="primary" size="small" @click="createStrategy()"
          >新建策略</el-button
        >
        <!-- 新建策略Drawer开始 -->
        <el-drawer
          title="新建策略"
          :visible.sync="createStrategyDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="createStrategyDrawer"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>新建策略</h3>
          </div>
          <div class="el-drawer-content">
            <el-upload
              class="upload"
              drag
              action="/"
              :limit="1"
              :http-request="createStrategyFile"
              :file-list="createStrategyFileItem"
              accept=".apk"
              ref="createStrategyUpload"
              v-show="createStrategyUploadShow"
              :on-exceed="handleExceed"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处,或<em>点击上传</em>
              </div>
              <div class="el-upload_tip" slot="tip">点击上传.apk文件</div>
            </el-upload>
            <!--创建策略的列表 -->
            <div v-for="(item, index) in createStrategyFileItem" :key="index">
              <el-form
                :model="strategyItemForm"
                class="strategyItemForm"
                :rules="rules"
                ref="strategyItemForm"
              >
                <!-- 上传文件的信息 -->
                <div class="strategyItem">
                  <h3 class="strategyItemTitle">
                    <i class="strategyItemTitleIcon"></i>
                    <span> 应用信息</span>
                  </h3>
                  <div class="strategyItemContent">
                    <el-row>
                      <el-col :span="6">
                        <img
                          :src="'data:image/jpg;base64,' + item.data.appIcon"
                        />
                      </el-col>
                      <el-col :span="18">
                        <p class="appName">{{ item.data.appName }}</p>
                        <p class="appPackage">
                          包名:&nbsp;&nbsp;{{ item.data.appPackage }}
                        </p>
                        <p>
                          <span style="margin-right:10px"
                            >版本:&nbsp;&nbsp;{{ item.data.appVersion }}</span
                          >
                          <span
                            >大小:&nbsp;&nbsp;{{ item.data.appMbSize }}MB</span
                          >
                        </p>
                        <el-form-item label="策略名称" prop="strategyName">
                          <el-input
                            size="small"
                            style="width:50%"
                            v-model="strategyItemForm.strategyName"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <!-- 新建策略---配置策略 -->
                <div class="strategyItem">
                  <h3 class="strategyItemTitle">
                    <i class="strategyItemTitleIcon"></i>
                    <span>配置策略</span>
                  </h3>
                  <div class="strategyItemContent">
                    <el-form-item
                      v-for="strategyItem in strategyItemData"
                      :key="strategyItem.id"
                      :label="strategyItem.reinforceItemName"
                      label-width="22%"
                    >
                      <!-- 有子选项 -->
                      <template v-if="strategyItem.children">
                        <template
                          v-if="strategyItem.reinforceItemName == '防篡改'"
                        >
                          <el-checkbox-group
                            v-model="strategyItemForm.tamperChoiceItem"
                            :min="0"
                            :max="1"
                          >
                            <el-checkbox
                              v-for="strategySubItem in strategyItem.children"
                              :key="strategySubItem.id"
                              :label="strategySubItem.id"
                              @change="
                                checked =>
                                  handleCheckedChange(
                                    checked,
                                    'falsify',
                                    '',
                                    strategyItem.id
                                  )
                              "
                              >{{
                                strategySubItem.reinforceItemName
                              }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </template>
                        <template v-else>
                          <el-checkbox-group
                            v-model="strategyItemForm.choiceItem"
                          >
                            <el-checkbox
                              v-for="strategySubItem in strategyItem.children"
                              :key="strategySubItem.id"
                              :label="strategySubItem.id"
                              :disabled="strategySubItem.isCancel == 2"
                              :checked="strategySubItem.isChecked == 1"
                              >{{
                                strategySubItem.reinforceItemName
                              }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </template>
                      </template>
                      <!-- 没有子选项 -->
                      <template v-else>
                        <!-- 启用签名MD5 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-if="
                            strategyItem.reinforceItemName == '自定义签名MD5'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked =>
                                handleCheckedChange(
                                  checked,
                                  'MD5',
                                  item.keyTreeData[0].signMd5Value
                                )
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <!-- 启用SO高级加固 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-else-if="
                            strategyItem.reinforceItemName == 'SO高级加固'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2 || soDisabled"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked => handleCheckedChange(checked, 'SO', '')
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <!-- 启用H5文件加固 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-else-if="
                            strategyItem.reinforceItemName == 'H5文件加固'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2 || h5Disabled"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked => handleCheckedChange(checked, 'H5', '')
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <el-checkbox-group
                          v-else
                          v-model="strategyItemForm.choiceItem"
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2"
                            :checked="strategyItem.isChecked == 1"
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                      </template>
                      <!-- 自定义签名MD5 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == '自定义签名MD5' &&
                            strategyItemForm['MD5'] == true
                        "
                      >
                        <el-form-item label="签名MD5">
                          <template v-if="!addSignatureClick">
                            <el-input
                              size="small"
                              maxLength="32"
                              style="width:51%"
                              v-model="item.keyTreeData[0].signMd5Value"
                            ></el-input>
                            <el-button
                              type="text"
                              @click="
                                addSignature(
                                  item.keyTreeData[0].signMd5Value,
                                  'createAddSignatureClick'
                                )
                              "
                              >添加</el-button
                            >
                          </template>
                          <template v-else>
                            <el-input
                              size="small"
                              clearable
                              maxLength="32"
                              style="width:51%"
                              v-model="strategyItemForm.signMd5Items[0].value"
                            ></el-input>
                            <el-button
                              type="text"
                              @click="
                                addSignature(
                                  strategyItemForm.signMd5Items[0].value
                                )
                              "
                              >添加</el-button
                            >
                          </template>
                        </el-form-item>

                        <el-form-item
                          v-for="(addSignatureItem,
                          addSignatureIndex) in strategyItemForm.signMd5Items"
                          :key="addSignatureIndex"
                          v-show="addSignatureIndex"
                          style="margin-left:70px"
                        >
                          <el-input
                            size="small"
                            style="width:58%"
                            clearable
                            maxlength="32"
                            :disabled="true"
                            v-model="addSignatureItem.value"
                          ></el-input>
                          <el-button
                            type="text"
                            @click="
                              deleteSignature(
                                addSignatureItem,
                                addSignatureIndex
                              )
                            "
                            >删除</el-button
                          >
                        </el-form-item>
                      </template>
                      <!-- SO高级加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'SO高级加固' &&
                            strategyItemForm['SO'] == true
                        "
                      >
                        <el-tree
                          :data="item.keyTreeData[0].soItems"
                          show-checkbox
                          node-key="label"
                          ref="soTree"
                          @check-change="getSoCheckedNodes()"
                        ></el-tree>
                      </template>
                      <!-- H5文件加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'H5文件加固' &&
                            strategyItemForm['H5'] == true
                        "
                      >
                        <el-tree
                          :data="item.keyTreeData[0].h5Items"
                          show-checkbox
                          node-key="label"
                          ref="h5Tree"
                          @check-change="getH5CheckedNodes()"
                        ></el-tree>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
            <div class="el-drawer-footer">
              <el-button
                type="primary"
                @click="saveStrategy()"
                :disabled="!saveStrategyBox"
                >保存</el-button
              >
              <el-button @click="cancelStrategy()" plain>取消</el-button>
            </div>
          </div>
        </el-drawer>
        <!-- 新增策略Drawer结束 -->
        <!-- 修改策略Drawer开始 -->
        <el-drawer
          title="修改策略"
          :visible.sync="amendStrategyDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="amendStrategyDrawer"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>修改策略</h3>
          </div>
          <div class="el-drawer-content">
            <!-- 修改策略--应用信息 -->
            <el-form :model="strategyItemForm" class="amendStrategyForm">
              <div class="strategyName">
                <h3 class="strategyNameTitle">
                  <i class="strategyItemTitleIcon"></i>
                  <span>应用信息 </span>
                </h3>
                <div class="strategyNameContent">
                  <el-row v-if="strategyDetailItem">
                    <el-col :span="6">
                      <img
                        :src="
                          'data:image/jpg;base64,' +
                            strategyDetailItem['reinforceInfo'].appIcon
                        "
                      />
                    </el-col>
                    <el-col :span="18">
                      <p class="appName">
                        {{ strategyDetailItem["reinforceInfo"].appName }}
                      </p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;
                        {{ strategyDetailItem["reinforceInfo"].appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px;">
                          版本:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appVersion
                          }}
                        </span>
                        <span
                          >大小:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appMbSize
                          }}</span
                        >
                      </p>
                      <p>
                        <span
                          >策略名称:&nbsp;&nbsp;{{
                            strategyDetailItem.reinforceStrategyName
                          }}</span
                        >
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="strategyName">
                <h3 class="strategyNameTitle">
                  <i class="strategyItemTitleIcon"></i>
                  <span>配置策略</span>
                </h3>
                <div class="strategyNameContent">
                  <el-form-item
                    v-for="strategyItem in strategyItemData"
                    :key="strategyItem.id"
                    :label="strategyItem.reinforceItemName"
                    label-width="22%"
                  >
                    <template v-if="strategyItem.children">
                      <el-checkbox-group
                        v-model="tamperArray"
                        v-if="strategyItem.reinforceItemName == '防篡改'"
                        :min="0"
                        :max="1"
                      >
                        <el-checkbox
                          v-for="strategySubItem in strategyItem.children"
                          :key="strategySubItem.id"
                          :label="strategySubItem.id"
                          :checked="strategySubItem.checked"
                          @change="
                            checked =>
                              handleCheckedChange(
                                checked,
                                'falsify',
                                '',
                                strategyItem.id
                              )
                          "
                          >{{ strategySubItem.reinforceItemName }}
                        </el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group v-else v-model="choiceArray">
                        <el-checkbox
                          v-for="strategySubItem in strategyItem.children"
                          :key="strategySubItem.id"
                          :label="strategySubItem.id"
                          >{{ strategySubItem.reinforceItemName }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </template>
                    <!-- 没有子选项 -->
                    <template v-else>
                      <!-- 启用签名MD5 -->
                      <el-checkbox-group
                        v-model="choiceArray"
                        v-if="strategyItem.reinforceItemName == '自定义签名MD5'"
                      >
                        <el-checkbox
                          :label="strategyItem.id"
                          :disabled="strategyItem.isCancel == 2"
                          :checked="strategyItem.checked"
                          @change="
                            checked =>
                              handleCheckedChange(
                                checked,
                                'MD5',
                                md5ArrayList,
                                '',
                                strategyItem.checked
                              )
                          "
                          >启用</el-checkbox
                        >
                      </el-checkbox-group>
                      <!-- 启用SO高级加固 -->
                      <el-checkbox-group
                        v-model="choiceArray"
                        v-else-if="
                          strategyItem.reinforceItemName == 'SO高级加固'
                        "
                      >
                        <el-checkbox
                          :label="strategyItem.id"
                          :disabled="
                            strategyItem.isCancel == 2 || amendSoDisabled
                          "
                          :checked="strategyItem.checked"
                          @change="
                            checked =>
                              handleCheckedChange(
                                checked,
                                'SO',
                                '',
                                '',
                                strategyItem.checked
                              )
                          "
                          >启用</el-checkbox
                        >
                      </el-checkbox-group>
                      <!-- 启用H5文件加固 -->
                      <el-checkbox-group
                        v-model="choiceArray"
                        v-else-if="
                          strategyItem.reinforceItemName == 'H5文件加固'
                        "
                      >
                        <el-checkbox
                          :label="strategyItem.id"
                          :disabled="
                            strategyItem.isCancel == 2 || amendH5Disabled
                          "
                          :checked="strategyItem.checked"
                          @change="
                            checked =>
                              handleCheckedChange(
                                checked,
                                'H5',
                                '',
                                '',
                                strategyItem.checked
                              )
                          "
                          >启用</el-checkbox
                        >
                      </el-checkbox-group>
                      <el-checkbox-group v-else v-model="choiceArray">
                        <el-checkbox
                          :label="strategyItem.id"
                          :disabled="strategyItem.isCancel == 2"
                          :checked="strategyItem.checked"
                          >启用</el-checkbox
                        >
                      </el-checkbox-group>
                      <!-- 自定义签名MD5 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == '自定义签名MD5' &&
                            !md5Click
                        "
                      >
                        <template v-if="strategyItem.checked">
                          <el-form-item label="签名MD5">
                            <el-input
                              size="small"
                              maxLength="32"
                              style="width:51%"
                              v-model="strategyItemForm.signMd5Items[0].value"
                            />
                            <el-button
                              type="text"
                              @click="
                                addSignature(
                                  strategyItemForm.signMd5Items[0].value,
                                  'amendAddSignatureClick'
                                )
                              "
                              >添加</el-button
                            >
                            <div
                              v-for="(item,
                              index) in strategyItemForm.signMd5Items"
                              :key="index"
                              v-show="index"
                            >
                              <template v-if="item.value">
                                <el-input
                                  size="small"
                                  style="width:51%;margin-left:70px;"
                                  v-model="item.value"
                                  :disabled="true"
                                ></el-input>
                                <el-button
                                  type="text"
                                  @click="
                                    deleteSignature(
                                      item,
                                      index,
                                      'amendDeleteSignatureClick'
                                    )
                                  "
                                  >删除</el-button
                                >
                              </template>
                            </div>
                          </el-form-item>
                        </template>
                      </template>
                      <template
                        v-if="
                          strategyItem.reinforceItemName == '自定义签名MD5' &&
                            md5Click
                        "
                      >
                        <template v-if="strategyItemForm['MD5'] == true">
                          <el-form-item label="签名MD5">
                            <template v-if="!amendAddSignatureClick">
                              <el-input
                                size="small"
                                maxLength="32"
                                style="width:51%"
                                v-model="md5ArrayList"
                              />
                              <el-button
                                type="text"
                                @click="
                                  addSignature(
                                    md5ArrayList,
                                    'amendAddSignatureClick'
                                  )
                                "
                                >添加</el-button
                              >
                            </template>
                            <template v-else>
                              <el-input
                                size="small"
                                maxLength="32"
                                style="width:51%"
                                v-model="strategyItemForm.signMd5Items[0].value"
                              />
                              <el-button
                                type="text"
                                @click="
                                  addSignature(
                                    strategyItemForm.signMd5Items[0].value,
                                    'amendAddSignatureClick'
                                  )
                                "
                                >添加</el-button
                              >
                            </template>
                          </el-form-item>
                          <div
                            v-for="(item, index) in disabledMd5ArrayList"
                            :key="index"
                          >
                            <el-input
                              size="small"
                              style="width:51%;margin-left:70px;"
                              v-model="item.value"
                              :disabled="true"
                            ></el-input>
                            <el-button
                              type="text"
                              @click="
                                deleteSignature(
                                  item,
                                  index,
                                  'amendDeleteSignatureClick'
                                )
                              "
                              >删除</el-button
                            >
                          </div>
                        </template>
                      </template>
                      <!-- SO高级加固 -->
                      <!-- 没点击SO高级加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'SO高级加固' &&
                            !soClick
                        "
                      >
                        <template
                          v-if="
                            strategyItem.reinforceItemName == 'SO高级加固' &&
                              strategyItem.checked
                          "
                        >
                          <el-tree
                            :data="soArrayList"
                            show-checkbox
                            node-key="key"
                            style="height:150px;overflow:auto;"
                            default-expand-all
                            ref="soTree"
                            :default-checked-keys="flatSoArray"
                            @check-change="getSoCheckedNodes()"
                          ></el-tree>
                        </template>
                      </template>
                      <!-- 点击了SO高级加固 -->
                      <template v-else>
                        <template
                          v-if="
                            strategyItem.reinforceItemName == 'SO高级加固' &&
                              strategyItemForm['SO'] == true
                          "
                        >
                          <el-tree
                            :data="soArrayList"
                            show-checkbox
                            node-key="key"
                            style="height:150px;overflow:auto;"
                            default-expand-all
                            ref="soTree"
                            :default-checked-keys="flatSoArray"
                            @check-change="getSoCheckedNodes()"
                          ></el-tree>
                        </template>
                      </template>
                      <!-- H5文件加固 -->
                      <!-- 没点击H5文件加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'H5文件加固' &&
                            !h5Click
                        "
                      >
                        <template
                          v-if="
                            strategyItem.reinforceItemName == 'H5文件加固' &&
                              strategyItem.checked
                          "
                        >
                          <el-tree
                            :data="h5ArrayList"
                            show-checkbox
                            node-key="key"
                            style="height:150px;overflow:auto"
                            ref="h5Tree"
                            @check-change="getH5CheckedNodes()"
                            :default-checked-keys="flatH5Array"
                            default-expand-all
                          ></el-tree>
                        </template>
                      </template>
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'H5文件加固' &&
                            h5Click
                        "
                      >
                        <template
                          v-if="
                            strategyItem.reinforceItemName == 'H5文件加固' &&
                              strategyItemForm['H5'] == true
                          "
                        >
                          <el-tree
                            :data="h5ArrayList"
                            show-checkbox
                            node-key="key"
                            style="height:150px;overflow:auto"
                            ref="h5Tree"
                            :default-checked-keys="flatH5Array"
                            @check-change="getH5CheckedNodes()"
                            default-expand-all
                          ></el-tree>
                        </template>
                      </template>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button
              type="primary"
              @click="saveAmendStrategy(strategyDetailItem['id'])"
              >修改</el-button
            >
            <el-button @click="cancelAmendStrategy()" plain>取消</el-button>
          </div>
        </el-drawer>
        <!-- 修改策略Drawer结束 -->
        <!-- 策略详细Drawer开始 -->
        <el-drawer
          title="策略详情"
          :visible.sync="strategyDetailDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="strategyDetailDrawer"
          size="40%"
          class="strategyDetailDrawer"
        >
          <div class="el-drawer-header">
            <h3>策略详情</h3>
          </div>
          <div class="el-drawer-content">
            <!-- 策略详情-应用信息 -->
            <el-form class="strategyDetailForm">
              <div class="strategyName">
                <h3 class="strategyNameTitle">
                  <i class="strategyItemTitleIcon"></i>
                  <span>应用信息</span>
                </h3>
                <div class="strategyNameContent">
                  <el-row v-if="strategyDetailItem">
                    <el-col :span="6">
                      <img
                        :src="
                          'data:image/jpg;base64,' +
                            strategyDetailItem['reinforceInfo'].appIcon
                        "
                      />
                    </el-col>
                    <el-col :span="18">
                      <p class="appName">
                        {{ strategyDetailItem["reinforceInfo"].appName }}
                      </p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;
                        {{ strategyDetailItem["reinforceInfo"].appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px;">
                          版本:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appVersion
                          }}
                        </span>
                        <span
                          >大小:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appMbSize + "MB"
                          }}</span
                        >
                      </p>
                      <p>
                        <span
                          >策略名称:&nbsp;&nbsp;{{
                            strategyDetailItem.reinforceStrategyName
                          }}</span
                        >
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="strategyName">
                <h3 class="strategyNameTitle">
                  <i class="strategyItemTitleIcon"></i>
                  <span>配置策略</span>
                </h3>
                <div class="strategyNameContent">
                  <el-form-item
                    v-for="strategyItem in strategyItemData"
                    :key="strategyItem.id"
                    :label="strategyItem.reinforceItemName"
                    label-width="22%"
                  >
                    <!-- 有子选项 -->
                    <template v-if="strategyItem.children">
                      <el-checkbox-group
                        v-if="strategyItem.reinforceItemName == '防篡改'"
                        :min="0"
                        :max="1"
                        v-model="tamperArray"
                      >
                        <el-checkbox
                          v-for="strategySubItem in strategyItem.children"
                          :key="strategySubItem.id"
                          :label="strategySubItem.id"
                          :disabled="true"
                          :checked="strategySubItem.checked"
                          >{{ strategySubItem.reinforceItemName }}
                        </el-checkbox>
                      </el-checkbox-group>
                      <el-checkbox-group v-else v-model="choiceArray">
                        <el-checkbox
                          v-for="strategySubItem in strategyItem.children"
                          :key="strategySubItem.id"
                          :label="strategySubItem.id"
                          :disabled="true"
                          :checked="strategySubItem.checked"
                          >{{ strategySubItem.reinforceItemName }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </template>
                    <!-- 没有子选项 -->
                    <template v-else>
                      <el-checkbox-group v-model="choiceArray">
                        <el-checkbox
                          :label="strategyItem.id"
                          :disabled="true"
                          :checked="strategyItem.checked"
                          >启用</el-checkbox
                        >
                      </el-checkbox-group>
                    </template>
                    <!-- SO高级加固 -->
                    <template
                      v-if="
                        strategyItem.reinforceItemName == 'SO高级加固' &&
                          disabledSoArrayList.length != 0 &&
                          strategyItem.checked
                      "
                    >
                      <el-tree
                        :data="disabledSoArrayList"
                        node-key="label"
                      ></el-tree>
                    </template>
                    <!-- H5文件加固 -->
                    <template
                      v-if="
                        strategyItem.reinforceItemName == 'H5文件加固' &&
                          disabledH5ArrayList.length != 0 &&
                          strategyItem.checked
                      "
                    >
                      <el-tree
                        :data="disabledH5ArrayList"
                        node-key="label"
                      ></el-tree>
                    </template>
                    <!-- 自定义签名MD5 -->
                    <template
                      v-if="
                        strategyItem.reinforceItemName == '自定义签名MD5' &&
                          disabledMd5ArrayList.length != 0
                      "
                    >
                      <div
                        v-for="(item, index) in disabledMd5ArrayList"
                        :key="index"
                      >
                        <el-input
                          :disabled="true"
                          style="font-size:12px"
                          class="md5Input"
                          v-model="item.value"
                        ></el-input>
                      </div>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button plain @click="cancelstrategyDetail()">取消</el-button>
          </div>
        </el-drawer>
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="reinforceStrategyBody">
      <template>
        <el-table
          :data="listItem"
          element-loading-text="加载中"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reinforce_strategy_name"
            label="策略名称"
          ></el-table-column>
          <el-table-column
            prop="reinforce_strategy_count"
            label="策略数量"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="user_name" label="创建人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top-start">
                <i
                  class="el-icon-edit-outline editIcon"
                  @click="amendStrategy(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="详细" placement="top-start">
                <i
                  class="el-icon-tickets floderIcon"
                  @click="strategyDetail(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <i
                  class="el-icon-delete deleteIcon"
                  @click="
                    deleteStrategy(
                      scope.row.id,
                      scope.row.reinforce_strategy_name
                    )
                  "
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="reinforceStrategyBase">
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "reinforceStrategy",
  components: { pagination },
  mixins: [pageMixins],
  data() {
    return {
      test: [],
      ruleForm: {
        reinforceStrategyName: ""
      },
      curPage: 1,
      limit: 10,
      listItem: [],
      loading: false,
      createStrategyDrawer: false,
      amendStrategyDrawer: false,
      strategyDetailDrawer: false,
      soArrayList: [],
      md5ArrayList: "",
      h5ArrayList: [],
      disabledSoArrayList: [],
      disabledH5ArrayList: [],
      disabledMd5ArrayList: [],
      strategyItemForm: {
        strategyName: "",
        signMd5Items: [{ value: "" }],
        tamperChoiceItem: [],
        choiceItem: [],
        soItemList: [],
        h5ItemList: [],
        md5Checked: false,
        soChecked: false
      },
      addSignatureClick: false,
      amendAddSignatureClick: false,
      md5Click: false,
      soClick: false,
      h5Click: false,
      rules: {
        strategyName: [
          { required: true, message: "请输入策略名称", trigger: "blur" }
        ]
      },
      createStrategyFileItem: [],
      createStrategyUploadShow: true,
      strategyItemData: [],
      h5Disabled: false,
      soDisabled: false,
      amendSoDisabled: false,
      amendH5Disabled: false,
      saveStrategyBox: false,
      amendStrategyForm: {},
      strategyDetailItem: null,
      reinforceItemList: [],
      choiceArray: [],
      tamperArray: [],
      flatSoArray: [],
      flatH5Array: []
    };
  },
  inject: ["reload"],
  beforeMount() {
    const _this = this;
    _this.getData();
    api.reinforceService
      .getReinforceItemTree({ reinforceItem: {} })
      .then(res => {
        if (res.code == "00") {
          _this.strategyItemData = res.data;
        }
      });
  },
  methods: {
    async getData() {
      const params = {};
      params.queryInfo = this.ruleForm;
      this.getDataItem(this.addPageInfo(params));
    },
    //获取列表数据
    getDataItem(params) {
      api.signatureService.getSignatureList(params).then(res => {
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
    //限制文件上传的个数
    handleExceed(files, fileList) {
      this.$message.warning("最多只能上传1个文件哦");
    },
    search() {
      let _this = this;
      _this.loading = true;
      _this.getData();
      setTimeout(() => {
        _this.loading = false;
      }, 500);
    },
    refresh() {
      this.reload();
    },
    //创建策略
    createStrategy() {
      this.createStrategyDrawer = true;
    },
    //上传策略开始
    createStrategyFile(file) {
      let _this = this,
        params = new FormData();
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
        if (res.code === "01" || res.code === "99" || res.code === "500") {
          _this.createStrategyDrawer = false;
          _this.$refs.createStrategyUpload.clearFiles();
        }
        if (res.code === "00") {
          _this.createStrategyUploadShow = false;
          _this.saveStrategyBox = true;
          let data = res.data,
            keyData = data.appPath,
            keyTreeData = [];
          let dataItem = { data, keyTreeData };
          //得到签名MD5,SO,h5
          api.reinforceService.getParseApkInfoByFileKey(keyData).then(res => {
            if (res.code == "00") {
              const data = res.data;
              if (data.soItems.length == 0) {
                _this.soDisabled = true;
              }
              if (data.h5Items.length == 0) {
                _this.h5Disabled = true;
              }
              keyTreeData.push(data);
            }
          });
          _this.createStrategyFileItem.push(dataItem);
        }
      });
    },
    //上传策略结束
    //勾选启用
    handleCheckedChange(checked, checkboxType, value, id) {
      let _this = this,
        strategyItemForm = _this.strategyItemForm;
      strategyItemForm[checkboxType] = checked;
      if (checkboxType === "falsify") {
        if (checked) {
          if (id) {
            strategyItemForm.choiceItem.push(id);
          }
        } else {
          strategyItemForm.choiceItem = strategyItemForm.choiceItem.filter(
            v => v != 3
          );
        }
      }
      if (checkboxType === "MD5") {
        strategyItemForm.md5Checked = checked;
        _this.md5Click = true;
        if (!checked) {
          _this.disabledMd5ArrayList = [];
          strategyItemForm.signMd5Items = [];
        } else {
          strategyItemForm.signMd5Items = [{ value }];
        }
      } else if (checkboxType === "SO") {
        strategyItemForm.soChecked = checked;
        _this.soClick = true;
      } else if (checkboxType === "H5") {
        strategyItemForm.h5Checked = checked;
        _this.h5Click = true;
      }
    },
    //得到SO选中的值
    getSoCheckedNodes() {
      const _this = this;
      _this.$refs.soTree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.strategyItemForm.soItemList = result;
      });
      _this.strategyItemForm.soItemList = _this.strategyItemForm.soItemList.filter(
        v => v
      );
    },
    //得到H5选中的值
    getH5CheckedNodes() {
      const _this = this;
      _this.$refs.h5Tree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.strategyItemForm.h5ItemList = result;
      });
      _this.strategyItemForm.h5ItemList = _this.strategyItemForm.h5ItemList.filter(
        v => v
      );
    },
    //添加签名
    addSignature(value, clicktype) {
      let _this = this,
        signMd5Items = _this.strategyItemForm.signMd5Items,
        disabledMd5ArrayList = _this.disabledMd5ArrayList,
        regularResult = /^[A-Fa-f0-9]{32}$/.test(value);
      _this.addSignatureClick = true;
      if (regularResult) {
        if (clicktype == "amendAddSignatureClick") {
          _this.amendAddSignatureClick = true;
          disabledMd5ArrayList.push({ value });
          signMd5Items.push({ value: "" });
          signMd5Items[0].value = value;
          signMd5Items.reverse();
        } else {
          signMd5Items.push({ value: "" });
          signMd5Items[0].value = value;
          signMd5Items.reverse();
        }
      } else {
        _this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
      }
    },
    //删除签名
    deleteSignature(addSignatureItem, addSignatureIndex, clicktype) {
      let signMd5Items = this.strategyItemForm.signMd5Items;
      if (signMd5Items.indexOf(addSignatureItem) > -1) {
        signMd5Items.splice(addSignatureIndex, 1);
      }
    },
    //取消保存策略
    cancelStrategy() {
      const _this = this;
      if (_this.createStrategyFileItem.length) {
        _this
          .$confirm("会清空当前上传文件,是否继续?", "提示", {
            closeOnClickModal: false,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            _this.reload();
            _this.createStrategyDrawer = false;
            _this.$refs.createStrategyUpload.clearFiles();
          })
          .catch(() => {});
      } else {
        _this.createStrategyDrawer = false;
      }
    },
    //保存创建的策略
    saveStrategy() {
      let _this = this,
        taskList = _this.strategyItemForm,
        allValid = true;
      _this.$refs["strategyItemForm"][0].validate(valid => {
        if (!valid) {
          allValid = false;
          return false;
        }
      });
      if (taskList.soChecked) {
        if (!taskList.soItemList.length) {
          _this.$message.error("请选择SO文件");
          allValid = false;
        }
      }
      if (taskList.h5Checked) {
        if (!taskList.h5ItemList.length) {
          _this.$message.error("请选择H5文件");
          allValid = false;
        }
      }
      if (taskList.md5Checked) {
        let md5Value =
            taskList.signMd5Items[taskList.signMd5Items.length - 1].value,
          regularResult = /^[A-Fa-f0-9]{32}$/.test(md5Value);
        if (md5Value) {
          if (!regularResult) {
            _this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
            allValid = false;
          }
        } else {
          _this.$message.error("签名MD5不能为空哦");
          allValid = false;
        }
      }
      if (taskList.strategyName) {
        const strategyName = taskList.strategyName;
        api.reinforceService.checkStrategyName({ strategyName }).then(res => {
          if (res) {
            //必填项都已经填写 请求异步 需写在这里
            if (allValid) {
              let _this = this,
                strategyItemForm = _this.strategyItemForm,
                createStrategyFileItem = _this.createStrategyFileItem[0].data,
                signMd5ItemsData = [],
                signMd5Items = strategyItemForm.signMd5Items;
              signMd5Items = signMd5Items.filter(v => v.value);
              signMd5Items.forEach((v, i) => {
                signMd5ItemsData.push(v.value);
              });
              strategyItemForm.choiceItem = strategyItemForm.choiceItem
                .concat(strategyItemForm.tamperChoiceItem, 22)
                .filter(v => {
                  return v != "";
                });
              new Set(strategyItemForm.choiceItem);
              let reinforceInfo = {
                appName: createStrategyFileItem.appName,
                appIcon: createStrategyFileItem.appIcon,
                appPackage: createStrategyFileItem.appPackage,
                appFileName: createStrategyFileItem.appFileName,
                appPath: createStrategyFileItem.appPath,
                appSize: createStrategyFileItem.appSize,
                appVersion: createStrategyFileItem.appVersion
              };
              let strategyItemDto = {
                reinforceStrategyName: strategyItemForm.strategyName,
                reinforceItemList: strategyItemForm.choiceItem,
                h5ItemList: strategyItemForm.h5ItemList,
                soItemList: strategyItemForm.soItemList,
                signMd5Items: signMd5ItemsData,
                reinforceInfo
              };
              api.reinforceService.saveStrategy(strategyItemDto).then(res => {
                if (res.code == "00") {
                  _this.createStrategyDrawer = false;
                  _this.$notify({
                    message: "新增策略成功!",
                    type: "success",
                    duration: 1000
                  });
                  _this.reload();
                }
              });
            }
          } else {
            allValid = false;
            _this.$message.error("策略名称已存在!");
          }
        });
      }
    },
    //取消修改策略
    cancelAmendStrategy() {
      this.amendStrategyDrawer = false;
    },
    //修改原始数据
    amendOriginalTree(treeNodes) {
      const _this = this;
      if (treeNodes) {
        treeNodes.forEach(item => {
          item["key"] = item.value ? item.value : item.label;
          if (item.children) {
            _this.amendOriginalTree(item.children);
          } else {
            item["key"] = item.value ? item.value : item.label;
          }
        });
      }
    },
    //修改策略得到用户选中树形结构选中原始的值
    traverseTree(treeNodes, flatArray) {
      const _this = this;
      if (treeNodes) {
        treeNodes.forEach(item => {
          if (item.children) {
            _this.traverseTree(item.children, flatArray);
          } else {
            flatArray.push(item.value);
          }
        });
      }
    },
    //获取策略具体内容
    getstrategy(id) {
      const _this = this;
      api.reinforceService.getStrategyDetail({ id }).then(res => {
        if (res.code == "00") {
          let data = res.data,
            keyData = data.reinforceInfo.appPath;
          //防止每次点击详情都push
          _this.strategyItemForm.signMd5Items = [{ value: "" }];
          _this.disabledMd5ArrayList = [];
          api.reinforceService.getParseApkInfoByFileKey(keyData).then(res => {
            if (res.code == "00") {
              let keyData = res.data;
              _this.soArrayList = keyData.soItems;
              _this.h5ArrayList = keyData.h5Items;
              _this.md5ArrayList = keyData.signMd5Value;
              _this.amendOriginalTree(_this.soArrayList);
              _this.amendOriginalTree(_this.h5ArrayList);
              if (keyData.soItems.length == 0) {
                _this.amendSoDisabled = true;
              }
              if (keyData.h5Items.length == 0) {
                _this.amendH5Disabled = true;
              } else {
                _this.amendH5Disabled = false;
              }
              _this.strategyDetailItem = data;
              _this.disabledSoArrayList = data.soItemList;
              _this.disabledH5ArrayList = data.h5ItemList;
              data.md5ItemList.forEach(v => {
                _this.disabledMd5ArrayList.push({ value: v });
              });
              _this.traverseTree(_this.disabledSoArrayList, _this.flatSoArray);
              _this.traverseTree(_this.disabledH5ArrayList, _this.flatH5Array);
              _this.strategyItemForm.soItemList = _this.flatSoArray;
              _this.strategyItemForm.h5ItemList = _this.flatH5Array;
              data.md5ItemList.forEach(v => {
                _this.strategyItemForm.signMd5Items.push({ value: v });
              });
            }
          });
          let selectedList = data.reinforceItemList;
          _this.strategyItemData.forEach(obj => {
            obj["checked"] = false;
            if (obj.children) {
              obj.children.forEach(v => {
                v["checked"] = false;
                selectedList.some(obj1 => {
                  if (obj1.id == v.id) {
                    v["checked"] = true;
                  }
                });
              });
            }
            selectedList.some(obj1 => {
              if (obj1.id == obj.id) {
                obj["checked"] = true;
              }
            });
          });
          let choiceArray = [],
            tamperArray = [],
            result = _this.strategyItemData.map(item => {
              if (item.children) {
                if (item.reinforceItemName == "防篡改") {
                  item.children.forEach(v => {
                    if (v.checked == true) {
                      tamperArray.push(v.id);
                    }
                  });
                } else {
                  item.children.forEach(v => {
                    if (v.checked == true) {
                      choiceArray.push(v.id);
                    }
                  });
                }
              }
              if (item.checked == true) {
                return item.id;
              }
            });
          _this.choiceArray = result.concat(choiceArray);
          _this.tamperArray = tamperArray;
        }
      });
    },
    //修改策略
    amendStrategy(id) {
      this.amendStrategyDrawer = true;
      let _this = this,
        strategyItemForm = _this.strategyItemForm;
      _this.getstrategy(id);
    },
    //保存修改的策略
    saveAmendStrategy(id) {
      let _this = this,
        strategyDetailItem = _this.strategyDetailItem["reinforceInfo"],
        strategyItemForm = _this.strategyItemForm,
        choiceItem = _this.choiceArray.concat(_this.tamperArray),
        choiceList = [], //选中的id集合
        allValid = true,
        signMd5ItemsData = [];
      _this.strategyItemForm.signMd5Items.forEach(v => {
        signMd5ItemsData.push(v.value);
      });
      signMd5ItemsData = signMd5ItemsData.filter(v => v);
      //去空
      choiceItem.forEach(item => {
        if (item) {
          choiceList.push(item);
        }
      });
      _this.reinforceItemList = choiceList.concat(
        _this.strategyItemForm.choiceItem
      );
      if (_this.reinforceItemList.includes(23)) {
        if (!strategyItemForm.soItemList.length) {
          _this.$message.error("请选择SO文件");
          allValid = false;
        }
      }
      if (_this.reinforceItemList.includes(24)) {
        if (!strategyItemForm.h5ItemList.length) {
          _this.$message.error("请选择H5文件");
          allValid = false;
        }
      }
      if (_this.reinforceItemList.includes(13)) {
        let md5Value =
            strategyItemForm.signMd5Items[
              strategyItemForm.signMd5Items.length - 1
            ].value,
          regularResult = /^[A-Fa-f0-9]{32}$/.test(md5Value);
        if (md5Value) {
          if (!regularResult) {
            _this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
            allValid = false;
          }
        } else {
          _this.$message.error("签名MD5不能为空哦");
          allValid = false;
        }
      }
      let strategyItemDto = {
        id,
        reinforceInfo: {
          appFileName: strategyDetailItem.appFileName,
          appIcon: strategyDetailItem.appIcon,
          appMbSize: strategyDetailItem.appMbSize,
          appPackage: strategyDetailItem.appPackage,
          appPath: strategyDetailItem.appPath,
          appVersion: strategyDetailItem.appVersion
        },
        reinforceItemList: _this.reinforceItemList,
        soItemList: strategyItemForm.soItemList,
        signMd5Items: signMd5ItemsData,
        h5ItemList: strategyItemForm.h5ItemList
      };
      if (allValid) {
        api.reinforceService.saveStrategy(strategyItemDto).then(res => {
          if (res.code == "00") {
            _this.$notify({
              message: "修改策略成功",
              type: "success",
              duration: 1000
            });
            this.amendStrategyDrawer = false;
            _this.reload();
          }
        });
      }
    },
    //策略详细
    strategyDetail(id) {
      let _this = this;
      _this.strategyDetailDrawer = true;
      _this.getstrategy(id);
    },
    //取消查看策略详细
    cancelstrategyDetail() {
      this.strategyDetailDrawer = false;
    },
    //删除策略
    deleteStrategy(id, name) {
      let _this = this;
      _this
        .$confirm("确定删除" + name + "策略吗?", "提示", {
          confirmButtonTex: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.reinforceService.deleteStrategy(id).then(res => {
            if (res.code == "00") {
              _this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              _this.reload();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style>
.reinforceStrategyHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinforceStrategy .searchForm {
  display: flex;
  margin-bottom: 15px;
}
.reinforceStrategy .searchForm .operateBox {
  margin-left: 20px;
}
.reinforceStrategy .el-drawer {
  overflow-y: auto;
}
.strategyItemTitleIcon {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #409eff;
  margin-right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.reinforceStrategy .el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.reinforceStrategy .el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
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
.reinforceStrategy .el-drawer-content {
  margin-top: 60px;
  position: relative;
  padding: 0 20px;
}
.reinforceStrategy .el-drawer-content .upload {
  padding: 0 20px;
}
.editIcon,
.floderIcon,
.deleteIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.reinforceStrategyBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.reinforceStrategyBody .el-table thead {
  color: #515a6a;
}
.reinforceStrategyBody .el-table__header-wrapper {
  background: #f8f8f9 !important;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.reinforceStrategyBase .paginationBox {
  margin-top: 20px;
}
.md5Input .el-input__inner {
  height: 32px;
  width: 50%;
  display: block;
  margin: 10px 0;
}
.reinforceStrategy .el-drawer-footer {
  width: 40%;
  position: fixed;
  bottom: 0px;
  background: white;
  z-index: 9;
  padding: 10px 0px;
  border-top: 1px solid #ebebeb;
  right: 0;
  text-align: right;
}
.strategyItemForm .strategyItemTitle,
.strategyDetailForm .strategyItemTitle,
.amendStrategyForm .strategyItemTitle {
  position: relative;
  font-weight: 700;
  font-size: 16px;
}
.strategyItemForm .strategyItemTitle > span,
.strategyDetailForm .strategyItemTitle > span,
.amendStrategyForm .strategyItemTitle > span {
  color: #333;
  margin-left: 10px;
  font-weight: 530;
}
.amendStrategyForm .strategyNameTitle {
  margin-bottom: 10px;
  position: relative;
}
.strategyItemForm .strategyNameTitle span,
.strategyDetailForm .strategyNameTitle span,
.amendStrategyForm .strategyNameTitle span {
  color: #333;
  font-size: 16px;
  font-weight: 530;
  padding-left: 10px;
}

.strategyItemForm .el-row:first-child p,
.strategyDetailForm .el-row:first-child p,
.amendStrategyForm .el-row:first-child p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
  font-size: 14px;
}
.strategyItemForm .appName,
.strategyDetailForm .appName,
.amendStrategyForm .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.strategyItemForm .appInfo,
.strategyDetailForm .appInfo,
.amendStrategyForm .appInfo {
  display: flex;
  margin: 30px 0;
}
.strategyItemForm img,
.strategyDetailForm img,
.amendStrategyForm img {
  width: 55%;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.reinforceStrategy .el-form-item__label {
  text-align: left;
}
.strategyItemForm .strategyItemContent {
  margin-top: 10px;
}
/* 修改策略详情Drawer */
.strategyDetailDrawer .el-drawer-content {
  padding-top: 20px;
}
.strategyDetailDrawer .strategyNameTitle {
  margin-bottom: 10px;
  position: relative;
}

.reinforceStrategy
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
