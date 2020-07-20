<template>

<div id="info" style="  position: absolute; 
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  height: 100px;
  margin: auto;">
  可换电池电量: {{form.name}} &nbsp;&nbsp;<el-button type="primary"  @click="dialogFormVisible = true">编辑</el-button>





<el-dialog title="编辑" :visible.sync="dialogFormVisible">
  <span slot="footer" class="dialog-footer">
      <el-form :model="form">
        <el-form-item label="可换电池电量" :label-width="formLabelWidth">
      <el-input   v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
  </span>
</el-dialog>

<div>
  预约有效时间/min:{{form.time}} &nbsp;<el-button type="primary"  @click="formVisible = true">编辑</el-button>

  
<el-dialog title="编辑" :visible.sync="formVisible">
  <span slot="footer" class="dialog-footer">
      <el-form :model="form">
        <el-form-item label="预约有效时间" :label-width="formLabelWidth">
      <el-input   v-model="form.time" autocomplete="off"></el-input>
    </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
    <el-button @click="formVisible = false">取 消</el-button>
    <el-button type="primary" @click="formVisible = false">确 定</el-button>
  </div>
  </span>
</el-dialog>
</div>
</div>
</template>



<script>

  import {getPamram} from "@/api/common/common";

  export default {
    name: 'info',
    data() {
      return {
        dialogFormVisible: false,
        formVisible:false,
        form: {
          name: '23',
          time: 15,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
        
      };
      
    },
      mounted () {

          // getPamram('1312').then(res => {
          //   console.log(res);
          //   this.form.name = res.data.data;
          // });
  },
  };
</script>

<style>

</style>


<style>
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
    MIN-height: 36px;
  }
  .ROW-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>