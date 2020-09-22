<template>
  <basic-container>
    <avue-crud :option="option"
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
               @on-load="onLoad">
      <template slot="menuLeft">
          <el-button type="primary "
                   size="small"
                   icon="el-icon-plus"
                   @click="onOpen()">新增
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.swapupdate_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot-scope="{row}" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(row)">{{$t(`chakan`)}}</el-button>
        
      </template>

    
    </avue-crud>

    <el-dialog title="View" width="60%" :visible.sync="dialogViewVisible"  center>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="80px">
        <el-form-item label="升级包类型" prop="patchType">
          <el-select v-model="formData.patchType" placeholder="请选择升级包类型" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in field103Options" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新内容" prop="patchContent">
          <el-input v-model="formData.patchContent " placeholder="请输入更新内容" clearable :style="{width: '100%'}" >
          </el-input>
        </el-form-item>
        <el-form-item label="上传" prop="patchUrl" required>
          <el-upload ref="patchUrl" :file-list="field104fileList" :action="field104Action" :headers="myHeaders"
            :before-upload="field104BeforeUpload" accept=".bin" :on-success="handleSuccess">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="升级包地址" prop="patchUrl">
          <el-input v-model="formData.patchUrl" placeholder="请输入升级包地址" clearable :style="{width: '100%'}" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber ">
          <el-input v-model="formData.versionNumber " placeholder="请输入版本号" clearable :style="{width: '100%'}" >
          </el-input>
        </el-form-item>
        <el-form-item label="硬件版本号" prop="hardwareVersion ">
          <el-input v-model="formData.hardwareVersion " placeholder="请输入版本号" clearable :style="{width: '100%'}" >
          </el-input>
        </el-form-item>
        <el-form-item label="字节长度" prop="byteLength">
          <el-input v-model="formData.byteLength" placeholder="请输入字节长度" clearable :style="{width: '100%'}" :disabled="true">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>

       <el-dialog title="固件升级详情" width="60%" :visible.sync="dialogVisible" class="abow_dialog" center>
      <div ref="form" :model="rowItem">
        <div v-for="item in rowItem.item" :key="item.id" :title="item.title" class="item">
          <div class="title">{{item.title}}</div>
          <div v-for="column in item.column" :key="column.label" style="width:33%;float:left">
            <label class="label">{{column.label}}：</label>
            <label>{{column.prop}}</label>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭 </el-button>
      </span>
    </el-dialog>
  </basic-container>

  
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_update/swapupdate";
  import {mapGetters} from "vuex";
  import website from "@/config/website";

import { getToken } from "@/util/auth";

var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;


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
        dialogViewVisible:false,
        dialogVisible:false,
        rowItem:[],
        selectionList: [],
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
      
            {
              label: "升级包类型",
              prop: "patchType",
              type:'select',
              dicData:[
                {"value":"0",label:"BMS"},
                {"value":"1",label:"Scooter"},
                {"value":"2",label:"Station"},
              ],
              rules: [{
                required: true,
                message: "请输入升级包类型 0:BMS 1:电动车  2:换电柜",
                trigger: "blur"
              }]
            },
            {
              label: "版本号",
              prop: "versionNumber",
              rules: [{
                required: true,
                message: "请输入版本号",
                trigger: "blur"
              }]
            },
            {
              label: "升级包地址",
              prop: "patchUrl",
              rules: [{
                required: true,
                message: "请输入升级包地址",
                trigger: "blur"
              }]
            },
            {
              label: "文件内容",
              prop: "content",
              hide:true,
              rules: [{
                required: true,
                message: "请输入文件内容",
                trigger: "blur"
              }]
            },
            {
              label: "字节长度",
              prop: "byteLength",
              rules: [{
                required: true,
                message: "请输入字节长度",
                trigger: "blur"
              }]
            },
            {
              label: "升级内容",
              hiede:true,
              prop: "patchContent",
              rules: [{
                required: true,
                message: "请输入升级内容",
                trigger: "blur"
              }]
            },
            {
              label: "硬件版本号",
              prop: "hardwareVersion",
              rules: [{
                required: true,
                message: "请输入创建人",
                trigger: "blur"
              }]
            },
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
        data: [],
        formData: {
        patchUrl: undefined,
        content:undefined,
        patchContent:undefined,
        versionNumber: undefined,
        byteLength: undefined,
        hardwareVersion:undefined,
        patchType: undefined,
       
      },
      rules: {
        patchType: [{
          required: true,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        patchContent:[
          {
            required: true,
            message: "请输入升级内容",
            trigger: "blur"
          }
        ]
      },
      myHeaders: { Authorization: auth, "Blade-Auth": "bearer " + token },
      field104Action: '/api/blade-resource/oss/endpoint/uploadPackage',
      field104fileList: [],
      field103Options: [{
        "label": "BMS",
        "value": 0
      }, {
        "label": "Sccoter",
        "value": 1
      }, {
        "label": "Station",
        "value": 2
      }],



      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
           addBtn: this.vaildData(this.permission.swapupdate_add, false),
          viewBtn: this.vaildData(this.permission.swapupdate_view, false),
          // delBtn: this.vaildData(this.permission.swapupdate_delete, false),
          editBtn: this.vaildData(this.permission.swapupdate_edit, false)
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
       rowView(row){
         this.dialogVisible=true;
 this.rowItem = {
        item: [
          {
            title: "固件包",
            column: [
              { label: "固件包类型", prop: row.patchType },
              {
                label: "更新内容",
                prop: row.patchContent
              },
              {
                label: "固件包地址",
                prop: row.patchUrl
              },
              // { label: '文件内容', prop: row.content },
              {
                label: "字节长度",
                prop: row.byteLength 
              },
              { label: "版本号", prop: row.versionNumber  },

            ]
          },
        ]
      };          


      },
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },

  
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onOpen() {
        alert(1111)
        this.dialogViewVisible=true;
      },
    onClose() {
      this.$refs['elForm'].resetFields()
      this.dialogViewVisible=true;

    },
    handleSuccess(res) {
      if(res.code=200){
        console.log(res);
        this.formData.patchUrl=res.data.patchUrl;
        this.formData.content=res.data.content;
        // this.formData.versionNumber=res.data.versionNumber;
        this.formData.byteLength=res.data.byteLength;
        this.formData.patchUrl=res.data.patchUrl;
      }
   
    },
    close() {
     this.dialogViewVisible=false;
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
              if (valid) {
            add(this.formData).then(() => {
            this.$message({
              type: "success",
              message: "success!"
      });       this.$refs['elForm'].resetFields();
                this.dialogViewVisible = false;
                this.onLoad(this.page);
            },error => {
          console.log(error);
            }
            );
          
        }
      })
    },
    
    field104BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      let isAccept = new RegExp('.bin').test(file.name)
      if (!isAccept) {
        this.$message.error('应该选择.bin类型的文件')
      }
      return isRightSize && isAccept
    },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
.el-upload__tip {
  line-height: 1.2;
}

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
