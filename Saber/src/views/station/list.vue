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
    
        <el-button @click="dialogFormVisible = true">分配店铺</el-button>
        <template>
          <el-button @click.stop="delstore">解除店铺关联</el-button>
        </template>

        <el-dialog title="分配店铺" :visible.sync="dialogFormVisible" width="30%" center>
          <span slot="footer" class="dialog-footer">
            <avue-form :option="formoption" v-model="form" @submit="handleSubmit"></avue-form>
          </span>
        </el-dialog>

        <!-- <el-button type="primary"
                     icon="el-icon-check"
                     size="small"
                     plain
        @click.stop="goimportxls()">导出</el-button>-->
      </template>

      <template slot-scope="{row}" slot="storeId">
        <el-tag>{{row.storeName}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="supplierId">
        <el-tag>{{row.supplierName}}</el-tag>
      </template>

      <template slot-scope="{row}" slot="connectStatus">
        <label
          :style="{color:row.connectStatus=='0'?'green':'red'}"
        >{{row.connectStatus=="0"?"已连接":"未连接"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-box"
          @click.stop="getListData(scope.row)"
        >充电仓管理</el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click.stop="getrowViews(scope.row)"
        >{{$t(`chakan`)}}</el-button>
        <!-- <el-button type="text" icon="el-icon-view" size="small" @click.stop="getrowViews(scope.row)">查看</el-button> -->
        <el-button
          type="text"
          size="small"
          icon="el-icon-picture-outline"
          @click.stop="getGridData(scope.row)"
        >图片管理</el-button>&nbsp;&nbsp;

          <el-button
          type="text"
          size="small"
          icon="el-icon-document-copy"
          @click.stop="openmap(scope.row)"
        >地址选取</el-button>
  
      </template>
    </avue-crud>
    <el-dialog
      title="地图"
      :visible.sync="mapDialogVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <mapbox-map mapWidth="60%" mapHeight="600px" :lnglat="lnglat" @sendiptVal="showChildMsg"></mapbox-map>
<!-- 
   <el-form
          ref="editForm"
          :model="editData"
          label-width="140px"
        >
          <el-form-item label="地图">
            <div style="height: 370px;">
                            <label>
                                <GmapAutocomplete @place_changed="setPlace" ref="gampautocomplete"/>
                                <el-button @click="addMarker">confirm</el-button>
                            </label>
                            <br/>
                            <gmap-map
                                    :center="center"
                                    :zoom="16"
                                    map-type-id="terrain"
                                    style="width: 400px; height: 300px"
                            >
                                <gmap-marker
                                        @dragend="updateMaker"
                                        :key="index"
                                        v-for="(m, index) in markers"
                                        :position="m.position"
                                        :clickable="true"
                                        :draggable="true"
                                        @click="center = m.position"
                                ></gmap-marker>
                            </gmap-map>
                        </div>
          </el-form-item>
   </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitAddres()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="换电柜图片" :visible.sync="dialogTableVisible" :append-to-body="true" center>
      <el-button @click="getTableData()">分配图片</el-button>

      <el-button @click="fileDialog=true">上传换电柜图片</el-button>
      <el-dialog width="50%" title="上传换电柜图片" :visible.sync="fileDialog" append-to-body>
        <el-form :model="fileform">
          <el-form-item label="上传图片" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="/api//blade-resource/oss/endpoint//upload"
              :show-file-list="false"
              :headers="myHeaders"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="photoUrl" :src="photoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fileDialog = false">取 消</el-button>
          <el-button type="primary" @click="insertShopPicature()">确 定</el-button>
        </div>
      </el-dialog>


      <el-table :data="gridData" class="tb-edit" highlight-current-row>
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="picture_id" label="图片id" v-if="show"></el-table-column>
        <el-table-column property="station_picture_id" label="编号" v-if="show"></el-table-column>
        <el-table-column property="station_id" label="编号" v-if="show"></el-table-column>
        <el-table-column prop="picture_main_url" label="图片" min-width="20%">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="scope.row.picture_main_url" min-width="70" height="70" />
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="权重">
          <template slot-scope="scope">
            <el-input
              size="small"
              style="width:80px"
              v-model="scope.row.sort"
              placeholder="请输入权重"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column property="is_default" label="是否为主图" width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.is_default==="0"? '是':'否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="deletePicture(scope.row)" size="small">删除</el-button>
            <el-button type="text" @click="updateMain(scope.row)">设置为主图</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog width="50%" title="图片素材" :visible.sync="innerVisible" append-to-body>
        <el-button @click="submitPicture()">关联图片</el-button>
        <el-button @click="uploadDialog=true">上传图片</el-button>

        <el-table :data="tabledData" @selection-change="changeFun" style="margin-top:50px;">
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="index" width="70px">
            <template slot-scope="scope">{{scope.$index+1}}</template>
          </el-table-column>
          <el-table-column property="picture_id" label="图片id" v-if="show"></el-table-column>
          <el-table-column prop="picture_main_url" label="图片" min-width="20%">
            <template slot-scope="scope">
              <img :src="scope.row.picture_main_url" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="picture86Url" label="图片86" min-width="20%">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.picture86Url" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="picture324Url" label="图片324" min-width="20%">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.picture324Url" min-width="70" height="70" />
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="上传素材"
          :visible.sync="uploadDialog"
          :append-to-body="true"
          width="40%"
          center
        >
          <el-form :model="uploadform">
            <el-form-item label="上传图片" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                action="/api//blade-resource/oss/endpoint//upload"
                :show-file-list="false"
                :headers="myHeaders"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="uploadDialog = false">取 消</el-button>
            <el-button type="primary" @click="insertPicature()">确 定</el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </el-dialog>

    <el-dialog
      title="充电仓管理"
      :visible.sync="chaTableVisible"
      :append-to-body="true"
      :fullscreen="false"
      width="80%"
    >
      <el-table :data="chaData">
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="station_code" label="充电柜编码 " width="150"></el-table-column>
        <el-table-column property="name" label="仓位" width="200"></el-table-column>
        <el-table-column property="lt" label="电池仓锁状态" width="200"></el-table-column>
        <el-table-column property="ct" label="电池仓状态"></el-table-column>
        <el-table-column property="v" label="电池仓电压 " width="150"></el-table-column>
        <el-table-column property="i" label="电池仓电流" width="200"></el-table-column>
        <el-table-column property="t" label="电池仓温度" width="150"></el-table-column>
        <el-table-column property="tmz" label="电池仓累计时间充电"></el-table-column>
        <el-table-column property="tm" label="当前充电时间 " width="150"></el-table-column>
        <el-table-column property="bs" label="当前剩余电池" width="200"></el-table-column>
        <el-table-column property="bm" label="充电电池的MOS最高温度" width="150"></el-table-column>
        <el-table-column property="bt" label="当前充电电池的最高温度" width="150"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="查看" width="60%" :visible.sync="dialogViewVisibles" class="abow_dialog" center>
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
        <el-button type="primary" @click="dialogViewVisibles = false">返 回</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>

<script>
import {
  getList,
  getDetail,
  add,
  addPhoto,
  update,
  updateAddress,
  getChaList,
  remove,
  importxls,
  updateSort,
  SaveStore,
  updatePicture,
  del,
  SavePicture,
  getStationcPicture,
  removePicture
} from "@/api/swap_station/station";
import { getDeptTree } from "@/api/swap_supplier/supplier";
import { getPicture } from "@/api/swap_picture/picture";
import website from "@/config/website";

import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { addPic } from "@/api/swap_picture/picture";

var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;
export default {
  data() {
    return {
      dialogViewVisibles: false,
      rowItem: {},
      form: {},
      gridData: [],
      tabledData: [],
      show: false,
      multipleSelection: [],
      currentPlace: '',
      query: {},
      chaData: [],
      editData:{},
      dialogFormVisible: false,
      dialogTableVisible: false,
      mapDialogVisible: false,
      chaTableVisible: false,
      innerVisible: false,
      loading: true,
      myHeaders: { Authorization: auth, "Blade-Auth": "bearer " + token },
      fileDialog: false,
      imageUrl: "",
      photoUrl: "",
      lnglat: {
        stationId: 0,
        longitude: 0,
        latitude: 0
      },
      pictureMainUrl: "",
      pictureUrl: "",
      uploadform: {},
      fileform: {},
      center: {
           lat: 40.4167754,
                        lng: -3.7037902,
      },
      markers: [],
      place: null,
      formLabelWidth: "100px",
      pictureMainUrl: "",
      picturestationId: 0,
      uploadDialog: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      formoption: {
        column: [
          {
            label: "分配店铺",
            prop: "storeId",
            type: "tree",
            span: 24,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择店铺",
                trigger: "blur"
              }
            ],
            dicUrl: "/api/swap_store/store/select",
            props: {
              label: "storeName",
              value: "storeId"
            }
          }
        ]
      },
      selectionList: [],
      option: {
        dialogWidth: "60%",
        tip: false,
        border: true,
        viewBtn: false,
        updateBtn: true,
        selection: true,
        excelBtn: true,
        indexLabel: "index",
        // columnBtn:false,
        // searchBtn:false,
        // defaultExpandAll:true,
        index: true,
        align: "center",
        column: [
          // {
          //   label: "换电柜ID",
          //   prop: "stationId",
          //   editDisabled:true,
          //   editDisplay:false,
          //   addDisabled:true,
          //   addDisplay:false,
          //   rules: [{
          //     required: true,
          //     message: "请输入换电柜ID",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t(`station.stationCode`),
            // width: 160,
            prop: "stationCode",
            editDisabled: true,
            search: true,
            rules: [
              {
                required: true,
                message: "请输入换电柜编号（UID）",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.stationModel`),
            // width: 120,
            prop: "stationModel",
            rules: [
              {
                required: false,
                message: "请输入换电柜型号",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.imei`),
            // width: 140,
            prop: "imei",
            rules: [
              {
                required: false,
                addDisabled: true,
                addDisplay: false,
                message: "请输入设备IMEI码",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.warehouseNumber`),
            prop: "warehouseNumber",
            search: false,
            valueDefault: 3,
            type: "number",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入充电仓数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "分配店铺",
            width: 140,
            prop: "storeId",
            type: "tree",
            slot: true,
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择店铺",
                trigger: "blur"
              }
            ],
            dicUrl: "/api/swap_store/store/select",
            props: {
              label: "storeName",
              value: "storeId"
            }
          },
          {
            label: "电表实时读数",
            width: 120,
            prop: "ammeterValue",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入电表实时读数",
                trigger: "blur"
              }
            ]
          },
          {
            label: "读数时间",
            width: 160,
            prop: "ammeterTime",
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入读数时间",
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "营业开始时间",
          //   prop: "businessTimeS",
          //   type: "time",
          //   format: " HH:mm ",
          //   valueFormat: "HH:mm",
          //   hide: true,
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入营业开始时间",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          // {
          //   label: "营业结束时间",
          //   prop: "businessTimeE",
          //   hide: true,
          //   type: "time",
          //   format: " HH:mm",
          //   valueFormat: "HH:mm:",
          //   rules: [
          //     {
          //       required: false,
          //       message: "请输入营业结束时间",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t(`station.address`),
            width: 200,
            prop: "address",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入地址",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.stationStatus`),
            width: 100,
            prop: "stationStatus",
            search: true,
            type: "select",
            hide: true,
            // addDisabled:true,
            addDisplay: false,
            valueDefault: "0",
            dicData: [
              {
                label: "正常",
                value: "0"
              },
              {
                label: "故障",
                value: "1"
              },
              {
                label: "维修",
                value: "2"
              },
              {
                label: "报废",
                value: "3"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入换电柜状态 数据字典",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.locationStatus`),
            prop: "locationStatus",
            addDisabled: true,
            addDisplay: false,
            search: true,
            type: "select",
            valueDefault: "1",
            hide: true,
            dicData: [
              {
                label: "已定位",
                value: "0"
              },
              {
                label: "未定位",
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: "请输入定位状态",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.connectStatus`),
            prop: "connectStatus",
            slot: true,
            //addDisabled:true,
            addDisplay: false,
            search: true,
            type: "select",
            valueDefault: "1",
            // hide:true,
            dicData: [
              {
                label: "已连接",
                value: "0"
              },
              {
                label: "未连接",
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入连接状态 0:已连接 1:未连接",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`scooter.expirationDate`),
            prop: "expirationDate",
            valueDefault: "1",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入保质期(月)",
                trigger: "blur"
              }
            ]
          },
          {
            label: "关联供应商",
            width: 160,
            prop: "supplierId",
            type: "tree",
            multiple: false,
            hide: true,
            dicData: [],
            props: {
              label: "title"
            },
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择供应商",
                trigger: "click"
              }
            ]
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
          {
            label: this.$t(`scooter.produceTime`),
            width: 120,
            prop: "produceTime",
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            hide: true,
            // addDisabled:true,
            // addDisplay:false,
            rules: [
              {
                required: false,
                message: "请输入"+this.$t(`scooter.produceTime`),
                trigger: "blur"
              }
            ]
          }
          //
          // {
          //   label: "创建人",
          //   prop: "createUser",
          // editDisabled:true,
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
          //    editDisabled:true,
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
          //     editDisabled:true,
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
          //   label: "删除标识",
          //   prop: "delFlag",
          //   type:'select',
          //      addDisabled:true,
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
          //     required: false,
          //     message: "请输入删除标识 0代表存在 1代表删除",
          //     trigger: "blur"
          //   }]
          // },
        ]
      },
      data: []
    };
  },

  watch: {
    "form.tenantId"() {
      if (this.form.tenantId !== "") {
        getDeptTree(this.form.tenantId).then(res => {
          const index = this.$refs.crud.findColumnIndex("supplierId");

          this.option.column[index].dicData = res.data.data;
        });
      }
    }
  },

  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.station_add, false),
        viewBtn: this.vaildData(this.permission.station_view, false)
        //  delBtn: this.vaildData(this.permission.station_delete, false),
        // editBtn: this.vaildData(this.permission.station_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.stationId);
      });
      return ids.join(",");
    }
  },
  methods: {
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
    getrowViews(row) {
      this.dialogViewVisibles = true;
      var stationStatus;
      switch (row.stationStatus) {
        case "0":
          stationStatus = "正常";
          break;
        case "1":
          stationStatus = "故障";
          break;
        case "2":
          stationStatus = "维修";
          break;
        case "3":
          stationStatus = "报废";
          break;
      }
      this.rowItem = {
        item: [
          {
            title: "换电柜信息",
            column: [
              { label: this.$t(`station.stationCode`), prop: row.stationCode },
              { label: this.$t(`station.imei`), prop: row.imei },
              {
                label: this.$t(`station.stationModel`),
                prop: row.stationModel
              },
              {
                label: this.$t(`station.warehouseNumber`),
                prop: row.warehouseNumber
              },
              {
                label: this.$t(`station.expirationDate`),
                prop: row.expirationDate
              },
              {
                label: this.$t(`scooter.produceTime`),
                prop: row.produceTime
              }
            ]
          },
          {
            title: "换电柜状态",
            column: [
              { label: this.$t(`station.stationStatus`), prop: stationStatus },
              {
                label: this.$t(`station.locationStatus`),
                prop: row.locationStatus == "0" ? "已定位" : "未定位"
              },
              {
                label: this.$t(`station.connectStatus`),
                prop: row.connectStatus == "0" ? "已连接" : "未连接"
              }
            ]
          },
          {
            title: "关联商家及店铺信息",
            column: [
              { label: "分配店铺", prop: row.storeName },
              { label: "电表实时读数", prop: row.ammeterValue },
              { label: "读数时间", prop: row.ammeterTime },
              { label: "营业开始时间", prop: row.businessTimeS },
              { label: "营业结束时间", prop: row.businessTimeE },
              { label: this.$t(`station.address`), prop: row.address },
              { label: "关联供应商", prop: row.supplierId }
            ]
          }
        ],
        fullItem: [
          // {
          //   title: "备注",
          //   prop: row.remark
          // }
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
        link.download = "导出换电柜数据列表.xls";
        link.click();
      });
    },
    submitPicture() {
      let pictureids = [];
      this.multipleSelection.forEach(ele => {
        pictureids.push(ele.picture_id);
      });

      SavePicture(pictureids.join(","), this.data.picturestationId).then(() => {
        getStationcPicture(this.data.picturestationId).then(res => {
          console.log("返回结果:" + res.data);
          this.gridData = res.data.data;
        });
        this.$message({
          type: "success",
          message: "success!"
        });
        this.innerVisible = false;
      });
    },
    getTableData() {
      getPicture().then(res => {
        console.log("返回结果:" + res.data);
        this.tabledData = res.data.data;
      });
      this.innerVisible = true;
    },

    openmap(row) {
      this.lnglat.longitude = row.longitude;
      this.lnglat.latitude = row.latitude;
      this.lnglat.stationId = row.stationId;
      this.mapDialogVisible = true;

    },
                // 设置位置
        setPlace(place) {
            this.currentPlace = null
            this.currentPlace = place
        },
        // 获取当前位置
        geolocate() {
            navigator.geolocation.getCurrentPosition(position => {
                    console.log('获取当前位置', position)
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                },
                () => {
                    this.center = {
                        lat: 40.4167754,
                        lng: -3.7037902,
                    }
                })
        },
        updateMaker(event) {
                this.markers[0].position = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
            },
            addMarker() {
                if (this.currentPlace) {
                    const marker = {
                        lat: this.currentPlace.geometry.location.lat(),
                        lng: this.currentPlace.geometry.location.lng()
                    }
                    this.markers.push({position: marker})
                    this.center = marker
                }
            },
    showChildMsg(value) {
      var obj = JSON.parse(value);
      this.lnglat.longitude = obj.lng;
      this.lnglat.latitude = obj.lat;
    },
    sumbitAddres() {
      updateAddress(this.lnglat).then(
        () => {
          this.mapDialogVisible = false;
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

    getGridData(row) {
      this.data.picturestationId = row.stationId;
      getStationcPicture(row.stationId).then(res => {
        console.log("返回结果:" + res.data);
        this.gridData = res.data.data;
      });
      this.dialogTableVisible = true;
    },

    getListData(row) {
      getChaList(row.stationCode).then(res => {
        console.log("返回结果:" + res.data);
        this.chaData = res.data.data;
        console.log("cha:" + this.chaData);
      });
      this.chaTableVisible = true;
    },

    deletePicture(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          console.log(row.station_picture_id);
          return removePicture(row.station_picture_id);
        })
        .then(() => {
          getStationcPicture(this.data.picturestationId).then(res => {
            console.log("返回结果:" + res.data);
            this.gridData = res.data.data;
          });
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      return isJPG && isLt2M;
    },

    handleSuccess(res, file) {
      console.log(res);
      this.photoUrl = res.data.url;
      this.data.pictureUrl = res.data.url;
    },

    insertShopPicature() {
      if (this.data.pictureUrl == "") {
        this.$message({
          type: "error",
          message: "请上传图片"
        });
        return;
      }

      console.log("返回结果:" + this.data.picturestationId);
      addPhoto(this.data.pictureUrl, this.data.picturestationId).then(() => {
        getStationcPicture(this.data.picturestationId).then(res => {
          console.log("返回结果:" + res.data);
          this.gridData = res.data.data;
        });
        this.$message({
          type: "success",
          message: "success!"
        });
        this.fileDialog = false;
      });
    },

    insertPicature() {
      if (this.pictureMainUrl == "") {
        this.$message({
          type: "error",
          message: "请上传图片"
        });
        return;
      }

      addPic(this.pictureMainUrl).then(() => {
        getPicture().then(res => {
          console.log("返回结果:" + res.data);
          this.tabledData = res.data.data;
        });
        this.$message({
          type: "success",
          message: "success!"
        });
        this.uploadDialog = false;
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = res.data.url;
      this.pictureMainUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return isJPG && isLt2M;
    },
    updateMain(row) {
      this.$confirm("确定将此图设置为主图吗?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          console.log(row.station_picture_id, row.station_id);
          return updatePicture(row.station_picture_id, row.station_id);
        })
        .then(() => {
          getStationcPicture(this.data.picturestationId).then(res => {
            console.log("返回结果:" + res.data);
            this.gridData = res.data.data;
          });
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = res.data.url;
      this.pictureMainUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return isJPG && isLt2M;
    },

    handleSubmit() {
      if (this.ids.length > 0) {
        SaveStore(this.ids, this.form.storeId).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
          this.dialogFormVisible = false;
        });
      } else {
        this.$message.error("Please select at least one piece of data");
      }
    },

    delstore() {
      if (this.ids.length > 0) {
        del(this.ids).then(() => {
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
          return remove(row.stationId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

    handleEdit(index, row) {
      row.stationPictureId = row.station_picture_id;
      updateSort(row);
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
        getDetail(this.form.stationId).then(res => {
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
    changeFun(val) {
      this.multipleSelection = val;
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

      getDeptTree(this.form.tenantId).then(res => {
        const index = this.$refs.crud.findColumnIndex("supplierId");
        this.option.column[index].dicData = res.data.data;
        console.log(this.option.column[index].dicData);
      });
    }
  }
};
</script>

    <style>
* {
  margin: 0;
  padding: 0;
}
body {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  overflow: auto;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
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