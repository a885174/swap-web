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
        >{{$t(`delete`)}}</el-button>
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
      <template slot-scope="{row}" slot="orderStatus">
        <label
          :style="{color:row.orderStatus=='0'?'green':'red'}"
        >{{row.orderStatus=="0"?$t(`billing.billed`):(row.orderStatus=="1"?$t(`billing.unbilled`):(row.orderStatus=="2"?$t(`billing.paid`):(row.orderStatus=="3"?$t(`billing.abnormal`):$t(`billing.billing`))))}}</label>
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
        >{{$t(`billing.upload`)}}</el-button>

        <el-dialog title="upload" :visible.sync="centerDialogVisible" :append-to-body="true" center>
          <basic-container>
            <avue-form :option="formoption" v-model="form" @submit="handleSubmit()"></avue-form>
          </basic-container>
        </el-dialog>&nbsp;&nbsp;&nbsp;
        <el-button type="text" @click="pagedetial(scope.row)">Detail</el-button>

        <el-dialog title="Detail" :visible.sync="dialogTableVisible" :append-to-body="true">
          <el-table :data="gridData">
            <el-table-column property="station_code" label="station code" width="200"></el-table-column>
            <el-table-column property="init_read" label="Previous Clearing Time" width="150"></el-table-column>
            <el-table-column property="init_time" label="Previous Reading Time" width="200"></el-table-column>
            <el-table-column property="end_read" label="Reading Time"></el-table-column>
            <el-table-column property="end_time" label="Electrical Meter Reading" width="200"></el-table-column>
            <el-table-column property="electricity_price" label="electricity price"></el-table-column>
            <el-table-column property="electricity_sum" label="Power Consumption"></el-table-column>
            <el-table-column property="total_prices" label="totalprices"></el-table-column>
            <el-table-column property="is_bill" label="status"></el-table-column>
            <!-- <el-table-column property="remark" label="备注"></el-table-column> -->
          </el-table>
        </el-dialog>&nbsp;&nbsp;&nbsp;
        <el-button type="text" @click.stop="finish(scope.row)">{{$t(`billing.jiesuan`)}}</el-button>
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
    // 企业名类 验证
    var validateStoreName = (rule, value, callback) => {
      var reg = /^[0-9]+$/;
      if (value.length <= 0) {
        callback(
          new Error(this.$t(`scooter.please`) + this.$t(`store.storeName`))
        );
      } else if (reg.test(value)) {
        callback(this.$t(`store.pureNumber`));
      } else {
        callback();
      }
    };
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
            label: "Please update the payment certification.",
            prop: "imgUrl",
            type: "upload",
            loadText: "wait",
            span: 24,
            propsHttp: {
              res: "data"
            },
            tip: ".png/.jpg",
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
          {
            label: this.$t(`transactionNum`),
            search: true,
            prop: "transactionNum",
            rules: [
              {
                required: true,
                message: this.$t(`scooter.please`) + this.$t(`store.storeID`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`store.storeName`),
            prop: "storeName",
            rules: [
              {
                validator: validateStoreName,
                required: true,
                message: "请输入店铺",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`billing.totalPrices`),
            prop: "totalPrices",
            rules: [
              {
                required: true,
                message: "请输入计费总价",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`billing.status`),
            prop: "orderStatus",
            type: "select",
            slot: true,
            dicData: [
              {
                label: this.$t(`billing.billed`),
                value: "0"
              },
              {
                label: this.$t(`billing.unbilled`),
                value: "1"
              },
              {
                label: this.$t(`billing.paid`),
                value: "2"
              },
              {
                label: this.$t(`billing.abnormal`),
                value: "3"
              },
              {
                label: this.$t(`billing.billing`),
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
      this.$confirm("Are you sure?", {
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
