<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
                   v-if="permission.role_delete"
                   plain
                      @click="handleDelete">{{$t(`delete`)}}
        </el-button>
        <el-button size="small"
                   icon="el-icon-delete"
                   @click="handleRole"
                   plain>Permission settings
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="Role configuration"
               :visible.sync="box"
               width="20%">
      <el-tree :data="list"
               show-checkbox
               node-key="id"
               ref="tree"
               :default-checked-keys="defaultObj"
               :props="props">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">{{$t(`cancelText`)}}</el-button>
        <el-button type="primary"
                   @click="submit">{{$t(`submitText`)}}</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {add, getList, getRole, getRoleTree, grant, grantTree, remove, update} from "@/api/system/role";
  import {mapGetters} from "vuex";
  import website from '@/config/website';

  export default {
  data() {
    return {
      form: {},
      box: false,
      props: {
        label: "title",
        value: "key"
      },
      list: [],
      defaultObj: [],
      selectionList: [],
      query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
      option: {
        tip: false,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        dialogWidth: 300,
        dialogHeight: 400,
        column: [
          {
            label: "roleName",
            prop: "roleName",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入roleName",
                trigger: "blur"
              }
            ]
          },
          {
            label: "Teant Group",
            prop: "tenantId",
            type: "tree",
            dicUrl: "/api/blade-system/tenant/select",
            addDisplay: false,
            // editDisplay: false,
            viewDisplay: website.tenantMode,
            span: 24,
            props: {
              label: "tenantName",
              value: "tenantId"
            },
            hide: !website.tenantMode,
            search: website.tenantMode,
            rules: [{
              required: true,
              message: "请输入所属租户",
              trigger: "click"
            }]
          },
          {
            label: "roleAlias",
            prop: "roleAlias",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入角色别名",
                trigger: "blur"
              }
            ]
          },
          {
            label: "Superior department ",
            prop: "parentId",
            dicData: [],
            type: "tree",
            hide: true,
            span: 24,
            props: {
              label: "title"
            },
            rules: [
              {
                required: false,
                message: "请选择上级角色",
                trigger: "click"
              }
            ]
          },
          {
            label: "sort",
            prop: "sort",
            type: "number",
            span: 24,
            rules: [
              {
                required: true,
                message: "sort",
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
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false)
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
    submit() {
      const menuLIst = this.$refs.tree.getCheckedKeys().join(",");
      grant(this.ids, menuLIst).then(() => {
        this.box = false;
        this.$message({
          type: "success",
          message: "success!"
        });
        this.onLoad(this.page);
      });
    },
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
        this.onLoad(this.page);
        loading();
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
    handleRole() {
      if (this.selectionList.length !== 1) {
        this.$message.warning("只能选择一条数据");
        return;
      }
      this.defaultObj = [];
      grantTree()
        .then(res => {
          this.list = res.data.data;
          return getRole(this.ids);
        })
        .then(res => {
          this.defaultObj = res.data.data;
          this.box = true;
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
    currentChange(currentPage){
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        this.data = res.data.data;
        getRoleTree().then(res => {
          const data = res.data.data;
          const index = this.$refs.crud.findColumnIndex("parentId");
          this.option.column[index].dicData = data;
        });
      });
    }
  }
};
</script>

<style>
</style>
