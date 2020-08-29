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
                   v-if="permission.station_delete"
                      @click="handleDelete">{{$t(`delete`)}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_station/station";
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
              label: "换电柜ID",
              prop: "stationId",
              rules: [{
                required: true,
                message: "请输入换电柜ID",
                trigger: "blur"
              }]
            },
            {
              label:this.$t(`station.stationCode`),
              prop: "stationCode",
              rules: [{
                required: true,
                message: "请输入换电柜编号（UID）",
                trigger: "blur"
              }]
            },
            {
              label: "换电柜型号",
              prop: "stationModel",
              rules: [{
                required: true,
                message: "请输入换电柜型号",
                trigger: "blur"
              }]
            },
            {
              label: "设备IMEI码",
              prop: "imei",
              rules: [{
                required: true,
                message: "请输入设备IMEI码",
                trigger: "blur"
              }]
            },
            {
              label: "充电仓数",
              prop: "warehouseNumber",
              rules: [{
                required: true,
                message: "请输入充电仓数",
                trigger: "blur"
              }]
            },
            {
              label: "店铺id",
              prop: "storeId",
              rules: [{
                required: true,
                message: "请输入店铺id",
                trigger: "blur"
              }]
            },
            {
              label: "电表实时读数",
              prop: "ammeterValue",
              rules: [{
                required: true,
                message: "请输入电表实时读数",
                trigger: "blur"
              }]
            },
            {
              label: "读数时间",
              prop: "ammeterTime",
              rules: [{
                required: true,
                message: "请输入读数时间",
                trigger: "blur"
              }]
            },
            {
              label: "营业开始时间",
              prop: "businessTimeS",
              rules: [{
                required: true,
                message: "请输入营业开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "营业结束时间",
              prop: "businessTimeE",
              rules: [{
                required: true,
                message: "请输入营业结束时间",
                trigger: "blur"
              }]
            },
            {
              label: "地址",
              prop: "address",
              rules: [{
                required: true,
                message: "请输入地址",
                trigger: "blur"
              }]
            },
            {
              label: "换电柜状态 数据字典",
              prop: "stationStatus",
              rules: [{
                required: true,
                message: "请输入换电柜状态 数据字典",
                trigger: "blur"
              }]
            },
            {
              label: "定位状态 0:已定位 1:未定位",
              prop: "locationStatus",
              rules: [{
                required: true,
                message: "请输入定位状态 0:已定位 1:未定位",
                trigger: "blur"
              }]
            },
            {
              label: "连接状态 0:已连接 1:未连接",
              prop: "connectStatus",
              rules: [{
                required: true,
                message: "请输入连接状态 0:已连接 1:未连接",
                trigger: "blur"
              }]
            },
            {
              label: "保质期(年)",
              prop: "expirationDate",
              rules: [{
                required: true,
                message: "请输入保质期(年)",
                trigger: "blur"
              }]
            },
            {
              label: "供应商id",
              prop: "supplierId",
              rules: [{
                required: true,
                message: "请输入供应商id",
                trigger: "blur"
              }]
            },
            {
              label: "出厂时间",
              prop: "produceTime",
              rules: [{
                required: true,
                message: "请输入出厂时间",
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
            {
              label: "备注",
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "删除标识 0代表存在 1代表删除",
              prop: "delFlag",
              rules: [{
                required: true,
                message: "请输入删除标识 0代表存在 1代表删除",
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
          addBtn: this.vaildData(this.permission.station_add, false),
          viewBtn: this.vaildData(this.permission.station_view, false),
          delBtn: this.vaildData(this.permission.station_delete, false),
          editBtn: this.vaildData(this.permission.station_edit, false)
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
