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
          v-if="permission.billingorder_delete"
          @click="handleDelete"
        >删 除</el-button>
      </template>

      <template slot-scope="{row}" slot="rentPrice">
        <el-tag>{{row.rentPrice/100}}</el-tag>
      </template>

      <template slot-scope="{row}" slot="electricityPrice">
        <el-tag>{{row.electricityPrice/100}}</el-tag>
      </template>

      <template slot-scope="{row}" slot="totalPrices">
        <el-tag>{{row.totalPrices/100}}</el-tag>
      </template>
      <template
        slot-scope="{row}"
        slot="totalPrices"
      >
        <label
          :style="{color:row.totalPrices=='0'?'green':'red'}"
        >{{row.totalPrices=="0"?"已出账单未付款":(row.totalPrices=="1"?"未出账单":(row.totalPrices=="2"?"已付款":(row.totalPrices=="3"?"异常状态":"正在结算")))}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <!-- 
          <template slot-scope="{row}"
                slot="voucherUrl">
        <el-tag><Img src='{{"+row.totalPrices+"}}'></Img></el-tag>
      </template>-->

      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-document-copy"
          v-if="scope.row.orderStatus!='1' "
          @click="upload(scope.row)"
        >上传凭证</el-button>

        <el-dialog title="上传凭证" :visible.sync="centerDialogVisible" :append-to-body="true" center>
          <basic-container>
            <avue-form :option="formoption" v-model="form" @submit="handleSubmit()"></avue-form>
          </basic-container>
        </el-dialog>&nbsp;&nbsp;&nbsp;
        <el-button type="text" @click="pagedetial(scope.row)">账单详情</el-button>

        <el-dialog title="账单详情" :visible.sync="dialogTableVisible" :append-to-body="true">
          <el-table :data="gridData">
            <el-table-column property="station_code" label="换电柜编号" width="200"></el-table-column>
            <el-table-column property="init_read" label="上次读数" width="150"></el-table-column>
            <el-table-column property="init_time" label="上次读取时间" width="200"></el-table-column>
            <el-table-column property="end_read" label="本次读数"></el-table-column>
            <el-table-column property="end_time" label="本次读取数时间" width="200"></el-table-column>
            <el-table-column property="electricity_price" label="电费单价"></el-table-column>
            <el-table-column property="electricity_sum" label="实用电量"></el-table-column>
            <el-table-column property="total_prices" label="计费总价"></el-table-column>
            <el-table-column property="is_bill" label="状态"></el-table-column>
            <el-table-column property="remark" label="备注"></el-table-column>
          </el-table>
        </el-dialog>&nbsp;&nbsp;&nbsp;
        <el-button type="text" @click.stop="finish(scope.row)">结算</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  billList,
  uploadvoucher,
  editStatus
} from "@/api/swap_billing_order/billingorder";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      uploadorderId: "",
      query: {},
      gridData: [],
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      centerDialogVisible: false,
      dialogTableVisible: false,
      formoption: {
        column: [
          {
            label: "附件上传",
            prop: "imgUrl",
            type: "upload",
            loadText: "附件上传中，请稍等",
            span: 24,
            propsHttp: {
              res: "data"
            },
            tip: "只能上传jpg/png文件，且不超过500kb",
            action: "/api//blade-resource/oss/endpoint//uploadFile"
          }
          //     {
          //   label: "订单id",
          //   prop: "orderId",
          //   rules: [{
          //     required: false,
          //     message: "请输入订单id",
          //     trigger: "blur"
          //   }]
          // },
        ]
      },
      selectionList: [],

      option: {
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          // {
          //   label: "订单id",
          //   prop: "orderId",
          //   rules: [{
          //     required: true,
          //     message: "请输入订单id",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "交易编号",
            search: true,
            prop: "transactionNum",
            rules: [
              {
                required: true,
                message: "请输入店铺id",
                trigger: "blur"
              }
            ]
          },
          {
            label: "店铺名",
            prop: "storeName",
            rules: [
              {
                required: true,
                message: "请输入店铺",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "充电柜id",
          //   prop: "stationId",
          //   rules: [{
          //     required: true,
          //     message: "请输入充电柜id",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "银行卡号",
            prop: "cardNo",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入店铺",
                trigger: "blur"
              }
            ]
          },
          {
            label: "持卡人",
            prop: "cardholder",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入电表初读数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "发行银行",
            prop: "initTime",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入初读数时间",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "电表始读数",
          //   prop: "endRead",
          //   rules: [{
          //     required: true,
          //     message: "请输入电表始读数",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "始读数时间",
          //   prop: "endTime",
          //   rules: [{
          //     required: true,
          //     message: "请输入始读数时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "实用电量",
          //   prop: "electricitySum",
          //   rules: [{
          //     required: true,
          //     message: "请输入实用电量",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "电费单价",
          //   prop: "electricityPrice",
          //     slot:true,
          //   rules: [{
          //     required: true,
          //     message: "请输入电费单价",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "租金",
          //   prop: "rentPrice",
          //   slot:true,
          //   rules: [{
          //     required: true,
          //     message: "请输入租金",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "计费总价",
            prop: "totalPrices",
            slot: true,
            rules: [
              {
                required: true,
                message: "请输入计费总价",
                trigger: "blur"
              }
            ]
          },
          {
            label: "订单状态 ",
            prop: "orderStatus",
            type: "select",
            slot: true,
            dicData: [
              {
                label: "已出账单未付款 ",
                value: "0"
              },
              {
                label: "未出账单",
                value: "1"
              },
              {
                label: "已付款",
                value: "2"
              },
              {
                label: "异常状态",
                value: "3"
              },
              {
                label: "正在结算",
                value: "4"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入订单状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: "付款凭证",
            prop: "voucherUrl",
            type: "upload",
            imgWidth: 200,
            hide: true,
            listType: "picture-img"
          }
          // {
          //   label: "付款时间",
          //   prop: "payTime",
          //   rules: [{
          //     required: true,
          //     message: "请输入付款时间",
          //     trigger: "blur"
          //   }]
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
          // },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   rules: [{
          //     required: true,
          //     message: "请输入备注",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "删除状态 0代表存在 1代表删除",
          //   prop: "delFlag",
          //   rules: [{
          //     required: true,
          //     message: "请输入删除状态 0代表存在 1代表删除",
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
        addBtn: this.vaildData(this.permission.billingorder_add, false),
        viewBtn: this.vaildData(this.permission.billingorder_view, false),
        delBtn: this.vaildData(this.permission.billingorder_delete, false),
        editBtn: this.vaildData(this.permission.billingorder_edit, false)
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

    pagedetial(row) {
      billList(row.orderId).then(res => {
        console.log("返回结果:" + res.data);
        this.gridData = res.data.data;
      });
      this.dialogTableVisible = true;
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

    upload(row) {
      this.uploadorderId = row.orderId;
      if (row.orderStatus != "0") {
        this.$message({
          type: "error",
          message: "未出账单不能上传凭证"
        });
        return;
      }
      this.centerDialogVisible = true;
    },

    finish(row) {
      row.orderStatus = "4";
      this.$confirm("确定结算?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      }).then(() => {
        editStatus(row).then(
          () => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "success!"
            });
          },
          error => {
            console.log(error);
          }
        );
      });
    },

    handleSubmit() {
      uploadvoucher(this.uploadorderId, this.$data.form.imgUrl[0].value).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
          this.centerDialogVisible = false;
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
        getDetail(this.form.orderId).then(res => {
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
</style>
