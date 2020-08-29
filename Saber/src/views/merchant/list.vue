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
        <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">{{$t(`delete`)}}</el-button>

        <template>
          <el-button @click.stop="delteant">{{$t(`tenant.Frozen`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`Unfreeze`)}}</el-button>
        </template>
      </template>

      <template slot-scope="{row}" slot="status">
        <label
          :style="{color:row.status=='0'?'green':'red'}"
        >{{row.status=="0"?"Normal":"Frozen"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>
    <el-dialog title="View" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
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
        <el-button type="primary" @click="dialogViewVisible = false">Back </el-button>
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
  remove,
  del
} from "@/api/swap_merchant/merchant";
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
        selection: true,
        excelBtn: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: this.$t(`merchant.merchantId`),
            prop: "merchantId",
            search: true,
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入商户id",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`merchant.merchantName`),
            prop: "merchantName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入商户名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "商户logo",
            prop: "logoUrl",
            type: "upload",
            hide: true,
            listType: "picture-img",
            addDisplay: false,
            editDisplay: false,
            span: 24,
            propsHttp: {
              res: "data.0"
            },
            canvasOption: {
              text: "avue",
              ratio: 0.1
            },
            tip: "只能上传jpg/png用户头像，且不超过500kb",
            action: "https://avueupload.91eic.com/upload/list",
            rules: [
              {
                required: false,
                message: "请输入商户logo url",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`merchant.countryId`),
            prop: "countryId",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入国家",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`merchant.city`),
            prop: "cityId",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入城市",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "行业 数据字典",
          //   prop: "trade",
          //   rules: [{
          //     required: true,
          //     message: "请输入行业 数据字典",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`supplier.linkman`),
            prop: "linkman",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入"+this.$t(`supplier.linkman`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`store.contactNumber`),
            prop: "contactNumber",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入"+this.$t(`store.contactNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "address",
            prop: "address",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入联系地址",
                trigger: "blur"
              }
            ]
          },
          {
            label: "法律代表",
            prop: "legalPerson",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入法律代表",
                trigger: "blur"
              }
            ]
          },
          {
            label: "工商备案 ",
            prop: "filingStatus",
            type: "select",
            valueDefault: "1",
            hide: true,
            dicData: [
              {
                label: this.$t(`merchant.have`),
                value: "0"
              },
              {
                label: this.$t(`merchant.no`),
                value: "1"
              },
              {
                label: this.$t(`merchant.unknown`),
                value: "2"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入工商备案",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t( `merchant.status`),
            search: false,
            addDisPlay: false,
            prop: "status",
            valueDefault: "0",
            type: "select",
            slot: true,
            dicData: [
              {
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: this.$t(`tenant.Frozen`),
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: "请选择"+this.$t( `merchant.status`),
                trigger: "blur"
              }
            ]
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
            // {
            //   label: "备注",
            //   prop: "remark",
            //   hide: true,
            //   rules: [
            //     {
            //       required: false,
            //       message: "请输入备注",
            //       trigger: "blur"
            //     }
            //   ]
            // }
          // {
          //   label: "删除状态",
          //   prop: "delFlag",
          //   search:true,
          //   type:'select',
          //   dicData:[
          //     {
          //       label:'存在',
          //       value:'0'
          //     },{
          //       label:'删除',
          //       value:'1'
          //     }
          //   ],
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
        addBtn: this.vaildData(this.permission.merchant_add, false),
        viewBtn: this.vaildData(this.permission.merchant_view, false)
        //delBtn: this.vaildData(this.permission.merchant_delete, false),
        //editBtn: this.vaildData(this.permission.merchant_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.merchantId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      this.dialogViewVisible = true;
      var filingStatus;
      switch (row.filingStatus) {
        case "0":
          filingStatus = this.$t(`merchant.have`);
          break;
        case "1":
          filingStatus = this.$t(`merchant.no`);
          break;
        case "2":
          filingStatus = this.$t(`merchant.unknown`);
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "Merchant Info",
            column: [
              { label: this.$t(`merchant.merchantName`), prop: row.merchantName },
              { label: this.$t(`merchant.countryId`), prop: row.countryId },
              { label: this.$t(`merchant.city`), prop: row.cityId },
              { label: this.$t(`supplier.linkman`), prop: row.linkman },
              { label: this.$t(`store.contactNumber`), prop: row.contactNumber },
              { label: "address", prop: row.address },
              // { label: "法律代表", prop: row.legalPerson },
              // { label: "工商备案", prop: filingStatus },
              { label: this.$t(`teant.teantStatus`), prop: row.status == "0" ? this.$t(`battery.Normal`) :this.$t(`tenant.Frozen`) }
            ],
            fullItem: [
              {
                title: "备注",
                prop: row.remark
              }
            ]
          }
        ]
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
    delteant() {
      if (this.ids.length > 0) {
        del(this.ids, "1").then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      }
    },

    userdel() {
      if (this.ids.length > 0) {
        del(this.ids, "0").then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
      } else {
        this.$message({
          type: "error",
          message: "Please select at least one piece of data!"
        });
      }
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
          return remove(row.merchantId);
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
        getDetail(this.form.merchantId).then(res => {
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
