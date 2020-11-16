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
  getDetail,
  add,
  update,
  remove
} from "@/api/swap_scooter/scooter";
import{getList} from "@/api/test_station/test";
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
        viewBtn: false,
        selection: true,
        column: [
          
          {
            label: "设备编码",
            prop: "stationCode",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入设备编码",
                trigger: "blur"
              }
            ]
          },

          {
            label: "电池仓1",
            prop: "CHA1",
            rules: [
              {
                required: true,
                message: "电池仓1",
                trigger: "blur"
              }
            ]
          },
            {
            label: "电池仓1充电状态",
            prop: "charge_status_1",
            rules: [
              {
                required: true,
                message: "充电状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: "电池仓2",
            prop: "CHA2",
            rules: [
              {
                required: true,
                message: "电池仓2",
                trigger: "blur"
              }
            ]
          },
            {
            label: "电池仓2充电状态",
            prop: "charge_status_2",
            rules: [
              {
                required: true,
                message: "充电状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: "电池仓3",
            prop: "CHA3",
            rules: [
              {
                required: true,
                message: "电池仓3",
                trigger: "blur"
              }
            ]
          },
            {
            label: "电池仓3充电状态",
            prop: "charge_status_3",
            rules: [
              {
                required: true,
                message: "充电状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: "二维码是否校验",
            prop: "verify",
            rules: [
              {
                required: true,
                message: "二维码是否校验 （0：已校验 1：校验不通过 2:未校验 ）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "sim",
            prop: "sim",
            rules: [
              {
                required: true,
                message: "sim",
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
        console.log(data)
        this.page.total = data.total;
        this.data = data.list;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
