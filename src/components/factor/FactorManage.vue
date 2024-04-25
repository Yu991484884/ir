<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="factor" placeholder="要因名検索" suffix-icon="el-icon-search" style="width: 200px;"
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
      <el-table-column prop="id" label="IR管理番号" width="90">
      </el-table-column>
      <el-table-column prop="factor" label="要因名称" width="300">
      </el-table-column>
      <el-table-column prop="comment" label="備考" width="300">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">編集</el-button>
          <el-popconfirm
              title="削除します？"
              @confirm="del(scope.row.no)"
              style="margin-left: 5px;">
            <el-button slot="reference" size="small" type="danger">削除</el-button>
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
        title="編集"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>


        <!-- 下面开始为表单 就是在表格里面数据回显  -->
      <el-form ref="form" :rules="rules" :model="form" label-width="150px">
        <el-form-item label="IR管理番号" prop="id">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="要因名称" prop="factor">
          <el-col :span="20">
            <el-input v-model="form.factor"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="備考" prop="comment">
          <el-col :span="20">
            <el-input v-model="form.comment"></el-input>
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
  //设置为当前vue的名称  ⭐⭐⭐⭐⭐
  name: "FactorManage",
  data() {

    let checkDuplicate = (rule, value, callback) => {
        if (this.form.id) {
          return callback();
        }
        this.$axios.get(this.$httpUrl + "/factor/findById?id=" + this.form.id).then(res => res.data).then(res => {
          if (res.code != 200) {
            callback()
          } else {
            callback(new Error('既に存在している管理番号'));
          }
        })
      };
    
    return {
      tableData: [],
      pageSize: 30,
      pageNum: 1,
      total: 0,
      factor: '',
      centerDialogVisible: false,
      form: {
        no:'',
        id:'',
        factor: '',
        comment:'',
      },
      rules: {
        id:[
        {required: true, message: '管理番号入力', trigger: 'blur'},
          {validator: checkDuplicate, trigger: 'blur'}
        ],
        factor: [
          {required: true, message: '要因名称入力', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(no) {
      console.log(no)

      this.$axios.get(this.$httpUrl + '/factor/delete?no=' + no).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.loadPost()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },
    mod(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {

        //赋值到表单 修改数据时候的回显设置 
        this.form.no = row.no
        this.form.id = row.id
        this.form.factor = row.factor
        this.form.comment = row.comment

      })
    },
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm()
      })

    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/factor/save', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/factor/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '操作失败！',
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
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    resetParam() {
      this.factor = ''
      // this.comment =''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/factor/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          factor: this.factor,
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('获取数据失败')
        }

      })
    }
  },
  beforeMount() {
    this.loadPost()
  }
}
</script>

<style scoped>

</style>