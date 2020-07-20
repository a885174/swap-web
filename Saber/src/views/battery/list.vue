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
                   @click="handleDelete">批量删除
        </el-button>

           <!-- <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     @click.stop="goimportxls()">导出</el-button> -->
                     <el-popover
  placement="top-start"
  width="800"
  height="600"
  trigger="click">
  <el-table  :data="tableData"   highlight-current-row>
    <el-table-column  property="tenantId" label="电动车id"></el-table-column>
    <el-table-column  property="tenantName" label="电动车姓名"></el-table-column>
  </el-table>
    <div style="margin-top: 20px">
    <el-button @click="setCurrent(tableData[1])">选取电动车</el-button>
  </div>
</el-popover>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,importxls} from "@/api/swap_battery/battery";
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
          viewBtn: true,
          selection: true,
          // columnBtn:false,
          // searchBtn:false,
          // defaultExpandAll:true,
          index:true,
          menuWidth:100,
          excelBtn:true,
            editDisabled:true,
          column: [
            // {
            //   label: "电池id",
            //   prop: "batteryId",
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入电池id",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: this.$t(`battery.batteryCode`),
              prop: "batteryCode",
              search:true,
              rules: [{
                required: true,
                message: "请输入电池编号 BID",
                trigger: "blur"
              }]
            },
                 {
              label: this.$t(`battery.batteryName`),
              prop: "batteryName",
              search:true,
              rules: [{
                required: false,
                message: "请输入电池名  ",
                trigger: "blur"
              }]
            },
            {
              label:  this.$t(`battery.batteryVersion`),
              prop: "batteryVersion",
              search:true,
              // addDisabled:true,
              // addDisplay:false,
              rules: [{
                required: false,
                message: "请输入电池型号",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.voltage`),
              prop: "voltage",
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: false,
                message: "请输入电池电压 V",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.electricity`),
              prop: "electricity",
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: false,
                message: "请输入电池电流 A",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.cycleIndex`),
              prop: "cycleIndex",
              addDisabled:true,
              addDisplay:false,
              type:'number',
              rules: [{
                required: false,
                message: "请输入电池循环次数",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.surplusMileage`),
              addDisabled:true,
              addDisplay:false,
              prop: "surplusMileage",
              rules: [{
                required: false,
                message: "请输入预估行驶里程",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.surplusElectric`),
              prop: "surplusElectric",
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: false,
                message: "请输入剩余电量",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.healthValue`),
              prop: "healthValue",
              type:'number',
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: false,
                message: "请输入电池健康值 0-100",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.batteryStatus`),
              prop: "batteryStatus",
              search:true,
              type:'select',
             // addDisabled:true,
              addDisplay:false,
              valueDefault:'0',
              dicData:[
               {
                  label:'正常',
                  value:'0'
                },{
                  label:'故障',
                  value:'1',
                },{
                  label:'维修',
                  value:'2'
                },{
                  label:'报废',
                  value:'3'
                }
              ],
              rules: [{
                required: false,
                message: "请输入电池状态",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.lockStatus`),
              prop: "lockStatus",
              type:'select',
              //addDisabled:true,
              addDisplay:false,
              valueDefault:"1",
              dicData:[
                {
                  label:'已锁定',
                  value:'0'
                },{
                  label:'未锁定',
                  value:'1'
                }
              ],
              rules: [{
                required: false,
                message: "请输入锁定状态 0:已锁定 1:未锁定",
                trigger: "blur"
              }]
            },
            {
              label:  this.$t(`battery.powerStatus`),
              prop: "powerStatus",
              type:'select',
              //addDisabled:true,
              addDisplay:false,
              valueDefault:'2',
              dicData:[
                {

                  label:'充电中',
                  value:'0'
                },{
                  label:'放电中',
                  value:'1'
                },{
                  label:'搁置',
                  value:'2'
                }
              ],
              search:true,
              rules: [{
                required: false,
                message: "请输入充电状态 0:充电中 1:放电中 2:搁置",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.activateStatus`),
              prop: "activateStatus",
              //addDisabled:true,
              addDisplay:false,
              valueDefault:'1',
              search:true,
              type:'select',
              dicData:[
                {
                  label:'已激活',
                  value:'0'
                },{
                  label:'未激活',
                  value:'1'
                }
              ],
              rules: [{
                required: false,
                message: "请输入激活状态 0已激活 1:未激活",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.temperature`),
              prop: "temperature",
              addDisabled:true,
              addDisplay:false,
              rules: [{
                required: false,
                message: "请输入电池温度 ℃",
                trigger: "blur"
              }]
            },
            {
              label: this.$t(`battery.connectStatus`),
             // addDisabled:true,
              addDisplay:false,
              valueDefault:2,
              prop: "connectStatus",
              search:true,
              type:'select',
              dicData:[
                {
                  label:'连接换电归',
                  value:'0'
                },{
                  label:'连接电动车',
                  value:'1'
                },{
                  label:'未连接',
                  value:'2'
                },{
                  label:'通讯错误',
                  value:'3'
                },{
                  label:'模块错误',
                  value:'4'

                }
              ],
              rules: [{
                required: false,
                message: "请选择输入连接状态 ）",
                trigger: "blur"
              }]
            },
            {
              label:this.$t(`battery.systemStatus`),
              prop: "systemStatus",
              type:'select',
              //addDisabled:true,
              addDisplay:false,
              valueDefault:"0",
              value:'正常',
              dicData:[
                {
                  label:'正常',
                  value:'0'
                },{
                  label:'安全',
                  value:'1'
                },{
                  label:'被盗',
                  value:'2'
                },{
                  label:'睡眠',
                  value:'3'
                }
              ],
              rules: [{
                required: false,
                message: "请输入系统模式 数据字典",
                trigger: "blur"
              }]
            },
            {
              label: "保质期",
              prop: "expirationDate",
              // addDisabled:true,
              // addDisplay:false,
              type:'number',
              valueDefault:1,
              hide:true,
              rules: [{
                required: false,
                message: "请输入保质期",
                trigger: "blur"
              }]
            },
            // {
            //   label: "电芯规格",
            //   addDisabled:true,
            //   addDisplay:false,
            //   prop: "specification",
            //   rules: [{
            //     required: false,
            //     message: "请输入电芯规格",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "电芯生成商",
            //   prop: "producer",
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: false,
            //     message: "请输入电芯生成商",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "电池PACK厂",
            //   prop: "producePack",
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: false,
            //     message: "请输入电池PACK厂",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "出厂时间",
              prop: "produceTime",
              type:'datetime',
              format: "yyyy-MM-dd",
              hide:true,
              valueFormat: "yyyy-MM-dd",
              rules: [{
                required: false,
                message: "请输入出厂时间",
                trigger: "blur"
              }]
            },
            // {
            //   label: "供应商id",
            //   prop: "supplierId",
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   rules: [{
            //     required: true,
            //     message: "请输入供应商id",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "创建人",
            //   prop: "createUser",
            //   editDisabled:true,
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
            //   label: "创建时间",
            //   prop: "createTime",
          
            //   type:'datetime',
            //   editDisabled:true,
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
            //    type:'datetime',
            //   rules: [{
            //     required: true,
            //     message: "请输入更新时间",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "备注",
            //   prop: "remark",
            //   // addDisabled:true,
            //   // addDisplay:false,
            //   rules: [{
            //     required: false,
            //     message: "请输入备注",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "删除标识",
            //   prop: "delFlag",
            //   type:'select',
            //   editDisabled:true,
            //   editDisplay:false,
            //   addDisabled:true,
            //   addDisplay:false,
            //   dicData:[
            //     {
            //       label:'存在',
            //       value:'0'
            //     },{
            //       label:'删除',
            //       value:'1'
            //     }
            //   ],
            //   rules: [{
            //     required: true,
            //     message: "请输入删除标",
            //     trigger: "blur"
            //   }]
            // },
          ]
        },
        data: [],
        tableData:[]
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          // addBtn: this.vaildData(this.permission.battery_add, false),
          // viewBtn: this.vaildData(this.permission.battery_view, false),
           //delBtn: this.vaildData(this.permission.battery_delete, false),
          // editBtn: this.vaildData(this.permission.battery_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.batteryId);
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
            return remove(row.batteryId);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      
      goimportxls(){
        importxls().then((response) => {
        let blob = new Blob([response.data], { type: 'application/x-xls' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        //配置下载的文件名
        link.download = '导出电池数据列表.xls'
        link.click()
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
          getDetail(this.form.batteryId).then(res => {
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
