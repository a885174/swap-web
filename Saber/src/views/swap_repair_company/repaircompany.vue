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
        <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">{{$t(`delete`)}}</el-button>
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>
    <el-dialog title="view" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
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
        <el-button type="primary" @click="dialogViewVisible = false">Back </el-button>
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
  remove
} from "@/api/swap_repair_company/repaircompany";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogViewVisible: false,
      rowItem: {},
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
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label:this.$t(`repaircompany.comId`),
            prop: "comId",
            editDisabled:true,
            editDisplay:false,
            addDisabled:true,
            addDisplay:false,
            rules: [{
              required: true,
              message: "请输入维修商id",
              trigger: "blur"
            }]
          },
          {
            label: this.$t(`repaircompany.comName`),
            prop: "comName",
            rules: [
              {
                required: true,
                message: "请输入维修商名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.linkman`),
            prop: "linkman",
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`)+this.$t(`supplier.linkman`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`suppliercontactNumber`),
            prop: "contactNumber",
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`)+this.$t(`suppliercontactNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`repaircompany.legalRepresentative`),
            prop: "legalPerson",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入法律代表",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`repaircompany.Industrial`),
            prop: "filingStatus",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入工商备案 0:有1:无2:未知",
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
                message: this.$t(`scooter.please`)+this.$t(`store.address`),
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "创建人",
          //   prop: "createUser",
          //   rules: [{
          //     required: true,
          //     message: "请输入创建人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "创建时间",
          //   prop: "createTime",
          //   rules: [{
          //     required: true,
          //     message: "请输入创建时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新人",
          //   prop: "updateUser",
          //   rules: [{
          //     required: true,
          //     message: "请输入更新人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新时间",
          //   prop: "updateTime",
          //   rules: [{
          //     required: true,
          //     message: "请输入更新时间",
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
        // addBtn: this.vaildData(this.permission.repaircompany_add, false),
        // viewBtn: this.vaildData(this.permission.repaircompany_view, false),
        // delBtn: this.vaildData(this.permission.repaircompany_delete, false),
        // editBtn: this.vaildData(this.permission.repaircompany_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.comId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      this.dialogViewVisible = true;
      this.rowItem = {
        item: [
          {
            title: this.$t(`repaircompany.repairerInformation`),
            column: [
              { label: this.$t(`repaircompany.comName`), prop: row.comName },
              { label: this.$t(`supplier.linkman`), prop: row.linkman },
              { label: this.$t(`supplier.contactNumber`), prop: row.contactNumber },
              { label: this.$t(`repaircompany.legalRepresentative`), prop: row.legalPerson },
              { label: this.$t(`repaircompany.Industrial`), prop: row.filingStatus },
              { label: "address", prop: row.address },
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
          return remove(row.comId);
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
        getDetail(this.form.comId).then(res => {
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
