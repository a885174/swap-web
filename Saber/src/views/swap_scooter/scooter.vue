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
          v-if="permission.scooter_delete"
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
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
  remove
} from "@/api/swap_scooter/scooter";
import { mapGetters } from "vuex";

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
            label: "电动车id",
            prop: "scooterId",
            rules: [
              {
                required: true,
                message: "请输入电动车id",
                trigger: "blur"
              }
            ]
          },
          {
            label: "电动车编号 VIN",
            prop: "scooterCode",
            rules: [
              {
                required: true,
                message: "请输入电动车编号 VIN",
                trigger: "blur"
              }
            ]
          },
          {
            label: "车牌号 唯一",
            prop: "licensePlate",
            rules: [
              {
                required: true,
                message: "请输入车牌号 唯一",
                trigger: "blur"
              }
            ]
          },
          {
            label: "设备IMEI码",
            prop: "imei",
            rules: [
              {
                required: true,
                message: "请输入设备IMEI码",
                trigger: "blur"
              }
            ]
          },
          {
            label: "电动车型号",
            prop: "scooterVersion",
            rules: [
              {
                required: true,
                message: "请输入电动车型号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "车辆状态 （数据字典）",
            prop: "scooterStatus",
            rules: [
              {
                required: true,
                message: "请输入车辆状态 （数据字典）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "销售渠道 （数据字典）（0：客户 1：门店）",
            prop: "sellChannel",
            rules: [
              {
                required: true,
                message: "请输入销售渠道 （数据字典）（0：客户 1：门店）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "业务状态 （0：已销售 1：未销售）",
            prop: "sellStatus",
            rules: [
              {
                required: true,
                message: "请输入业务状态 （0：已销售 1：未销售）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "激活状态 （0：已激活 1：未激活）",
            prop: "initStatus",
            rules: [
              {
                required: true,
                message: "请输入激活状态 （0：已激活 1：未激活）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "行驶状态 （0：运行中 1：已停止）",
            prop: "runStatus",
            rules: [
              {
                required: true,
                message: "请输入行驶状态 （0：运行中 1：已停止）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "定位状态 （0：已定位 1：未定位）",
            prop: "gpsStatus",
            rules: [
              {
                required: true,
                message: "请输入定位状态 （0：已定位 1：未定位）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "上锁状态 （0：已锁定 1：未连接）",
            prop: "lockStatus",
            rules: [
              {
                required: true,
                message: "请输入上锁状态 （0：已锁定 1：未连接）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "防盗锁定 （0：已锁定 1：未锁定）",
            prop: "securityLock",
            rules: [
              {
                required: true,
                message: "请输入防盗锁定 （0：已锁定 1：未锁定）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "欠费锁车 （0：已锁定 1：未锁定）",
            prop: "arrearageLock",
            rules: [
              {
                required: true,
                message: "请输入欠费锁车 （0：已锁定 1：未锁定）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "可装电池数",
            prop: "batteryNumber",
            rules: [
              {
                required: true,
                message: "请输入可装电池数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "实时总里程表读数",
            prop: "mileageValue",
            rules: [
              {
                required: true,
                message: "请输入实时总里程表读数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "里程读数时间",
            prop: "readTime",
            rules: [
              {
                required: true,
                message: "请输入里程读数时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "初始里程表读数",
            prop: "initRead",
            rules: [
              {
                required: true,
                message: "请输入初始里程表读数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "初始里程读数时间",
            prop: "initTime",
            rules: [
              {
                required: true,
                message: "请输入初始里程读数时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "供应商id",
            prop: "supplierId",
            rules: [
              {
                required: true,
                message: "请输入供应商id",
                trigger: "blur"
              }
            ]
          },
          {
            label: "出厂时间",
            width: 100,
            prop: "produceTime",
            default: true,
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            rules: [
              {
                required: true,
                message: "请输入出厂时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "保质期 （年）",
            prop: "expirationDate",
            rules: [
              {
                required: true,
                message: "请输入保质期 （年）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "创建人",
            prop: "createUser",
            rules: [
              {
                required: true,
                message: "请输入创建人",
                trigger: "blur"
              }
            ]
          },
          {
            label: "创建时间",
            prop: "createTime",
            rules: [
              {
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "更新人",
            prop: "updateUser",
            rules: [
              {
                required: true,
                message: "请输入更新人",
                trigger: "blur"
              }
            ]
          },
          {
            label: "更新时间",
            prop: "updateTime",
            rules: [
              {
                required: true,
                message:
                  this.$t(`scooter.please`) + this.$t(`AppVseroin.updatedTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "备注",
            prop: "remark",
            rules: [
              {
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }
            ]
          },
          {
            label: "删除状态 0代表存在 1代表删除",
            prop: "delFlag",
            rules: [
              {
                required: true,
                message: "请输入删除状态 0代表存在 1代表删除",
                trigger: "blur"
              }
            ]
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
        addBtn: this.vaildData(this.permission.scooter_add, false),
        viewBtn: this.vaildData(this.permission.scooter_view, false),
        delBtn: this.vaildData(this.permission.scooter_delete, false),
        editBtn: this.vaildData(this.permission.scooter_edit, false)
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
