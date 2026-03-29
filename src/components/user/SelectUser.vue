<template>
  <div class="select-user-page">
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
        <el-table-column prop="id" label="社員番号" width="110" align="center" />
        <el-table-column prop="name" label="姓名" min-width="120" />

        <el-table-column label="営業所" min-width="180">
          <template slot-scope="scope">
            {{ getUnitName(scope.row.unitcode) }}
          </template>
        </el-table-column>

        <el-table-column label="業種" min-width="140">
          <template slot-scope="scope">
            {{ getOccupationName(scope.row.occupationcode) }}
          </template>
        </el-table-column>

        <el-table-column label="役職" min-width="120">
          <template slot-scope="scope">
            {{ getJobTitleName(scope.row.jobtitlecode) }}
          </template>
        </el-table-column>

        <el-table-column label="組織" min-width="200">
          <template slot-scope="scope">
            {{ getOrganizationName(scope.row.organizationcode) }}
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

    <!-- 詳細ダイアログ -->
    <el-dialog
      title="社員情報"
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

        <el-form-item label="社員番号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>

        <el-form-item label="名前" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="営業所">
          <el-select
            v-model="form.unitcode"
            placeholder="営業所選択"
            filterable
            clearable
            class="full-width"
          >
            <el-option
              v-for="item in unitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="業種">
          <el-select
            v-model="form.occupationcode"
            placeholder="業種選択"
            filterable
            clearable
            class="full-width"
          >
            <el-option
              v-for="item in occupationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="役職">
          <el-select
            v-model="form.jobtitlecode"
            placeholder="役職選択"
            filterable
            clearable
            class="full-width"
          >
            <el-option
              v-for="item in jobTitleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="組織">
          <el-select
            v-model="form.organizationcode"
            placeholder="組織選択"
            filterable
            clearable
            class="full-width"
          >
            <el-option
              v-for="item in organizationOptions"
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
  name: "SelectUser",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: "",

      centerDialogVisible: false,
      form: {
        id: "",
        no: "",
        name: "",
        unitcode: "",
        occupationcode: "",
        jobtitlecode: "",
        organizationcode: ""
      },

      rules: {},

      // DBマスタ
      unitList: [],
      authorityList: []
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
    }
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

    resetForm() {
      this.form = {
        id: "",
        no: "",
        name: "",
        unitcode: "",
        occupationcode: "",
        jobtitlecode: "",
        organizationcode: ""
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
        this.form.name = row.name;
        this.form.unitcode =
          row.unitcode === null || row.unitcode === undefined ? "" : Number(row.unitcode);
        this.form.occupationcode =
          row.occupationcode === null || row.occupationcode === undefined
            ? ""
            : Number(row.occupationcode);
        this.form.jobtitlecode =
          row.jobtitlecode === null || row.jobtitlecode === undefined
            ? ""
            : Number(row.jobtitlecode);
        this.form.organizationcode =
          row.organizationcode === null || row.organizationcode === undefined
            ? ""
            : Number(row.organizationcode);
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
      this.name = "";
      this.pageNum = 1;
      this.loadPost();
    },

    selectCurrentChange(val) {
      this.$emit("doSelectUser", val);
    },

    search() {
      this.pageNum = 1;
      this.loadPost();
    },

    loadPost() {
      this.$axios
        .post(this.$httpUrl + "/user/listPageC1", {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          param: {
            name: this.name
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
    this.loadUnits();
    this.loadAuthorities();
    this.loadPost();
  }
};
</script>

<style scoped>
.select-user-page {
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