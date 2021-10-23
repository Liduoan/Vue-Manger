/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input
          size="medium"
          v-model="formInline.phone"
          placeholder="输入用户手机号"
          @keyup.enter.native="search"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-input size="small" v-model="formInline.deptNo" placeholder="输入部门代码"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
        >
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="handleEdit()"
          v-show="formInline.isShow"
          >添加</el-button
        >
      </el-form-item>
    </el-form>

    <el-descriptions
      title="顾客基本信息"
      direction="vertical"
      :column="4"
      border
      v-show="formInline.isShow"
    >
      <el-descriptions-item label="姓名">{{
        guestInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{
        guestInfo.phone
      }}</el-descriptions-item>
      <el-descriptions-item label="余额"
        >{{ guestInfo.prices }}
      </el-descriptions-item>
      <el-descriptions-item label="生日">{{
        guestInfo.birthday
      }}</el-descriptions-item>
    </el-descriptions>

    <br />
    <!--列表-->
    <el-table
      size="middle"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%"
      title="顾客订单信息"
    >
      <el-table-column prop="guestName" label="顾客姓名" width="250">
        {{
        guestInfo.name
      }}
      </el-table-column>
      <el-table-column prop="itemName" label="消费项目" width="250">
      </el-table-column>
      <el-table-column sortable prop="itemPrice" label="消费金额" width="250">
      </el-table-column>
      <el-table-column  prop="updatedTime" label="消费时间" width="250">
        <!-- <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template> -->
      </el-table-column>

      <el-table-column  prop="username" label="操作人" width="250">
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <!-- 编辑界面 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="30%"
      @click="closeDialog"
    >
      <el-form
        label-width="120px"
        :model="editForm"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="消费项目" prop="itemName">
          <el-input
            size="small"
            v-model="editForm.itemName"
            auto-complete="off"
            placeholder="请输入消费项目名称"
          ></el-input>
        </el-form-item>

        <el-form-item  label="消费金额" prop="itemPrice">
          <el-input
            size="small"
            v-model="editForm.itemPrice"
            auto-complete="off"
            placeholder="请输入消费金额"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm('editForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete,getGuestInfo} from "../../api/userMG";
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        username: "",
        guestId: "",
        itemName: "",
        itemPrice: "",
        // token: localStorage.getItem("logintoken"),
      },
      guestInfo: {
        id: "",
        name: "",
        phone: "",
        prices: "",
        birthday: "",
      },
      // rules表单验证
      rules: {
        phone: [{ required: true, message: "请输入用户手机", trigger: "blur" }],
        deptNo: [
          { required: true, message: "请输入部门代码", trigger: "blur" },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
        phone: "",
        isShow: false,
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {
    Pagination,
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    // this.getdata(this.formInline.phone);
    this.editForm.username = localStorage.getItem("userId")
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata(parameter) {
      this.loading = true;
      //查询用户信息
      getGuestInfo(parameter)
        .then((res) => {
          console.log(res)
          this.editForm.guestId = res.data.id
          this.guestInfo.id = res.data.id
          this.guestInfo.name = res.data.name
          this.guestInfo.phone = res.data.phone
          this.guestInfo.prices = res.data.prices
          this.guestInfo.birthday = res.data.birthday
        })
        .catch((err) => {
          this.loading = false;
          this.formInline.isShow = false;
          this.$message.error("用户信息加载失败，请稍后再试！");
        });

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      deptList(parameter)
        .then((res) => {
          this.loading = false;
          if (res.code != 200) {
            this.$message({
              type: "info",
              message: "电话或姓名无效",
            });
            this.formInline.phone = "";
            this.formInline.isShow = false;
          } else {
            this.listData = res.data;
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page;
            this.pageparm.pageSize = this.formInline.limit;
            this.pageparm.total = res.count;
            this.formInline.isShow = true;
          }
        })
        .catch((err) => {
          this.loading = false;
          this.formInline.isShow = false;
          this.$message.error("菜单加载失败，请稍后再试！");
        });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline.phone);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.deptId = row.deptId;
        this.editForm.deptName = row.deptName;
        this.editForm.deptNo = row.deptNo;
      } else {
        this.title = "添加";
        this.editForm.deptId = "";
        this.editForm.deptName = "";
        this.editForm.deptNo = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate((valid) => {
        if (valid) {
          deptSave(this.editForm)
            .then((res) => {
              this.editFormVisible = false;
              this.loading = false;
              if (res.code == 200) {
                // this.getdata(this.formInline);
                this.getdata(this.formInline.phone);
                this.$message({
                  type: "success",
                  message: "订单保存成功！",
                });
              } else {
                if(res.code == 402){
                  this.$message.error({
                    type: "info",
                    message: res.data,
                  });
                }else{
                  this.$message({
                    type: "info",
                    message: res.data,
                  });
                }
              }
            })
            .catch((err) => {
              this.editFormVisible = false;
              this.loading = false;
              this.$message.error(res.data);
            });
        } else {
          return false;
        }
      });
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deptDelete(row.deptId)
            .then((res) => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "公司已删除!",
                });
                this.getdata(this.formInline);
              } else {
                this.$message({
                  type: "info",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error("公司删除失败，请稍后再试！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
  },
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 