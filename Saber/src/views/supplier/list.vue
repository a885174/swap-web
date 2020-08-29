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
        <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">{{$t(`delete  `)}}</el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click="rowView(scope.row)">{{$t(`chakan`)}}</el-button>
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
  update,
  remove
} from "@/api/swap_supplier/supplier";
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
        excelBtn: true,
        border: true,
        index: true,
        viewBtn: false,
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: "供应商id",
            prop: "supplierId",
            hide:true,
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
            label: this.$t(`supplier.supplierName`),
            prop: "supplierName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入供应商名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.type`),
            prop: "supplierType",
            type: "select",
            valueDefault: "1",
            search: true,
            dicData: [
              {
                label: "电动车供应商",
                value: "1"
              },
              {
                label: "换电柜供应商",
                value: "2"
              },
              {
                label: "电池供应商",
                value: "3"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入供应商类型 ",
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
                message: "请输入主要联系人",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.contactNumber`),
            prop: "contactNumber",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入联系电话",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.address`),
            prop: "address",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入地址",
                trigger: "blur"
              }
            ]
          },
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
          // {
          //   label: "备注",
          //   prop: "remark",
          //   hide: true,
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入备注",
          //       trigger: "blur"
          //     }
          //   ]
          // }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.supplier_add, false),
        viewBtn: this.vaildData(this.permission.supplier_view, false)
        // delBtn: this.vaildData(this.permission.supplier_delete, false),
        // editBtn: this.vaildData(this.permission.supplier_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.supplierId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      this.dialogViewVisible = true;
      console.log(row);
      var supplierType;
      switch (row.supplierType) {
        case "1":
          supplierType = "电动车供应商";
          break;
        case "2":
          supplierType = "换电柜供应商";
          break;
        case "3":
          supplierType = "电池供应商";
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "Suppllier Info  ",
            column: [
              // { label: "供应商id", prop: row.supplierId },
              { label: this.$t(`supplier.supplierName`), prop: row.supplierName },
              { label: this.$t(`supplier.type`), prop: supplierType },
              { label: this.$t(`store.linkman`), prop: row.linkman },
              { label: this.$t(`store.contactNumber`), prop: row.contactNumber },
              { label: "address", prop: row.address }
            ]
          }
        ],
        fullItem: [
          // {
          //   title: "备注",
          //   prop: row.remark
          // }
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
          return remove(row.supplierId);
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
        getDetail(this.form.supplierId).then(res => {
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
