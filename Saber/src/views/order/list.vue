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
          v-if="permission.order_delete"
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
      </template>
      <template slot-scope="{row}" slot="payStatus">
        <label
          :style="{color:row.payStatus=='0'?'green':'red'}"
        >{{row.payStatus=="0"?$t(`order.successfully`):(row.payStatus=="1"?$t(`order.paidButNotPaid`):(row.payStatus=="2"?$t(`order.toBePaid`):(row.payStatus=="3"?$t(`order.paymentFailed`):$t(`order.cancelPayment`))))}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button
          type="text"
          icon="el-icon-view"
          size="small"
          @click.stop="rowView(row)"
        >{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="View"
      width="60%"
      :visible.sync="dialogViewVisible"
      class="abow_dialog"
      center
    >
      <div ref="form" :model="rowItem">
        <div v-for="item in rowItem.item" :key="item.id" :title="item.title" class="item">
          <div class="title">{{item.title}}</div>
          <div v-for="column in item.column" :key="column.label" style="width:33%;float:left">
            <label class="label">{{column.label}}：</label>
            <label>{{column.prop}}</label>
          </div>
        </div>
        <div v-for="item in rowItem.fullItem" :key="item.title" class="fullItem">
          <div class="title">{{item.title}}</div>
          <p>{{item.prop}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisible = false">Back</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove
} from "@/api/swap_order/order";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogViewVisible: false,
      rowItem: {},
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
        addBtn: true,
        selection: true,
        excelBtn: true,
        editBtn: true,
        align: "center",
        menuWidth: 120,
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: "订单id",
            prop: "orderId",
            search: false,
            hide: true,
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入订单id",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`order.orderNo`),
            // width: 190,
            search: true,
            editDisabled: true,
            prop: "orderCode",
            rules: [
              {
                required: true,
                message: "请输入订单编号 唯一",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "用户id",
          //   prop: "userId",
          //                 editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入用户id",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "电动车id",
          //   prop: "scooterId",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入电动车id",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "套餐id",
          //   prop: "planId",
          //   search:true,
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入套餐id",
          //     trigger: "blur"
          //   }]
          // },

          {
            label: this.$t(`order.useName`),
            // width: 140,
            prop: "userName",
            rules: [
              {
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐单价",
            prop: "planPrice",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入套餐单价 100",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐里程",
            prop: "distance",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入套餐单价 100",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`order.scooterCode`),
            width: 190,
            prop: "scooterCode",
            rules: [
              {
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐折扣",
            prop: "discount",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入套餐折扣",
                trigger: "blur"
              }
            ]
          },
          {
            label: "数量",
            prop: "count",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入数量",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`order.planTotal`),
            prop: "planTotal",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入套餐总价",
                trigger: "blur"
              }
            ]
          },
          {
            label: "优惠券",
            prop: "discounts",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`order.totalPrices`),
            prop: "totalPrices",
            rules: [
              {
                required: true,
                message: "请输入订单总价",
                trigger: "blur"
              }
            ]
          },
          {
            label: "套餐总里程",
            width: 120,
            prop: "distanceSum",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }
            ]
          },
          {
            label: "支付渠道",
            prop: "payChannel",
            type: "select",
            hide: true,
            editDisabled: true,
            dicData: [
              {
                label: "ovo",
                value: "0"
              },
              {
                label: "gopay",
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入支付渠道 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`order.payStatus`),
            prop: "payStatus",
            type: "select",
            editDisabled: true,
            slot: true,
            dicData: [
              {
                label: this.$t(`order.successfully`),
                value: "0"
              },
              {
                label: this.$t(`order.paidButNotPaid`),
                value: "1"
              },
              {
                label: this.$t(`order.toBePaid`),
                value: "2"
              },
              {
                label: this.$t(`order.paymentFailed`),
                value: "3"
              },
              {
                label: this.$t(`order.cancelPayment`),
                value: "4"
              }
            ],
            rules: [
              {
                required: false,
                message:
                  "请输入支付状态 0:到账成功 1:已支付未到帐2:待支付 3:支付失败 4：取消支付",
                trigger: "blur"
              }
            ]
          },
          {
            label: "第三方支付编号",
            editDisabled: true,
            hide: true,
            prop: "payCode",
            rules: [
              {
                required: true,
                message: "请输入第三方支付编号 第三方支付编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "第三方支付回调结果",
            editDisabled: true,
            prop: "callbackResult",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入第三方支付回调结果",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "创建时间",
          //   prop: "createTime",
          //   editDisabled: true,
          //   editDisplay: false,
          //   addDisabled: true,
          //   addDisplay: false,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入创建时间",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t(`order.PayTime`),
            // width: 190,
            prop: "payTime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            type: "date",
            rules: [
              {
                required: false,
                message: "请输入完成付款时间",
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "创建人",
          //   prop: "createUser",
          //                 editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新人",
          //   prop: "updateUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新人",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新时间",
          //   prop: "updateTime",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
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
        addBtn: this.vaildData(this.permission.order_add, false),
        viewBtn: this.vaildData(this.permission.order_view, false),
        delBtn: this.vaildData(this.permission.order_delete, false),
        editBtn: this.vaildData(this.permission.order_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.orderId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      this.dialogViewVisible = true;
      var payStatus;
      switch (row.payStatus) {
        case "0":
          payStatus = this.$t(`order.successfully`);
          break;
        case "1":
          payStatus = this.$t(`order.paidButNotPaid`);
          break;
        case "2":
          payStatus = this.$t(`order.toBePaid`);
          break;
        case "3":
          payStatus = this.$t(`order.paymentFailed`);
          break;
        case "4":
          payStatus = this.$t(`order.cancelPayment`);
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "Order Info",
            column: [
              // { label: "订单id", prop: row.orderId },
              { label: this.$t(`order.orderNo`), prop: row.orderCode },
              { label: this.$t(`order.packagePrice`), prop: row.planPrice },
              { label: this.$t(`order.packageMileage`), prop: row.distance },
              { label: this.$t(`user.username`), prop: row.userName },
              { label: this.$t(`scooter.name`), prop: row.scooterCode },
              // { label: "套餐折扣", prop: row.discount },
              // { label: "数量", prop: row.count },
              // { label: "套餐总价", prop: row.planTotal },
              // { label: "优惠券", prop: row.discounts },
              { label: this.$t(`order.totalPrices`), prop: row.totalPrices },
              { label: this.$t(`scooter.totalMileag`), prop: row.distanceSum },
              {
                label: this.$t(`order.payChannel`),
                prop: row.payChannel == "0" ? "ovo" : "gopay"
              },
              { label: this.$t(`order.payStatus`), prop: payStatus },
              { label: this.$t(`order.thirdParty`), prop: row.payCode },
              // { label: "第三方支付回调结果", prop: row.callbackResult },
              { label: this.$t(`order.PayTime`), prop: row.payTime }
            ]
          }
        ]
        // fullItem: [
        //   {
        //     title: "备注",
        //     prop: row.remark
        //   }
        // ]
      };
    },
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
.abow_dialog .el-dialog .el-dialog__body {
  padding: 0 30px;
}
.abow_dialog .title {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.847058823529412);
  line-height: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}
.abow_dialog .item {
  overflow: hidden;
  padding-bottom: 12px;
  padding-top: 12px;
  border-bottom: 1px solid #ebebeb;
}
.abow_dialog .item label {
  line-height: 32px;
}
.abow_dialog .fullItem {
  padding-bottom: 12px;
  padding-top: 12px;
  line-height: 20px;
  border-bottom: 1px solid #ebebeb;
}
</style>
