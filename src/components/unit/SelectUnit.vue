
<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" class="custom-input-size" placeholder="営業所名入力してください" suffix-icon="el-icon-search" style="width: 200px;"
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
      <el-table-column prop="unitcode" label="営業所コード" width="180">
      </el-table-column>
      <el-table-column prop="name" label="営業所名" width="180">
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
  </div>
</template>

<script>
export default {
  name: "SeletUnit",
  data() {
    
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
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',

      centerDialogVisible: false,
      form: {

        unitcode: '',
        name: '',

        roleId: '1'
      },
    }
  },

  methods: {
   resetForm() {
      this.$refs.form.resetFields();
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
    },
    selectCurrentChange(val) {

      this.$emit("doSelectUnit", val)
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/unit/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
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

    this.loadPost()
  }
}
</script>

<style scoped>
.custom-input-size {
  font-size: 11px; /* 或者你希望设置的任何大小 */
}
</style>