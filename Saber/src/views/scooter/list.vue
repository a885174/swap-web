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

        <!--     
          <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     plain
        @click.stop="goimportxls()">导出</el-button>-->

        <el-popover placement="right" width="400" trigger="click">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="$t(`scooter.fileName`)">
              <el-upload
                class="upload-demo"
                ref="upload"
                :limit="1"
                :http-request="customUpload"
                action
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary">{{$t(`scooter.selectFile`)}}</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  @click="submitUpload"
                >{{$t(`scooter.uploadToServer`)}}</el-button>
                <el-button size="small" type="infor" @click="download">{{$t(`scooter.importTemplate`)}}</el-button>
                <div slot="tip" class="el-upload__tip">please select xls</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button size="medium" slot="reference">{{$t(`import`)}}</el-button>
        </el-popover>

        <el-button @click="openTenantWindos()">{{$t(`assignClient`)}}</el-button>

        <el-dialog title="Assign Client" :visible.sync="dialogFormVisible" width="30%" center>
          <span slot="footer" class="dialog-footer">
            <avue-form :option="formoption" v-model="form" @submit="handleSubmit"></avue-form>
          </span>
        </el-dialog>

        <template>
          <el-button @click.stop="delteant">{{$t(`scooter.UnlinkwithClient`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`scooter.arrearageLock`)}}</el-button>
        </template>
        <el-button @click.stop="Updatelock">{{$t(`scooter.arrearageLock`)}}</el-button>
      </template>

      <template slot-scope="{row}" slot="userId">
        <el-tag>{{row.loginName}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="tenantId">
        <el-tag>{{row.tenantName}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="connectStatus">
        <label
          :style="{color:row.connectStatus=='0'?'green':'red'}"
        >{{row.connectStatus=="0"?"Connect":"Unconnect"}}</label>
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
        <div v-for="item in rowItem.fullItem" :key="item.title" class="fullItem">
          <div class="title">{{item.title}}</div>
          <p>{{item.prop}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisible = false">Back</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  downloadxls,
  update,
  remove,
  importxls,
  fileUpload,
  getenantList,
  SavueTeant,
  del
} from "@/api/swap_scooter/scooter";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      produceTime: "",
      dialogFormVisible: false,
      dialogViewVisible: false,
      form: {},
      rowItem: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      formoption: {
        column: [
          {
            label: this.$t(`assignClient`),
            prop: "tenantId",
            type: "tree",
            span: 24,
            slot: true,
            rules: [
              {
                required: true,
                message: this.$t(`scooter.selectCustomer`),
                trigger: "blur"
              }
            ],
            dicUrl: "/api/swap_tenant_bat/swaptenantbat/select",
            props: {
              label: "tenantName",
              value: "tenantId"
            }
          }
        ]
      },
      option: {
        // dialogWidth: "60%",
        // dialogHeight: 500,
        // labelWidth: 140,
        tip: false,
        border: true,
        index: true,
        selection: true,
        excelBtn: true,
        viewBtn: false,
        editBtn: true,
        delBtn: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        // columnBtn:false,
        // searchBtn:false,
        // defaultExpandAll:true,
        column: [
          // {
          //   label: "电动车id",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   prop: "scooterId",
          //   search: true,
          //   rules: [{
          //     required: true,
          //     message: "请输入电动车id",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`scooter.vincode`),
            // width: 160,
            prop: "scooterCode",
            editDisabled: true,
            search: true,
            span: 20,
            labelWidth: 120,
            rules: [
              {
                required: true,
                message: this.$t(`scooter.please`) + this.$t(`scooter.vincode`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.licensePlate`),
            prop: "licensePlate",
            span: 20,
            search: true,
            labelWidth: 120,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.licensePlate`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.scooterVersion`),
            // width: 120,
            prop: "scooterVersion",
            valueDefault: "",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.vehicleModel`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "IMEI",
            // width: 160,
            addDisabled: true,
            addDisplay: false,
            span: 8,
            prop: "imei",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.IMEICode`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.connectStatus`),
            prop: "connectStatus",
            slot: true,
            //addDisabled:true,
            addDisplay: false,
            search: true,
            type: "select",
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`Connected`),
                value: "0"
              },
              {
                label: this.$t(`Unconnected`),
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: this.$t(`scooter.connectionStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.scooterStatus`),
            prop: "scooterStatus",
            type: "select",
            search: true,
            hide: true,
            // addDisabled:true,
            valueDefault: "0",
            addDisplay: false,
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
                  this.$t(`scooter.please`) + this.$t(`scooter.scooterStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.sellChannel`),
            search: true,
            hide: true,
            type: "select",
            valueDefault: "1",
            prop: "sellChannel",
            dicData: [
              {
                label: this.$t(`scooter.client`),
                value: "0"
              },
              {
                label: this.$t(`scooter.store`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.salesChannel`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.sellStatus`),
            prop: "sellStatus",
            hide: true,
            //editDisabled:true,
            editDisplay: false,
            //addDisabled:true,
            addDisplay: false,
            type: "select",
            search: true,
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`scooter.sold`),
                value: "0"
              },
              {
                label: this.$t(`scooter.notSold`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.businessStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.nameOfClient`),
            prop: "tenantId",
            type: "tree",
            hide: true,
            slot: true,
            dicUrl: "/api/swap_tenant_bat/swaptenantbat/select",
            valueDefault: "",
            props: {
              label: "tenantName",
              value: "tenantId"
            },
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.pleaseSelect`) +
                  this.$t(`scooter.nameOfClient`),
                trigger: "blur"
              }
            ]
          },
          // {
          //     label: "所属用户户",
          //     prop: "userId",
          //     type: "tree",
          //     slot: true,
          //     valueDefault:"",
          //     dicUrl: "/api/swap_user/wapuser/select",
          //     props: {
          //       label: "loginName",
          //       value: "userId"
          //     },
          //   },
          {
            label: this.$t(`scooter.initStatus`),
            prop: "initStatus",
            hide: true,
            //editDisabled:true,
            editDisplay: false,
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
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
                required: true,
                message: this.$t(`scooter.activationStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.runStatus`),
            prop: "runStatus",
            type: "select",
            hide: true,
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`scooter.running`),
                value: "0"
              },
              {
                label: this.$t(`scooter.stopped`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.drivingStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.gpsStatus`),
            prop: "gpsStatus",
            type: "select",
            hide: true,
            //addDisabled:true,
            valueDefault: "1",
            addDisplay: false,
            dicData: [
              {
                label: this.$t(`scooter.targeted`),
                value: "0"
              },
              {
                label: this.$t(`scooter.untargeted`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.positioningStatus`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.lockStatus`),
            prop: "lockStatus",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            type: "select",
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`scooter.locked`),
                value: "0"
              },
              {
                label: this.$t(`scooter.NotLocked`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.lockedState`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.securityLock`),
            prop: "securityLock",
            type: "select",
            hide: true,
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`scooter.locked`),
                value: "0"
              },
              {
                label: this.$t(`scooter.notConnected`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.antiTheftLock`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.arrearageLock`),
            prop: "arrearageLock",
            type: "select",
            hide: true,
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`scooter.locked`),
                value: "0"
              },
              {
                label: this.$t(`scooter.notConnected`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.arrearsLockCar`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.batteryNumber`),
            width: 100,
            hide: true,
            prop: "batteryNumber",
            valueDefault: "1",
            type: "number",
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.batteryNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.mileageValue`),
            width: 100,
            hide: true,
            prop: "mileageValue",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) +
                  "：" +
                  this.$t(`scooter.mileageValue`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.mileageReading`),
            prop: "readTime",
            type: "datetime",
            hide: true,
            addDisabled: true,
            addDisplay: false,
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.enterMileageReading`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.initialOdometer`),
            hide: true,
            prop: "initRead",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.enterInitialOdometer`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.initialMileageTime`),
            prop: "initTime",
            hide: true,
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.enterInitialMileageTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.supplierId`),
            hide: true,
            prop: "supplierId",
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: this.$t(`scooter.enterSupplierId`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.produceTime`),
            width: 100,
            hide: true,
            prop: "produceTime",
            default: true,
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.produceTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.expirationDate`),
            prop: "expirationDate",
            hide: true,
            valueDefault: "1",
            type: "number",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.enterShelfLife`),
                trigger: "blur"
              }
            ]
          }
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
          //   addDisabled:true,
          //   addDisplay:false,
          //   type:'datetime',
          //   editDisabled:true,
          //   editDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新人",
          //   prop: "updateUser",
          //   addDisabled:true,
          //   addDisplay:false,
          //   editDisabled:true,
          //   editDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新时间",
          //   prop: "updateTime",
          //   addDisabled:true,
          //   addDisplay:false,
          //   editDisabled:true,
          //   editDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   hide: true,
          //   editDisabled: true,
          //   editDisplay: false,
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入备注",
          //       trigger: "blur"
          //     }
          //   ]
          // }
          // {
          //   label: "删除状态",
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
          //       label:'已删除',
          //       value:'1'
          //     }
          //   ],
          //   rules: [{
          //     required: true,
          //     message: "请输入删除状态 0代表存在 1代表删除",
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
        addBtn: this.vaildData(this.permission.scooter_add, false),
        viewBtn: this.vaildData(this.permission.scooter_view, false),
        //delBtn: this.vaildData(this.permission.scooter_delete, false),
        editBtn: this.vaildData(this.permission.scooter_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.scooterId);
      });
      return ids.join(",");
    }
  },
  created() {
    this.form.sellChannel = "0";
    console.log(this.form);
    getenantList(1, 20, "").then(response => {
      response = response.data;
      if (response.code == 200) {
        this.tableData = response.data.records;
      }
    });
  },
  methods: {
    rowView(row) {
      getDetail(row.scooterId).then(res => {
        this.form = res.data.data;
        this.dialogViewVisible = true;
        var scooterStatus;
        switch (row.scooterStatus) {
          case "0":
            scooterStatus = this.$t(`battery.Normal`);
            break;
          case "1":
            scooterStatus = this.$t(`battery.Fault`);
            break;
          case "2":
            scooterStatus = this.$t(`battery.Repairing`);
            break;
          case "3":
            scooterStatus = this.$t(`battery.Castoff`);
            break;
        }
        this.rowItem = {
          item: [
            {
              title: "Scooter",
              column: [
                { label: this.$t(`scooter.vincode`), prop: row.scooterCode },
                {
                  label: this.$t(`scooter.licensePlate`),
                  prop: row.licensePlate
                },
                {
                  label: this.$t(`scooter.scooterVersion`),
                  prop: row.scooterVersion
                },
                {
                  label: this.$t(`scooter.batteryNumber`),
                  prop: row.batteryNumber
                },
                { label: "IMEI", prop: row.imei },
                {
                  label: this.$t(`scooter.mileageValue`),
                  prop: row.mileageValue == null ? "0" : row.mileageValue + "km"
                },
                {
                  label: this.$t(`scooter.expirationDate`),
                  prop: row.expirationDate + "month"
                },
                {
                  label: this.$t(`scooter.produceTime`),
                  prop: row.produceTime
                },
                {
                  label: this.$t(`scooter.sellChannel`),
                  prop:
                    row.sellChannel == 0
                      ? this.$t(`scooter.client`)
                      : this.$t(`scooter.store`)
                }
              ]
            },
            {
              title: this.$t(`scooter.scooterStatus`),
              column: [
                {
                  label: this.$t(`scooter.scooterStatus`),
                  prop: scooterStatus
                },
                {
                  label: this.$t(`scooter.sellStatus`),
                  prop:
                    row.sellStatus == "0"
                      ? this.$t(`scooter.sold`)
                      : this.$t(`scooter.notSold`)
                },
                {
                  label: this.$t(`scooter.initStatus`),
                  prop:
                    row.initStatus == "0"
                      ? this.$t(`scooter.activated`)
                      : this.$t(`scooter.inactivated`)
                },
                {
                  label: this.$t(`scooter.runStatus`),
                  prop:
                    row.runStatus == "0"
                      ? this.$t(`scooter.running`)
                      : this.$t(`scooter.stopped`)
                },
                {
                  label: this.$t(`scooter.gpsStatus`),
                  prop:
                    row.gpsStatus == "0"
                      ? this.$t(`scooter.targeted`)
                      : this.$t(`scooter.untargeted`)
                },
                {
                  label: this.$t(`scooter.lockStatus`),
                  prop: row.lockStatus == "0" ? this.$t(`scooter.locked`) : this.$t(`scooter.NotLocked`)
                },
                {
                  label: this.$t(`scooter.connectStatus`),
                  prop:
                    row.connectStatus == "0"
                      ? this.$t(`Connected`)
                      : this.$t(`Unconnected`)
                },
                {
                  label: this.$t(`scooter.securityLock`),
                  prop: row.securityLock == "0" ? this.$t(`scooter.locked`) : this.$t(`scooter.notConnected`)
                },
                {
                  label: this.$t(`scooter.arrearageLock`),
                  prop: row.arrearageLock == "0" ? this.$t(`scooter.locked`) : this.$t(`scooter.notConnected`)
                },
                // {
                //   label: this.$t(`scooter.arrearageLock`),
                //   prop: row.arrearageLock == "0" ? "已锁定 " : "未连接"
                // }
              ]
            }
          ]
          // fullItem: [
          //   {
          //     title: "备注",
          //     prop: row.remark
          //   }
          // ]
        };
      });
    },
    customUpload(file) {
      //
      fileUpload(file).then(response => {
        console.log(response);
        response = response.data;
        if (response.code == 200) {
          this.$message({
            type: "success",
            message: "success!"
          });
        }
      });
    },
    delteant() {
      if (this.ids.length > 0) {
        this.$confirm("Are you sure you want to delete the selected data?", {
          confirmButtonText: "sure",
          cancelButtonText: "cancel",
          type: "warning"
        }).then(() => {
          del(this.ids, "teant").then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "success!"
            });
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      }
    },

    userdel() {
      if (this.ids.length > 0) {
        this.$confirm(this.$t(`scooter.userAssociation`), {
          confirmButtonText: this.$t(`submitText`),
          cancelButtonText: this.$t(`cancelText`),
          type: "warning"
        }).then(() => {
          del(this.ids, "user").then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "success!"
            });
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      }
    },
    Updatelock() {
      if (this.ids.length > 0) {
        del(this.ids).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      }
    },

    openTenantWindos() {
      if (this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      } else {
        this.dialogFormVisible = true;
      }
    },
    rowSave(row, loading, done) {
      console.log(row);
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

    goimportxls() {
      importxls().then(response => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "导出电动车数据列表.xls";
        link.click();
      });
    },

    download() {
      downloadxls().then(response => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "电动车下载模板.xls";
        link.click();
      });
    },
    handleSubmit() {
      if (this.ids.length > 0) {
        SavueTeant(this.ids, this.form.tenantId).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
          this.dialogFormVisible = false;
        });
      } else {
        this.$message.error("Please select at least one piece of data");
      }
    },

    handleEdit(index, row) {
      console.log(index, row);
    },

    rowDel(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return remove(row.scooterId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setCustomer() {
      console.log(this.currentRow);
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("Please select at least one piece of data");
        return;
      }
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: this.$t(`submitText`),
        cancelButtonText: this.$t(`cancelText`),
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
      console.log(this.form);
      if (type == "add") {
        this.form.sellChannel = "0";
      }
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.scooterId).then(res => {
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
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
