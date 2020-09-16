<template>
  <basic-container>
    <avue-crud :option="option"
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
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.updaterecord_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_update_record/updaterecord";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
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
              label: "主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "升级包id",
              prop: "patchId",
              rules: [{
                required: true,
                message: "请输入升级包id",
                trigger: "blur"
              }]
            },
            {
              label: "升级包类型 0:BMS 1:电动车  2:换电柜",
              prop: "patchType",
              rules: [{
                required: true,
                message: "请输入升级包类型 0:BMS 1:电动车  2:换电柜",
                trigger: "blur"
              }]
            },
            {
              label: "升级包地址",
              prop: "patchUrl",
              rules: [{
                required: true,
                message: "请输入升级包地址",
                trigger: "blur"
              }]
            },
            {
              label: "版本号",
              prop: "versionNumber",
              rules: [{
                required: true,
                message: "请输入版本号",
                trigger: "blur"
              }]
            },
            {
              label: "终端id",
              prop: "deviceId",
              rules: [{
                required: true,
                message: "请输入终端id",
                trigger: "blur"
              }]
            },
            {
              label: "终端编码",
              prop: "deviceCode",
              rules: [{
                required: true,
                message: "请输入终端编码",
                trigger: "blur"
              }]
            },
            {
              label: "升级状态 0 升级中  1 升级完成  2升级失败 3待升级",
              prop: "updateStatus",
              rules: [{
                required: true,
                message: "请输入升级状态 0 升级中  1 升级完成  2升级失败 3待升级",
                trigger: "blur"
              }]
            },
            {
              label: "创建人",
              prop: "createUser",
              rules: [{
                required: true,
                message: "请输入创建人",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "更新人",
              prop: "updateUser",
              rules: [{
                required: true,
                message: "请输入更新人",
                trigger: "blur"
              }]
            },
            {
              label: "更新时间",
              prop: "updateTime",
              rules: [{
                required: true,
                message: "请输入更新时间",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.updaterecord_add, false),
          viewBtn: this.vaildData(this.permission.updaterecord_view, false),
          delBtn: this.vaildData(this.permission.updaterecord_delete, false),
          editBtn: this.vaildData(this.permission.updaterecord_edit, false)
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
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
</style>
