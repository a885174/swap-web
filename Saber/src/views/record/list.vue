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
        <!-- <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button> -->
        
          <!-- <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     @click.stop="goimportxls()">导出</el-button> -->
                <!-- <el-button >批量导入</el-button> -->
      </template>
      
          
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,importxls} from "@/api/swap_record/record";
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
          viewBtn: false,
          selection: true,
          menu:false,
          addBtn:false,
            excelBtn:true,
          column: [
            {
              label: "记录id",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              hide:true,
              addDisplay:false,
              prop: "recordId",
              rules: [{
                required: true,
                message: "请输入记录id",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.recordNumber`),
              prop: "recordNumber",
              search:true,
              rules: [{
                required: true,
                message: "请输入记录编号",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.userName`),
              prop: "userName",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: true,
                message: "请输入用户id",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.scooterCode`),
              prop: "scooterCode",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: true,
                message: "请输入电动车id",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.batteryCode`),
              prop: "batteryCode",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: true,
                message: "请输入电池id",
                trigger: "blur"
              }]

            },
            {
              label:this.$t(`recorde.stationCode`),
              prop: "stationCode",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: true,
                message: "请输入换电柜id",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.warehouseCode`),
              prop: "warehouseCode",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              hid:true,
              rules: [{
                required: true,
                message: "请输入充电仓id",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.orderTimeS`),
              prop: "orderTimeS",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              type: "date",
              
              rules: [{
                required: true,
                message: "请输入订单开始时间",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`record.orderTimeE`),
              prop: "orderTimeE",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              type: "date",
              rules: [{
                required: true,
                message: "请输入订单结束时间",
                trigger: "blur"
              }]
            },
            {
              label:this.$t('record.orderStatus'),
              seach:true,
              prop: "orderStatus",
              type:'select',
              dicData:[
                {
                  label:'进行中',
                  value:'0'
                },{
                  label:'结束',
                  value:'1'
                }
              ],
              rules: [{
                required: true,
                message: "请输入订单状态 ",
                trigger: "blur"
              }]
            },
            {
              label: "创建人",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              prop: "createUser",
              hide:true,
              rules: [{
                required: true,
                message: "请输入创建人",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
               editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              hide:true,
              rules: [{
                required: false,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "更新人",
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              hide:true,
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
              hide:true,
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
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
         addBtn: this.vaildData(this.permission.record_add, false),
          viewBtn: this.vaildData(this.permission.record_view, false),
          delBtn: this.vaildData(this.permission.record_delete, false),
          editBtn: this.vaildData(this.permission.record_edit, false)
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

       goimportxls(){
        importxls().then((response) => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: 'application/x-xls' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        //配置下载的文件名
        link.download = '导出数据列表.xls'
        link.click()
  });},

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
              message: "success!"
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
              message: "success!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.recordId).then(res => {
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
