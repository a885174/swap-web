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

        <template>
          <el-button @click.stop="delteant">{{$t(`plan.takeOff`)}}</el-button>
        </template>
        <template>
          <el-button @click.stop="userdel">{{$t(`plan.sale`)}}</el-button>
        </template>
      </template>
      <template slot-scope="{row}" slot="shopStatus">
        <label
          :style="{color:row.shopStatus=='0'?'green':'red'}"
        >{{row.shopStatus=="0"?"Sale":"Take OFF"}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-date" size="small" @click="opentable(scope.row)">营业时间分配</el-button>
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="rowView(scope.row)">{{$t(`chakan`)}}</el-button>
        <el-button type="text" icon="el-icon-picture-outline" size="small" @click="getGridData(scope.row)">图片管理</el-button>
        <el-button
          type="text"
          icon="el-icon-picture-outline"
          size="small"
          @click="getGridData(scope.row)"
        >图片管理</el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-document-copy"
          @click="openmap(scope.row)"
        >{{$t(`getlocation`)}}</el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="Map"
      :visible.sync="mapDialogVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <mapbox-map mapWidth="100%" mapHeight="600px" :lnglat="lnglat" @sendiptVal="showChildMsg"></mapbox-map>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitAddres()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="营业时间分配" :visible.sync="tableVisible" :append-to-body="true">
      <el-button @click="timeFormVisible=true">新增营业时间</el-button>

      <el-table :data="timeData">
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="week" label="星期" width="150">
          <template slot-scope="scope">
            <el-tag>{{scope.row.week===0? '七天24小时':'星期'+scope.row.week}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="business_time_s" label="营业开始时间" width="200"></el-table-column>
        <el-table-column property="business_time_e" label="营业结束时间"></el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deltime(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="新增营业时间"
      :visible.sync="timeFormVisible"
      :append-to-body="true"
      width="40%"
      center
    >
      <el-form :model="addform">
        <el-form-item label="星期" :label-width="formLabelWidth">
          <el-select v-model="addform.week" placeholder="请选择星期">
            <el-option label="七天24小时" value="0"></el-option>
            <el-option label="星期一" value="1"></el-option>
            <el-option label="星期二" value="2"></el-option>
            <el-option label="星期三" value="3"></el-option>
            <el-option label="星期四" value="4"></el-option>
            <el-option label="星期五" value="5"></el-option>
            <el-option label="星期六" value="6"></el-option>
            <el-option label="星期天" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Start TIME" :label-width="formLabelWidth">
          <el-select v-model="addform.businessTimeS" placeholder="请选择时间">
            <el-option label="1:00" value="1:00"></el-option>
            <el-option label="2:00" value="2:00"></el-option>
            <el-option label="3:00" value="3:00"></el-option>
            <el-option label="4:00" value="4:00"></el-option>
            <el-option label="5:00" value="5:00"></el-option>
            <el-option label="6:00" value="6:00"></el-option>
            <el-option label="7:00" value="7:00"></el-option>
            <el-option label="8:00" value="8:00"></el-option>
            <el-option label="9:00" value="9:00"></el-option>
            <el-option label="10:00" value="10:00"></el-option>
            <el-option label="11:00" value="11:00"></el-option>
            <el-option label="12:00" value="12:00"></el-option>
            <el-option label="13:00" value="13:00"></el-option>
            <el-option label="14:00" value="14:00"></el-option>
            <el-option label="15:00" value="15:00"></el-option>
            <el-option label="16:00" value="16:00"></el-option>
            <el-option label="17:00" value="17:00"></el-option>
            <el-option label="18:00" value="18:00"></el-option>
            <el-option label="19:00" value="19:00"></el-option>
            <el-option label="20:00" value="20:00"></el-option>
            <el-option label="21:00" value="21:00"></el-option>
            <el-option label="22:00" value="22:00"></el-option>
            <el-option label="23:00" value="23:00"></el-option>
            <el-option label="24:00" value="24:00"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="END Time" :label-width="formLabelWidth">
          <el-select v-model="addform.businessTimeE" placeholder="请选择时间">
            <el-option label="1:00" value="1:00"></el-option>
            <el-option label="2:00" value="2:00"></el-option>
            <el-option label="3:00" value="3:00"></el-option>
            <el-option label="4:00" value="4:00"></el-option>
            <el-option label="5:00" value="5:00"></el-option>
            <el-option label="6:00" value="6:00"></el-option>
            <el-option label="7:00" value="7:00"></el-option>
            <el-option label="8:00" value="8:00"></el-option>
            <el-option label="9:00" value="9:00"></el-option>
            <el-option label="10:00" value="10:00"></el-option>
            <el-option label="11:00" value="11:00"></el-option>
            <el-option label="12:00" value="12:00"></el-option>
            <el-option label="13:00" value="13:00"></el-option>
            <el-option label="14:00" value="14:00"></el-option>
            <el-option label="15:00" value="15:00"></el-option>
            <el-option label="16:00" value="16:00"></el-option>
            <el-option label="17:00" value="17:00"></el-option>
            <el-option label="18:00" value="18:00"></el-option>
            <el-option label="19:00" value="19:00"></el-option>
            <el-option label="20:00" value="20:00"></el-option>
            <el-option label="21:00" value="21:00"></el-option>
            <el-option label="22:00" value="22:00"></el-option>
            <el-option label="23:00" value="23:00"></el-option>
            <el-option label="24:00" value="24:00"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="Submittime()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="店铺图片" :visible.sync="dialogTableVisible" :append-to-body="true" center>
      <el-button @click="getTableData()">分配图片</el-button>

      <el-button @click="fileDialog=true">上传店铺图片</el-button>

      <el-table :data="gridData" class="tb-edit" highlight-current-row>
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="picture_id" label="图片id" v-if="show"></el-table-column>
        <el-table-column property="repair_id" label="换电柜id" v-if="show"></el-table-column>
        <el-table-column property="store_picture_id" label="编号" v-if="show"></el-table-column>
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
    </el-dialog>
    <el-dialog width="50%" title="上传店铺图片" :visible.sync="fileDialog" append-to-body>
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
    <el-dialog title="上传素材" :visible.sync="uploadDialog" :append-to-body="true" width="40%" center>
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
    </el-dialog>

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
  updateAddress,
  addPhoto,
  remove,
  del
} from "@/api/swap_repair_shop/repairshop";
import { getPicture } from "@/api/swap_picture/picture";
import { mapGetters } from "vuex";
import website from "@/config/website";

import {
  getPage,
  SaveTime,
  updateSort,
  removeTime,
  updatePicture,
  SavePicture,
  getStorePicture,
  removePicture
} from "@/api/swap_repair_business/repairbusiness";
import { getToken } from "@/util/auth";
import { addPic } from "@/api/swap_picture/picture";

var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;

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

      show: false,
      lnglat: {
        shopId: 0,
        longitude: 0,
        latitude: 0
      },
      uploadDialog: false,
      fileDialog: false,
      imageUrl: "",
      photoUrl: "",
      myHeaders: { Authorization: auth, "Blade-Auth": "bearer " + token },
      pictureMainUrl: "",
      pictureUrl: "",
      uploadform: {},
      fileform: {},
      gridData: [],
      timeData: [],
      tabledData: [],
      picturestoreId: 0,
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      centerDialogVisible: false,
      timeFormVisible: false,
      mapDialogVisible: false,
      tableVisible: false,
      innerVisible: false,
      formLabelWidth: "100px",
      timeStoreId: 0,
      addform: {
        repairId: "0",
        week: "0",
        businessTimeS: "6:00",
        businessTimeE: "6:00"
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        index: true,
        columnBtn: true,
        viewBtn: false,
        excelBtn: true,
        selection: true,
        align: "center",
        menuAlign: "center",
        indexLabel: "index",
        column: [
          {
            label: this.$t(`repairshop.shopId`),
            prop: "shopId",
            editDisabled: true,
            editDisplay: false,
            addDisabled: true,
            addDisplay: false,
            rules: [
              {
                required: true,
                message: "请输入维修店铺id",
                trigger: "blur"
              }
            ]
          },
          {
            label:this.$t(`repairshop.shopeName`),
            prop: "shopName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入店铺名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "维修区域",
            prop: "areaId",
            type: "tree",
            hide: true,
            //slot: true,
            dicUrl: "/api/swap_area/area/select",
            rules: [
              {
                required: true,
                message: "请输入所属维修商",
                trigger: "blur"
              }
            ],
            props: {
              label: "areaName",
              value: "areaId"
            }
          },
          {
            label: "所属维修商",
            prop: "comId",
            type: "tree",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入所属维修商",
                trigger: "blur"
              }
            ],
            //slot: true,
            dicUrl: "/api/swap_repair_company/repaircompany/select",
            props: {
              label: "comName",
              value: "comId"
            }
          },
          // {
          //   label: "所属维修商",
          //   prop: "comId",
          //   rules: [{
          //     required: true,
          //     message: "请输入所属维修商",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "营业开始时间",
            prop: "businessTimeS",
            hide: true,
            type: "select",
            dicData: [
              {
                label: "1:00",
                value: "1:00"
              },
              {
                label: "2:00",
                value: "2:00"
              },
              {
                label: "3:00",
                value: "3:00"
              },
              {
                label: "4:00",
                value: "4:00"
              },
              {
                label: "5:00",
                value: "5:00"
              },
              {
                label: "6:00",
                value: "6:00"
              },
              {
                label: "7:00",
                value: "7:00"
              },
              {
                label: "8:00",
                value: "8:00"
              },
              {
                label: "9:00",
                value: "9:00"
              },
              {
                label: "10:00",
                value: "10:00"
              },
              {
                label: "11:00",
                value: "11:00"
              },
              {
                label: "12:00",
                value: "12:00"
              },
              {
                label: "13:00",
                value: "13:00"
              },
              {
                label: "14:00",
                value: "14:00"
              },
              {
                label: "15:00",
                value: "15:00"
              },
              {
                label: "16:00",
                value: "16:00"
              },
              {
                label: "17:00",
                value: "17:00"
              },
              {
                label: "18:00",
                value: "18:00"
              },
              {
                label: "19:00",
                value: "19:00"
              },
              {
                label: "20:00",
                value: "20:00"
              },
              {
                label: "21:00",
                value: "21:00"
              },
              {
                label: "22:00",
                value: "22:00"
              },
              {
                label: "23:00",
                value: "23:00"
              },
              {
                label: "24:00",
                value: "24:00"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入营业开始时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "营业结束时间",
            prop: "businessTimeE",
            hide: true,
            type: "select",
            dicData: [
              {
                label: "1:00",
                value: "1:00"
              },
              {
                label: "2:00",
                value: "2:00"
              },
              {
                label: "3:00",
                value: "3:00"
              },
              {
                label: "4:00",
                value: "4:00"
              },
              {
                label: "5:00",
                value: "5:00"
              },
              {
                label: "6:00",
                value: "6:00"
              },
              {
                label: "7:00",
                value: "7:00"
              },
              {
                label: "8:00",
                value: "8:00"
              },
              {
                label: "9:00",
                value: "9:00"
              },
              {
                label: "10:00",
                value: "10:00"
              },
              {
                label: "11:00",
                value: "11:00"
              },
              {
                label: "12:00",
                value: "12:00"
              },
              {
                label: "13:00",
                value: "13:00"
              },
              {
                label: "14:00",
                value: "14:00"
              },
              {
                label: "15:00",
                value: "15:00"
              },
              {
                label: "16:00",
                value: "16:00"
              },
              {
                label: "17:00",
                value: "17:00"
              },
              {
                label: "18:00",
                value: "18:00"
              },
              {
                label: "19:00",
                value: "19:00"
              },
              {
                label: "20:00",
                value: "20:00"
              },
              {
                label: "21:00",
                value: "21:00"
              },
              {
                label: "22:00",
                value: "22:00"
              },
              {
                label: "23:00",
                value: "23:00"
              },
              {
                label: "24:00",
                value: "24:00"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入营业结束时间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "address",
            prop: "address",
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入address",
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.linkman`),
            prop: "linkman",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入"+this.$t(`stoe.linkman`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`supplier.contactNumber`),
            prop: "contactNumber",
            hide: true,
            rules: [
              {
                required: false,
                message: "请输入"+this.$t(`stoe.contactNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`repairshop.shopStatus`),
            prop: "shopStatus",
            valueDefault: "1",
            type: "select",
            slot: true,
            dicData: [
              {
                label: this.$t(`plan.sale`),
                value: "0"
              },
              {
                label: this.$t(`plan.takeOff`),
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: "请输入"+this.$t(`repairshop.shopStatus`),
                trigger: "blur"
              }
            ]
          }
          // {
          //   label: "店铺图片",
          //   prop: "shopPicUrl",
          //   rules: [{
          //     required: true,
          //     message: "请输入店铺图片 相对路径",
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
        // addBtn: this.vaildData(this.permission.repairshop_add, false),
        // viewBtn: this.vaildData(this.permission.repairshop_view, false),
        // delBtn: this.vaildData(this.permission.repairshop_delete, false),
        // editBtn: this.vaildData(this.permission.repairshop_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.shopId);
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
            title: "Detail",
            column: [
              // { label: "维修店铺id", prop: row.shopId },
              { label: this.$t(`repairshop.shopeName`), prop: row.shopName },
              // { label: "维修区域", prop: row.areaId },
              { label: "维修区域", prop: row.areaName },
              { label: "所属维修商", prop: row.comId },
              { label: "营业开始时间", prop: row.businessTimeS },
              { label: "营业结束时间", prop: row.businessTimeE },
              { label: "addrees", prop: row.address },
              { label: this.$t(`supplier.linkman`), prop: row.linkman },
              { label: this.$t(`supplier.contactNumber`), prop: row.contactNumber },
              {
                label: this.$t(`repairshop.shopStatus`),
                prop: row.shopStatus == "0" ? this.$t(`plan.sale`) : "this.$t(`plan.takeOff`) "
              }
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

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      return isJPG && isLt2M;
    },

    handleAvatarSuccess(res, file) {
      // console.log(res);
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = res.data.url;
      this.pictureMainUrl = res.data.url;
    },

    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      return isJPG && isLt2M;
    },

    handleSuccess(res, file) {
      // console.log(res);
      // console.log(URL.createObjectURL(file.raw));
      // this.photoUrl = URL.createObjectURL(file.raw);
      // this.data.pictureUrl = res.data.url;
      this.photoUrl = res.data.url;
      this.data.pictureUrl = res.data.url;
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

    insertShopPicature() {
      if (this.data.pictureUrl == "") {
        this.$message({
          type: "error",
          message: "请上传图片"
        });
        return;
      }

      console.log("返回结果:" + this.data.pictureUrl);
      addPhoto(this.data.pictureUrl, this.data.picturestoreId).then(() => {
        getStorePicture(this.data.picturestoreId).then(res => {
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

    openmap(row) {
      this.lnglat.longitude = row.longitude;
      this.lnglat.latitude = row.latitude;
      this.lnglat.shopId = row.shopId;

      this.mapDialogVisible = true;
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

    getTableData() {
      getPicture().then(res => {
        console.log("返回结果:" + res.data);
        this.tabledData = res.data.data;
      });
      this.innerVisible = true;
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
    rowDel(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return remove(row.shopId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },
    opentable(row) {
      this.tableVisible = true;
      this.timeStoreId = row.shopId;
      getPage(row.shopId).then(res => {
        console.log("返回结果:" + res.data);
        this.timeData = res.data.data;
      });
    },
    deltime(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return removeTime(row.id);
        })
        .then(() => {
          getPage(this.timeStoreId).then(res => {
            this.timeData = res.data.data;
          });
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },
    submitPicture() {
      let pictureids = [];
      this.multipleSelection.forEach(ele => {
        pictureids.push(ele.picture_id);
      });

      SavePicture(pictureids.join(","), this.data.picturestoreId).then(() => {
        getStorePicture(this.data.picturestoreId).then(res => {
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

    deletePicture(row) {
      this.$confirm("Are you sure you want to delete the selected data?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return removePicture(row.repair_picture_id);
        })
        .then(() => {
          getStorePicture(this.data.picturestoreId).then(res => {
            console.log("返回结果:" + res.data);
            this.gridData = res.data.data;
          });
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
        getDetail(this.form.shopId).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },

    handleEdit(index, row) {
      row.repairPictureId = row.repair_picture_id;
      updateSort(row);
    },
    updateMain(row) {
      this.$confirm("是否设置为主图?", {
        confirmButtonText: "sure",
        cancelButtonText: "cancel",
        type: "warning"
      })
        .then(() => {
          return updatePicture(row.repair_picture_id, row.repair_id);
        })
        .then(() => {
          getStorePicture(this.data.picturestoreId).then(res => {
            console.log("返回结果:" + res.data);
            this.gridData = res.data.data;
          });
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },
    getGridData(row) {
      this.data.picturestoreId = row.shopId;
      getStorePicture(row.shopId).then(res => {
        console.log("返回结果:" + res.data);
        this.gridData = res.data.data;
      });
      this.dialogTableVisible = true;
    },
    changeFun(val) {
      this.multipleSelection = val;
    },
    Submittime() {
      this.addform.repairId = this.timeStoreId;
      SaveTime(this.addform).then(() => {
        getPage(this.timeStoreId).then(res => {
          this.timeData = res.data.data;
        });
        this.$message({
          type: "success",
          message: "success!"
        });
        this.timeFormVisible = false;
      });
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

