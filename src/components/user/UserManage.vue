<template>
  <div class="user-manage-page">
    <div class="page-card">
      <!-- 検索エリア -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="name"
            class="search-input"
            placeholder="名前を入力してください"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="loadPost"
          />
          <el-input
            v-model="id"
            class="search-input"
            placeholder="社員番号を入力してください"
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

      <!-- 一覧 -->
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
        <el-table-column prop="no" label="ID" width="80" align="center" />
        <el-table-column prop="id" label="社員番号" width="140" align="center" />
        <el-table-column prop="name" label="名前" min-width="100" />

        <el-table-column label="営業所" min-width="200">
          <template slot-scope="scope">
            {{ getUnitName(scope.row.unitcode) }}
          </template>
        </el-table-column>

<el-table-column label="権限" width="140" align="center">
  <template slot-scope="scope">
    <el-tag disable-transitions>
      {{ getRoleName(scope.row.roleid) }}
    </el-tag>
  </template>
</el-table-column>






        <el-table-column label="業種" min-width="150">
          <template slot-scope="scope">
            {{ getOccupationName(scope.row.occupationcode) }}
          </template>
        </el-table-column>

        <el-table-column label="役職" min-width="120">
          <template slot-scope="scope">
            {{ getJobTitleName(scope.row.jobtitlecode) }}
          </template>
        </el-table-column>

        <el-table-column label="組織" min-width="150">
          <template slot-scope="scope">
            {{ getOrganizationName(scope.row.organizationcode) }}
          </template>
        </el-table-column>

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
      :title="form.no ? '社員情報編集' : '社員新規登録'"
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
        <el-form-item label="社員番号" prop="id">
          <el-input
            v-model="form.id"
            placeholder="社員番号を入力"
            clearable
          />
        </el-form-item>

        <el-form-item label="名前" prop="name">
          <el-input
            v-model="form.name"
            placeholder="名前を入力"
            clearable
          />
        </el-form-item>

        <el-form-item label="営業所" prop="unitcode">
          <el-select v-model="form.unitcode" placeholder="営業所を選択" filterable clearable class="full-width">
            <el-option
              v-for="item in unitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="業種" prop="occupationcode">
          <el-select v-model="form.occupationcode" placeholder="業種を選択" filterable clearable class="full-width">
            <el-option
              v-for="item in occupationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="役職" prop="jobtitlecode">
          <el-select v-model="form.jobtitlecode" placeholder="役職を選択" filterable clearable class="full-width">
            <el-option
              v-for="item in jobTitleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="組織" prop="organizationcode">
          <el-select v-model="form.organizationcode" placeholder="組織を選択" filterable clearable class="full-width">
            <el-option
              v-for="item in organizationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

<el-form-item label="権限" prop="roleid">
  <el-select v-model="form.roleid" placeholder="権限を選択" filterable clearable class="full-width">
    <el-option
      v-for="item in roleOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
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
  name: "UserManage",

  data() {
    const checkDuplicate = (rule, value, callback) => {
      if (!value) {
        return callback();
      }

      // 編集時は自分自身を許可
      if (this.form.no) {
        return callback();
      }

      this.$axios
        .get(this.$httpUrl + "/user/findByNo?id=" + value)
        .then(res => res.data)
        .then(res => {
          if (res.code === 200) {
            callback(new Error("既に存在している社員番号です"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("重複チェックに失敗しました"));
        });
    };

    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: "",
      id: "",
      centerDialogVisible: false,

form: {
  no: "",
  id: "",
  name: "",
  unitcode: "",
  occupationcode: "",
  jobtitlecode: "",
  organizationcode: "",
  roleid: 2
},

      // DBから取得するマスタ
      unitList: [],
      authorityList: [],

      rules: {
id: [
  { required: true, message: "社員番号を入力してください", trigger: "blur" },
  { pattern: /^[0-9]+$/, message: "社員番号は数字のみ入力してください", trigger: "blur" },
  { validator: checkDuplicate, trigger: "blur" }
],
        name: [
          { required: true, message: "社員名を入力してください", trigger: "blur" }
        ]
      }
    };
  },

  computed: {
    unitOptions() {
      return (this.unitList || []).map(item => ({
        label: item.name,
        value: Number(item.unitcode)
      }));
    },

    occupationOptions() {
      const map = new Map();
      (this.authorityList || []).forEach(item => {
        if (item.occupationcode != null && item.occupationnm) {
          map.set(Number(item.occupationcode), item.occupationnm);
        }
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },

    jobTitleOptions() {
      const map = new Map();
      (this.authorityList || []).forEach(item => {
        if (item.jobtitlecode != null && item.jobtitlenm) {
          map.set(Number(item.jobtitlecode), item.jobtitlenm);
        }
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },

    organizationOptions() {
      const map = new Map();
      (this.authorityList || []).forEach(item => {
        if (item.organizationcode != null && item.columnName) {
          map.set(Number(item.organizationcode), item.columnName);
        }
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },

roleOptions() {
  const map = new Map();

  (this.authorityList || []).forEach(item => {
    const roleId = Number(item.roleid);

    if (item.roleid != null && item.rolenm && !map.has(roleId)) {
      map.set(roleId, item.rolenm);
    }
  });

  return Array.from(map, ([value, label]) => ({ value, label }));
},
  },

  methods: {
    loadUnits() {
      this.$axios
        .get(this.$httpUrl + "/unit/list")
        .then(res => {
          this.unitList = res.data || [];
        })
        .catch(err => {
          console.error("unit取得失敗", err);
          this.unitList = [];
        });
    },

    loadAuthorities() {
      this.$axios
        .get(this.$httpUrl + "/m-authority/list")
        .then(res => {
          this.authorityList = res.data || [];
        })
        .catch(err => {
          console.error("authority取得失敗", err);
          this.authorityList = [];
        });
    },

    getUnitName(code) {
      const item = this.unitOptions.find(v => Number(v.value) === Number(code));
      return item ? item.label : "不明";
    },

    getOccupationName(code) {
      const item = this.occupationOptions.find(v => Number(v.value) === Number(code));
      return item ? item.label : "不明";
    },

    getJobTitleName(code) {
      const item = this.jobTitleOptions.find(v => Number(v.value) === Number(code));
      return item ? item.label : "未定";
    },

    getOrganizationName(code) {
      const item = this.organizationOptions.find(v => Number(v.value) === Number(code));
      return item ? item.label : "不明";
    },

getRoleName(code) {
  const item = this.roleOptions.find(v => Number(v.value) === Number(code));
  return item ? item.label : "不明";
},

resetForm() {
  this.form = {
    no: "",
    id: "",
    name: "",
    unitcode: "",
    occupationcode: "",
    jobtitlecode: "",
    organizationcode: "",
    roleid: 2
  };

  this.$nextTick(() => {
    if (this.$refs.form) {
      this.$refs.form.clearValidate();
    }
  });
},

    del(no) {
      this.$axios
        .get(this.$httpUrl + "/user/delete?no=" + no)
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
    id: row.id,
    name: row.name,
    unitcode: row.unitcode === null || row.unitcode === undefined ? "" : Number(row.unitcode),
    occupationcode: row.occupationcode === null || row.occupationcode === undefined ? "" : Number(row.occupationcode),
    jobtitlecode: row.jobtitlecode === null || row.jobtitlecode === undefined ? "" : Number(row.jobtitlecode),
    organizationcode: row.organizationcode === null || row.organizationcode === undefined ? "" : Number(row.organizationcode),
    roleid: row.roleid === null || row.roleid === undefined ? 2 : Number(row.roleid)
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
        .post(this.$httpUrl + "/user/save", this.form)
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
      this.$axios
        .post(this.$httpUrl + "/user/update", this.form)
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
      this.name = "";
      this.id = "";
      this.pageNum = 1;
      this.loadPost();
    },

    loadPost() {
      this.$axios
        .post(this.$httpUrl + "/user/listPageC1", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            name: this.name,
            id: this.id
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
        });
    }
  },

  beforeMount() {
    this.loadUnits();
    this.loadAuthorities();
    this.loadPost();
  }
};
</script>

<style scoped>
.user-manage-page {
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
  width: 240px;
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

.full-width {
  width: 100%;
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
.custom-form /deep/ .el-select .el-input__inner {
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