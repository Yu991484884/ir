<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" class="custom-input-size" placeholder="営業所名入力してください" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">検索</el-button>
      <el-button type="success" @click="resetParam">クリア</el-button>

      <el-button type="primary" style="margin-left: 5px;" @click="add">新規</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border>
      <!-- <el-table-column prop="no" label="ID" width="60">
      </el-table-column> -->
      <el-table-column prop="unitcode" label="営業所コード" width="100">
      </el-table-column>
      <el-table-column prop="name" label="営業所名" width="200">
      </el-table-column>

      <!-- <el-table-column prop="createdate" label="作成時間" width="180">
      </el-table-column>
      <el-table-column prop="updatedate" label="更新時間" width="180">
      </el-table-column> -->
      <el-table-column prop="operate" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)" style="margin-left: 10px;">編集</el-button>
          <el-popconfirm
              title="本当に削除しますか？"
              @confirm="del(scope.row.no)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger" style="margin-left: 10px;">削除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20,30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog
        title="編集画面"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="150px">
        <el-form-item label="営業所コード" prop="unitcode">
          <el-col :span="20">
            <el-input v-model="form.unitcode"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="営業所名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取　消</el-button>
    <el-button type="primary" @click="save">確　定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UnitManage",  //设置为当前vue的名称 ⭐⭐⭐⭐⭐
  data() {
    let checkAge = (rule, value, callback) => {
      if (value > 150) {
        callback(new Error('規定年齢超えます'));
      } else {
        callback();
      }
    };
    let checkDuplicate = (rule, value, callback) => {
      if (this.form.no) {
        return callback();
      }
      this.$axios.get(this.$httpUrl + "/unit/findByNo?unitcode=" + this.form.unitcode).then(res => res.data).then(res => {
        if (res.code != 200) {

          callback()
        } else {
          callback(new Error('営業所コード既に登録済'));
        }
      })
    };

    return {
      tableData: [],
      pageSize: 30,
      pageNum: 1,
      total: 0,
      name: '',
      // sex: '',
      // sexs: [
      //   {
      //     value: '1',
      //     label: '男'
      //   }, {
      //     value: '0',
      //     label: '女'
      //   }
      // ],
      centerDialogVisible: false,
      form: {
        // no: '',
        unitcode: '',
        name: '',
        // createdate: '',
        // updatedate: '',
        // phone: '',
        // sex: '0',
        roleId: '1'
      },
      rules: {
        unitcode: [
          {required: true, message: '営業所コード', trigger: 'blur'},
          {max: 8, message: '8桁まで', trigger: 'blur'},
          {validator: checkDuplicate, trigger: 'blur'}
        ],
        name: [
          {required: true, message: '営業所名', trigger: 'blur'}
        ],
        // password: [
        //   {required: true, message: '请输入密码', trigger: 'blur'},
        //   {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
        // ],
        // age: [
        //   {required: true, message: '请输入年龄', trigger: 'blur'},
        //   {min: 1, max: 3, message: '长度在 1 到 3 个位', trigger: 'blur'},
        //   {pattern: /^([1-9][0-9]*){1,3}$/, message: '年龄必须为正整数字', trigger: "blur"},
        //   {validator: checkAge, trigger: 'blur'}
        // ],
        // phone: [
        //   {required: true, message: "手机号不能为空", trigger: "blur"},
        //   {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}
        // ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(no) {
      console.log(no)

      this.$axios.get(this.$httpUrl + '/unit/delete?no=' + no).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '削除完了！',
            type: 'success'
          });
          this.loadPost()
        } else {
          this.$message({
            message: '削除失败！',
            type: 'error'
          });
        }

      })
    },
    mod(row) {
      console.log(row)

      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.no = row.no
        this.form.unitcode = row.unitcode
        this.form.name = row.name
        // this.form.password = ''
        // this.form.age = row.age + ''
        // this.form.sex = row.sex + ''
        // this.form.phone = row.phone
        this.form.roleId = row.roleId
      })
    },
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm()
      })

    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/unit/save', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '新規登録完了！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '新規登録失敗！',
            type: 'error'
          });
        }

      })
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/unit/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message({
            message: '更新完了！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '更新失敗！',
            type: 'error'
          });
        }

      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.no) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    handleSizeChange(val) {
      console.log(`１ページ ${val} 件`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当ページ: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    loadGet() {
      this.$axios.get(this.$httpUrl + '/unit/listPageC1').then(res => res.data).then(res => {
        console.log(res)
      })
    },
    resetParam() {
      this.name = ''
      // this.sex = ''
    },
    loadPost() {
      // this.$axios.post(this.$httpUrl + '/user/listPage', 
      this.$axios.post(this.$httpUrl + '/unit/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          // sex: this.sex,
          roleId: '1'
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('レスポンスエラー')
        }

      })
    }
  },
  beforeMount() {
    //this.loadGet();
    this.loadPost()
  }
}
</script>

<style scoped>
.custom-input-size {
  font-size: 11px; /* 或者你希望设置的任何大小 */
}
</style>