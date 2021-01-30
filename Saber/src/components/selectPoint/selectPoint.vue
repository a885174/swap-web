<template>
  <div>
    <div class="mapWrap">
      <gmap-autocomplete
        id="autocompleteStart"
        :value="form.starting_point"
        :select-first-on-enter="true"
        type="text"
        class="inputAddress"
        placeholder="Inserisci punto di partenza"
        @input="value = $event.target.value"
        @keypress.enter="$event.preventDefault()"
        @place_changed="processStartChanged"
      />
      <label class="address">{{latlngCurrent}}</label>
      <el-button @click="centerMap" icon="el-icon-aim" type="text">回到此处</el-button>
      <!-- :select-first-on-enter="true" -->
      <label class="latlng">{{starting_point}}</label>
      <gmap-map
        ref="mapRef"
        :center="centers"
        @center_changed="updateCenter"
        :zoom="zooms"
        @click="updateMarker"
        map-type-id="terrain"
        style="width: 100%; height: 100vh"
      >
        <gmap-marker
          @dragend="updateMaker"
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="centers=m.position"
        ></gmap-marker>
      </gmap-map>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    oldmarker: {
      type: String,
      default: ""
    },
    address: ""
  },
  data: function() {
    return {
      flag: false,
      reportedMapCenter: {
        lat: 23.0132656,
        lng: 113.287056
      },
      centers: null,
      zooms: 14,
      markers: [
        {
          position: { lat: 23.0132656, lng: 113.287056 }
        }
      ],
      place: null,
      form: {},
      placeStart: "",
      starting_point: "",
      latlngCurrent: "",
      markerlatlng: ""
    };
  },
  created() {
    this.sync();
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => {
      map.panTo({
        lat: Number(this.oldmarker.split(",")[0]),
        lng: Number(this.oldmarker.split(",")[1])
      });
    });
  },
  methods: {
    // 点击地图，更改选中图标位置
    updateMarker(markerValue) {
      const mlat = markerValue.latLng.lat();
      const mlon = markerValue.latLng.lng();
      this.markers[0].position = {
        lat: mlat,
        lng: mlon
      };
      this.starting_point = `${mlat},${mlon}`;
    },
    centerMap() {
      var that = this;
      that.centers = that.reportedMapCenter;
      if (that.starting_point) {
        setTimeout(function() {
          that.centers = {
            lat: Number(that.starting_point.split(",")[0]),
            lng: Number(that.starting_point.split(",")[1])
          };
        }, 50);
      } else {
        setTimeout(function() {
          that.centers = {
            lat: Number(that.oldmarker.split(",")[0]),
            lng: Number(that.oldmarker.split(",")[1])
          };
        }, 50);
      }
    },
    updateCenter(latLng) {
      this.reportedMapCenter = {
        lat: latLng.lat(),
        lng: latLng.lng()
      };
    },
    sync() {
      this.latlngCurrent = this.address;
      this.centers = {
        lat: Number(this.oldmarker.split(",")[0]),
        lng: Number(this.oldmarker.split(",")[1])
      };
      this.markers[0].position = {
        lat: Number(this.oldmarker.split(",")[0]),
        lng: Number(this.oldmarker.split(",")[1])
      };
      this.zooms = 16;
      this.starting_point = this.oldmarker;
    },
    updateMaker(event) {
      this.markers[0].position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    },

    // starting_pont 搜索框选中地址
    processStartChanged(placeStart) {
      console.log(placeStart);
      this.placeStart = placeStart;
      if (this.placeStart) {
        const lat = placeStart.geometry.location.lat();
        const lon = placeStart.geometry.location.lng();

        let starting = "";
        !placeStart.types.includes("route")
          ? (starting = placeStart.name + " " + placeStart.formatted_address)
          : (starting = placeStart.formatted_address);
        this.form.starting_point = starting;
        this.latlngCurrent = starting;
        this.starting_point = `${lat},${lon}`;
        // this.centerMap();
        this.centers = {
          lat: lat,
          lng: lon
        };
        this.markers[0].position = {
          lat: lat,
          lng: lon
        };
        this.zooms = 16;
        this.$emit("getLatlng", this.starting_point);
      }
    }
  }
};
</script>

<style>
.qqmap {
  width: 100%;
  height: 800px;
}
.mapWrap {
  position: relative;
  width: 100%;
  height: 800px;
  overflow: hidden;
  margin-top: 15px;
}
.lngTips {
  display: none;
  width: 255px;
  height: 40px;
  padding: 5px 7px;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 123456;
  background: #ffffff;
  border-radius: 5px;
  line-height: 20px;
  box-shadow: #eeeeee 1px 1px 3px;
  border: #eeeeee 1px solid;
  font-size: 12px;
}

.pac-container {
  z-index: 3000;
}
.inputAddress {
  width: 400px;
  height: 38px;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 15px;
  margin-bottom: 20px;
}
.inputAddress::-webkit-input-placeholder {
  color: #c0c4cc;
}
.inputAddress::-moz-placeholder {
  color: #c0c4cc;
}
.inputAddress:-ms-input-placeholder {
  color: #c0c4cc;
}
.address {
  font-size: 14px;
  /* color: #409eff; */
  margin: 0 10px 0px 20px;
}
.latlng{
  float: right;
}
</style>