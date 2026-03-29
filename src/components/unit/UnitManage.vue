<template>
  <div class="unit-manage-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="name"
            class="search-input"
            placeholder="営業所名を入力してください"
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
        <el-table-column prop="unitcode" label="営業所コード" width="140" align="center" />
        <el-table-column prop="name" label="営業所名" min-width="220" />
        <el-table-column prop="parentid" label="センターCD" width="120"></el-table-column>
        <el-table-column prop="parentnm" label="センター名" width="200"></el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="mod(scope.row)">
              編集
            </el-button>
            <el-popconfirm
              title="本当に削除しますか？"
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
      :title="form.no ? '営業所編集' : '営業所新規登録'"
      :visible.sync="centerDialogVisible"
      width="520px"
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
        <el-form-item
          v-if="!form.no"
          label="営業所コード"
          prop="unitcode"
        >
          <el-input
            v-model="form.unitcode"
            placeholder="営業所コードを入力"
            prefix-icon="el-icon-document-copy"
            clearable
            maxlength="8"
            show-word-limit
          />
        </el-form-item>

        <el-form-item v-else label="営業所コード">
          <el-input
            v-model="form.unitcode"
            disabled
            prefix-icon="el-icon-document-copy"
          />
        </el-form-item>

        <el-form-item label="営業所名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="営業所名を入力"
            prefix-icon="el-icon-office-building"
            clearable
          />
        </el-form-item>

<el-form-item label="上位組織名" prop="parentnm">
  <el-col :span="20">
    <el-select
      v-model="form.parentid"
      placeholder="センター選択"
      style="width:100%"
      @change="centerChange">

      <el-option
        v-for="item in centerList"
        :key="item.centercd"
        :label="item.centernm"
        :value="item.centercd">
      </el-option>

    </el-select>
  </el-col>
</el-form-item>



      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="save">
          確定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UnitManage",
  data() {
    const checkUnitCodeNumber = (rule, value, callback) => {
      if (!value) {
        return callback();
      }

      if (!/^[0-9]+$/.test(value)) {
        callback(new Error("数字で入力してください"));
      } else {
        callback();
      }
    };

    const checkDuplicate = (rule, value, callback) => {
      if (!value) {
        return callback();
      }

      if (this.form.no) {
        return callback();
      }

      this.$axios
        .get(this.$httpUrl + "/unit/findByNo?unitcode=" + value)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            callback(new Error("営業所コードは既に登録済です"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("重複チェック処理に失敗しました"));
        });
    };

    
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: "",
      centerDialogVisible: false,
        centerList: [],   

      form: {
        no: "",
        unitcode: "",
        name: "",
            parentid: '',
    parentnm: '',
        roleId: "1"
      },
      rules: {
        unitcode: [
          { required: true, message: "営業所コードを入力してください", trigger: "blur" },
          { max: 8, message: "8桁まで入力可能です", trigger: "blur" },
          { validator: checkUnitCodeNumber, trigger: "blur" },
          { validator: checkDuplicate, trigger: "blur" }
        ],
        name: [
          { required: true, message: "営業所名を入力してください", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    resetForm() {
      this.form = {
        no: "",
        unitcode: "",
        name: "",
        roleId: "1"
      };

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    centerChange(val) {
  let center = this.centerList.find(item => item.centercd === val)
  if (center) {
    this.form.parentid = center.centercd
    this.form.parentnm = center.centernm
  }
},

    del(no) {
      this.$axios
        .get(this.$httpUrl + "/unit/delete?no=" + no)
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
              message: "削除失敗！",
              type: "error"
            });
          }
        });
    },

loadCenterList() {
  this.$axios.get(this.$httpUrl + "/m-authority/listCenter")
    .then(res => res.data)
    .then(res => {
      if (res.code === 200) {
        this.centerList = res.data
      }
    })
},


    mod(row) {
      this.form = {
        no: row.no,
        unitcode: row.unitcode,
        name: row.name,
        roleId: row.roleId || "1"
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
      this.$axios
        .post(this.$httpUrl + "/unit/save", this.form)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: "新規登録完了！",
              type: "success"
            });
            this.centerDialogVisible = false;
            this.loadPost();
            this.resetForm();
          } else {
            this.$message({
              message: "新規登録失敗！",
              type: "error"
            });
          }
        });
    },

    doMod() {
      this.$axios
        .post(this.$httpUrl + "/unit/update", this.form)
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
              message: "更新失敗！",
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
      this.name = "";
      this.pageNum = 1;
      this.loadPost();
    },

    loadPost() {
      this.$axios
        .post(this.$httpUrl + "/unit/listPageC1", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            name: this.name,
            roleId: "1"
          }
        })
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.total = res.total;
          } else {
            this.$message.error("レスポンスエラー");
          }
        });
    }
  },

  beforeMount() {
    this.loadPost();
      this.loadCenterList()
  }
};
</script>

<style scoped>
.unit-manage-page {
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