<template>
  <basic-container>
    <avue-crud
      :option="option"
      :data="data"
      ref="crud"
      v-model="form"
      :page="page"
      :permission="permissionList"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
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
          v-if="permission.tenant_delete"
          plain
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, remove, update, add } from "@/api/system/tenant";
import { mapGetters } from "vuex";

export default {
  data() {
    // 联系电话/手机 验证
    var validateContactNumber = (rule, value, callback) => {
      var reg = /^(08)\d{7,12}$/;
      if (!reg.test(value)) {
        callback(new Error());
      } else {
        callback();
      }
    };
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
      selectionList: [],
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        dialogWidth: 300,
        dialogHeight: 400,
        column: [
          {
            label: "tenantId",
            prop: "tenantId",
            search: true,
            addDisplay: false,
            editDisplay: false,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入tenantId",
                trigger: "blur"
              }
            ]
          },
          {
            label: "tenantName",
            prop: "tenantName",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.linkman`),
            prop: "linkman",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t(`scooter.please`) + this.$t(`supplier.linkman`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.contactNumber`),
            prop: "contactNumber",
            span: 24,
            rules: [
              {
                validator: validateContactNumber,
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`store.contactNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "address",
            prop: "address",
            span: 24,
            minRows: 6,
            type: "textarea",
            rules: [
              {
                validator: validateStoreName,
                required: false,
                message: this.$t(`station.enterAddress`),
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
        addBtn: this.vaildData(this.permission.tenant_add, false),
        viewBtn: this.vaildData(this.permission.tenant_view, false),
        delBtn: this.vaildData(this.permission.tenant_delete, false),
        editBtn: this.vaildData(this.permission.tenant_edit, false)
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
      });
    }
  }
};
</script>

<style>
</style>
