<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="名前入力" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>

      <el-input v-model="id" placeholder="社員番号入力" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>          
      <!-- <el-select v-model="sex" filterable placeholder="请选择性别" style="margin-left: 5px;">
        <el-option
            v-for="item in sexs"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select> -->
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
      <el-table-column prop="id" label="社員番号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="名前" width="180">
      </el-table-column>

      <el-table-column 　prop="unitcode" label="営業所" width="150" >
        <template slot-scope="scope">
              {{ 
              scope.row.unitcode === 1 ? "管理本部" : 
              scope.row.unitcode === 3 ? "業務本部" : 
              scope.row.unitcode === 10 ? "川口ﾕﾆｯﾄ" : 
              scope.row.unitcode === 14 ? "大宮ﾕﾆｯﾄ" : 
              scope.row.unitcode === 18 ? "横浜ﾕﾆｯﾄ" : 
              scope.row.unitcode === 22 ? "船橋ﾕﾆｯﾄ" : 
              scope.row.unitcode === 23 ? "浮島ﾕﾆｯﾄ" : 
              scope.row.unitcode === 27 ? "厚木ﾕﾆｯﾄ" : 
              scope.row.unitcode === 28 ? "鴻巣ﾕﾆｯﾄ" : 
              scope.row.unitcode === 31 ? "大宮C-ｲﾝﾍﾞﾝﾄﾘｰ①兼日中ｸﾞﾛｽ" : 
              scope.row.unitcode === 32 ? "大宮C-グロス" : 
              scope.row.unitcode === 33 ? "大宮C-ｿｰﾃｨﾝｸﾞ店別" : 
              scope.row.unitcode === 34 ? "大宮C-ｿｰﾃｨﾝｸﾞ店別第2" : 
              scope.row.unitcode === 35 ? "大宮C-ｲﾝﾍﾞﾝﾄﾘｰ②兼夜間仕分" : 
              scope.row.unitcode === 36 ? "大宮C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" : 
              scope.row.unitcode === 41 ? "浮島C-ｲﾝﾍﾞﾝﾄﾘｰ/事務" : 
              scope.row.unitcode === 42 ? "浮島C-ｿｰﾃｨﾝｸﾞ店別" : 
              scope.row.unitcode === 43 ? "浮島C-ｿｰﾃｨﾝｸﾞ店別②" : 
              scope.row.unitcode === 44 ? "浮島C-ｿｰﾃｨﾝｸﾞ店別③" : 
              scope.row.unitcode === 61 ? "厚木C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" : 
              scope.row.unitcode === 62 ? "厚木C-ｸﾞﾛｽ" : 
              scope.row.unitcode === 63 ? "厚木C-ｿｰﾃｨﾝｸﾞ店別①" : 
              scope.row.unitcode === 64 ? "厚木C-ｿｰﾃｨﾝｸﾞ店別②" : 
              scope.row.unitcode === 92 ? "岩槻C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" : 
              scope.row.unitcode === 93 ? "岩槻C-ｿｰﾃｨﾝｸﾞ店別" : 
              scope.row.unitcode === 1031 ? "第1 BPﾕﾆｯﾄ" : 
              scope.row.unitcode === 1155 ? "大宮C-ＬＤﾕﾆｯﾄ" : 
              scope.row.unitcode === 1195 ? "岩槻C-ＬＤﾕﾆｯﾄ" : 
              scope.row.unitcode === 1245 ? "浮島C-ＬＤﾕﾆｯﾄ" : 
              scope.row.unitcode === 1615 ? "厚木C-ＬＤﾕﾆｯﾄ" : 
              "不明"
              }}
        </template>
      </el-table-column>

      <el-table-column prop="roleId" label="権限" width="100">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.roleId === 0 ? 'danger' : (scope.row.roleId === 1 ? 'primary' : 'success')"
              disable-transitions>{{
              scope.row.roleId === 0 ? 'Super管理者' :
                  (scope.row.roleId === 1 ? '管理者' : '利用者')
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="occupationcode" label="業種" width="150">
        <template slot-scope="scope">
              {{ 
              scope.row.occupationcode === 7 ? "経理" : 
              scope.row.occupationcode === 1? "ドライバー" : 
              scope.row.occupationcode === 34 ? "ローディング" : 
              scope.row.occupationcode === 15 ? "センター管理・入庫" : 
              scope.row.occupationcode === 38 ? "ソーティング・グロス" : 
              scope.row.occupationcode === 37 ? "ソーティング・点別" : 
              scope.row.occupationcode === 33 ? "インベトリー・事務" : 
              scope.row.occupationcode === 22 ? "SC・一般" : 
              scope.row.occupationcode === 32 ? "営業" : 
              scope.row.occupationcode === 23 ? "SC・一般" : 
              scope.row.occupationcode === 35 ? "インベトリー・現場" : 
              scope.row.occupationcode === 39 ? "SC・一般" : 
              scope.row.occupationcode === 16 ? "グロス在庫管理" : 
              scope.row.occupationcode === 5 ? "事務職" : 
              scope.row.occupationcode === 6 ? "情報システム" : 
              scope.row.occupationcode === 2 ? "オペレーター" : 
              scope.row.occupationcode === 25 ? "SC・一般" : 
              scope.row.occupationcode === 17 ? "種まき・出荷" : 
              scope.row.occupationcode === 21 ? "SC・一般" : 
              scope.row.occupationcode === 18 ? "SC・一般" : 
              scope.row.occupationcode === 26 ? "SC・一般" : 
              scope.row.occupationcode === 41 ? "SC・一般" : 
              scope.row.occupationcode === 24 ? "SC・一般" : 
              scope.row.occupationcode === 28 ? "SC・一般" : 
              scope.row.occupationcode === 40 ? "SC・一般" : 
              scope.row.occupationcode === 20 ? "SC・一般" : 
              scope.row.occupationcode === 31 ? "SC・一般" : 
              scope.row.occupationcode === 19 ? "SC・一般" : 
              scope.row.occupationcode === 29 ? "SC・一般" : 
              scope.row.occupationcode === 9 ? "エリアマネージャー" : 
              "不明"
              }}
        </template>
      </el-table-column>

      <el-table-column prop="jobtitlecode" label="役職" width="150">
        <template slot-scope="scope">

              {{ scope.row.jobtitlecode === 3 ? "チーフ" : 
              scope.row.jobtitlecode === 4 ? "リーダー" : 
              scope.row.jobtitlecode === 2 ? "クール" : 
              scope.row.jobtitlecode === 7 ? "統括マネージャー" : 
              scope.row.jobtitlecode === 5 ? "サブマネージャー" : 
              scope.row.jobtitlecode === 1 ? "サブクルー" : 
              scope.row.jobtitlecode === 6 ? "マネージャー" : 
              scope.row.jobtitlecode === 11 ? "再雇用社員" : 
              scope.row.jobtitlecode === 10 ? "再雇用SC" : 
              "未定"
              }}
        </template>
      </el-table-column>
            
      <el-table-column prop="organizationcode" label="組織" width="200">
        <template slot-scope="scope">

              {{ scope.row.organizationcode === 1 ? "北王流通株式会社" : 
              scope.row.organizationcode === 2 ? "北王デリバリー" : 
              scope.row.organizationcode === 3 ? "北王フードベース" : 
              scope.row.organizationcode === 4 ? "北王Gurop" : 
              "不明"
              }}

        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">編集</el-button>
          <el-popconfirm
              title="削除しますか？"
              @confirm="del(scope.row.no)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger">削除</el-button>
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
        <el-form-item label="社員番号" prop="id">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="名前" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        
        <el-form-item label="営業所">
          <el-select v-model="form.unitcode" placeholder="営業所選択">
            <el-option label="管理本部" :value="1"></el-option>
            <el-option label="業務本部" :value="3"></el-option>
            <el-option label="川口ﾕﾆｯﾄ" :value="10"></el-option>
            <el-option label="大宮ﾕﾆｯﾄ" :value="14"></el-option>
            <el-option label="横浜ﾕﾆｯﾄ" :value="18"></el-option>
            <el-option label="船橋ﾕﾆｯﾄ" :value="22"></el-option>
            <el-option label="浮島ﾕﾆｯﾄ" :value="23"></el-option>
            <el-option label="厚木ﾕﾆｯﾄ" :value="27"></el-option>
            <el-option label="鴻巣ﾕﾆｯﾄ" :value="28"></el-option>
            <el-option label="大宮C-ｲﾝﾍﾞﾝﾄﾘｰ①兼日中ｸﾞﾛｽ" :value="31"></el-option>
            <el-option label="大宮C-グロス" :value="32"></el-option>
            <el-option label="大宮C-ｿｰﾃｨﾝｸﾞ店別" :value="33"></el-option>
            <el-option label="大宮C-ｿｰﾃｨﾝｸﾞ店別第2" :value="34"></el-option>
            <el-option label="大宮C-ｲﾝﾍﾞﾝﾄﾘｰ②兼夜間仕分" :value="35"></el-option>
            <el-option label="大宮C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" :value="36"></el-option>
            <el-option label="浮島C-ｲﾝﾍﾞﾝﾄﾘｰ/事務" :value="41"></el-option>
            <el-option label="浮島C-ｿｰﾃｨﾝｸﾞ店別" :value="42"></el-option>
            <el-option label="浮島C-ｿｰﾃｨﾝｸﾞ店別②" :value="43"></el-option>
            <el-option label="浮島C-ｿｰﾃｨﾝｸﾞ店別③" :value="44"></el-option>
            <el-option label="厚木C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" :value="61"></el-option>
            <el-option label="厚木C-ｸﾞﾛｽ" :value="62"></el-option>
            <el-option label="厚木C-ｿｰﾃｨﾝｸﾞ店別①" :value="63"></el-option>
            <el-option label="厚木C-ｿｰﾃｨﾝｸﾞ店別②" :value="64"></el-option>
            <el-option label="岩槻C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ" :value="92"></el-option>
            <el-option label="岩槻C-ｿｰﾃｨﾝｸﾞ店別" :value="93"></el-option>
            <el-option label="第1 BPﾕﾆｯﾄ" :value="1031"></el-option>
            <el-option label="大宮C-ＬＤﾕﾆｯﾄ" :value="1155"></el-option>
            <el-option label="岩槻C-ＬＤﾕﾆｯﾄ" :value="1195"></el-option>
            <el-option label="浮島C-ＬＤﾕﾆｯﾄ" :value="1245"></el-option>
            <el-option label="厚木C-ＬＤﾕﾆｯﾄ" :value="1615"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="業種">
          <el-select v-model="form.occupationcode" placeholder="業種選択">
            <el-option label="経理" value="7"></el-option>
            <el-option label="ドライバー" value="1"></el-option>
            <el-option label="ローディング" value="34"></el-option>
            <el-option label="センター管理・入庫" value="15"></el-option>
            <el-option label="ソーティング・グロス" value="38"></el-option>
            <el-option label="ソーティング・点別" value="37"></el-option>
            <el-option label="インベトリー・事務" value="33"></el-option>
            <el-option label="営業" value="32"></el-option>
            <el-option label="インベトリー・現場" value="35"></el-option>
            <el-option label="グロス在庫管理" value="16"></el-option>
            <el-option label="情報システム" value="6"></el-option>
            <el-option label="オペレーター" value="2"></el-option>
            <el-option label="種まき・出荷" value="17"></el-option>
            <el-option label="SC・一般" value="21,18,26,41,24,28,40,20,31,19,29,22,23,39,25"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="役職">
          <el-select v-model="form.jobtitlecode" placeholder="役職選択">
            <el-option label="クルー" value="2"></el-option>
            <el-option label="チーフ" value="3"></el-option>
            <el-option label="リーダー" value="4"></el-option>
            <el-option label="サブクルー" value="1"></el-option>
            <el-option label="マネージャー" value="6"></el-option>
            <el-option label="統括マネージャーー" value="7"></el-option>
            <el-option label="再雇用社員" value="11"></el-option>
            <el-option label="再雇用サブクルー" value="10"></el-option>
            <el-option label="サブマネージャー" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="組織">
          <el-select v-model="form.organizationcode" placeholder="組織選択">
            <el-option label="北王流通株式会社" value="1"></el-option>
            <el-option label="北王デリバリー" value="2"></el-option>
            <el-option label="北王フードベース" value="3"></el-option>
            <el-option label="北王Group" value="4"></el-option>
          </el-select>
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
  name: "UserManage",　//设置为当前vue的名称 
  data() {
    let checkDuplicate = (rule, value, callback) => {
      if (this.form.no) {
        return callback();
      }
      this.$axios.get(this.$httpUrl + "/user/findByNo?id=" + this.form.id).then(res => res.data).then(res => {
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
      name: '',
      id:'',
      centerDialogVisible: false,
      form: {
        id: '',
        no: '',
        name: '',
        unitcode: '',
        occupationcode: '',
        jobtitlecode: '',
        organizationcode: '',
        roleid: '2'
      },
      rules: {
        id: [
          {required: true, message: '社員番号入力', trigger: 'blur'},
          // { min: 3,max: 5, message: '8桁まで', trigger: 'blur'},
          {validator: checkDuplicate, trigger: 'blur'}
        ],
        name: [
          {required: true, message: '社員名入力', trigger: 'blur'}
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
      this.$axios.get(this.$httpUrl + '/user/delete?no=' + no).then(res => res.data).then(res => {
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
        this.form.name = row.name

        // this.form.unitcode = 
        // row.unitcode===1?'管理本部':
        // row.unitcode===3?'業務本部':
        // row.unitcode===10?'川口ﾕﾆｯﾄ':
        // row.unitcode===14?'大宮ﾕﾆｯﾄ':
        // row.unitcode===18?'横浜ﾕﾆｯﾄ':
        // row.unitcode===22?'船橋ﾕﾆｯﾄ':
        // row.unitcode===23?'浮島ﾕﾆｯﾄ':
        // row.unitcode===27?'厚木ﾕﾆｯﾄ':
        // row.unitcode===28?'鴻巣ﾕﾆｯﾄ':
        // row.unitcode===31?'大宮C-ｲﾝﾍﾞﾝﾄﾘｰ①兼日中ｸﾞﾛｽ':
        // row.unitcode===32?'大宮C-グロス':
        // row.unitcode===33?'大宮C-ｿｰﾃｨﾝｸﾞ店別':
        // row.unitcode===34?'大宮C-ｿｰﾃｨﾝｸﾞ店別第2':
        // row.unitcode===35?'大宮C-ｿｰﾃｨﾝｸﾞ店別第2':
        // row.unitcode===36?'大宮C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ':
        // row.unitcode===41?'浮島C-ｲﾝﾍﾞﾝﾄﾘｰ/事務':
        // row.unitcode===42?'浮島C-ｿｰﾃｨﾝｸﾞ店別':
        // row.unitcode===43?'浮島C-ｿｰﾃｨﾝｸﾞ店別②':
        // row.unitcode===44?'浮島C-ｿｰﾃｨﾝｸﾞ店別③':
        // row.unitcode===61?'厚木C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ':
        // row.unitcode===62?'厚木C-ｸﾞﾛｽ':
        // row.unitcode===63?'厚木C-ｿｰﾃｨﾝｸﾞ店別①':
        // row.unitcode===64?'厚木C-ｿｰﾃｨﾝｸﾞ店別②':
        // row.unitcode===92?'岩槻C-事務所/ｲﾝﾍﾞﾝﾄﾘｰ':
        // row.unitcode===93?'岩槻C-ｿｰﾃｨﾝｸﾞ店別':
        // row.unitcode===1031?'第1 BPﾕﾆｯﾄ':
        // row.unitcode===1155?'大宮C-ＬＤﾕﾆｯﾄ':
        // row.unitcode===1195?'岩槻C-ＬＤﾕﾆｯﾄ':
        // row.unitcode===1245?'浮島C-ＬＤﾕﾆｯﾄ':
        // row.unitcode===1615?'厚木C-ＬＤﾕﾆｯﾄ':
        // '不明'

        // this.form.occupationcode = row.occupationcode===7?'経理'
        // :row.occupationcode===1?'ドライバー'
        // :row.occupationcode===34?'ローディング'
        // :row.occupationcode===15?'センター管理・入庫'
        // :row.occupationcode===38?'ソーティング・グロス'
        // :row.occupationcode===37?'ソーティング・点別'
        // :row.occupationcode===33?'インベトリー・事務'
        // :row.occupationcode===22?'SC・一般'
        // :row.occupationcode===32?'営業'
        // :row.occupationcode===23?'SC・一般'
        // :row.occupationcode===35?'インベトリー・現場'
        // :row.occupationcode===39?'SC・一般'
        // :row.occupationcode===16?'グロス在庫管理'
        // :row.occupationcode===5?'事務職'
        // :row.occupationcode===6?'情報システム'
        // :row.occupationcode===2?'オペレーター'
        // :row.occupationcode===25?'SC・一般'
        // :row.occupationcode===17?'種まき・出荷'
        // :row.occupationcode===21?'SC・一般'
        // :row.occupationcode===26?'SC・一般'
        // :row.occupationcode===41?'SC・一般'
        // :row.occupationcode===24?'SC・一般'
        // :row.occupationcode===28?'SC・一般'
        // :row.occupationcode===40?'SC・一般'
        // :row.occupationcode===20?'SC・一般'
        // :row.occupationcode===31?'SC・一般'
        // :row.occupationcode===19?'SC・一般'
        // :row.occupationcode===29?'SC・一般'
        // :row.occupationcode===9?'管理職'
        // :'不明'

        // this.form.jobtitlecode = row.jobtitlecode===2?'クルー'
        // :row.jobtitlecode===3?'チーフ'
        // :row.jobtitlecode===4?'リーダー'
        // :row.jobtitlecode===5?'サブマネージャー'
        // :row.jobtitlecode===6?'マネージャー'
        // :row.jobtitlecode===7?'統括マネージャー'
        // :row.jobtitlecode===11?'再雇用社員'
        // :row.jobtitlecode===10?'再雇用Sc'
        // :row.jobtitlecode===1?'Sc'
        // :'未定'
       
        // this.form.organizationcode = row.organizationcode===1?'北王流通株式会社'
        // :row.organizationcode===2?'北王デリバリー'
        // :row.organizationcode===3?'北王フードベース':
        // this.form.roleid = row.roleid

      })
    },
    add() {

          this.centerDialogVisible = true
          this.form.unitcode = ''
          this.form.occupationcode = ''
          this.form.jobtitlecode = ''
          // this.form.jobtitlecode = row.sex + ''
          this.form.organizationcode = ''
      this.$nextTick(() => {
        this.resetForm()
      })

    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/user/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/user/update', this.form).then(res => res.data).then(res => {
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
      this.$axios.get(this.$httpUrl + '/user/listP').then(res => res.data).then(res => {
        console.log(res)
      })
    },
    resetParam() {
      this.name = ''
      this.id = ''
    },
    loadPost() {
      // this.$axios.post(this.$httpUrl + '/user/listPage', 
      this.$axios.post(this.$httpUrl + '/user/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          id: this.id,
          // roleId: '2'
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

    /* 自定义样式，去除边框颜色 */
    .el-tag.no-border {
      border-color: transparent; /* 使边框颜色透明 */
    }
    .no-color {
      color: initial; /* 或者使用 'inherit' 来从父元素继承颜色，或指定一个具体的颜色 */
    }
</style>