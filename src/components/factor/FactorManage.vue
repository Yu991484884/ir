<template>
  <div class="factor-manage-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="factor"
            class="search-input"
            placeholder="要因名を入力してください"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="search"
          />
<el-button type="primary" icon="el-icon-search" @click="search">
  検索
</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetParam">
            クリア
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-button type="primary" icon="el-icon-plus" @click="add">
            新規
          </el-button>
        </div>
      </div>

      <!-- テーブル -->
      <el-table
        :data="tableData"
        border
        stripe
        class="custom-table"
        :header-cell-style="{
          background: '#f5f7fa',
          color: '#303133',
          fontWeight: '600'
        }"
      >
<el-table-column prop="no" label="IR管理番号" width="140" align="center" />
        <el-table-column prop="factor" label="要因名称" min-width="260" />
        <el-table-column prop="comment" label="備考" min-width="260" />
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="mod(scope.row)">
              編集
            </el-button>
            <el-popconfirm
              title="削除しますか？"
              @confirm="del(scope.row.no)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                plain
                class="btn-delete"
              >
                削除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
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

    <!-- ダイアログ -->
    <el-dialog
      :title="form.no ? '要因編集' : '要因新規登録'"
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
        label-width="120px"
        class="custom-form"
      >
<el-form-item label="IR管理番号">
  <el-input
    :value="form.no || '自動採番'"
    disabled
  />
</el-form-item>

        <el-form-item label="要因名称" prop="factor">
          <el-input
            v-model="form.factor"
            placeholder="要因名称を入力"
            clearable
          />
        </el-form-item>

        <el-form-item label="備考" prop="comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            :rows="3"
            placeholder="備考を入力"
          />
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
  name: "FactorManage",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      factor: "",
      centerDialogVisible: false,
      form: {
        no: "",
        factor: "",
        comment: ""
      },
      rules: {
        factor: [
          { required: true, message: "要因名称を入力してください", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    resetForm() {
      this.form = {
        no: "",
        factor: "",
        comment: ""
      };

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

        search() {
  this.pageNum = 1;
  this.loadPost();
},

    del(no) {
      this.$axios
        .get(this.$httpUrl + "/factor/delete?no=" + no)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: "削除完了！",
              type: "success"
            });
            this.loadPost();
          } else {
            this.$message({
              message: res.msg || "削除失敗！",
              type: "error"
            });
          }
        });
    },

    mod(row) {
      this.form = {
        no: row.no,
        factor: row.factor,
        comment: row.comment
      };

      this.centerDialogVisible = true;

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    add() {
      this.resetForm();
      this.centerDialogVisible = true;
    },

    doSave() {
      const saveData = {
        factor: this.form.factor,
        comment: this.form.comment
      };

      this.$axios
        .post(this.$httpUrl + "/factor/save", saveData)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: "登録完了！",
              type: "success"
            });
            this.centerDialogVisible = false;
            this.loadPost();
            this.resetForm();
          } else {
            this.$message({
              message: res.msg || "登録失敗！",
              type: "error"
            });
          }
        });
    },

    doMod() {
      const updateData = {
        no: this.form.no,
        factor: this.form.factor,
        comment: this.form.comment
      };

      this.$axios
        .post(this.$httpUrl + "/factor/update", updateData)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: "更新完了！",
              type: "success"
            });
            this.centerDialogVisible = false;
            this.loadPost();
            this.resetForm();
          } else {
            this.$message({
              message: res.msg || "更新失敗！",
              type: "error"
            });
          }
        });
    },



    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.no) {
            this.doMod();
          } else {
            this.doSave();
          }
        }
      });
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
      this.factor = "";
      this.pageNum = 1;
      this.loadPost();
    },

    loadPost() {
      this.$axios
        .post(this.$httpUrl + "/factor/listPageC1", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            factor: this.factor
          }
        })
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.$message.error(res.msg || "データ取得失敗");
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
.factor-manage-page {
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

.toolbar-left,
.toolbar-right {
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

.btn-delete {
  margin-left: 8px;
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

.custom-form /deep/ .el-input__inner,
.custom-form /deep/ .el-textarea__inner {
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

  .toolbar-left,
  .toolbar-right {
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