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

        <el-button @click="dialogFormVisible = true">{{$t(`AssignStore`)}}</el-button>
        <template>
          <el-button @click.stop="delstore">{{$t(`UnlinkwithStore`)}}</el-button>
          <el-button @click="upload.open=true">{{$t(`import`)}}</el-button>
        </template>

        <el-dialog title="AssignStore" :visible.sync="dialogFormVisible" width="30%" center>
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
        >{{row.connectStatus=="0"?$t(`Connected`):$t(`Unconnected`)}}</label>
        <!-- <el-tag>{{row.tenantStatus}}</el-tag> -->
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit"
          @click.stop="openEditDialog(scope.row)"
        >{{$t(`message.edit`)}}</el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-box"
          @click.stop="getListData(scope.row)"
        >warhouse management</el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          @click.stop="getrowViews(scope.row)"
        >{{$t(`chakan`)}}</el-button>
        <!-- <el-button type="text" icon="el-icon-view" size="small" @click.stop="getrowViews(scope.row)">{{$t(`chakan`)}}</el-button> -->
        <el-button
          type="text"
          size="small"
          icon="el-icon-picture-outline"
          @click.stop="getGridData(scope.row)"
        >pictureManagement</el-button>&nbsp;&nbsp;
        <el-button
          type="text"
          size="small"
          icon="el-icon-document-copy"
          @click.stop="openmap(scope.row)"
        >{{$t(`getlocaton`)}}</el-button>
      </template>
    </avue-crud>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="editdialogVisibles"
      :fullscreen="true"
      :append-to-body="true"
    >
      <avue-form ref="editform" v-model="editform" :option="editoption">
        <template slot="stationpicture">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="uploadstation"
            :show-file-list="false"
            :file-list="photoList"
            :on-change="changePhotoFile"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
        <template slot="stationpicturelist">
          <el-upload
            action
            class="upload-idCard"
            list-type="picture-card"
            :file-list="idCardImageList"
            ref="imgRef"
            :limit="2"
            :auto-upload="false"
            :on-change="changePhotoFiles"
            :on-remove="function(file ,raw){ handleRemovePic('idCard',file ,raw) }"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
        <template slot="address">
          <mapselect ref="gmap" :oldmarker="oldmarker" :address="oldaddress"></mapselect>
        </template>
        <template slot="menuForm">
          <el-button type="primary" @click="editFromSubmit()">提 交</el-button>
          <el-button @click="handleEmpty()">清 空</el-button>
        </template>
      </avue-form>
    </el-dialog>
    <my-cropper ref="myCropper" @getFile="getFile" @upAgain="upAgain"></my-cropper>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        action="/api//swap_station/station/importData"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="goimportxls">download template</el-link>
        </div>
        <div class="el-upload__text">
          Drag the file here, or
          <em>Click upload</em>
        </div>
        <div
          class="el-upload__tip"
          style="color:red"
          slot="tip"
        >Tip: only "XLS" or "xlsx" format files can be imported!</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="Map"
      :visible.sync="mapDialogVisible"
      :append-to-body="true"
      width="30%"
      center
    >
      <mapbox-map mapWidth="60%" mapHeight="600px" :lnglat="lnglat" @sendiptVal="showChildMsg"></mapbox-map>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">{{$t(`submitText`)}}</el-button>
        <el-button type="primary" @click="sumbitAddres()">{{$t(`cancelText`)}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t(`station.cabinetPicture`)"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      center
    >
      <el-button @click="getTableData()">{{$t(`station.assignPicture`)}}</el-button>

      <el-button @click="fileDialog=true">{{$t(`station.uploadCabinetPicture`)}}</el-button>
      <el-dialog
        width="50%"
        :title="$t(`station.uploadCabinetPicture`)"
        :visible.sync="fileDialog"
        append-to-body
      >
        <el-form :model="fileform">
          <el-form-item :label="$t(`station.uploadPicture`)" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="/api/blade-resource/oss/endpoint/upload"
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
          <el-button @click="fileDialog = false">{{$t(`cancelText`)}}</el-button>
          <el-button type="primary" @click="insertShopPicature()">{{$t(`submitText`)}}</el-button>
        </div>
      </el-dialog>

      <el-table :data="gridData" class="tb-edit" highlight-current-row>
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="picture_id" :label="$t(`station.pictureId`)" v-if="show"></el-table-column>
        <el-table-column property="station_picture_id" :label="$t(`station.numbering`)" v-if="show"></el-table-column>
        <el-table-column property="station_id" :label="$t(`station.numbering`)" v-if="show"></el-table-column>
        <el-table-column prop="picture_main_url" :label="$t(`station.image`)" min-width="20%">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="scope.row.picture_main_url" min-width="70" height="70" />
          </template>
        </el-table-column>

        <el-table-column prop="sort" :label="$t(`station.weights`)">
          <template slot-scope="scope">
            <el-input
              size="small"
              style="width:80px"
              v-model="scope.row.sort"
              :placeholder="$t(`station.enterWeight`)"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.sort}}</span>
          </template>
        </el-table-column>
        <el-table-column property="is_default" :label="$t(`station.mainImage`)" width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.is_default==="0"? $t(`AppVseroin.yes`):$t(`AppVseroin.no`)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t(`station.operating`)" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="deletePicture(scope.row)"
              size="small"
            >{{$t(`station.delete`)}}</el-button>
            <el-button type="text" @click="updateMain(scope.row)">{{$t(`station.setMainImage`)}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        width="50%"
        :title="$t(`station.pictureMaterial`)"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-button @click="submitPicture()">{{$t(`station.AssociatedPicture`)}}</el-button>
        <el-button @click="uploadDialog=true">{{$t(`station.uploadMaterial`)}}</el-button>

        <el-table :data="tabledData" @selection-change="changeFun" style="margin-top:50px;">
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="index" width="70px">
            <template slot-scope="scope">{{scope.$index+1}}</template>
          </el-table-column>
          <el-table-column property="picture_id" :label="$t(`station.pictureId`)" v-if="show"></el-table-column>
          <el-table-column prop="picture_main_url" :label="$t(`station.image`)" min-width="20%">
            <template slot-scope="scope">
              <img :src="scope.row.picture_main_url" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="picture86Url" :label="$t(`station.image`)+'86'" min-width="20%">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.picture86Url" min-width="70" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="picture324Url" :label="$t(`station.image`)+'324'" min-width="20%">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.picture324Url" min-width="70" height="70" />
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="$t(`station.uploadMaterial`)"
          :visible.sync="uploadDialog"
          :append-to-body="true"
          width="40%"
          center
        >
          <el-form :model="uploadform">
            <el-form-item :label="$t(`station.uploadPicture`)" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                action="/api/blade-resource/oss/endpoint/upload"
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
            <el-button type="primary" @click="insertPicature()">{{$t(`submitText`)}}</el-button>
            <el-button @click="uploadDialog = false">{{$t(`cancelText`)}}</el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </el-dialog>

    <el-dialog
      title="warehouse"
      :visible.sync="chaTableVisible"
      :append-to-body="true"
      :fullscreen="false"
      width="80%"
    >
      <el-table :data="chaData">
        <el-table-column label="index" width="70px">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="station_code" label="station code " width="150"></el-table-column>
        <el-table-column property="name" :label="$t(`station.position`)" width="200"></el-table-column>
        <el-table-column property="lt" :label="$t(`station.lockState`)" width="200"></el-table-column>
        <el-table-column property="ct" label="status"></el-table-column>
        <el-table-column property="v" :label="$t(`station.voltage`)" width="150"></el-table-column>
        <el-table-column property="i" :label="$t(`station.current`)" width="200"></el-table-column>
        <el-table-column property="t" :label="$t(`station.temperature`)" width="150"></el-table-column>
        <el-table-column property="tmz" :label="$t(`station.timeToCharge`)"></el-table-column>
        <el-table-column property="tm" :label="$t(`station.currentChargingTime`)" width="150"></el-table-column>
        <el-table-column property="bs" :label="$t(`station.remainingBattery`)" width="200"></el-table-column>
        <el-table-column property="bm" :label="$t(`station.maximumTemperature`)" width="150"></el-table-column>
        <el-table-column property="bt" :label="$t(`station.currentMaximumTemperature`)" width="150"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="view"
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisibles = false">Back</el-button>
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
  removePicture,
  upload
} from "@/api/swap_station/station";
import { getDeptTree } from "@/api/swap_supplier/supplier";
import { getPicture } from "@/api/swap_picture/picture";
import website from "@/config/website";

import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { addPic } from "@/api/swap_picture/picture";
import gMapSelectPoint from "@/components/selectPoint/selectPoint.vue";
import MyCropper from "@/components/crop_image/cropper.vue";

var token = getToken(); // 要保证取到
var auth = `Basic ${Base64.encode(
  `${website.clientId}:${website.clientSecret}`
)}`;
export default {
  components: { mapselect: gMapSelectPoint, MyCropper },
  data() {
    // 企业名类 验证
    var validateStoreName = (rule, value, callback) => {
      var reg = /^[0-9]+$/;
      if (value.length <= 0) {
        callback(
          new Error(this.$t(`scooter.please`) + this.$t(`store.storeName`))
        );
      } else if (reg.test(value)) {
        callback(this.$t(`store.pureNumber`));
      } else {
        callback();
      }
    };
    // 换电柜SID码 验证
    var validateSID = (rule, value, callback) => {
      var reg = /^(SS|ss)\d{14}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入英文+数字"));
      } else {
        callback();
      }
    };

    // IMEI码 验证
    var validateIMEI = (rule, value, callback) => {
      var reg = /^\d{15,17}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入英文+数字"));
      } else {
        callback();
      }
    };
    return {
      uploadstation: "/api/blade-resource/oss/endpoint//upload",
      photoList: [],
      headerObj: "",
      imageUrl: "",
      imageUrl1: "",
      imageUrl2: "",
      idCardImageList: [],

      oldmarker: "",
      oldaddress: "",
      supplierTree: [],
      editdialogVisibles: false,
      dialogViewVisibles: false,
      rowItem: {},
      form: {},
      gridData: [],
      tabledData: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: auth, "Blade-Auth": "bearer " + token }
        // headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
      },
      show: false,
      multipleSelection: [],
      currentPlace: "",
      query: {},
      chaData: [],
      editData: {},
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
        lng: -3.7037902
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
            label: this.$t(`AssignStore`),
            prop: "storeId",
            type: "tree",
            span: 24,
            slot: true,
            rules: [
              {
                required: true,
                message: this.$t(`station.selectStore`),
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
          {
            label: this.$t(`station.stationCode`),
            // width: 160,
            prop: "stationCode",
            editDisabled: true,
            search: true,
            rules: [
              {
                validator: validateSID,
                required: true,
                message: this.$t(`station.enterSwitchCabinetNumber`),
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
                message: this.$t(`station.enterModel`),
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
                validator: validateIMEI,
                required: false,
                addDisabled: true,
                addDisplay: false,
                message: this.$t(`station.enterDeviceCode`),
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
                message: this.$t(`station.enterNumber`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`AssignStore`),
            width: 140,
            prop: "storeId",
            type: "tree",
            slot: true,
            hide: true,
            rules: [
              {
                required: true,
                message: this.$t(`station.selectStore`),
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
            label: this.$t(`station.reading`),
            width: 120,
            prop: "ammeterValue",
            addDisabled: true,
            addDisplay: false,
            hide: true,
            rules: [
              {
                required: false,
                message: this.$t(`station.inputReading`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.readingTime`),
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
                message: this.$t(`station.inputReadingTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.address`),
            width: 200,
            prop: "address",
            hide: true,
            rules: [
              {
                validator: validateStoreName,
                required: false,
                message: this.$t(`station.enterAddress`),
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
                label: this.$t(`battery.Normal`),
                value: "0"
              },
              {
                label: this.$t(`battery.Fault`),
                value: "1"
              },
              {
                label: this.$t(`battery.Repairing`),
                value: "2"
              },
              {
                label: this.$t(`battery.Castoff`),
                value: "3"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`station.enterStatus`),
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
                label: this.$t(`scooter.targeted`),
                value: "0"
              },
              {
                label: this.$t(`scooter.untargeted`),
                value: "1"
              }
            ],
            rules: [
              {
                required: false,
                message: this.$t(`station.enterPositioningStatus`),
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
                label: this.$t(`Connected`),
                value: "0"
              },
              {
                label: "Unconnected",
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: this.$t(`scooter.connectionStatus`),
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
                message: this.$t(`scooter.enterShelfLife`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.supplier`),
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
                required: false,
                message: this.$t(`station.selectSupplier`),
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
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.produceTime`),
                trigger: "blur"
              }
            ]
          }
        ]
      },
      data: [],
      editform: {
      },
      editoption: {
        emptyBtn: false,
        submitBtn: false,
        column: [
          {
            label: this.$t(`station.stationCode`),
            prop: "stationCode",
            disabled: true,
            rules: [
              {
                validator: validateSID,
                required: true,
                message: this.$t(`station.enterSwitchCabinetNumber`),
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
                message: this.$t(`station.enterModel`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`station.supplier`),
            prop: "supplierId",
            type: "tree",
            dicData: [],
            props: {
              label: "title"
            },
            rules: [
              {
                required: false,
                message: this.$t(`station.selectSupplier`),
                trigger: "click"
              }
            ]
          },
          {
            label: this.$t(`scooter.produceTime`),
            width: 120,
            prop: "produceTime",
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            // addDisabled:true,
            // addDisplay:false,
            rules: [
              {
                required: false,
                message:
                  this.$t(`scooter.please`) + this.$t(`scooter.produceTime`),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t(`AssignStore`),
            prop: "storeId",
            type: "tree",
            rules: [
              {
                required: true,
                message: this.$t(`station.selectStore`),
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
            label: "展示状态",
            prop: "connectStatus",
            //addDisabled:true,
            type: "select",
            valueDefault: "1",
            // hide:true,
            dicData: [
              {
                label: "展示",
                value: "0"
              },
              {
                label: "不展示",
                value: "1"
              }
            ],
            rules: [
              {
                required: true,
                message: this.$t(`scooter.connectionStatus`),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "营业时间",
          //   prop: "produceTimetype",
          //   formslot:true,
          //   rules: [{
          //       required: true,
          //       message: "请输营业时间",
          //       trigger: "blur"
          //     }]
          // }
          {
            label: "主图图片",
            prop: "stationpicture",
            formslot: true,
            span: 24
          },
          {
            label: "店铺图片",
            prop: "stationpicturelist",
            formslot: true,
            span: 24
          },
          {
            label: "地址",
            prop: "address",
            formslot: true,
            span: 24
          }
        ]
      }
    };
  },

  // watch: {
  // "form.tenantId"() {
  //   if (this.form.tenantId !== "") {
  //     getDeptTree(this.form.tenantId).then(res => {
  //       const index = this.$refs.crud.findColumnIndex("supplierId");
  //       this.option.column[index].dicData = res.data.data;
  //     });
  //   }
  // }
  // },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.station_add, false),
        viewBtn: this.vaildData(this.permission.station_view, false),
        editBtn: this.vaildData(this.permission.station_edit, false)
        //  delBtn: this.vaildData(this.permission.station_delete, false),
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
    // 提交编辑表单
    editFromSubmit() { 
      
      console.log(this.editform);
      debugger;
      update(this.editform).then(
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
    // 清空编辑表单
    handleEmpty() {},
    // 图片列表删除方法
    handleRemovePic(name, file, fileList) {
      //将删除后的fileList赋给数组
      this.idCardImageList = fileList;
      this.editform.imgList = this.idCardImageList;
      console.log(this.idCardImageList);
    },
    changePhotoFile(file, fileList) {
      if (fileList.length > 0) {
        this.photoList = [fileList[fileList.length - 1]];
      }
      this.handleCrop(file, "single");
    },
    changePhotoFiles(file, fileList) {
      if (fileList.length > 0) {
        this.photoList = [fileList[fileList.length - 1]];
      }
      this.handleCrop(file, "list1");
    },
    handleCrop(file, type) {
      this.$nextTick(() => {
        this.$refs.myCropper.open(file.raw || file, type);
      });
    },
    // 点击弹框重新时触发
    upAgain() {
      this.$refs["upload"].$refs["upload-inner"].handleClick();
    },
    
    getFile(file, type) {
      const formData = new FormData();
      formData.append("file", file);
      // 上传照片接口
      upload(formData).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          // this.companyInfo.imageUrl = res.data.data.url;
          if (type == "single") {
            this.imageUrl = res.data.data.url;
            this.editform.mainImg = this.imageUrl;
          } else if (type == "list1") {
            this.imageUrl1 = res.data.data.url;
            this.idCardImageList.push({
              name: res.data.data.name,
              url: res.data.data.url
            });
            this.editform.imgList = this.idCardImageList;
            console.log(this.idCardImageList);
          } else {
            this.imageUrl2 = res.data.data.url;
          }
          //上传成功后，关闭弹框组件
          this.$refs.myCropper.close();
        } else {
          this.$message.error("上传出错");
        }
      });
    },

    getLatlng(latLng) {
      this.editform.latitude = latLng.split(",")[0];
      this.editform.longitude = latLng.split(",")[1];
    },
    openEditDialog(row) {
      this.editdialogVisibles = true;
      this.editform = row;
      this.editoption.column[2].dicData = this.supplierTree;
      this.oldmarker = row.latitude + "," + row.longitude;
      this.oldaddress = row.address;
      console.log("--------------------" + this.oldmarker);
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
    getrowViews(row) {
      getDetail(row.stationId).then(res => {
        var data = res.data.data;
        this.dialogViewVisibles = true;
        var stationStatus;
        switch (data.stationStatus) {
          case "0":
            stationStatus = this.$t(`battery.Normal`);
            break;
          case "1":
            stationStatus = this.$t(`battery.Fault`);
            break;
          case "2":
            stationStatus = this.$t(`battery.Repairing`);
            break;
          case "3":
            stationStatus = this.$t(`battery.Castoff`);
            break;
        }
        this.rowItem = {
          item: [
            {
              title: this.$t(`station.info`),
              column: [
                {
                  label: this.$t(`station.stationCode`),
                  prop: data.stationCode
                },
                { label: this.$t(`station.imei`), prop: data.imei },
                {
                  label: this.$t(`station.stationModel`),
                  prop: data.stationModel
                },
                {
                  label: this.$t(`station.warehouseNumber`),
                  prop: data.warehouseNumber
                },
                {
                  label: this.$t(`station.expirationDate`),
                  prop: data.expirationDate
                },
                {
                  label: this.$t(`scooter.produceTime`),
                  prop: data.produceTime
                }
              ]
            },
            {
              title: this.$t(`station.stationStatus`),
              column: [
                {
                  label: this.$t(`station.stationStatus`),
                  prop: stationStatus
                },
                {
                  label: this.$t(`station.locationStatus`),
                  prop:
                    data.locationStatus == "0"
                      ? this.$t(`scooter.targeted`)
                      : this.$t(`scooter.untargeted`)
                },
                {
                  label: this.$t(`station.connectStatus`),
                  prop:
                    data.connectStatus == "0"
                      ? this.$t(`Connected`)
                      : this.$t(`Unconnected`)
                }
              ]
            },
            {
              title: this.$t(`station.associated`),
              column: [
                { label: this.$t(`AssignStore`), prop: data.storeName },
                { label: this.$t(`station.reading`), prop: data.ammeterValue },
                {
                  label: this.$t(`station.readingTime`),
                  prop: data.ammeterTime
                },
                {
                  label: this.$t(`station.startTime`),
                  prop: data.businessTimeS
                },
                { label: this.$t(`station.endTime`), prop: data.businessTimeE },
                { label: this.$t(`station.address`), prop: data.address },
                { label: this.$t(`station.supplier`), prop: data.supplierId }
              ]
            }
          ],
          fullItem: [
            // {
            //   title: "备注",
            //   prop: data.remark
            // }
          ]
        };
      });
    },
    goimportxls() {
      importxls().then(response => {
        //创建一个blob对象,file的一种
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "stationList.xls";
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
      this.currentPlace = null;
      this.currentPlace = place;
    },
    // 获取当前位置
    geolocate() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        () => {
          this.center = {
            lat: 40.4167754,
            lng: -3.7037902
          };
        }
      );
    },
    updateMaker(event) {
      this.markers[0].position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.center = marker;
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
        this.gridData = res.data.data;
      });
      this.dialogTableVisible = true;
    },

    getListData(row) {
      getChaList(row.stationCode).then(res => {
        this.chaData = res.data.data;
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
            this.gridData = res.data.data;
          });
          this.$message({
            type: "success",
            message: "success!"
          });
        });
    },

    beforeUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error(this.$t(`station.exceed`));
      }
      // return isJPG && isLt2M;
      return isLt2M;
    },

    handleSuccess(res, file) {
      console.log(res);
      this.photoUrl = URL.createObjectURL(file.raw);
      // this.photoUrl = res.data.url;
      this.data.pictureUrl = res.data.url;
    },

    insertShopPicature() {
      if (this.data.pictureUrl == "") {
        this.$message({
          type: "error",
          message: this.$t(`station.pUploadPicture`)
        });
        return;
      }

      addPhoto(this.data.pictureUrl, this.data.picturestationId).then(() => {
        getStationcPicture(this.data.picturestationId).then(res => {
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
          message: this.$t(`station.pUploadPicture`)
        });
        return;
      }

      addPic(this.pictureMainUrl).then(() => {
        getPicture().then(res => {
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
      this.$confirm(this.$t(`station.setImage`), {
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

    handleFileUploadProgress(event) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "Result", { dangerouslyUseHTMLString: true });
      this.onLoad(this.page);
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    goimportxls() {
      importxls().then(response => {
        let blob = new Blob([response.data], { type: "application/x-xls" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //配置下载的文件名
        link.download = "Station.xlsx";
        link.click();
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
        this.supplierTree = res.data.data;
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
.el-upload-list__item-delete {
  display: block;
}
.imgs {
  width: 160px;
  height: 160px;
}
.imgs img {
  width: 100%;
}
.el-icon-close {
  font-size: 16px;
}
</style>