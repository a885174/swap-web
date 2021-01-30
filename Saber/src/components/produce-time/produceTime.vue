<template>
  <div class="produce_time">
    <el-select
      @change="changeTimeType"
      v-model="timeType"
      placeholder="请选择"
      style="width:200px !important"
    >
      <el-option
        v-for="item in timeTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div v-if="timeType=='2'" class="selectitems">
      <el-select :value="'8 * 5'" placeholder="请选择" style="width:200px !important">
        <el-option :label="'8 * 5'" :value="'8 * 5'"></el-option>
      </el-select>
      <el-time-picker
        :clearable="false"
        is-range
        v-model="fixedTime"
        range-separator="-"
        start-placeholder="Start Time"
        end-placeholder="End Time"
        placeholder="选择时间范围"
        style="width: 200px !important;"
        class="timePicker"
        value-format="HH:mm"
        format="HH:mm"
      ></el-time-picker>
    </div>
    <div v-if="timeType=='3'" class="selectitems">
      <div v-for="(item, index) in ruleForm.list" :key="index" class="weekItem">
        <el-select
          multiple
          v-model="item.week"
          @change="selectChange(item.week,index)"
          placeholder="请选择"
          style="width: 320px !important;"
        >
          <el-option
            v-for="(item,optionIndex)  in weekOptions"
            :key="optionIndex"
            :label="item.label"
            :disabled="getDisable(item.value)"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-time-picker
          :clearable="false"
          is-range
          v-model="item.fixedTime"
          range-separator="-"
          start-placeholder="Start Time"
          end-placeholder="End Time"
          placeholder="选择时间范围"
          style="width: 200px !important;"
          class="timePicker"
          @change="timeChange"
          value-format="HH:mm"
          format="HH:mm"
        ></el-time-picker>
        <i v-if="ruleForm.list.length>1" class="el-icon-remove ico" @click="del(index)"></i>
      </div>
      <i v-if="fuSelectedLust.length<7" class="el-icon-circle-plus ico" @click="add"></i>
    </div>
  </div>
</template>

<script>
// 添加数组自定义事件 用来删除数组中的某一项
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
export default {
  data() {
    return {
      // 时间类型数组
      timeTypeOptions: [
        {
          value: "1",
          label: "24 * 7"
        },
        {
          value: "2",
          label: "8 * 5"
        },
        {
          value: "3",
          label: "已定义"
        }
      ],
      //选定的时间类型
      timeType: "1",
      currentType: "",
      // 固定时间范围
      fixedTime: [new Date(2021, 1, 28, 8, 30), new Date(2021, 1, 28, 17, 30)],
      ruleForm: {
        list: [
          {
            week: "",
            fixedTime: [
              new Date(2021, 1, 28, 8, 30),
              new Date(2021, 1, 28, 17, 30)
            ]
          }
        ]
      },
      weekOptions: [
        {
          label: "Monday",
          value: "Monday"
        },
        {
          label: "Tuesday",
          value: "Tuesday"
        },
        {
          label: "Wednesday",
          value: "Wednesday"
        },
        {
          label: "Thursday",
          value: "Thursday"
        },
        {
          label: "Friday",
          value: "Friday"
        },
        {
          label: "Saturday",
          value: "Saturday"
        },
        {
          label: "Sunday",
          value: "Sunday"
        }
      ],
      weeklist: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      selectedOptions: [],
      fuSelectedLust: []
    };
  },
  methods: {
    changeTimeType(value) {
      console.log(this.timeType);
    },
    selectChange(value, index) {
      console.log(arguments);
      console.log(value, index);
      this.selectedOptions[index] = value;
    //   if (this.selectedOptions.length > 0) {
        let allList = [];
        this.selectedOptions.forEach(element => {
          allList = [...new Set([...allList, ...element])];
        });
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(allList);
        this.fuSelectedLust = allList;
    //   } else {
    //     this.fuSelectedLust = value;
    //   }
      //   this.fuSelectedLust = RemoveSame;
    },
    getDisable(value) {
      if (this.fuSelectedLust.indexOf(value) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    timeChange(val) {
      console.log(this.ruleForm);
    },
    add() {
      console.log(this.weeklist);
      console.log(this.selectedOptions);
      let RemoveSame = [
        ...new Set([...this.weeklist, ...this.selectedOptions])
      ];
      console.log(RemoveSame);
      let SamePart = this.weeklist.filter(item =>
        this.selectedOptions.includes(item)
      );
      console.log(SamePart);
      let Difference = RemoveSame.filter(item => !SamePart.includes(item));
      console.log(Difference);
      this.ruleForm.list.push({
        week: "",
        fixedTime: [new Date(2021, 1, 28, 8, 30), new Date(2021, 1, 28, 17, 30)]
      });
      console.log(this.ruleForm.list);
    },
    del(index) {
      // 删除时恢复可选
      if (this.ruleForm.list[index] || this.ruleForm.list[index] == 0) {
        this.selectedOptions.remove(this.ruleForm.list[index].week);
      }
      console.log(this.selectedOptions);
      this.ruleForm.list.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.selectitems {
  margin-top: 20px;
}
.timePicker {
  margin-left: 20px;
}
.weekItem {
  margin-top: 10px;
}
.el-icon-remove {
  margin-left: 10px;
  font-size: 18px;
  line-height: 38px;
  color: crimson;
}
.el-icon-circle-plus {
  color: green;
  font-size: 18px;
}
</style>