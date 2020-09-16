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
                   icon="el-icon-add"
                   plain
                   @click="onOpen()">添加
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.swapupdate_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

    
    </avue-crud>

    <el-dialog title="View" width="60%" :visible.sync="dialogViewVisible"  center>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="80px">
        <el-form-item label="升级包类型" prop="field103">
          <el-select v-model="formData.field103" placeholder="请选择升级包类型" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in field103Options" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传" prop="field104" required>
          <el-upload ref="field104" :file-list="field104fileList" :action="field104Action"
            :before-upload="field104BeforeUpload" accept=".txt">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="升级包地址" prop="patchUrl">
          <el-input v-model="formData.patchUrl" placeholder="请输入升级包地址" clearable :style="{width: '100%'}" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber ">
          <el-input v-model="formData.versionNumber " placeholder="请输入版本号" clearable :style="{width: '100%'}" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="字节长度" prop="bytelength">
          <el-input v-model="formData.bytelength" placeholder="请输入字节长度" clearable :style="{width: '100%'}" :disabled="true">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </basic-container>

  
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_update/swapupdate";
  import {mapGetters} from "vuex";

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
        data: [],
        formData: {
        patchUrl: undefined,
        versionNumber: undefined,
        byteLength: undefined,
        field103: undefined,
        field104: null,
       
      },
      rules: {
        field103: [{
          required: true,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
      },
      field104Action: 'https://jsonplaceholder.typicode.com/posts/',
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
          // addBtn: this.vaildData(this.permission.swapupdate_add, false),
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
        this.dialogViewVisible=true;
      },
    onClose() {
      this.$refs['elForm'].resetFields()
      this.dialogViewVisible=true;

    },
    close() {
     this.dialogViewVisible=false;
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
    field104BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      let isAccept = new RegExp('.txt').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择.txt类型的文件')
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

</style>
