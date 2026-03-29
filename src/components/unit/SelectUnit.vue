<template>
  <div class="select-unit-page">
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
        <el-table-column prop="unitcode" label="営業所コード" width="160" align="center" />
        <el-table-column prop="name" label="営業所名" min-width="220" />
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
  </div>
</template>

<script>
export default {
  name: "SeletUnit",
  data() {
    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: ""
    };
  },

  methods: {
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
      this.$emit("doSelectUnit", val);
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
.select-unit-page {
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