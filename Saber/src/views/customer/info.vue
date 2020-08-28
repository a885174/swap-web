<template>
  <div
    id="info"
    class="fullbox"
  >
    <div class="content">
      <span>Service Number:</span>
      <span class="phone">{{form.name}}</span>
      <el-button type="primary" size="small" @click="dialogFormVisible = true">Update</el-button>
    </div>

    <el-dialog title="Update" :visible.sync="dialogFormVisible">
      <span slot="footer" class="dialog-footer">
        <el-form :model="form">
          <el-form-item label="Service Number" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">Submit</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  name: "info",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "856312131",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  }
};
</script>

<style>
</style>script


<style>
.fullbox {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-color: white;
}
.fullbox .content {
  position: absolute;
  top: 10%;
  left: 30%;
  /* transform: translate(0, -50%); */
}
.fullbox .content .phone {
  padding: 0 20px;
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