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
                   v-if="permission.subscribe_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_subscribe/subscribe";
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
            // {
            //   label: "预约id",
            //   prop: "subscribeId",
            //   rules: [{
            //     required: true,
            //     message: "请输入预约id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "充电柜编号",
              prop: "stationName",
              rules: [{
                required: true,
                message: "请输入充电柜id",
                trigger: "blur"
              }]
            },

            
            {
              label: "预约用户",
              prop: "userName",
              rules: [{
                required: true,
                message: "请输入预约用户id",
                trigger: "blur"
              }]
            },
            {
              label: "电池",
              prop: "batteryName",
              rules: [{
                required: true,
                message: "请输入电池id",
                trigger: "blur"
              }]
            },
            {
              label: "充电仓编号",
              prop: "warehouse",
              rules: [{
                required: true,
                message: "请输入充电仓编号",
                trigger: "blur"
              }]
            },
            {
              label: "发起预约时间",
              prop: "subscribeTime",
              rules: [{
                required: true,
                message: "请输入发起预约时间",
                trigger: "blur"
              }]
            },
            {
              label: "预约成功时间",
              prop: "succeedTime",
              rules: [{
                required: true,
                message: "请输入预约成功时间",
                trigger: "blur"
              }]
            },
            {
              label: "有效时间 分钟",
              prop: "effectiveTime",
              rules: [{
                required: true,
                message: "请输入有效时间 分钟",
                trigger: "blur"
              }]
            },
            {
              label: "预约状态 ",
              prop: "subscribeState",
              type:'select',
              dicData:[
                {
                  label:'预约中',
                  value:'0'
                },{
                  label:'预约成功',
                  value:'1'
                },{
                  label:'预约失败',
                  value:'2'
                },{
                  label:'已过期',
                  value:'3'
                },{
                  label:'已取电池',
                  value:'4'
                }],
              rules: [{
                required: true,
                message: "请输入预约状态 0：预约中  1：预约成功  2.预约失败   3：已过期；4：已取电池",
                trigger: "blur"
              }]
            // },
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
          addBtn: this.vaildData(this.permission.subscribe_add, false),
          viewBtn: this.vaildData(this.permission.subscribe_view, false),
          delBtn: this.vaildData(this.permission.subscribe_delete, false),
          editBtn: this.vaildData(this.permission.subscribe_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.subscribeId);
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
            return remove(row.subscribeId);
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
          getDetail(this.form.subscribeId).then(res => {
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
