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
        <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">批量删除</el-button>

        <!--     
          <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     plain
        @click.stop="goimportxls()">导出</el-button>-->

        <el-popover placement="right" width="400" trigger="click">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="文件名称">
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
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  @click="submitUpload"
                >上传到服务器</el-button>
                <el-button size="small" type="infor" @click="download">导入模板</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button size="medium" slot="reference">导入</el-button>
        </el-popover>

        <el-button @click="openTenantWindos()">分配客户</el-button>

        <el-dialog title="分配客户" :visible.sync="dialogFormVisible" width="30%" center>
          <span slot="footer" class="dialog-footer">
            <avue-form :option="formoption" v-model="form" @submit="handleSubmit"></avue-form>
          </span>
        </el-dialog>

        <template>
          <el-button @click.stop="delteant">解除客户关联</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">解除用户关联</el-button>
        </template>
        <el-button @click.stop="Updatelock">欠费锁车</el-button>
        <el-button>删除</el-button>
      </template>

      <template slot-scope="{row}" slot="userId">
        <el-tag>{{row.loginName}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="tenantId">
        <el-tag>{{row.tenantName}}</el-tag>
      </template>

      <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">查看</el-button>
      </template>
    </avue-crud>

    <el-dialog title="查看" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
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
        <el-button type="primary" @click="dialogViewVisible = false">返 回</el-button>
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
            label: "分配客户",
            prop: "tenantId",
            type: "tree",
            span: 24,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择客户",
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
        dialogWidth: "60%",
        dialogHeight: 500,
        labelWidth: 140,
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
            width: 160,
            prop: "scooterCode",
            editDisabled: true,
            search: true,
            span: 8,
            rules: [
              {
                required: true,
                message: "请输入电动车编号 VIN码",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.licensePlate`),
            width: 100,
            prop: "licensePlate",
            span: 8,
            search: true,
            rules: [
              {
                required: false,
                message: "请输入车牌号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "设备IMEI码",
            width: 160,
            addDisabled: true,
            addDisplay: false,
            span: 8,
            prop: "imei",
            rules: [
              {
                required: false,
                message: "请输入设备IMEI码",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.scooterVersion`),
            width: 120,
            prop: "scooterVersion",
            valueDefault: "",
            rules: [
              {
                required: false,
                message: "请输入电动车型号",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.scooterStatus`),
            prop: "scooterStatus",
            type: "select",
            search: true,
            // addDisabled:true,
            valueDefault: "0",
            addDisplay: false,
            dicData: [
              {
                label: "正常",
                value: "0"
              },
              {
                label: "故障",
                value: "1"
              },
              {
                label: "维修",
                value: "2"
              },
              {
                label: "报废",
                value: "3"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入车辆状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.sellChannel`),
            search: true,
            type: "select",
            valueDefault: "1",
            prop: "sellChannel",
            dicData: [
              {
                label: "客户",
                value: "0"
              },
              {
                label: "门店",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入销售渠道",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.sellStatus`),
            prop: "sellStatus",
            //editDisabled:true,
            editDisplay: false,
            //addDisabled:true,
            addDisplay: false,
            type: "select",
            search: true,
            valueDefault: "1",
            dicData: [
              {
                label: "已销售 ",
                value: "0"
              },
              {
                label: "未销售",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入业务状态 （0：已销售 1：未销售）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "所属客户",
            prop: "tenantId",
            type: "tree",
            slot: true,
            dicUrl: "/api/swap_tenant_bat/swaptenantbat/select",
            valueDefault: "",
            props: {
              label: "tenantName",
              value: "tenantId"
            }
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
            //editDisabled:true,
            editDisplay: false,
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            type: "select",
            dicData: [
              {
                label: "已激活",
                value: "0"
              },
              {
                label: "未激活",
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: "请选择激活状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.runStatus`),
            prop: "runStatus",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: "运行中",
                value: "0"
              },
              {
                label: "已停止",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入行驶状态 （0：运行中 1：已停止）",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.gpsStatus`),
            prop: "gpsStatus",
            type: "select",
            //addDisabled:true,
            valueDefault: "1",
            addDisplay: false,
            dicData: [
              {
                label: "已定位",
                value: "0"
              },
              {
                label: "未定位",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入定位状态 （0：已定位 1：未定位）",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.lockStatus`),
            prop: "lockStatus",
            addDisabled: true,
            addDisplay: false,
            type: "select",
            valueDefault: "1",
            dicData: [
              {
                label: "已锁定",
                value: "0"
              },
              {
                label: "未锁定",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入上锁状态 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.securityLock`),
            prop: "securityLock",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: "已锁定",
                value: "0"
              },
              {
                label: "未连接",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入防盗锁定 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.arrearageLock`),
            prop: "arrearageLock",
            type: "select",
            //addDisabled:true,
            addDisplay: false,
            valueDefault: "1",
            dicData: [
              {
                label: "已锁定",
                value: "0"
              },
              {
                label: "未连接",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入欠费锁车 （0：已锁定 1：未锁定）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "可装电池数",
            width: 100,
            prop: "batteryNumber",
            valueDefault: "1",
            type: "number",
            rules: [
              {
                required: false,
                message: "请输入可装电池数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "行车总里程",
            width: 100,
            prop: "mileageValue",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入行车总里程",
                trigger: "blur"
              }
            ]
          },
          {
            label: "里程读数时间",
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
                message: "请输入里程读数时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "初始里程表读数",
            prop: "initRead",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入初始里程表读数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "初始里程读数时间",
            prop: "initTime",
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入初始里程读数时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "供应商id",
            prop: "supplierId",
            hide: true,
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入供应商id",
                trigger: "blur"
              }
            ]
          },
          {
            label: "出厂时间",
            width: 100,
            prop: "produceTime",
            default: true,
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            rules: [
              {
                required: false,
                message: "请输入出厂时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "保质期（月）",
            prop: "expirationDate",
            valueDefault: "1",
            type: "number",
            rules: [
              {
                required: false,
                message: "请输入保质期 （月）",
                trigger: "blur"
              }
            ]
          },
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
          {
            label: "备注",
            prop: "remark",
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入备注",
                trigger: "blur"
              }
            ]
          }
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
      this.dialogViewVisible = true;
      var scooterStatus;
      switch (row.scooterStatus) {
        case "0":
          scooterStatus = "正常";
          break;
        case "1":
          scooterStatus = "故障";
          break;
        case "2":
          scooterStatus = "维修";
          break;
        case "3":
          scooterStatus = "报废";
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "电动车信息",
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
              { label: "电池数", prop: row.batteryNumber },
              { label: "设备IMEI码", prop: row.imei },
              {
                label: "行车总里程",
                prop: row.mileageValue == null ? "0" : row.mileageValue + "km"
              },
              { label: "保质期（月）", prop: row.expirationDate + "月" },
              { label: "出厂时间", prop: row.produceTime },
              {
                label: this.$t(`scooter.sellChannel`),
                prop: row.sellChannel == 0 ? "客户" : "门店"
              }
            ]
          },
          {
            title: "电动车状态",
            column: [
              {
                label: this.$t(`scooter.scooterStatus`),
                prop: scooterStatus
              },
              {
                label: this.$t(`scooter.sellStatus`),
                prop: row.sellStatus == "0" ? "已销售 " : "未销售"
              },
              {
                label: this.$t(`scooter.initStatus`),
                prop: row.initStatus == "0" ? "已激活 " : "未激活"
              },
              {
                label: this.$t(`scooter.runStatus`),
                prop: row.runStatus == "0" ? "运行中 " : "已停止"
              },
              {
                label: this.$t(`scooter.gpsStatus`),
                prop: row.gpsStatus == "0" ? "已定位 " : "已定位"
              },
              {
                label: this.$t(`scooter.lockStatus`),
                prop: row.lockStatus == "0" ? "已锁定 " : "未锁定"
              },
              {
                label: this.$t(`scooter.securityLock`),
                prop: row.securityLock == "0" ? "已锁定 " : "未连接"
              },
              {
                label: this.$t(`scooter.arrearageLock`),
                prop: row.arrearageLock == "0" ? "已锁定 " : "未连接"
              }
            ]
          }
        ],
        fullItem: [
          {
            title: "备注",
            prop: row.remark
          }
        ]
      };
    },
    customUpload(file) {
      //
      fileUpload(file).then(response => {
        console.log(response);
        response = response.data;
        if (response.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
    },
    delteant() {
      if (this.ids.length > 0) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(this.ids, "teant").then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择至少一条数据!"
        });
      }
    },

    userdel() {
      if (this.ids.length > 0) {
        this.$confirm("确定解决用户关联?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(this.ids, "user").then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择至少一条数据!"
        });
      }
    },
    Updatelock() {
      if (this.ids.length > 0) {
        del(this.ids).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择至少一条数据!"
        });
      }
    },

    openTenantWindos() {
      if (this.ids.length == 0) {
        this.$message({
          type: "error",
          message: "请选择至少一条数据!"
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
            message: "操作成功!"
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
            message: "操作成功!"
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
            message: "操作成功!"
          });
          this.dialogFormVisible = false;
        });
      } else {
        this.$message.error("请选择至少一条数据");
      }
    },

    handleEdit(index, row) {
      console.log(index, row);
    },

    rowDel(row) {
      if (this.row.runStatus == 0) {
        alert("行驶过程中的车不可删除");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.scooterId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
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
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
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
