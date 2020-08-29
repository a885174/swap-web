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

        <!-- <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click.stop="goimportxls()">导出</el-button>
        <el-button >批量导入</el-button>-->

        <!-- <el-button >分配客户</el-button>
          <el-button >解除客户关联</el-button>
          <el-button >解除用户关联</el-button>
          <el-button >欠费锁车</el-button>
        <el-button >删除</el-button>-->

        <!-- <template>
  <el-button @click.stop="delteant">{{$t(`tenant.Frozen`)}}</el-button>        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`Unfreeze`)}}</el-button>
        </template>-->
      </template>
      <!-- <template slot-scope="{row}" slot="userStatus">
        <label
          :style="{color:row.userStatus=='0'?'green':'red'}"
        >{{row.userStatus=="0"?this.$t(`battery.Normal`):(row.userStatus=="1"?"已冻结":"欠费锁定")}}</label>
      </template>-->
      <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>
    <el-dialog title="view" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
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
  importxls,
  del
} from "@/api/swap_user/wapuser";
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
        viewBtn: false,
        addBtn:false,
        index: true,
        selection: true,
        excelBtn: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: "userId",
            prop: "userId",
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            search: true,
            rules: [
              {
                required: true,
                message: "请输入用户ID",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.loginName`),
            prop: "loginName",
            rules: [
              {
                required: true,
                message: "请输入登录账号 不能修改",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.username`),
            prop: "username",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入用户姓名",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "密码",
          //   prop: "password",
          //   rules: [{
          //     required: true,
          //     message: "请输入密码",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`user.phoneNumber`),
            prop: "phoneNumber",
            search: true,
            rules: [
              {
                required: false,
                message: "请输入手机号码",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.email`),
            prop: "email",
            rules: [
              {
                required: false,
                message: "请输入邮箱 暂不真实校验，只做格式校验",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.job`),
            prop: "job",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入职业 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.sex`),
            prop: "sex",
            hide: true,
            type: "select",
            valueDefault: "0",
            dicData: [
              {
                label: "男",
                value: "0"
              },
              {
                label: "女",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入用户性别 ",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`user.birthday`),
            prop: "birthday",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            type: "datetime",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入出生年月日",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "盐加密",
          //   prop: "salt",
          //   rules: [{
          //     required: false,
          //     message: "请输入盐加密",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "头像路径",
          //   prop: "avatar",
          //     hide:true,
          //   rules: [{
          //     required: true,
          //     message: "请输入头像路径",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`user.userStatus`),
            prop: "userStatus",
            type: "select",
            addDisplay: false,
            editDisplay: false,
            hide: true,
            valueDefault: "1",
            search: true,
            slot: true,
            dicData: [
              {
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: "已冻结",
                value: "1"
              },
              {
                label: "欠费锁定",
                value: "2"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入帐号状态 0正常,1已冻结 2欠费锁定",
                trigger: "blur"
              }
            ]
          },
          {
            label: "最后登陆IP",
            prop: "loginIp",
            hide: true,
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入最后登陆IP",
                trigger: "blur"
              }
            ]
          },
          {
            label: "最后登陆时间",
            prop: "loginDate",
            hide: true,
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入最后登陆时间",
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "创建者",
          //   prop: "createUser",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建者",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "创建时间",
          //   prop: "createTime",
          //  editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入创建时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "更新者",
          //   prop: "updateUser",
          //  editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入更新者",
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
          //     message: "请输入更新时间",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "删除标志",
          //   prop: "delFlag",
          //   type:'select',
          //   dicData:[
          //     {
          //       label:'存在',
          //       value:'0'
          //     },{
          //       laberl:'删除',
          //       value:'1'
          //     }
          //   ],
          //   rules: [{
          //     required: true,
          //     message: "请输入删除标志 0代表存在 1代表删除",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   rules: [{
          //     required: false,
          //     message: "请输入备注",
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
        addBtn: this.vaildData(this.permission.wapuser_add, false),
        viewBtn: this.vaildData(this.permission.wapuser_view, false)
        // delBtn: this.vaildData(this.permission.wapuser_delete, false),
        //editBtn: this.vaildData(this.permission.wapuser_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.userId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowView(row) {
      this.dialogViewVisible = true;
      this.rowItem = {
        item: [
          {
            title: "User Info",
            column: [
              { label: this.$t(`user.loginName`), prop: row.loginName },
              { label: this.$t(`user.username`), prop: row.username },
              { label: this.$t(`user.email`), prop: row.email },
              { label: this.$t(`user.phoneNumber`), prop: row.phoneNumber },
              { label: this.$t(`user.job`), prop: row.job },
              { label: this.$t(`user.sex`), prop: row.sex },
              { label: this.$t(`user.birthday`), prop: row.birthday },
              { label: this.$t(`user.userStatus`), prop: row.userStatus },
              { label: "ID card", prop: row.idcard },
              { label: "address", prop: row.address },
              { label: this.$t(`user.emergencyContact`), prop: row.emergencyContact },
              { label: this.$t(`user.emergencyPhone`), prop: row.emergencyPhone },
              { label: this.$t(`user.emailverification`), prop: row.checkEmail=="0"?"NO":"YES" },
              { label: this.$t(`user.ipaddress`), prop: row.loginIp },
              { label: this.$t(`user.loginDate`), prop: row.loginDate },
            ]
          }
        ]
      };
    },
    goimportxls() {
      importxls().then(response => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "导出用户数据列表.xls";
        link.click();
      });
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
          return remove(row.userId);
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
        getDetail(this.form.userId).then(res => {
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
