<template>
  <div class="avue-map">
      <p>{{address}}</p>

<!-- <el-input :disabled="true" v-model="address"></el-input> -->

    <el-button @click="box=true"
               class="avue-map__submit">{{textTitle}}</el-button>
    <el-dialog
               class="avue-map__dialog"
               width="60%"
               append-to-body
               modal-append-to-body
               title="选择坐标"
               @close="handleClose"
               :visible.sync="box">
      <div class="avue-map__content"
           v-if="box">
        <!-- <el-input class="avue-map__content-input"
                  id="map__input"
                  size="small"
                  v-model="text"
                  clearable
                  placeholder="输入关键字选取地点"></el-input> -->
        <div class="avue-map__content-box">
          <div id="map__container"
               class="avue-map__content-container"
                ref="basicMapbox" 
               tabindex="0">
                        <pre id='info'></pre>
    <pre id='coordinates' class='coordinates'></pre>
               </div>
          <div id="map__result"
               class="avue-map__content-result"></div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
export default {
  name: "AvueMap",
  props: {
    lnglat: {
      type: Object,
      default: () => {
        return {};
      }
    },
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      poi: {},
      marker: null,
      map: null,
      text: "",
      address:this.lnglat.longitude+","+this.lnglat.latitude,
      box: false
    };
  },
  watch: {
    box: {
      handler() {
        if (this.box) {
          this.$nextTick(() =>
            this.init(() => {
              console.log(this.lnglat)
              const P = this.lnglat.latitude;
              const R = this.lnglat.longitude;
              console.log(P,R)
              if(! P =="0"&&! R =="0"){
                  this.addMarker(R, P);
                          this.map.setCenter([R, P]);

              }
            })
          );
          
        }
      },
      immediate: true
    },
     lnglat:{
    handler(newValue,oldValue){
      this.address=newValue.longitude+","+newValue.latitude;
    },
    deep:true
  },
  },
  computed: {
    
    P() {
      return this.lnglat.P || 0;
    },
    R() {
      return this.lnglat.R || 0;
    },
    textTitle() {
      return this.poi.name === undefined ? "选择坐标" : "重新选择";
    }
  },
  methods: {
    //新增坐标
    addMarker(R, P) {
      console.log(1111)
      this.clearMarker();
      this.marker = new mapboxgl.Marker({
        position: [R, P],
          draggable: true
      });
    this.marker.setLngLat([R,P]).addTo( this.map)

      // this.marker.addTo(this.map);
    },
    //清空坐标
    clearMarker() {
      if (this.marker) {
        this.marker.remove();
        this.marker = null;
      }
    },
    //获取坐标
    // getAddress(R, P) {
    //   new window.AMap.service("AMap.Geocoder", () => {
    //     //回调函数
    //     let geocoder = new window.AMap.Geocoder({});
    //     geocoder.getAddress([R, P], (status, result) => {
    //       if (status === "complete" && result.info === "OK") {
    //         const regeocode = result.regeocode;
    //         this.poi = Object.assign(regeocode, {
    //           longitude: R,
    //           latitude: P
    //         });
    //         this.text = regeocode.formattedAddress;
    //         // 自定义点标记内容
    //         var markerContent = document.createElement("div");

    //         // 点标记中的图标
    //         var markerImg = document.createElement("img");
    //         markerImg.src =
    //           "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
    //         markerContent.appendChild(markerImg);

    //         // 点标记中的文本
    //         var markerSpan = document.createElement("span");
    //         markerSpan.className = "avue-map__marker";
    //         markerSpan.innerHTML = this.text;
    //         markerContent.appendChild(markerSpan);
    //         this.marker.setContent(markerContent); //更新点标记内容
    //       }
    //     });
    //   });
    // },
    handleClose() {
      this.text = "";
      // window.poiPicker.clearSearchResults();
      this.poi = {};
    },
    handleSubmit() {
      
      console.log(  );
      if(this.marker !=null){
        this.address = this.marker._lngLat. lng+","+this.marker._lngLat.lat;
       this.$emit("sendiptVal", JSON.stringify(this.marker._lngLat)) 
      }
          
      this.poi = {};
      this.box = false;
    },
    addClick() {
      this.map.on("click", e => {
        console.log(e)
        const lnglat = e.lngLat;
        const P = lnglat.lat;
        const R = lnglat.lng;
        document.getElementById('info').innerHTML =  JSON.stringify(e.lngLat)
        this.addMarker(R, P);
        // this.getAddress(R, P);
      });
    },
    init(callback) {
      mapboxgl.accessToken ='pk.eyJ1Ijoic3dhcGVuZXJnaSIsImEiOiJjazQwenA4eGgwN2FuM2ttczV3d3pnbzM3In0.vHSZs-Iv1m16miOc58z1mA'
            this.map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        center: [12.550343, 55.665957],
        zoom: 11,
        style: 'mapbox://styles/mapbox/streets-v11'
      });


    // 使用定位模块
         this.map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserLocation: true,
            zoom: 14,
        }))


        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
               mapboxgl: mapboxgl

        }));

         this.map.addControl(new mapboxgl.NavigationControl());




      

      
       this.addClick();
      callback();
    },
    initPoip() {
      window.AMapUI.loadUI(["misc/PoiPicker"], PoiPicker => {
        var poiPicker = new PoiPicker({
          input: "map__input",
          placeSearchOptions: {
            map: this.map,
            pageSize: 10
          },
          searchResultsContainer: "map__result"
        });
        //初始化poiPicker
        this.poiPickerReady(poiPicker);
      });
    },
    poiPickerReady(poiPicker) {
      window.poiPicker = poiPicker;
      //选取了某个POI
      poiPicker.on("poiPicked", poiResult => {
        this.clearMarker();
        var source = poiResult.source,
          poi = poiResult.item;
        this.text = poi.name;
        this.poi = poi;
        if (source !== "search") {
          poiPicker.searchByKeyword(poi.name);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.amap-icon img,
.amap-marker-content img {
  width: 25px;
  height: 34px;
}
.avue-map {
  &__submit {
    width: 100%;
  }
  &__marker {
    position: absolute;
    top: -20px;
    right: -118px;
    color: #fff;
    padding: 4px 10px;
    box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
    white-space: nowrap;
    font-size: 12px;
    font-family: "";
    background-color: #25a5f7;
    border-radius: 3px;
  }
  &__content {
    &-input {
      margin-bottom: 10px;
    }
    &-box {
      position: relative;
    }
    &-container {
      width: 100%;
      height: 450px;
    }
    &-result {
      display: block !important;
      position: absolute;
      top: 0;
      right: -8px;
      width: 250px;
      height: 450px;
      overflow-y: auto;
    }
  }
}
</style>
<style>
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
</style>