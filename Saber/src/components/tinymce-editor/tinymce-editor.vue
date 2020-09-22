<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/icons/default";
import "@/static/tinymce/skins/ui/oxide/skin.css";
import { uploadPics } from "@/api/swap_message/message";
export default {
  components: {
    Editor
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: "lists image media table textcolor wordcount contextmenu"
    },
    toolbar: {
      type: [String, Array],
      default:
        "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat"
    },
    maxSize: {
      default: 2097152,
      type: Number
    },
    url: {
      default: "",
      type: String
    },
    accept: {
      default: "image/jpeg, image/png",
      type: String
    },
    withCredentials: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      tinymceHtml: "请输入内容",
      //初始化配置
      init: {
        // skin_url: '/static/tinymce/skins/lightgray',
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        convert_urls: false,
        // images_upload_url: `http://47.112.171.131/`,
        // images_upload_credentials:true,
        // relative_urls: false,
        // remove_script_host: false,
        // menubar: false,
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          //   const img = "data:image/jpeg;base64," + blobInfo.base64();
          //   success(img);

          const self = this;
          console.log("blobInfo我被调用了");
          if (blobInfo.blob().size > self.maxSize) {
            failure("文件体积过大");
          }
          if (self.accept.indexOf(blobInfo.blob().type) > 0) {
            uploadPic();
          } else {
            failure("图片格式错误");
          }
          function uploadPic() {
            console.log("uploadPic");
            // const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", blobInfo.blob());

            uploadPics(formData).then(
              data => {
                console.log(data.data.data.url);
                success(data.data.data.url);
              },
              error => {
                this.$message({
                  type: "error",
                  message: error
                });
                console.log(error);
              }
            );
          }
        }
      },
      myValue: this.value
    };
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
<style scoped>
</style>