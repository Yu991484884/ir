<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="corporateentity" placeholder="企業体検索" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">検索</el-button>
      <el-button type="success" @click="resetParam">クリア</el-button>

    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
              highlight-current-row
              @current-change="selectCurrentChange">
      <el-table-column prop="no" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="id" label="企業体番号" width="180">
      </el-table-column>
      <el-table-column prop="corporateentity" label="企業体名" width="300">
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
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="ID" prop="no">
          <el-col :span="20">
            <el-input v-model="form.no"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="企業体番号" prop="id">
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
  name: "SelectCorporate",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      corporateentity: '',

      centerDialogVisible: false,
      form: {
        id: '',
        no: '',
        corporateentity: '',
      },
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
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
    loadGet() {
      this.$axios.get(this.$httpUrl + '/corporate/listP').then(res => res.data).then(res => {
        console.log(res)
      })
    },
    resetParam() {
      this.name = ''
      // this.sex = ''
    },
    selectCurrentChange(val) {
      //this.currentRow = val;
      this.$emit("doSelectCorporate", val)
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/corporate/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          corporateentity: this.corporateentity,
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
    //this.loadGet();
    this.loadPost()
  }
}
</script>

<style scoped>

</style>