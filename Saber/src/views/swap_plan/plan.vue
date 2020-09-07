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
        <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete">{{`delete`}}</el-button>

        <template>
          <el-button @click.stop="delteant">{{$t(`plan.takeOff`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`plan.sale`)}}</el-button>
        </template>
      </template>

      <template slot-scope="{row}" slot="planStatus">
        <label :style="{color:row.planStatus=='0'?'green':'red'}">{{row.planStatus=="0"?"Sale":"Take Off"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
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
  remove,
  del
} from "@/api/swap_plan/plan";
import { mapGetters } from "vuex";

// const validateNumber = (rule, value, callback) => {
//   if (value < 0 || value > 100) {
//     callback(new Error(this.$t(`plan.lessHundred`)));
//   } else {
//     callback();
//   }
// };

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
        excelBtn: true,
        align: "center",
        column: [
          // {
          //   label: "套餐id",
          //   prop: "planId",
          //   rules: [{
          //     required: true,
          //     message: "请输入套餐id",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`plan.planName`),
            prop: "planName",
            search: true,
            rules: [
              {
                required: true,
                message: this.$t(`scooter.please`)+this.$t(`plan.planName`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`plan.price`),
            prop: "price",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`)+this.$t(`plan.price`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`plan.distanceSum`),
            prop: "distanceSum",
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`)+ this.$t(`plan.distanceSum`),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "折扣(%) ",
          //   prop: "discount",
          //   type: "number",
          //   valueDefault: 100,
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入折扣",
          //       validator: validateNumber,

          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t(`plan.ailableTime`),
            prop: "ailableTime",
            type: "number",
            valueDefault: 0,
            rules: [
              {
                required: true,
                message: this.$t(`scooter.please`)+this.$t(`plan.ailableTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`plan.planStatus`),
            prop: "planStatus",
            type: "select",
            valueDefault: "1",
            slot: true,
            dicData: [
              {
                label: this.$t(`plan.sale`),
                value: "0"
              },
              {
                label: this.$t(`plan.takeOff`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`scooter.please`)+this.$t(`plan.planStatus`),
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
          //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "删除标志 （0代表存在 1代表删除）",
          //   prop: "delFlag",
          //   rules: [{
          //     required: true,
          //     message: "请输入删除标志 （0代表存在 1代表删除）",
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
        // addBtn: this.vaildData(this.permission.plan_add, false),
        // viewBtn: this.vaildData(this.permission.plan_view, false),
        // delBtn: this.vaildData(this.permission.plan_delete, false),
        // editBtn: this.vaildData(this.permission.plan_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.planId);
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
            title: "Detail",
            column: [
              // { label: "套餐id", prop: row.planId },
              { label: this.$t(`plan.planName`), prop: row.planName },
              { label: this.$t(`plan.price`), prop: row.price },
              { label: this.$t(`plan.distanceSum`), prop: row.distanceSum },
              // { label: "折扣(%)", prop: row.discount },
              { label: this.$t(`plan.ailableTime`), prop: row.ailableTime },
              { label: this.$t(`plan.planStatus`), prop: row.planStatus=="0"?this.$t(`plan.sale`):this.$t(`plan.takeOff`) },
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
          return remove(row.planId);
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
        getDetail(this.form.planId).then(res => {
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
