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
        >{{$t(`delte`)}}</el-button>

        <template>
          <el-button @click.stop="delteant">{{$t(`tenant.Frozen`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="delscooter">{{$t(`tenant.UnlinkwithMotorcycle`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`Unfreeze`)}}</el-button>
        </template>
      </template>
      <template slot-scope="{row}" slot="tenantStatus">
        <label
          :style="{color:row.tenantStatus=='0'?'green':'red'}"
        >{{row.tenantStatus=="0"?'Normal':'Fezon'}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click.stop="rowViews(scope.row)"
        >{{$t(`chakan`)}}</el-button>
        <el-button
          type="text"
          size="small"
          @click.stop="selectForm(scope.row)"
        >{{$t(`tenant.AssignScooter`)}}</el-button>

        <!-- <el-button type="text" @click="getListData(scope.row)">客户绑定详情</el-button> -->
      </template>
    </avue-crud>
    <!-- 分配电动车dialog -->
    <el-dialog title="Assign Scooter" :visible.sync="dialogFormVisible" width="60%" center>
      <avue-crud
        :option="selectOption"
        :table-loading="loading"
        :data="selectData"
        :page="selectPage"
        v-model="scooterForm"
        ref="selectCrud"
        @search-change="searchScooterChange"
        @search-reset="searchScooterReset"
        @selection-change="scooterSelect"
        @current-change="currentscooterChange"
        @size-change="scootersizeChange"
      >
        <template slot="menuLeft">
          <!-- 保存按钮 -->
          <template>
            <el-button @click.stop="updateScooter">{{$t(`submitText`)}}</el-button>
          </template>
        </template>
      </avue-crud>
      <!-- <span slot="footer" class="dialog-footer">
        <avue-form :option="formoption" v-model="form" @submit="handleSubmit"></avue-form>
      </span>-->
    </el-dialog>
    <el-dialog
      title="充电仓管理"
      :visible.sync="chaTableVisible"
      :append-to-body="true"
      :fullscreen="true"
    >
      <el-table :data="chaData">
        <el-table-column label="Index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="station_code" label="充电柜编码 " width="150"></el-table-column>
        <el-table-column property="name" label="仓位" width="200"></el-table-column>
        <el-table-column property="lt" label="电池仓锁状态" width="200"></el-table-column>
        <el-table-column property="ct" label="电池仓状态"></el-table-column>
        <el-table-column property="v" label="电池仓电压 " width="150"></el-table-column>
        <el-table-column property="i" label="电池仓电流" width="200"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="View"
      width="60%"
      :visible.sync="dialogViewVisibles"
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
        <el-button type="primary" @click="dialogViewVisibles = false">Back</el-button>
      </span>
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
  importxls,
  del,
  saveSccoterList,
  delSccoterList,
  selectSccoterList
} from "@/api/swap_tenant_bat/swaptenantbat";
import { mapGetters } from "vuex";

export default {
  data() {
    this.viewBtn = true;
    return {
      dialogViewVisibles: false,
      rowItem: {},
      form: {},
      query: {},
      squery: {},
      loading: true,
      dialogFormVisible: false,
      chaTableVisible: false,
      chaData: [],
      formoption: {
        column: [
          {
            label: "电动车",
            prop: "scooterId",
            type: "tree",
            span: 24,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择电动车",
                trigger: "blur"
              }
            ],
            dicUrl: "/api/swap_scooter/scooter/select",
            props: {
              label: "scooterCode",
              value: "scooterId"
            }
          }
        ]
      },
      selectId: "", // 选中的客户id
      selectData: [], // 当前的电动车列表
      selectOption: {
        tip: false,
        border: true,
        index: true,
        selection: true,
        align: "center",
        menu: false,
        indexLabel: "Index",
        refreshBtn: false,
        addBtn: false,
        column: [
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
          }
        ]
      },
      scooterForm: {},
      scooterIds: "",
      selectPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        dialogWidth: 400,
        dialogHeight: 330,
        tip: false,
        border: true,
        index: true,
        columnBtn: true,
        viewBtn: false,
        excelBtn: true,
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "Index",
        column: [
          {
            label: "客户id",
            prop: "tenantId",
            search: false,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入客户id",
                trigger: "blur"
              }
            ],
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false
          },
          // {
          //   label: "父客户id",
          //   prop: "parentId",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入父客户id",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`tenant.tenantName`),
            prop: "tenantName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入客户名称",
                trigger: "blur"
              }
            ]
          },

          {
            label: this.$t(`tenant.area`),
            prop: "area",
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`) + this.$t(`tenant.area`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.trade`),
            prop: "trade",
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`) + this.$t(`tenant.trade`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.linkman`),
            prop: "linkman",
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`) + this.$t(`tenant.linkman`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.contactNumber`),
            hide: true,
            prop: "contactNumber",
            rules: [
              {
                required: true,
                message:
                  this.$t(`scooter.please`) + this.$t(`store.contactNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "address",
            prop: "address",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入联系地址",
                trigger: "blur"
              }
            ]
          },
          {
            label: "email",
            prop: "email",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入邮箱",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.legalPerson`),
            prop: "legalPerson",
            hide: true,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`tenant.legalPerson`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.scooters`),
            prop: "scooters",
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: false,
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.users`),
            prop: "users",
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: false,
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.approveStatus`),
            prop: "approveStatus",
            type: "select",
            hide: true,
            valueDefault: "1",
            dicData: [
              {
                label: "有",
                value: "0"
              },
              {
                label: "无",
                value: "1"
              },
              {
                label: "未知",
                value: "2"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入工商备案",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`tenant.tenantStatus`),
            search: true,
            addDisPlay: false,
            valueDefault: "0",
            type: "select",
            slot: true,
            dicData: [
              {
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: this.$t(`tenant.Frozen`),
                value: "1"
              }
            ],
            prop: "tenantStatus",
            rules: [
              {
                required: true,
                message: "请输入客户状态",
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "创建者",
          //   prop: "createUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建者",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "创建时间",
          //   prop: "createTime",
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
          //   label: "更新者",
          //   prop: "updateUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新者",
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
          //   rules: [{
          //     required: true,
          //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "删除标志",
          //   prop: "delFlag",
          //   type:'select',
          //   dicData:[
          //     {
          //       label:'存在',
          //       value:'0'
          //     },{
          //       label:'刪除',
          //       value:'1'
          //     }
          //   ],
          //   rules: [{
          //     required: false,
          //     message: "请输入删除标志 0代表存在 1代表删除",
          //     trigger: "blur"
          //   }]
          // },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),

    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.tenants_add, false),
        viewBtn: this.vaildData(this.permission.tenants_view, false)
        // delBtn: this.vaildData(this.permission.swaptenantbat_delete, false),
        //editBtn: this.vaildData(this.permission.swaptenantbat_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.tenantId);
      });
      return ids.join(",");
    }
  },
  methods: {
    scootersizeChange(pageSize) {
      this.selectPage.pageSize = pageSize;
      this.scooterData(this.selectPage);
    },
    currentscooterChange(currentPage) {
      this.selectPage.currentPage = currentPage;
      this.scooterData(this.selectPage);
    },
    searchScooterReset() {
      this.squery = {};
      this.scooterData(this.selectPage);
    },
    searchScooterChange(params) {
      this.squery = params;
      this.scooterData(this.selectPage, params);
    },
    scooterData(page, params = {}) {
      selectSccoterList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.squery)
      ).then(res => {
        const data = res.data.data;
        this.selectPage.total = data.total;
        this.selectData = data.records;
        this.loading = false;
        this.$refs.selectCrud.toggleSelection();
        // this.selectionClear();
        // this.selectData = res.data.records;
      });
    },

    updateScooter() {
      if (this.scooterIds.length > 0) {
        saveSccoterList(this.scooterIds, this.scooterForm.tenantId).then(() => {
          this.scooterData(this.selectPage);
          this.$message({
            type: "success",
            message: "success!"
          });
          this.scooterIds = "";
          this.dialogFormVisible = false;
        });
      } else {
        this.$message.error("Please select at least one piece of data");
      }
    },
    // 选中的电动车ID
    scooterSelect(list) {
      let ids = [];
      list.forEach(ele => {
        ids.push(ele.scooterId);
      });
      this.scooterIds = ids.join(",");

    },
    // 打开分配电动车弹窗
    selectForm(row) {
      this.scooterIds = "";
      this.scooterForm = row;
      this.scooterData(this.selectPage);
      this.dialogFormVisible = true;
    },
    rowViews(row) {
      this.dialogViewVisibles = true;
      this.rowItem = {
        item: [
          {
            title: "Clinent Info",
            column: [
              // { label: "客户id", prop: row.tenantId },
              { label: this.$t(`tenant.tenantName`), prop: row.tenantName },
              { label: this.$t(`tenant.area`), prop: row.area },
              { label: this.$t(`tenant.trade`), prop: row.trade },
              { label: this.$t(`tenant.linkman`), prop: row.linkman },
              {
                label: this.$t(`tenant.contactNumber`),
                prop: row.contactNumber
              },
              { label: "address", prop: row.address },
              { label: "email", prop: row.email },
              { label: this.$t(`tenant.legalPerson`), prop: row.legalPerson },
              { label: this.$t(`tenant.scooters`), prop: row.scooters },
              { label: this.$t(`tenant.users`), prop: row.users },
              {
                label: this.$t(`tenant.approveStatus`),
                prop: row.approveStatus
              },
              {
                label: this.$t(`tenant.tenantStatus`),
                prop:
                  row.tenantStatus == "0"
                    ? this.$t(`battery.Normal`)
                    : this.$t(`teant.Frozen`)
              }
            ]
          }
        ]
      };
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
    goimportxls() {
      importxls().then(response => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "导出客户数据列表.xls";
        link.click();
      });
    },
    delscooter() {
      if (this.ids.length > 0) {
        delSccoterList(this.ids).then(() => {
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
    delteant() {
      if (this.ids.length > 0) {
        del(this.ids, "1").then(() => {
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

    userdel() {
      if (this.ids.length > 0) {
        del(this.ids, "0").then(() => {
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

    // getListData(row) {
    // getChaList(row.stationCode).then(res => {
    //     this.chaData = res.data.data;
    //   });
    // this.chaTableVisible=true;
    // },

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
          return remove(row.tenantId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
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
        console.log(this.form.tenantId);
        getDetail(this.form.tenantId).then(res => {
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
