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
        <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>

        <template>
          <el-button @click.stop="delteant">下架</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">上架</el-button>
        </template>
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
  update,
  remove,
  del
} from "@/api/swap_plan/plan";
import { mapGetters } from "vuex";

const validateNumber = (rule, value, callback) => {
  if (value < 0 || value > 100) {
    callback(new Error("请输入大于0或小宇于100的数字"));
  } else {
    callback();
  }
};

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
            label: "套餐名",
            prop: "planName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入套餐名",
                trigger: "blur"
              }
            ]
          },
          {
            label: "售价(元)",
            prop: "price",
            rules: [
              {
                required: false,
                message: "请输入售价 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐里程数(千米)",
            prop: "distanceSum",
            rules: [
              {
                required: false,
                message: "请输入套餐里程数 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: "折扣(%) ",
            prop: "discount",
            type: "number",
            valueDefault: 100,
            rules: [
              {
                required: false,
                message: "请输入折扣",
                validator: validateNumber,

                trigger: "blur"
              }
            ]
          },
          {
            label: "使用时间(天数)",
            prop: "ailableTime",
            type: "number",
            valueDefault: 0,
            rules: [
              {
                required: true,
                message: "请输入使用时间 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐状态",
            prop: "planStatus",
            type: "select",
            valueDefault: "1",
            dicData: [
              {
                label: "上架",
                value: "0"
              },
              {
                label: "下架",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入套餐状态",
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
            title: "套餐信息",
            column: [
              { label: "套餐id", prop: row.planId },
              { label: "套餐名", prop: row.planName },
              { label: "售价(元)", prop: row.price },
              { label: "套餐里程数(千米)", prop: row.distanceSum },
              { label: "折扣(%)", prop: row.discount },
              { label: "使用时间(天数)", prop: row.ailableTime },
              { label: "套餐状态", prop: row.planStatus=="0"?"上架":"下架" },
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
            message: "操作成功!"
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

    userdel() {
      if (this.ids.length > 0) {
        del(this.ids, "0").then(() => {
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
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.planId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
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
