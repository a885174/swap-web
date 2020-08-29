<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
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
                   v-if="permission.menu_delete"
                   plain
                   @click="handleDelete">{{$t(`delete`)}}
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="source">
        <div style="text-align:center">
          <i :class="row.source"></i>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {add, getList, getMenu, remove, update} from "@/api/system/menu";
  import {mapGetters} from "vuex";
  import iconList from "@/config/iconList";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          tip: false,
          dialogWidth: "60%",
          tree: true,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          column: [
            {
              label: "name",
              prop: "name",
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入name",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "path",
              prop: "path",
              rules: [
                {
                  required: true,
                  message: "请输入path",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "paren Menu",
              prop: "parentId",
              type: "tree",
              dicUrl: "/api/blade-system/menu/tree",
              hide: true,
              props: {
                label: "title"
              },
              rules: [
                {
                  required: false,
                  message: "请选择上级菜单",
                  trigger: "click"
                }
              ]
            },
            {
              label: "icon",
              prop: "source",
              type: "icon-select",
              slot: true,
              iconList: iconList,
              rules: [
                {
                  required: true,
                  message: "请输入icon",
                  trigger: "click"
                }
              ]
            },
            {
              label: "code",
              prop: "code",
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入code",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "category",
              prop: "category",
              type: "radio",
              dicData: [
                {
                  label: "menu",
                  value: 1
                },
                {
                  label: "button",
                  value: 2
                }
              ],
              hide: true,
              rules: [
                {
                  required: true,
                  message: "请选择菜单类型",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "alias",
              prop: "alias",
              rules: [
                {
                  required: true,
                  message: "请输入menu alias",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "ButtonType",
              prop: "action",
              type: "radio",
              dicData: [
                {
                  label: "Toolbar ",
                  value: 0
                },
                {
                  label: "operation",
                  value: 1
                },
                {
                  label: "Toolbar operation",
                  value: 2
                }
              ],
              hide: true,
              rules: [
                {
                  required: true,
                  message: "请选择按钮功能",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "sort",
              prop: "sort",
              type: "number",
              rules: [
                {
                  required: true,
                  message: "请输入sort",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "isOpen",
              prop: "isOpen",
              type: "radio",
              dicData: [
                {
                  label: "NO",
                  value: 0
                },
                {
                  label: "YES",
                  value: 1
                },
              ],
              hide: true
            },
            {
              label: "remark",
              prop: "remark",
              type: "textarea",
              span: 24,
              minRows: 6,
              hide: true
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
          addBtn: this.vaildData(this.permission.menu_add, false),
          viewBtn: this.vaildData(this.permission.menu_view, false),
          delBtn: this.vaildData(this.permission.menu_delete, false),
          editBtn: this.vaildData(this.permission.menu_edit, false)
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
          getMenu(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
        });
      }
    }
  };
</script>

<style>
</style>
