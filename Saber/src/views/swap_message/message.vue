<template>
  <basic-container>
    <!-- <tinymce-editor id="tinymce" v-model="editfrom.msg" ></tinymce-editor> -->
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
          type="primary"
          size="small"
          icon="el-icon-plus"
          plain
          @click="handleAdd"
        >{{$t(`add`)}}</el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
        >{{$t(`delete`)}}</el-button>
      </template>
      <template slot-scope="{row}" slot="status">
        <label
          :style="{color:row.status=='0'?'green':'red'}"
        >{{row.status=="0"?(`Publish`):"Unpublished"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="scope.row.status == 1"
          type="text"
          size="small"
          icon="el-icon-thumb"
          @click.stop="updateStuats(scope.row)"
        >{{$t(`battery.release`)}}</el-button>
      </template>

      <!-- <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click.stop="rowViews(scope.row)"
        >{{$t(`chakan`)}}</el-button>
        <el-button type="text" @click="getListData(scope.row)">客户绑定详情</el-button>
      </template>-->
    </avue-crud>
    <el-dialog
      title="view"
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

    <el-dialog :title="title" width="60%" :visible.sync="dialogEditVisible" class="abow_dialog">
      <el-form ref="editfrom" :model="editfrom" :rules="rules" label-width="80px">
        <el-row style="height:100px">
          <el-col :span="12">
            <el-form-item :label="$t(`message.messageTitle`)" prop="messageTitle">
              <el-input
                v-model="editfrom.messageTitle"
                :placeholder="$t(`scooter.please`) + $t(`message.messageTitle`)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="icon">
              <el-upload
                class="avatar-uploader"
                action="http://47.112.171.131/api//blade-resource/oss/endpoint//upload"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item :label="$t(`message.messageType`)">
              <el-select
                style="width:100%"
                v-model="editfrom.messageType"
                :placeholder="$t(`scooter.please`) +$t(`message.messageType`)"
              >
                <el-option :label="$t(`message.notice`)" value="1"></el-option>
                <el-option :label="$t(`message.bulletin`)" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item :label="$t(`message.status`)">
              <el-select
                style="width:100%"
                v-model="editfrom.status"
                :placeholder="$t(`scooter.please`) +$t(`message.status`)"
              >
                <el-option :label="$t(`battery.release`)" value="0"></el-option>
                <el-option :label="$t(`battery.ubrelease`)" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t(`message.method`)">
              <el-select
                style="width:100%"
                v-model="editfrom.pushService"
                :placeholder="$t(`scooter.please`) +$t(`message.method`)"
              >
                <el-option :label="$t(`merchant.no`)" value="0"></el-option>
                <el-option :label="$t(`message.statusBar`)" value="1"></el-option>
                <el-option :label="$t(`message.lockScreen`)" value="2"></el-option>
                <el-option :label="$t(`message.banner`)" value="3"></el-option>
                <el-option :label="$t(`message.SMS`)" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="$t(`message.method`)">
              <el-select
                style="width:100%"
                v-model="editfrom.pushService"
                :placeholder="$t(`scooter.please`) +$t(`message.method`)"
              >
                <el-option :label="$t(`merchant.no`)" value="0"></el-option>
                <el-option :label="$t(`message.statusBar`)" value="1"></el-option>
                <el-option :label="$t(`message.lockScreen`)" value="2"></el-option>
                <el-option :label="$t(`message.banner`)" value="3"></el-option>
                <el-option :label="$t(`message.SMS`)" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-form-item :label="$t(`message.messageContent`)">
            <tinymce-editor v-model="editfrom.messageContent" ref="editor"></tinymce-editor>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUpdate('editfrom')">{{$t(`message.save`)}}</el-button>
        <el-button @click="resetForm()">{{$t(`message.cancel`)}}</el-button>
      </div>
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
import website from "@/config/website";
import { getToken } from "@/util/auth";
var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;
export default {
  data() {
    return {
      rules: {
        messageTitle: [
          {
            required: true,
            message:
              this.$t(`scooter.please`) + this.$t(`message.messageTitle`),
            trigger: "blur"
          }
        ]
      },
      imageUrl: "",
      myHeaders: { Authorization: auth, "Blade-Auth": "bearer " + token },
      editfrom: {
        messageTitle: "",
        messageIcon: "SUCCESS",
        messageType: "2",
        status: "0",
        pushService: "0",
        messageContent: ""
      },
      oldId: 0,
      title: "",
      dialogEditVisible: false,
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
        editBtn: false,
        viewBtn: true,
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: this.$t(`message.messageTitle`),
            width: 280,
            prop: "messageTitle",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入" + this.$t(`message.messageTitle`),
                trigger: "blur"
              }
            ]
          },
          {
            label: "icon",
            width: 280,
            prop: "messageIcon",
            type: "upload",
            imgWidth: 60,
            listType: "picture-img",
            rules: [
              {
                required: true,
                message: "请输入icon",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`message.messageType`),
            prop: "messageType",
            type: "select",
            valueDefault: "2",
            dicData: [
              {
                label: this.$t(`message.notice`),
                value: "1"
              },
              {
                label: this.$t(`message.bulletin`),
                value: "2"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入" + this.$t(`message.messageType`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`message.status`),
            prop: "status",
            type: "select",
            valueDefault: "0",
            slot: true,
            dicData: [
              {
                label: this.$t(`battery.release`),
                value: "0"
              },
              {
                label: this.$t(`battery.ubrelease`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入" + this.$t(`message.status`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`message.method`),
            prop: "pushService",
            type: "select",
            hide: true,
            dicData: [
              {
                label: this.$t(`merchant.no`),
                value: "0"
              },
              {
                label: this.$t(`message.statusBar`),
                value: "1"
              },
              {
                label: this.$t(`message.lockScreen`),
                value: "2"
              },
              {
                label: this.$t(`message.banner`),
                value: "3"
              },
              {
                label: this.$t(`message.SMS`),
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
            label: this.$t(`message.results`),
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
          },
          {
            label: this.$t(`message.messageContent`),
            prop: "messageContent",
            component: "Ueditor",
            hide: true,
            span: 100,
            rules: [
              {
                required: true,
                message: "请输入" + this.$t(`message.messageContent`),
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
  // mounted() {
  //   tinymce.init({})
  // },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.message_add, false)
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.editfrom.messageIcon = res.data.url;
    },
    beforeAvatarUpload(file) {
      console.log("111111");
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    updateStuats(row) {
      row.status = "0";
      row.messageContent = this.HTMLEncode(row.messageContent);
      console.log(row);
      update(row).then(
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
    },
    HTMLEncode(html) {
      var temp = document.createElement("div");
      temp.textContent != null
        ? (temp.textContent = html)
        : (temp.innerText = html);
      var output = temp.innerHTML;
      temp = null;
      return output;
    },
    saveUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.editfrom);
          this.editfrom.messageContent = this.HTMLEncode(
            this.editfrom.messageContent
          );
          console.log(this.editfrom);
          add(this.editfrom).then(
            () => {
              this.onLoad(this.page);
              this.dialogEditVisible = false;
              this.$message({
                type: "success",
                message: "success!"
              });
            },
            error => {
              console.log(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.editfrom = {
        messageTitle: "",
        select: "SUCCESS",
        messageType: "2",
        status: "0",
        pushService: "0",
        messageContent: ""
      };
      this.dialogEditVisible = false;
    },
    handleAdd() {
      this.title = "新 增";
      this.editfrom = {
        messageTitle: "",
        select: "SUCCESS",
        messageType: "2",
        status: "0",
        pushService: "0",
        messageContent: ""
      };
      this.dialogEditVisible = true;
    },
    rowViews(row) {
      getDetail(row.messageId).then(res => {
        var data = res.data.data;

        this.dialogViewVisible = true;
        var pushService;
        switch (data.pushService) {
          case "0":
            pushService = this.$t(`merchant.no`);
            break;
          case "1":
            pushService = this.$t(`message.statusBar`);
            break;
          case "2":
            pushService = this.$t(`message.lockScreen`);
            break;
          case "3":
            pushService = this.$t(`message.banner`);
            break;
          case "4":
            pushService = this.$t(`message.SMS`);
            break;
        }
        this.rowItem = {
          item: [
            {
              title: this.$t(`message.details`),
              column: [
                { label: this.$t(`message.id`), prop: data.messageId },
                { label: this.$t(`message.title`), prop: data.messageTitle },
                {
                  label: this.$t(`message.type`),
                  prop:
                    data.messageType == "0"
                      ? this.$t(`message.notice`)
                      : this.$t(`message.bulletin`)
                },
                {
                  label: this.$t(`message.status`),
                  prop:
                    data.status == "0"
                      ? this.$t(`battery.release`)
                      : this.$t(`battery.ubrelease`)
                },
                { label: this.$t(`message.publisher`), prop: data.publisher },
                { label: this.$t(`message.method`), prop: pushService },
                { label: this.$t(`message.results`), prop: data.pushResult }
              ]
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
