<template>
  <div id="info" class="fullbox">
    <div class="content">
      <div class="item">
       <span class="title">可换电池电量:</span>
        <span class="info">{{form.name}}</span>
        <el-button type="primary" size="small" @click="dialogFormVisible = true">编辑</el-button>
      </div>
      <div class="item">
        <span class="title">预约有效时间/min:</span>
        <span class="info">{{form.time}}</span>
        <el-button type="primary" size="small" @click="formVisible = true">编辑</el-button>
      </div>
    </div>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <span slot="footer" class="dialog-footer">
        <el-form :model="form">
          <el-form-item label="可换电池电量" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </span>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="formVisible">
      <span slot="footer" class="dialog-footer">
        <el-form :model="form">
          <el-form-item label="预约有效时间" :label-width="formLabelWidth">
            <el-input v-model="form.time" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="formVisible = false">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import { getPamram } from "@/api/common/common";

export default {
  name: "info",
  data() {
    return {
      dialogFormVisible: false,
      formVisible: false,
      form: {
        name: "23",
        time: 15,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  mounted() {
    // getPamram('1312').then(res => {
    //   console.log(res);
    //   this.form.name = res.data.data;
    // });
  }
};
</script>

<style>
</style>


<style>
.fullbox {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-color: white;
}
.fullbox .content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.fullbox .content .item {
  padding: 12px 120px 12px 0;
}
.fullbox .content .item .info{
  padding: 0 120px;
}
.fullbox .content .item .title{
  display: inline-block;
  min-width: 200px;
  text-align: right;
}
/* .el-ROW {
    margin-bottom: 20px;
    &:LAST-child {
      margin-bottom: 0;
    }
  } */
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ROW-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>