<template>
  <div class="select-corporate-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="corporateentity"
            class="search-input"
            placeholder="企業体名を入力してください"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="loadPost"
          />
          <el-button type="primary" icon="el-icon-search" @click="loadPost">
            検索
          </el-button>
          <el-button icon="el-icon-refresh-left" @click="resetParam">
            クリア
          </el-button>
        </div>
      </div>

      <!-- テーブル -->
      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        class="custom-table"
        :header-cell-style="{
          background: '#f5f7fa',
          color: '#303133',
          fontWeight: '600'
        }"
        @current-change="selectCurrentChange"
      >
        <el-table-column prop="no" label="ID" width="80" align="center" />
        <el-table-column prop="id" label="企業体番号" width="180" align="center" />
        <el-table-column prop="corporateentity" label="企業体名" min-width="260" />
      </el-table>

      <!-- ページネーション -->
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        />
      </div>
    </div>

    <!-- 詳細ダイアログ -->
    <el-dialog
      title="企業体情報"
      :visible.sync="centerDialogVisible"
      width="560px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="custom-dialog"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="110px"
        class="custom-form"
      >
        <el-form-item label="ID" prop="no">
          <el-input v-model="form.no" />
        </el-form-item>

        <el-form-item label="企業体番号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>

        <el-form-item label="企業体名" prop="corporateentity">
          <el-input v-model="form.corporateentity" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">確定</el-button>
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
      corporateentity: "",

      centerDialogVisible: false,
      form: {
        id: "",
        no: "",
        corporateentity: ""
      },
      rules: {}
    };
  },
  methods: {
    resetForm() {
      this.form = {
        id: "",
        no: "",
        corporateentity: ""
      };

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    mod(row) {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.form.id = row.id;
        this.form.no = row.no;
        this.form.corporateentity = row.corporateentity;
      });
    },

    save() {
      this.centerDialogVisible = false;
    },

    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.loadPost();
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.loadPost();
    },

    resetParam() {
      this.corporateentity = "";
      this.pageNum = 1;
      this.loadPost();
    },

    selectCurrentChange(val) {
      this.$emit("doSelectCorporate", val);
    },

    loadPost() {
      this.$axios
        .post(this.$httpUrl + "/corporate/listPageC1", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            corporateentity: this.corporateentity
          }
        })
        .then(res => res.data)
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.$message.error("データ取得失敗");
          }
        })
        .catch(() => {
          this.$message.error("データ取得に失敗しました");
        });
    }
  },
  beforeMount() {
    this.loadPost();
  }
};
</script>

<style scoped>
.select-corporate-page {
  padding: 20px;
  background: #f7f8fa;
  min-height: 100%;
  box-sizing: border-box;
}

.page-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  width: 260px;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.custom-dialog /deep/ .el-dialog {
  border-radius: 14px;
  overflow: hidden;
}

.custom-dialog /deep/ .el-dialog__header {
  background: linear-gradient(90deg, #409eff, #66b1ff);
  padding: 18px 20px;
}

.custom-dialog /deep/ .el-dialog__title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.custom-dialog /deep/ .el-dialog__body {
  padding: 24px 24px 10px;
}

.custom-form /deep/ .el-form-item__label {
  font-weight: 600;
  color: #303133;
}

.custom-form /deep/ .el-input__inner {
  border-radius: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 10px 0 5px;
}

.dialog-footer .el-button {
  min-width: 100px;
  border-radius: 8px;
}

@media screen and (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .pagination-wrap {
    justify-content: center;
  }
}
</style>