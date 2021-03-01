<template>
  <div>
    <basic-container>
      <div class="info">
        <p>
          <span class="title">Amount：</span> Rp
          <span class="bold">{{amount}}</span>
        </p>
        <p>
          <span class="title">Quantity of electricity：</span>
          <span class="bold">{{electricity}}</span>&nbsp;&nbsp;&nbsp; Kwh
        </p>
        <p>
          <span class="title">Time：</span>{{startdate}} ~ {{enddate}}
        </p>
      </div>
    </basic-container>
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
        <!-- <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
        </template>-->
        <!-- <template slot-scope="{row}" slot="menu">
        <el-button
          type="text"
          icon="el-icon-view"
          size="small"
          @click.stop="rowView(row)"
        >{{$t(`chakan`)}}</el-button>
        </template>-->
      </avue-crud>
      <el-dialog
        title="view"
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
  </div>
</template>

<script>
import {
  getDetail,
  add,
  update,
  getstaEleList,
  stationElectricitySum,
  remove
} from "@/api/swap_station/station";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogViewVisible: false,
      rowItem: {},
      startdate:"",
      enddate:"",
      amount:"",
      electricity:"",
      form: {},
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
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        selection: true,
        menu: false,
        align: "center",
        column: [
          {
            label: "Amount",
            prop: "amount",
            rules: [
              {
                required: true,
                message: "请输入版本号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "quantity of electricity",
            prop: "electricity_read",
            rules: [
              {
                required: true,
                message: "请输入版本号",
                trigger: "blur"
              }
            ]
          },
          {
            label:"Start Time",
            prop: "startdate",
            rules: [
              {
                required: true,
                message: "请输入更新日志",
                trigger: "blur"
              }
            ]
          },
          {
            label:"End Time",
            prop: "enddate",
            // rules: [
            //   {
            //     required: true,
            //     message:
            //       this.$t(`scooter.please`) + this.$t(`AppVseroin.updatedTime`),
            //     trigger: "blur"
            //   }
            // ]
          }
        ]
      },
      data: []
    };
  },
    created() {
    this.getSum();
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.appversoin_add, false),
        viewBtn: this.vaildData(this.permission.appversoin_view, false),
        delBtn: this.vaildData(this.permission.appversoin_delete, false),
        editBtn: this.vaildData(this.permission.appversoin_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      getDetail(row.id).then(res => {
        var data = res.data.data;
        this.dialogViewVisible = true;
        this.rowItem = {
          item: [
            {
              title: this.$t(`AppVseroin.versionInformation`),
              column: [
                { label: this.$t(`AppVseroin.versionId`), prop: data.id },
                { label: this.$t(`AppVseroin.appVersoin`), prop: data.versoin },
                {
                  label: this.$t(`AppVseroin.whetherToForceUpdate`),
                  prop:
                    data.isForcedUpdate == "0"
                      ? this.$t(`AppVseroin.yes`)
                      : this.$t(`AppVseroin.no`)
                },
                { label: this.$t(`AppVseroin.apkAddress`), prop: data.apkUrl },
                {
                  label: this.$t(`AppVseroin.updateLog`),
                  prop: data.versoinLog
                },
                {
                  label: this.$t(`AppVseroin.updatedTime`),
                  prop: data.updateTime
                }
              ]
            }
          ]
        };
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
          return remove(row.id);
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
        getDetail(this.form.id).then(res => {
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
      // this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    getSum(){
      stationElectricitySum().then(res =>{
        const data = res.data.data;
        this.startdate = data.startdate;
        this.enddate = data.enddate;
        this.electricity=data.electricity_read;
        this.amount = data.amount;

      });
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getstaEleList(
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

.info {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  text-align: center;
  line-height: 48px;
}
.info .title {
  font-weight: 700;
}
.info .bold {
  font-weight: 700;
  font-size: 36px;
}
</style>
