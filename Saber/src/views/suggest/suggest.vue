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

          <template slot-scope="scope" slot="menu">
    <el-button v-if="scope.row.suggestStatus==='0'" type="text"
                   size="small"
                   icon="el-icon-document-copy" @click="deal(scope.row)"  >处理</el-button>

                   
        <el-dialog
        title="处理意见"
        :visible.sync="centerDialogVisible" :append-to-body="true"
        center>
         <basic-container>
           <avue-form  :option="formoption" v-model="form"  @submit="handleSubmit()"> </avue-form> 
         </basic-container>


      </el-dialog>
                      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,delwith} from "@/api/swap_suggest/suggest";
  import {mapGetters} from "vuex";


  export default {
    
  
    data() {
      return {
        form: {},
        query: {},
        suggestId:'',
        loading: true,
        title:'22',
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
                    centerDialogVisible: false,
            dialogTableVisible:false,
            formoption:{
           column: [
               {
              label: "处理结果",
              prop: "content",
              type:'textarea',
              rules: [{
                required: false,
                message: "请输入订单id",
                trigger: "blur"
              }]
            },
          ]
            },
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          
          column: [
            // {
            //   label: "意见id",
            //   prop: "suggestId",
            //   rules: [{
            //     required: true,
            //     message: "请输入意见id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "用户",
              prop: "userName",
              search:true,
              addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
              rules: [{
                required: false,
                message: "请输入用户id 0代表游客",
                trigger: "blur"
              }]
            },
            {
             prop: 'content', 
              label: this.$t(`suggest.detials`), 
              addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
              rules: [{
                required: false,
                message: "请输入意见内容",
                trigger: "blur"
              }]
            },
            {
              label: "图片",
              prop: "picUrl",
              type:'upload',
              imgWidth:200,
              listType:'picture-img',
              addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
            },
            {
              label: "客户端类型",
              prop: "clientType",
                type:'select',
              dicData:[
                {
                  label:'IOS',
                  value:'1'
                },{
                  label:'Android',
                  value:'2'
                },{
                  label:'其他',
                  value:'3'
                }
              ],
                    addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
              rules: [{
                required: false,
                message: "请输入客户端类型 1.IOS 2.Android. 3.其他",
                trigger: "blur"
              }]
            },
            {
              label: "客户端ip",
              prop: "clientIp",
              addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
              hide:true,
              rules: [{
                required: false,
                message: "请输入客户端ip",
                trigger: "blur"
              }]
            },
            {
              label: "是否匿名",
              prop: "anonymityStatus",
              type:'select',
                    addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
              dicData:[
                {
                  label:'是',
                  value:'1'
                },{
                  label:'否',
                  value:'0'
                }
              ],
              rules: [{
                required: true,
                message: "请输入是否匿名 1：是  0：否",
                trigger: "blur"
              }]
            },
            {
              label: "处理状态",
              prop: "suggestStatus",
                addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
                   dicData:[
                {
                  label:'已处理',
                  value:'1'
                },{
                  label:'未处理',
                  value:'0'
                }
              ],
              rules: [{
                required: false,
                message: "请输入处理状态 1：已处理  0：未处理",
                trigger: "blur"
              }]
            },
            {
              label: "处理结果",
              prop: "result",
              rules: [{
                required: true,
                message: "请输入处理结果",
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
          addBtn: this.vaildData(this.permission.suggest_add, false),
           viewBtn: this.vaildData(this.permission.suggest_view, false),
          delBtn: this.vaildData(this.permission.suggest_delete, false),
           editBtn: this.vaildData(this.permission.suggest_edit, false)
        };
      },
  
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.suggestId);
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
            handleSubmit(){
 
        delwith(this.suggestId,this.$data.form.content).then(() => {
            this.onLoad(this.page);
               this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.centerDialogVisible=false;
          });

      
      },
           deal(row){
             debugger;
        this.suggestId=row.suggestId;
        if(row.suggestStatus=='1'){
            this.$message({
            type: "error",
            message: "已处理过"
          });
          return
        }
      this.centerDialogVisible = true;
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
            return remove(row.suggestId);
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
          getDetail(this.form.suggestId ).then(res => {
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
