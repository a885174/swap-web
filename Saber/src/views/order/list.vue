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
                   v-if="permission.order_delete"
                   @click="handleDelete">批量删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/swap_order/order";
  import {mapGetters} from "vuex";

  export default   {
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
          addBtn:true,
          selection: true,
            excelBtn:true,
          editBtn:true,
          column: [
            {
              label: "订单id",
              prop: "orderId",
              search:false,
              hide:true,
              editDisabled:true,
              editDisplay:false,
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: true,
                message: "请输入订单id",
                trigger: "blur"
              }]
            },
            {
              label: "订单编号",
                 search:true,
                 editDisabled:true,
              prop: "orderCode",
              rules: [{
                required: true,
                message: "请输入订单编号 唯一",
                trigger: "blur"
              }]
            },
            // {
            //   label: "用户id",
            //   prop: "userId",
            //                 editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入用户id",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "电动车id",
            //   prop: "scooterId",
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入电动车id",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "套餐id",
            //   prop: "planId",
            //   search:true,
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入套餐id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "套餐单价",
              prop: "planPrice",
              rules: [{
                required: true,
                message: "请输入套餐单价 100",
                trigger: "blur"
              }]
            },
              {
              label: "套餐里程",
              prop: "distance",
              rules: [{
                required: true,
                message: "请输入套餐单价 100",
                trigger: "blur"
              }]
            },
            
                 {
              label: "用户",
              prop: "userName",
              rules: [{
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }]
            },
                       {
              label: "电动车编码",
              prop: "scooterCode",
              rules: [{
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }]
            },
            {
              label: "套餐折扣",
              prop: "discount",
              rules: [{
                required: true,
                message: "请输入套餐折扣",
                trigger: "blur"
              }]
            },
            {
              label: "数量",
              prop: "count",
              rules: [{
                required: true,
                message: "请输入数量",
                trigger: "blur"
              }]
            },
            {
              label: "套餐总价",
              prop: "planTotal",
              rules: [{
                required: true,
                message: "请输入套餐总价",
                trigger: "blur"
              }]
            },
            {
              label: "优惠券",
              prop: "discounts",
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "订单总价",
              prop: "totalPrices",
              rules: [{
                required: true,
                message: "请输入订单总价",
                trigger: "blur"
              }]
            },
            {
              label: "套餐总里程",
              prop: "distanceSum",
              rules: [{
                required: true,
                message: "请输入套餐总里程",
                trigger: "blur"
              }]
            },
            {
              label: "支付渠道",
              prop: "payChannel",
              type:'select',
              hide:true,
              editDisabled:true,
              dicData:[
                {
                  label:'ovo',
                  value:'0'
                },{
                  label:'gopay',
                  value:'1'
                }
              ],
              rules: [{
                required: true,
                message: "请输入支付渠道 ",
                trigger: "blur"
              }]
            },
            {
              label: "支付状态",
              prop: "payStatus",
              type:'select',
              editDisabled:true,
              dicData:[
                {
                  label:'到账成功',
                  value:'0'
                },{
                  label:'已支付未到帐',
                  value:'1'
                },{
                  label:'待支付',
                  value:'2'
                },{
                  label:'支付失败',
                  value:'3'
                },{
                  label:'取消支付',
                  value:'4'
                }
              ],
              rules: [{
                required: false,
                message: "请输入支付状态 0:到账成功 1:已支付未到帐2:待支付 3:支付失败 4：取消支付",
                trigger: "blur"
              }]
            },
            {
              label: "第三方支付编号",
              editDisabled:true,
              hide:true,
              prop: "payCode",
              rules: [{
                required: true,
                message: "请输入第三方支付编号 第三方支付编号",
                trigger: "blur"
              }]
            },
            {
              label: "第三方支付回调结果",
              editDisabled:true,
              hide:true,
              prop: "callbackResult",
              rules: [{
                required: false,
                message: "请输入第三方支付回调结果",
                trigger: "blur"
              }]
            },
            {
              label: "完成付款时间",
              prop: "payTime",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              type: "date",
              rules: [{
                required: false,
                message: "请输入完成付款时间",
                trigger: "blur"
              }]
            },
            // {
            //   label: "创建人",
            //   prop: "createUser",
            //                 editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入创建人",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "创建时间 可以用于下单时间",
            //   prop: "createTime",
            //                 editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入创建时间 可以用于下单时间",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "更新人",
            //   prop: "updateUser",
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入更新人",
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
            //   label: "备注",
            //   prop: "remark",
            //   rules: [{
            //     required: true,
            //     message: "请输入备注",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "删除状态 0代表存在 1代表删除",
            //   prop: "delFlag",
            //   rules: [{
            //     required: true,
            //     message: "请输入删除状态 0代表存在 1代表删除",
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
          addBtn: this.vaildData(this.permission.order_add, false),
          viewBtn: this.vaildData(this.permission.order_view, false),
          delBtn: this.vaildData(this.permission.order_delete, false),
          editBtn: this.vaildData(this.permission.order_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.orderId);
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
          getDetail(this.form.orderId).then(res => {
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
