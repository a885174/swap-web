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
      <!-- <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-add"
          plain
          @click="editView(row,'add')"
        >{{$t(`add`)}}</el-button>
      </template>-->

      <template slot-scope="{row}" slot="connectStatus">
        <label
          :style="{color:row.connectStatus=='0'?'green':'red'}"
        >{{row.connectStatus=="0"?"Connect":"Unconnect"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>

      <template slot-scope="{row}" slot="color">
        <label>{{row.color==0?"Red":(row.color==1?"Black":"White")}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="small"
          @click.stop="editView(row)"
        >{{$t(`message.edit`)}}</el-button>
      </template>
    </avue-crud>
    <el-dialog
      title="Edit"
      width="600px"
      :visible.sync="dialogViewVisible"
      class="abow_dialog"
      center
    >
      <el-form ref="form" :model="editform" label-width="0">
        <el-form-item label="Vin">
          <el-input v-model="form.vin"></el-input>
        </el-form-item>
        <el-form-item label="Controller QR Code">
          <el-input v-model="form.scooterCode"></el-input>
        </el-form-item>
        <el-form-item label="Motor Code">
          <el-input v-model="form.motorCode"></el-input>
        </el-form-item>
        <el-form-item label="Color">
          <div
            class="colorBox"
            v-for="(item,index) in colorlist"
            :key="index"
            @click="changeActive(index)"
            :class="{'active':index==current}"
          >
            <div class="box" :style="{ backgroundColor: item }"></div>
            <div class="text">{{item}}</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogViewVisible=false">Cancel</el-button>
          <el-button type="primary" @click="changeMoto()">Confirm</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getPage,
  getDetail,
  add,
  edit,
  remove
} from "@/api/swap_scooter/scooter";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      current: 0,
      colorlist: ["Red", "Black", "White"],
      dialogViewVisible: false,
      editform: {},
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
        editBtn: false,
        addBtn: false,
        column: [
          {
            label: "设备编码",
            prop: "scooterCode",
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
            label: "vin",
            prop: "vin",
            rules: [
              {
                required: true,
                message: "vin码",
                trigger: "blur"
              }
            ]
          },
          {
            label: "Motor Code",
            prop: "motorCode",
            rules: [
              {
                required: true,
                message: "motorCode",
                trigger: "blur"
              }
            ]
          },

          {
            label: "color",
            prop: "color",
            slot: true,
            rules: [
              {
                required: true,
                message: "color",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.connectStatus`),
            prop: "connectStatus",
            slot: true,
            //addDisabled:true,
            addDisplay: false,
            search: true,
            type: "select",
            valueDefault: "1",
            dicData: [
              {
                label: this.$t(`Connected`),
                value: "0"
              },
              {
                label: this.$t(`Unconnected`),
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: this.$t(`scooter.connectionStatus`),
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
    changeMoto() {
      edit(this.form).then(
        () => {
          this.dialogViewVisible = false;
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
    changeActive(index) {
      this.current = index;
      this.form.color = index;
    },
    editView(row) {
      console.log(row);
      getDetail(row.scooterId).then(res => {
        this.form = res.data.data;
        this.current = this.form.color;
        this.dialogViewVisible = true;
      });
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
      edit(row).then(
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
          const data = res.data.data;
          this.current = 1;
          this.form.vin = data.vin;
          this.form.scooterCode = data.scooterCode;
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
      getPage(
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
  padding-bottom: 20px;
}
.el-form-item__label {
  float: none;
}
.colorBox {
  position: relative;
  width: 75px;
  height: 58px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid rgba(121, 121, 121, 1);
  float: left;
  margin-right: 20px;
}
.active {
  background-color: rgba(22, 155, 213, 1);
  color: #fff;
}

.colorBox .box {
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  left: 50%;
  top: 6px;
  border: 1px solid rgba(121, 121, 121, 1);
  transform: translate(-50%, 0);
}
.colorBox .text {
  position: absolute;
  bottom: 6px;
  width: 100%;
  text-align: center;
  line-height: 16px;
  font-size: 14px;
}
</style>
