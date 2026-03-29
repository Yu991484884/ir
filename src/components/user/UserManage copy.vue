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
        <el-table-column prop="name" label="名前" min-width="140" />

        <el-table-column label="営業所" min-width="220">
          <template slot-scope="scope">
            {{ getUnitName(scope.row.unitcode) }}
          </template>
        </el-table-column>

        <el-table-column label="権限" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.roleId === 0 ? 'danger' : (scope.row.roleId === 1 ? 'primary' : 'success')"
              disable-transitions
            >
              {{
                scope.row.roleId === 0
                  ? 'Super管理者'
                  : (scope.row.roleId === 1 ? '管理者' : '利用者')
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="業種" min-width="180">
          <template slot-scope="scope">
            {{ getOccupationName(scope.row.occupationcode) }}
          </template>
        </el-table-column>

        <el-table-column label="役職" min-width="140">
          <template slot-scope="scope">
            {{ getJobTitleName(scope.row.jobtitlecode) }}
          </template>
        </el-table-column>

        <el-table-column label="組織" min-width="180">
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
      pageSize: 30,
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
        roleId: 2
      },

      unitOptions: [
        { label: "管理本部", value: 1 },
        { label: "業務本部", value: 3 },
        { label: "川口ﾕﾆｯﾄ", value: 10 },
        { label: "大宮ﾕﾆｯﾄ", value: 14 },
        { label: "横浜ﾕﾆｯﾄ", value: 18 },
        { label: "船橋ﾕﾆｯﾄ", value: 22 },
        { label: "浮島ﾕﾆｯﾄ", value: 23 },
        { label: "厚木ﾕﾆｯﾄ", value: 27 },
        { label: "鴻巣ﾕﾆｯﾄ", value: 28 },
        { label: "大宮C-ｲﾝﾍﾞﾝﾄﾘｰ①兼日中ｸﾞﾛｽ", value: 31 },
        { label: "大宮C-グロス", value: 32 },
        { label: "大宮C-ｿｰﾃｨﾝｸﾞ店別", value: 33 },
        { label: "大宮C-ｿｰﾃｨﾝｸﾞ店別第2", value: 34 },
        { label: "大宮C-ｲﾝﾍﾞﾝﾄﾘｰ②兼夜間仕分", value: 35 },
        { label: "大宮C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ", value: 36 },
        { label: "浮島C-ｲﾝﾍﾞﾝﾄﾘｰ/事務", value: 41 },
        { label: "浮島C-ｿｰﾃｨﾝｸﾞ店別", value: 42 },
        { label: "浮島C-ｿｰﾃｨﾝｸﾞ店別②", value: 43 },
        { label: "浮島C-ｿｰﾃｨﾝｸﾞ店別③", value: 44 },
        { label: "厚木C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ", value: 61 },
        { label: "厚木C-ｸﾞﾛｽ", value: 62 },
        { label: "厚木C-ｿｰﾃｨﾝｸﾞ店別①", value: 63 },
        { label: "厚木C-ｿｰﾃｨﾝｸﾞ店別②", value: 64 },
        { label: "岩槻C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ", value: 92 },
        { label: "岩槻C-ｿｰﾃｨﾝｸﾞ店別", value: 93 },
        { label: "第1 BPﾕﾆｯﾄ", value: 1031 },
        { label: "大宮C-ＬＤﾕﾆｯﾄ", value: 1155 },
        { label: "岩槻C-ＬＤﾕﾆｯﾄ", value: 1195 },
        { label: "浮島C-ＬＤﾕﾆｯﾄ", value: 1245 },
        { label: "厚木C-ＬＤﾕﾆｯﾄ", value: 1615 }
      ],

      occupationOptions: [
        { label: "経理", value: 7 },
        { label: "ドライバー", value: 1 },
        { label: "ローディング", value: 34 },
        { label: "センター管理・入庫", value: 15 },
        { label: "ソーティング・グロス", value: 38 },
        { label: "ソーティング・点別", value: 37 },
        { label: "インベトリー・事務", value: 33 },
        { label: "営業", value: 32 },
        { label: "インベトリー・現場", value: 35 },
        { label: "グロス在庫管理", value: 16 },
        { label: "事務職", value: 5 },
        { label: "情報システム", value: 6 },
        { label: "オペレーター", value: 2 },
        { label: "種まき・出荷", value: 17 },
        { label: "エリアマネージャー", value: 9 },
        { label: "SC・一般", value: 21 }
      ],

      jobTitleOptions: [
        { label: "サブクルー", value: 1 },
        { label: "クルー", value: 2 },
        { label: "チーフ", value: 3 },
        { label: "リーダー", value: 4 },
        { label: "サブマネージャー", value: 5 },
        { label: "マネージャー", value: 6 },
        { label: "統括マネージャー", value: 7 },
        { label: "再雇用サブクルー", value: 10 },
        { label: "再雇用社員", value: 11 }
      ],

      organizationOptions: [
        { label: "北王流通株式会社", value: 1 },
        { label: "北王デリバリー", value: 2 },
        { label: "北王フードベース", value: 3 },
        { label: "北王Gurop", value: 4 }
      ],

      rules: {
        id: [
          { required: true, message: "社員番号を入力してください", trigger: "blur" },
          { validator: checkDuplicate, trigger: "blur" }
        ],
        name: [
          { required: true, message: "社員名を入力してください", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    getUnitName(code) {
      const item = this.unitOptions.find(v => Number(v.value) === Number(code));
      return item ? item.label : "不明";
    },

    getOccupationName(code) {
      const scIppanCodes = [18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 31, 39, 40, 41];
      if (scIppanCodes.includes(Number(code))) {
        return "SC・一般";
      }
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
        no: "",
        id: "",
        name: "",
        unitcode: "",
        occupationcode: "",
        jobtitlecode: "",
        organizationcode: "",
        roleId: 2
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
              message: "削除失敗！",
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
        roleId: row.roleId === null || row.roleId === undefined ? 2 : Number(row.roleId)
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
              message: "登録失敗！",
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
            this.$message.error("データ取得失敗");
          }
        });
    }
  },

  beforeMount() {
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