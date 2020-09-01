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
          v-if="permission.solution_delete"
          @click="handleDelete"
        ></el-button>
      </template>
      <!-- <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">{{$t(`chakan`)}}</el-button>
      </template> -->
    </avue-crud>
    <el-dialog title="view" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
      <div ref="form" :model="rowItem">
        <div v-for="item in rowItem.item" :key="item.id" :title="item.title" class="item">
          <div class="title">{{item.title}}</div>
          <div v-for="column in item.column" :key="column.label" style="width:33%;float:left">
            <label class="label" v-if="column.label!=null" >{{column.label}}：</label>
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
} from "@/api/swap_solution/solution";
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
        viewBtn: true,
        selection: true,
        column: [
          {
            label: "主键id",
            prop: "faultId",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入主键id",
                trigger: "blur"
              }
            ]
          },
          {
            label:this.$t('faultCode'),
            prop: "faultCode",
            rules: [
              {
                required: true,
                message: "请输入故障编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`faultType`),
            prop: "faultType",
            type: "select",
            dicData: [
              {
                label: this.$t(`solution.electricVehicle`),
                value: "1"
              },
              {
                label: this.$t(`solution.battery`),
                value: "2"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入故障类型1：电动车  2：电池",
                trigger: "blur"
              }
            ]
          },
          {
            label: "faultKey",
            prop: "faultKey",
            rules: [
              {
                required: true,
                message: "请输入故障代码",
                trigger: "blur"
              }
            ]
          },
          {
            label: "faultValue",
            prop: "faultValue",
            rules: [
              {
                required: true,
                message: "请输入故障值",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`solution.faultName`),
            prop: "faultName",
            rules: [
              {
                required: true,
                message: "请输入故障名称",
                trigger: "blur"
              }
            ]
          },
          {
            label:this.$t(`solution.Solution`),
            prop: "faultSolution",
            rules: [
              {
                required: true,
                message: "请输入解决方案",
                trigger: "blur"
              }
            ]

          },
          {
            label: this.$t(`solution.creator`),
            prop: "createUser",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入创建人",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`solution.createdTime`),
            prop: "createTime",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`solution.updatePeople`),
            prop: "updateUser",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入更新人",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`solution.updateTime`),
            prop: "updateTime",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入更新时间",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.solution_add, false),
        viewBtn: this.vaildData(this.permission.solution_view, false),
        delBtn: this.vaildData(this.permission.solution_delete, false),
        editBtn: this.vaildData(this.permission.solution_edit, false)
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
      this.dialogViewVisible = true;
      this.rowItem = {
        item: [
          {
            title: this.$t(`solution.faultInformation`),
            column: [
              { label: this.$t(`solution.faultNum`), prop: row.faultCode },
              {
                label: this.$t(`solution.faultType`),
                prop: row.faultType == "1" ? this.$t(`solution.electricVehicle`) : this.$t(`solution.battery`)
              },
              { label: this.$t(`solution.faultCode`), prop: row.faultKey },
              { label: this.$t(`solution.failureValue`), prop: row.faultValue },
              { label: this.$t(`solution.faultName`), prop: row.faultName },
              // { label: this.$t(`solution.Solution`), prop: row.faultSolution },
              { label: this.$t(`solution.creator`), prop: row.createUser },
              { label: this.$t(`solution.createdTime`), prop: row.createTime },
              { label: this.$t(`solution.updatePeople`), prop: row.updateUser },
              { label: this.$t(`solution.updateTime`), prop: row.updateTime }
            ]
          },
          {
            title: this.$t(`solution.Solution`),
            column: [{  prop: row.faultSolution }]
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
