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
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.picture_delete"
                      @click="handleDelete">{{$t(`delete`)}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_picture/picture";
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
        selectionList: [],
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            // {
            //   label: "图片id",
            //   prop: "pictureId",
            //   rules: [{
            //     required: true,
            //     message: "请输入图片id",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "原图地址",
            //   prop: "pictureMainUrl",
            //   rules: [{
            //     required: true,
            //     message: "请输入原图地址",
            //     trigger: "blur"
            //   }]
            // },
                     {
            label: '图片',
            prop: 'pictureMainUrl',
            type: 'upload',
            loadText: '附件上传中，请稍等',
            span: 24,
            imgWidth:200,
            listType:'picture-img',
            propsHttp: {
              res: 'data'
            },
            tip: '只能上传jpg/png文件，且不超过500kb',
            action: '/api//blade-resource/oss/endpoint//upload'
          },
            {
            label: "360*324图片地址",
            prop: "picture324Url",
            type: 'upload',
            loadText: '附件上传中，请稍等',
            span: 24,
            imgWidth:200,
            addDisabled:true,
            addDisplay:false,
            editDisabled:true,
            editDisplay:false,
            listType:'picture-img',
            propsHttp: {
              res: 'data'
            },
            tip: '只能上传jpg/png文件，且不超过500kb',
            action: '/api//blade-resource/oss/endpoint//uploadFile'
            },
            {
              label: "96*86图片地址",
              prop: "picture86Url",
             type: 'upload',
            loadText: '附件上传中，请稍等',
            span: 24,
            imgWidth:200,
                addDisabled:true,
              addDisplay:false,
              editDisabled:true,
              editDisplay:false,
            listType:'picture-img',
            propsHttp: {
              res: 'data'
            },
            tip: '只能上传jpg/png文件，且不超过500kb',
            action: '/api//blade-resource/oss/endpoint//uploadFile'
            },
            // {
            //   label: "备注",
            //   prop: "remark",
            //   rules: [{
            //     required: false,
            //     message: "请输入备注",
            //     trigger: "blur"
            //   }]
            // },
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
            //     required: false,
            //     message: "请输入更新人",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "更新时间",
            //   prop: "updateTime",
            //   rules: [{
            //     required: false,
            //     message: this.$t(`scooter.please`)+this.$t(`AppVseroin.updatedTime`),
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "删除标识 0代表存在 1代表删除",
            //   prop: "delFlag",
            //   rules: [{
            //     required: true,
            //     message: "请输入删除标识 0代表存在 1代表删除",
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
          // addBtn: this.vaildData(this.permission.picture_add, false),
          viewBtn: this.vaildData(this.permission.picture_view, false),
          delBtn: this.vaildData(this.permission.picture_delete, false),
          editBtn: this.vaildData(this.permission.picture_edit, false)
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
            message: "success!"
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
            message: "success!"
          });
        }, error => {
          done();
          console.log(error);
        });
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
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
</style>
