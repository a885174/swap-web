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
      </template>
      <template slot-scope="{row}" slot="status">
        <label :style="{color:row.status=='0'?'green':'red'}">{{row.status=="0"?"正常":"关闭"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>

      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-view" @click.stop="rowViews(scope.row)">查看</el-button>
        <!-- <el-button type="text" @click="getListData(scope.row)">客户绑定详情</el-button> -->
      </template>
    </avue-crud>
    <el-dialog title="查看" width="60%" :visible.sync="dialogViewVisible" class="abow_dialog" center>
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
        <el-button type="primary" @click="dialogViewVisible = false">返 回</el-button>
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
} from "@/api/swap_message/message";
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
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          // {
          //   label: "公告ID",
          //   prop: "messageId",
          //   editDisabled: true,
          //   editDisplay: false,
          //   addDisabled: true,
          //   addDisplay: false,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入公告ID",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t(`message.messageTitle`),
            width: 280,
            prop: "messageTitle",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入公告标题",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`message.messageType`),
            prop: "messageType",
            type: "select",
            valueDefault: "0",
            valeDefault: "1",
            dicData: [
              {
                label: "通知",
                value: "1"
              },
              {
                label: "公告",
                value: "2"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入公告类型",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "公告内容",
          //   prop: "messageContent",
          //   rules: [{
          //     required: false,
          //     message: "请输入公告内容",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "公告内容",
          //   prop: "messageContent",
          //   component: "ueditor",
          //   options: {
          //     //普通图片上传
          //     action: "https://avuejs.com/upload",
          //     props: {
          //       res: "data",
          //       url: "url"
          //     }
          //   }
          // },
          {
            label:this.$t(`message.status`),
            prop: "status",
            type: "select",
            valueDefault: "0",
            slot: true,
            dicData: [
              {
                label: "正常",
                value: "0"
              },
              {
                label: "关闭",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入公告状态 （0正常 1关闭）",
                trigger: "blur"
              }
            ]
          },
          {
            label: "发布人",
            prop: "publisher",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入发布人",
                trigger: "blur"
              }
            ]
          },
          {
            label: "推送方式 ",
            prop: "pushService",
            type: "select",
            hide: true,
            dicData: [
              {
                label: "无",
                value: "0"
              },
              {
                label: "状态栏",
                value: "1"
              },
              {
                label: "锁屏",
                value: "2"
              },
              {
                label: "横幅通知",
                value: "3"
              },
              {
                label: "短信",
                value: "4"
              }
            ],
            valueDefault: "0",
            rules: [
              {
                required: true,
                message: "请选择推送方式",
                trigger: "blur"
              }
            ]
          },
          {
            label: "推送结果 ",
            prop: "pushResult",
            hide: true,
            display: false,
            rules: [
              {
                required: false,
                message: "请输入推送结果 0.成功1失败",
                trigger: "blur"
              }
            ]
          }
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
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        // addBtn: this.vaildData(this.permission.message_add, false),
        // viewBtn: this.vaildData(this.permission.message_view, false),
        // delBtn: this.vaildData(this.permission.message_delete, false),
        // editBtn: this.vaildData(this.permission.message_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.messageId);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowViews(row) {
      this.dialogViewVisible = true;
      var pushService;
      switch (row.pushService) {
        case "0":
          pushService = "无";
          break;
        case "1":
          pushService = "状态栏";
          break;
        case "2":
          pushService = "锁屏";
          break;
        case "3":
          pushService = "横幅通知";
          break;
        case "4":
          pushService = "短信";
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "消息详情",
            column: [
              { label: "公告ID", prop: row.messageId },
              { label: "公告标题", prop: row.messageTitle },
              {
                label: "公告类型",
                prop: row.messageType == "0" ? "通知" : "公告"
              },
              { label: "公告状态", prop: row.status == "0" ? "正常" : "关闭" },
              { label: "发布人", prop: row.publisher },
              { label: "发布人", prop: pushService },
              { label: "推送结果", prop: row.pushResult }
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
          return remove(row.messageId);
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
        getDetail(this.form.messageId).then(res => {
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
