<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
       <el-button   @click="upload.open=true">{{$t(`import`)}}</el-button>

        <!-- <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
        @click.stop="goimportxls()">导出</el-button>-->
        <el-popover placement="top-start" width="800" height="600" trigger="click">
          <el-table :data="tableData" highlight-current-row>
            <el-table-column property="tenantId" label="电动车id"></el-table-column>
            <el-table-column property="tenantName" label="电动车姓名"></el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button @click="setCurrent(tableData[1])">选取电动车</el-button>
          </div>
        </el-popover>
      </template>
      <template slot-scope="{row}" slot="connectStatus">
        <label
          :style="{color:row.connectStatus=='0' ||row.connectStatus=='1'?'green':'red'}"
        >{{row.connectStatus=="0"?$t(`battery.connectCbinet`):(row.connectStatus=="1"?$t(`battery.connectCars`):(row.connectStatus=="2"?$t(`Unconnected`):(row.connectStatus=="3"?$t(`battery.communicationError`):$t(`battery.moduleError`))))}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->

      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button
          type="text"
          icon="el-icon-view"
          size="small"
          @click.stop="rowView(row)"
        >{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="View"
      width="60%"
      :visible.sync="dialogViewVisible"
      class="abow_dialog"
      center
    >
      <div ref="form" :model="rowItem">
        <div v-for="item in rowItem.item" :key="item.id" :title="item.title" class="item">
          <div class="title">{{item.title}}</div>
          <div v-for="column in item.column" :key="column.label" style="width:33%;float:left">
            <label class="label">{{column.label}}：</label>
            <label>{{column.prop}}</label>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisible = false">Back</el-button>
      </span>
    </el-dialog>


       <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        action="/api//swap_battery/battery/importData"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="goimportxls">download template</el-link>
        </div>
        <div class="el-upload__text">
          Drag the file here, or
          <em>Click upload</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">Tip: only "XLS" or "xlsx" format files can be imported!</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  importxls
} from "@/api/swap_battery/battery";
import website from "@/config/website";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;
export default {
  
  data() {
    // 设备类名称 验证
    var validateDeviceName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error("请输入英文+数字"));
      } else {
        callback();
      }
    };
    // 电池BID码 验证
    var validateBID = (rule, value, callback) => {
      var reg = /^(BA|BT|ba|bt)\d{14}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入英文+数字"));
      } else {
        callback();
      }
    };
    return {
      dialogViewVisible: false,
      form: {},
    upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: auth, "Blade-Auth": "bearer " + token },
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
      },
      rowItem: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        viewBtn: false,
        selection: true,
        // columnBtn:false,
        // searchBtn:false,
        // defaultExpandAll:true,
        index: true,
        excelBtn: true,
        editDisabled: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: this.$t(`battery.batteryCode`),
            // width: 160,
            prop: "batteryCode",
            search: true,
            rules: [
              {
                validator: validateBID,
                required: true,
                message: this.$t(`battery.enterBID`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.batteryName`),
            // width: 160,
            prop: "batteryName",
            hide: true,
            search: true,
            rules: [
              {
                validator: validateDeviceName,
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`battery.batteryName`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.batteryVersion`),
            // width: 120,
            prop: "batteryVersion",
            search: true,
            // addDisabled:true,
            // addDisplay:false,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`battery.batteryVersion`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.voltage`),
            prop: "voltage",
            addDisabled: true,
            hide: true,
            addDisplay: false,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`) + this.$t(`battery.voltage`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.electricity`),
            prop: "electricity",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`battery.electricity`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.cycleIndex`),
            width: 120,
            prop: "cycleIndex",
            addDisabled: true,
            addDisplay: false,
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.cycleIndex`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.surplusMileage`),
            width: 120,
            addDisabled: true,
            addDisplay: false,
            prop: "surplusMileage",
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.surplusMileage`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.surplusElectric`),
            prop: "surplusElectric",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.surplusElectric`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.healthValue`),
            width: 120,
            prop: "healthValue",
            type: "number",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.healthValue`) +
                  " (0-100)",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.batteryStatus`),
            prop: "batteryStatus",
            search: true,
            type: "select",
            // addDisabled:true,
            addDisplay: false,
            valueDefault: "0",
            dicData: [
              {
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: this.$t(`battery.Fault`),
                value: "1"
              },
              {
                label: this.$t(`battery.Repairing`),
                value: "2"
              },
              {
                label: this.$t(`battery.Castoff`),
                value: "3"
              }
            ],
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.batteryStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.lockStatus`),
            prop: "lockStatus",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            hide: true,
            dicData: [
              {
                label: this.$t(`battery.Locked`),
                value: "0"
              },
              {
                label: this.$t(`battery.Unlocked`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`battery.enterlockStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.powerStatus`),
            prop: "powerStatus",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "2",
            dicData: [
              {
                label: this.$t(`battery.Charge`),
                value: "0"
              },
              {
                label: this.$t(`battery.Out`),
                value: "1"
              },
              {
                label: this.$t(`battery.Close`),
                value: "2"
              }
            ],
            search: true,
            rules: [
              {
                required: false,
                message: this.$t(`battery.enterpowerStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.activateStatus`),
            prop: "activateStatus",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            search: true,
            type: "select",
            dicData: [
              {
                label: this.$t(`scooter.activated`),
                value: "0"
              },
              {
                label: this.$t(`scooter.inactivated`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.activationStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.temperature`),
            prop: "temperature",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`battery.temperature`) +
                  " ℃",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.connectStatus`),
            // addDisabled:true,
            addDisplay: false,
            valueDefault: 2,
            prop: "connectStatus",
            slot: true,
            search: true,
            type: "select",
            dicData: [
              {
                label: this.$t(`battery.connectCbinet`),
                value: "0"
              },
              {
                label: this.$t(`battery.connectCars`),
                value: "1"
              },
              {
                label: this.$t(`Unconnected`),
                value: "2"
              },
              {
                label: this.$t(`battery.communicationError`),
                value: "3"
              },
              {
                label: this.$t(`battery.moduleError`),
                value: "4"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.connectionStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`battery.systemStatus`),
            prop: "systemStatus",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "0",
            value: this.$t(`battery.Normal`),
            hide: true,
            dicData: [
              {
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: this.$t(`battery.Safe`),
                value: "1"
              },
              {
                label: this.$t(`battery.Safe`),
                value: "2"
              },
              {
                label: this.$t(`battery.Safe`),
                value: "3"
              }
            ],
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`battery.systemStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.expirationDate`),
            prop: "expirationDate",
            // addDisabled:true,
            // addDisplay:false,
            type: "number",
            valueDefault: 1,
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.expirationDate`),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "电芯规格",
          //   addDisabled:true,
          //   addDisplay:false,
          //   prop: "specification",
          //   rules: [{
          //     required: false,
          //     message: "请输入电芯规格",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "电芯生成商",
          //   prop: "producer",
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: false,
          //     message: "请输入电芯生成商",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "电池PACK厂",
          //   prop: "producePack",
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: false,
          //     message: "请输入电池PACK厂",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`scooter.produceTime`),
            prop: "produceTime",
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.produceTime`),
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "供应商id",
          //   prop: "supplierId",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入供应商id",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "创建人",
          //   prop: "createUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "创建时间",
          //   prop: "createTime",

          //   type:'datetime',
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新人",
          //   prop: "updateUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新时间",
          //   prop: "updateTime",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //    type:'datetime',
          //   rules: [{
          //     required: true,
          //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   // addDisabled:true,
          //   // addDisplay:false,
          //   rules: [{
          //     required: false,
          //     message: "请输入备注",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "删除标识",
          //   prop: "delFlag",
          //   type:'select',
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   dicData:[
          //     {
          //       label:'存在',
          //       value:'0'
          //     },{
          //       label:'删除',
          //       value:'1'
          //     }
          //   ],
          //   rules: [{
          //     required: true,
          //     message: "请输入删除标",
          //     trigger: "blur"
          //   }]
          // },
        ]
      },
    
      data: [],
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        // addBtn: this.vaildData(this.permission.battery_add, false),
        // viewBtn: this.vaildData(this.permission.battery_view, false),
        //delBtn: this.vaildData(this.permission.battery_delete, false),
        // editBtn: this.vaildData(this.permission.battery_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.batteryId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      getDetail(row.batteryId).then(res => {
        var data = res.data.data;
        this.dialogViewVisible = true;
        var batteryStatus, powerStatus, connectStatus, systemStatus;
        switch (data.batteryStatus) {
          case "0":
            batteryStatus = this.$t(`battery.Normal`);
            break;
          case "1":
            batteryStatus = this.$t(`battery.Fault`);
            break;
          case "2":
            batteryStatus = this.$t(`battery.Repairing`);
            break;
          case "3":
            batteryStatus = this.$t(`battery.Castoff`);
            break;
        }
        switch (data.powerStatus) {
          case "0":
            powerStatus = this.$t(`battery.charge`);
            break;
          case "1":
            powerStatus = this.$t(`battery.Out`);
            break;
          case "2":
            powerStatus = this.$t(`battery.Close`);
            break;
        }
        switch (data.connectStatus) {
          case "0":
            connectStatus = this.$t(`battery.connectCbinet`);
            break;
          case "1":
            connectStatus = this.$t(`battery.connectCars`);
            break;
          case "2":
            connectStatus = this.$t(`Unconnected`);
            break;
          case "3":
            connectStatus = this.$t(`battery.communicationError`);
            break;
          case "4":
            connectStatus = this.$t(`battery.moduleError`);
            break;
        }
        switch (data.systemStatus) {
          case "0":
            systemStatus = this.$t(`battery.Normal`);
            break;
          case "1":
            systemStatus = this.$t(`battery.Safe`);
            break;
          case "2":
            systemStatus = this.$t(`battery.Stolen`);
            break;
          case "3":
            systemStatus = this.$t(`battery.Sleep`);
            break;
        }
        this.rowItem = {
          item: [
            {
              title: "Battery Info",
              column: [
                {
                  label: this.$t(`battery.batteryCode`),
                  prop: data.batteryCode
                },
                {
                  label: this.$t(`battery.batteryName`),
                  prop: data.batteryName
                },
                {
                  label: this.$t(`battery.batteryVersion`),
                  prop: data.batteryVersion
                },
                { label: this.$t(`battery.voltage`), prop: data.voltage },
                // { label: "设备IMEI码", prop: data.imei },
                {
                  label: this.$t(`battery.electricity`),
                  prop: data.electricity
                },
                { label: this.$t(`battery.cycleIndex`), prop: data.cycleIndex },
                {
                  label: this.$t(`battery.surplusElectric`),
                  prop: data.surplusElectric
                },
                {
                  label: this.$t(`battery.surplusMileage`),
                  prop: data.surplusMileage
                }
              ]
            },
            {
              title: this.$t(`battery.batteryStatus`),
              column: [
                {
                  label: this.$t(`battery.batteryStatus`),
                  prop: batteryStatus
                },
                {
                  label: this.$t(`battery.lockStatus`),
                  prop:
                    data.lockStatus == "0"
                      ? this.$t(`battery.Locked`)
                      : this.$t(`battery.Unlocked`)
                },
                {
                  label: this.$t(`battery.powerStatus`),
                  prop: powerStatus
                },
                {
                  label: this.$t(`battery.activateStatus`),
                  prop:
                    data.activateStatus == "0"
                      ? this.$t(`battery.Actived`)
                      : this.$t(`battery.Unactivated`)
                },
                {
                  label: this.$t(`battery.temperature`),
                  prop: data.temperature
                },
                {
                  label: this.$t(`battery.connectStatus`),
                  prop:
                    connectStatus == "0"
                      ? this.$t(`Connected`)
                      : this.$t(`Unconnected`)
                },
                {
                  label: this.$t(`battery.systemStatus`),
                  prop: systemStatus
                }
              ]
            }
          ]
        };
        console.log(this.rowItem);
      });
    },
    rowSave(row, loading, done) {
      add(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },
    rowUpdate(row, index, loading, done) {
      update(row).then(
        () => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        },
        error => {
          done();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return remove(row.batteryId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

  /** 下载模板操作 */
    // importTemplate() {
    //   importTemplate().then(response => {
    //     this.download(response.msg);
    //   });
    // },
        // 文件上传中处理
    handleFileUploadProgress(event) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "Result", { dangerouslyUseHTMLString: true });
          this.onLoad(this.page);
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    goimportxls() {
      importxls().then(response => {
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "Battery.xlsx";
        link.click();
      });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("Please select at least one piece of data");
        return;
      }
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.batteryId).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params) {
      this.query = params;
      this.onLoad(this.page, params);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;

      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
.abow_dialog .el-dialog .el-dialog__body {
  padding: 0 30px;
}
.abow_dialog .title {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.847058823529412);
  line-height: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}
.abow_dialog .item {
  overflow: hidden;
  padding-bottom: 12px;
  padding-top: 12px;
  border-bottom: 1px solid #ebebeb;
}
.abow_dialog .item label {
  line-height: 32px;
}
.abow_dialog .fullItem {
  padding-bottom: 12px;
  padding-top: 12px;
  line-height: 20px;
  border-bottom: 1px solid #ebebeb;
}
</style>
