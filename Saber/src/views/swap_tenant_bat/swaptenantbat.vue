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
                   v-if="permission.swaptenantbat_delete"
                      @click="handleDelete">{{$t(`delete`)}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_tenant_bat/swaptenantbat";
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
              label: "父客户id",
              prop: "parentId",
              rules: [{
                required: true,
                message: "请输入父客户id",
                trigger: "blur"
              }]
            },
            {
              label: "客户名称",
              prop: "tenantName",
              rules: [{
                required: true,
                message: "请输入客户名称",
                trigger: "blur"
              }]
            },
            {
              label: "显示顺序",
              prop: "orderNum",
              rules: [{
                required: true,
                message: "请输入显示顺序",
                trigger: "blur"
              }]
            },
            {
              label: "地区",
              prop: "area",
              rules: [{
                required: true,
                message: "请输入地区",
                trigger: "blur"
              }]
            },
            {
              label: "行业",
              prop: "trade",
              rules: [{
                required: true,
                message: "请输入行业",
                trigger: "blur"
              }]
            },
            {
              label: "联系人",
              prop: "linkman",
              rules: [{
                required: true,
                message: "请输入联系人",
                trigger: "blur"
              }]
            },
            {
              label: "联系电话",
              prop: "contactNumber",
              rules: [{
                required: true,
                message: "请输入联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "联系地址",
              prop: "address",
              rules: [{
                required: true,
                message: "请输入联系地址",
                trigger: "blur"
              }]
            },
            {
              label: "邮箱",
              prop: "email",
              rules: [{
                required: true,
                message: "请输入邮箱",
                trigger: "blur"
              }]
            },
            {
              label: "法定代表",
              prop: "legalPerson",
              rules: [{
                required: true,
                message: "请输入法定代表",
                trigger: "blur"
              }]
            },
            {
              label: "工商备案 0:有1:无2:未知",
              prop: "approveStatus",
              rules: [{
                required: true,
                message: "请输入工商备案 0:有1:无2:未知",
                trigger: "blur"
              }]
            },
            {
              label: "客户状态 0正常 1停用",
              prop: "tenantStatus",
              rules: [{
                required: true,
                message: "请输入客户状态 0正常 1停用",
                trigger: "blur"
              }]
            },
            {
              label: "创建者",
              prop: "createUser",
              rules: [{
                required: true,
                message: "请输入创建者",
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
              label: "更新者",
              prop: "updateUser",
              rules: [{
                required: true,
                message: "请输入更新者",
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
            {
              label: "删除标志 0代表存在 1代表删除",
              prop: "delFlag",
              rules: [{
                required: true,
                message: "请输入删除标志 0代表存在 1代表删除",
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
          addBtn: this.vaildData(this.permission.swaptenantbat_add, false),
          viewBtn: this.vaildData(this.permission.swaptenantbat_view, false),
          delBtn: this.vaildData(this.permission.swaptenantbat_delete, false),
          editBtn: this.vaildData(this.permission.swaptenantbat_edit, false)
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
            message: "success!"
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
            message: "success!"
          });
        }, error => {
          done();
          console.log(error);
        });
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
