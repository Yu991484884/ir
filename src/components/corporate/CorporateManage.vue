<template>
    <div>
      <div style="margin-bottom: 5px;">
        <el-input v-model="id" placeholder="企業体コード検索" suffix-icon="el-icon-search" style="width: 200px;"
                  @keyup.enter.native="loadPost"></el-input>
  
        <el-input v-model="corporateentity" placeholder="企業体名検索" suffix-icon="el-icon-search" style="width: 200px;"
                  @keyup.enter.native="loadPost"></el-input>          

        <el-button type="primary" style="margin-left: 5px;" @click="loadPost">検索</el-button>
        <el-button type="success" @click="resetParam">クリア</el-button>
  
        <!-- <el-button type="primary" style="margin-left: 5px;" @click="doSave">新增</el-button> -->
        <el-button type="primary" style="margin-left: 5px;" @click="add">新規</el-button>
      </div>
      <el-table :data="tableData"
                :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
                border>
        <el-table-column prop="no" label="ID" width="60">
        </el-table-column>
        <el-table-column prop="id" label="企業体コード" width="180">
        </el-table-column>
        <el-table-column prop="corporateentity" label="企業体名" width="250">
        </el-table-column>

        <el-table-column prop="operate" label="操作"　width="200">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="mod(scope.row)" style="margin-left: 10px;">編集</el-button>
            <el-popconfirm
                title="削除しますか？"
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
          title="編集"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
  
        <el-form ref="form" :rules="rules" :model="form" label-width="150px">
          <el-form-item label="企業体コード" prop="id">
            <el-col :span="20">
              <el-input v-model="form.id"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="企業体名" prop="corporateentity">
            <el-col :span="20">
              <el-input v-model="form.corporateentity"></el-input>
            </el-col>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: "CorporateManage",　//设置为当前vue的名称 
    data() {
      let checkDuplicate = (rule, value, callback) => {
        if (this.form.no) {
          return callback();
        }
        this.$axios.get(this.$httpUrl + "/corporate/findByNo?id=" + this.form.id).then(res => res.data).then(res => {
          if (res.code != 200) {
            callback()
          } else {
            callback(new Error('既に存在しているID'));
          }
        })
      };
  
      return {
        tableData: [],
        pageSize: 30,
        pageNum: 1,
        total: 0,
        corporateentity: '',
        id:'',

        centerDialogVisible: false,
        form: {
          id: '',
          no: '',
          corporateentity: '',
          // roleid: '2'
        },
        rules: {
          id: [
            {required: true, message: '企業体コード入力', trigger: 'blur'},
            // { min: 3,max: 5, message: '3桁から8桁まで', trigger: 'blur'},
            {validator: checkDuplicate, trigger: 'blur'}
          ],
          corporateentity: [
            {required: true, message: '企業体名入力', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs.form.resetFields();
      },
      del(no) {
        console.log(no)
  
        this.$axios.get(this.$httpUrl + '/corporate/delete?no=' + no).then(res => res.data).then(res => {
          console.log(res)
          if (res.code == 200) {
  
            this.$message({
              message: '削除完了！',
              type: 'success'
            });
            this.loadPost()
          } else {
            this.$message({
              message: '削除失敗！',
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
          this.form.id = row.id
          this.form.no = row.no             
          this.form.corporateentity = row.corporateentity
        })
      },
      add() {
  
        this.centerDialogVisible = true
        this.$nextTick(() => {
          this.resetForm()
        })
  
      },
      doSave() {
        this.$axios.post(this.$httpUrl + '/corporate/save', this.form).then(res => res.data).then(res => {
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
        this.$axios.post(this.$httpUrl + '/corporate/update', this.form).then(res => res.data).then(res => {
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
        console.log(`マイページ ${val} `);
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
        this.$axios.get(this.$httpUrl + '/corporate/listP').then(res => res.data).then(res => {
          console.log(res)
        })
      },
      resetParam() {
        this.corporateentity = ''
        this.id = ''
      },
      loadPost() {
        // this.$axios.post(this.$httpUrl + '/user/listPage', 
        this.$axios.post(this.$httpUrl + '/corporate/listPageC1', {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            id: this.id,
            corporateentity: this.corporateentity,
            // roleId: '2'
          }
        }).then(res => res.data).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.tableData = res.data
            this.total = res.total
          } else {
            alert('DATA取得失敗')
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
      .no-color {
      color: initial; /* 或者使用 'inherit' 来从父元素继承颜色，或指定一个具体的颜色 */
    }
  </style>