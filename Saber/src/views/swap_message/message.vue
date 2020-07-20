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
                   @click="handleDelete">批量删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_message/message";
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
            //   label: "公告ID",
            //   prop: "messageId",
            //   rules: [{
            //     required: true,
            //     message: "请输入公告ID",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "公告标题",
              prop: "messageTitle",
              search:true,
              rules: [{
                required: true,
                message: "请输入公告标题",
                trigger: "blur"
              }]
            },
            {
              label: "公告类型",
              prop: "messageType",
              type:'select',
              valueDefault:'0',
              valeDefault:'1',
              dicData:[
                {
                  label:'通知',
                  value:'1'
                },{
                  label:'公告',
                  value:'2'
                }],
              rules: [{
                required: false,
                message: "请输入公告类型",
                trigger: "blur"
              }]
            },
            // {
            //   label: "公告内容",
            //   prop: "messageContent",
            //   rules: [{
            //     required: false,
            //     message: "请输入公告内容",
            //     trigger: "blur"
            //   }]
            // },
               {
      label:'公告内容',
      prop:'messageContent',
      component: "ueditor",
      options:{
            //普通图片上传
            action: "https://avuejs.com/upload",
            props: {
              res: "data",
              url:'url'
            },

          }
          }
            ,{
              label: "公告状态",
              prop: "status",
              type:'select',
              valueDefault:'0',
              dicData:[
                {
                  label:'正常',
                  value:'0'
                },{
                  label:'关闭',
                  value:'1'
                }
              ],
              rules: [{
                required: false,
                message: "请输入公告状态 （0正常 1关闭）",
                trigger: "blur"
              }]
            },
            {
              label: "发布人",
              prop: "publisher",
              rules: [{
                required: false,
                message: "请输入发布人",
                trigger: "blur"
              }]
            },
            {
              label: "推送方式 ",
              prop: "pushService",
              type:'select',
              dicData:[
                {
                  label:'无',
                  value:'0'
                },{
                  label:'状态栏',
                  value:'1'
                },{
                  label:'锁屏',
                  value:'2'
                },{
                  label:'横幅通知',
                  value:'3'
                },{
                  label:'短信',
                  value:'4'
                }
              ],
              valueDefault:'0',
              rules: [{
                required: true,
                message: "请选择推送方式",
                trigger: "blur"
              }]
            },
            {
              label: "推送结果 ",
              prop: "pushResult",
              display:false,
              rules: [{
                required: false,
                message: "请输入推送结果 0.成功1失败",
                trigger: "blur"
              }]
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
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          // addBtn: this.vaildData(this.permission.message_add, false),
          // viewBtn: this.vaildData(this.permission.message_view, false),
          // delBtn: this.vaildData(this.permission.message_delete, false),
          // editBtn: this.vaildData(this.permission.message_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.messageId);
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
            return remove(row.messageId);
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
          getDetail(this.form.messageId).then(res => {
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
