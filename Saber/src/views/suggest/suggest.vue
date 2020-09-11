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
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
      </template>

      <template slot-scope="{row}" slot="suggestStatus">
        <label
          :style="{color:row.suggestStatus=='1'?'green':'red'}"
        >{{row.suggestStatus=="1"?"Disposed":"Undisposed"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="scope.row.suggestStatus==='0'"
          type="text"
          size="small"
          icon="el-icon-document-copy"
          @click="deal(scope.row)"
        >{{$t('suggest.Dispose')}}</el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click.stop="rowViews(scope.row)"
        >{{$t(`chakan`)}}</el-button>
      </template>
    </avue-crud>
    <el-dialog title="Dispose" :visible.sync="centerDialogVisible" :append-to-body="true" center>
      <basic-container>
        <avue-form :option="formoption" v-model="form" @submit="handleSubmit()"></avue-form>
      </basic-container>
    </el-dialog>
    <el-dialog
      title="Detail"
      width="60%"
      :visible.sync="dialogViewVisibles"
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
        <div class="imageItem" v-for="item in rowItem.imageItem" :key="item.title">
          <div class="title">{{item.title}}</div>
          <el-popover
            placement="bottom"
            trigger="click"
            v-for="column in item.column"
            :key="column"
          >
            <!--trigger属性值：hover、click、focus 和 manual-->
            <a :href="column" target="_blank" title="查看最大化图片">
              <img :src="column" class="bigimg" />
            </a>
            <img slot="reference" :src="column" class="img" />
          </el-popover>

          <!-- <el-image
            v-for="column in item.column"
            :key="column"
            :src="column"
            class="img"
            fit="cover"
            :preview-src-list="column.srcList"
          ></el-image>-->
          <!-- <img v-for="column in item.column" :key="column" :src="column" class="img" /> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisibles = false">Back</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script src="//unpkg.com/element-ui@2.13.2/lib/index.js"></script>
<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  delwith
} from "@/api/swap_suggest/suggest";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogViewVisibles: false,
      rowItem: {},
      form: {},
      query: {},
      suggestId: "",
      loading: true,
      title: "22",
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      centerDialogVisible: false,
      dialogTableVisible: false,
      formoption: {
        column: [
          {
            label: this.$t(`suggest.result`),
            prop: "content",
            type: "textarea",
            rules: [
              {
                required: false,
                message: "请输入订单id",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      option: {
        tip: false,
        border: true,
        index: true,
        selection: true,
        excelBtn: true,
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",

        column: [
          // {
          //   label: "意见id",
          //   prop: "suggestId",
          //   editDisabled: true,
          //   editDisplay: false,
          //   addDisabled: true,
          //   addDisplay: false,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入意见id",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t(`suggest.userName`),
            prop: "userName",
            search: true,
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入用户id 0代表游客",
                trigger: "blur"
              }
            ]
          },
          {
            prop: "content",
            label: this.$t(`suggest.detials`),
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入意见内容",
                trigger: "blur"
              }
            ]
          },
          {
            label: "图片",
            prop: "picUrl",
            type: "upload",
            imgWidth: 200,
            hide: true,
            listType: "picture-img",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false
          },
          {
            label: "客户端类型",
            prop: "clientType",
            hide: true,
            type: "select",
            dicData: [
              {
                label: "IOS",
                value: "1"
              },
              {
                label: "Android",
                value: "2"
              },
              {
                label: "其他",
                value: "3"
              }
            ],
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            rules: [
              {
                required: false,
                message: "请输入客户端类型 1.IOS 2.Android. 3.其他",
                trigger: "blur"
              }
            ]
          },
          {
            label: "客户端ip",
            prop: "clientIp",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入客户端ip",
                trigger: "blur"
              }
            ]
          },
          {
            label: "是否匿名",
            prop: "anonymityStatus",
            type: "select",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            hide: true,
            editDisplay: false,
            dicData: [
              {
                label: "是",
                value: "1"
              },
              {
                label: "否",
                value: "0"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入是否匿名 1：是  0：否",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`suggest.suggestStatus`),
            prop: "suggestStatus",
            addDisabled: true,
            addDisplay: false,
            editDisabled: true,
            editDisplay: false,
            slot: true,
            dicData: [
              {
                label: this.$t(`suggest.processed`),
                value: "1"
              },
              {
                label: this.$t(`suggest.untreated`),
                value: "0"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入处理状态 1：已处理  0：未处理",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`suggest.result`),
            prop: "result",
            rules: [
              {
                required: true,
                message: "请输入处理结果",
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
          //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
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
        // addBtn: this.vaildData(this.permission.scooter_add, false),
        viewBtn: this.vaildData(this.permission.scooter_view, false),
        //delBtn: this.vaildData(this.permission.scooter_delete, false),
        editBtn: this.vaildData(this.permission.scooter_edit, false)
      };
    },

    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.suggestId);
      });
      return ids.join(",");
    }
  },
  methods: {
    photoList() {
      // let final = [];
      // for (let photo of this.photos) {
      //   final.push(photo.src);
      // }
      // let nowIndex = final.findIndex(photo => photo === this.now);
      // if (nowIndex > -1) {
      //   let start = final.slice(0, nowIndex);
      //   let end = final.slice(nowIndex);
      //   final = [...end, ...start];
      // }
      // return final;
    },
    rowViews(row) {
      getDetail(row.suggestId).then(res => {
        var data = res.data.data;
        this.dialogViewVisibles = true;
        var imageItems = data.picUrl.split(";");
        var clientType;
        switch (data.clientType) {
          case "1":
            clientType = "IOS";
            break;
          case "2":
            clientType = "Android";
            break;
          case "3":
            clientType = "Other";
            break;
        }
        this.rowItem = {
          item: [
            {
              title: "Detail",
              column: [
                { label: this.$t(`suggest.userName`), prop: data.userName },
                // { label: "客户端类型", prop: clientType },
                // { label: "客户端ip", prop: data.clientIp },
                // { label: "是否匿名", prop: data.anonymityStatus=="1"?"是":"否" },
                {
                  label: this.$t(`suggest.suggestStatus`),
                  prop:
                    data.suggestStatus == "1"
                      ? this.$t(`suggest.processed`)
                      : this.$t(`suggest.untreated`)
                },
                { label: this.$t(`suggest.result`), prop: data.result }
                // { label: this.$t(`suggest.detials`), prop: data.content }
              ]
            }
          ],
          fullItem: [
            {
              title: this.$t(`suggest.detials`),
              prop: data.content
            }
          ],
          imageItem: [
            {
              title: "picture",
              column: imageItems,
              srcList: imageItems
            }
          ]
        };
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
    handleSubmit() {
      delwith(this.suggestId, this.$data.form.content).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "success!"
        });
        this.centerDialogVisible = false;
      });
    },
    deal(row) {
      debugger;
      this.suggestId = row.suggestId;
      if (row.suggestStatus == "1") {
        this.$message({
          type: "error",
          message: "已处理过"
        });
        return;
      }
      this.centerDialogVisible = true;
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
          return remove(row.suggestId);
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
      // if (["edit", "view"].includes(type)) {
      //   getDetail(this.form.suggestId).then(res => {
      //     this.form = res.data.data;
      //   });
      // }
      if (["edit"].includes(type)) {
        getDetail(this.form.suggestId).then(res => {
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
.abow_dialog .imageItem {
  padding-bottom: 12px;
  padding-top: 12px;
}
.abow_dialog .imageItem .img {
  width: 240px;
  cursor: pointer;
  margin: 0 10px;
}
.abow_dialog .imageItem .bigimg {
  width: 720px;
}
</style>
