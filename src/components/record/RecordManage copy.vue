<template>
  <div>
    <div style="margin-bottom: 5px;">

      <span class="demonstration">所属：</span>
      <el-select v-model="affiliationcode" placeholder="所属選択">
        <el-option
          v-for="(name, index) in unitNames"
          :key="index"
          :label="name"
          :value="name"
         >
      </el-option>
      </el-select >

      <!-- <el-input v-model="affiliationcode" placeholder="営業所検索" suffix-icon="el-icon-search" style="width: 200px;margin-bottom: 10px; margin-right: 20px; "
                @keyup.enter.native="loadPost"></el-input> -->
      <span class="demonstration">要因別：</span>
      <el-select v-model="factor" placeholder="要因選択" style="width: 200px;margin-bottom: 10px;">
        <el-option
          v-for="(name, index) in factorNames"
          :key="index"
          :label="name"
          :value="name">
        </el-option>
      </el-select>
                <br>
      <span class="demonstration">起因者：</span>
      <el-input v-model="causeperson" placeholder="起因者検索" suffix-icon="el-icon-search" style="width: 200px;margin-bottom: 10px;margin-right: 20px; "
                @keyup.enter.native="loadPost"></el-input>
      <span class="demonstration">　期間：</span>
        <el-date-picker
          v-model="today"
          type="daterange"
          range-separator="To"
          start-placeholder="開始日"
          end-placeholder="終了日">
        </el-date-picker><br>

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">検索</el-button>
      <el-button type="success" @click="resetParam">クリア</el-button>

      <el-button type="warning" style="margin-left: 5px;margin-bottom: 10px;" @click="exportToExcel">出力</el-button>
    </div>
    
    <el-table :data="tableData" height="1000" style="width: 100%"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border>
              <!-- prop=   对应的是从后端穿过来的查询结果 然后在这里显示-->
      <el-table-column prop="no" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="today" label="発生日" width="120">
      </el-table-column>

      <el-table-column prop="affiliationcode" label="所属" width="140">
      </el-table-column>

      <el-table-column 　prop="classification" label="区分" width="80" >
        <template slot-scope="scope">
              {{ 
              scope.row.classification === 1 ? "TP" : 
              scope.row.classification === 2 ? "WH" : 
              scope.row.classification === 3 ? "LD" : 
              "不明"
              }}
        </template>
      </el-table-column>

      <el-table-column 　prop="responsibility" label="社内外" width="80" >
        <template slot-scope="scope">
              {{ 
              scope.row.responsibility === 1 ? "社内" : 
              scope.row.responsibility === 2 ? "社外" : 
              "不明"
              }}
        </template>
      </el-table-column>

      <el-table-column prop="causeperson" label="起因者" width="100">
      </el-table-column>

      <el-table-column prop="corporateentity" label="企業体名" width="180">
      </el-table-column>

      
      <el-table-column prop="storename" label="店舗名" width="180">
      </el-table-column>

      
      <el-table-column prop="progress" label="経緯" width="300">
      </el-table-column>

      <el-table-column prop="reporter" label="報告者" width="180">
      </el-table-column>

      <el-table-column 　prop="temperature" label="温度帯" width="100" >
        <template slot-scope="scope">
              {{ 
              scope.row.temperature === 1 ? "冷蔵" : 
              scope.row.temperature === 2 ? "チルド" : 
              scope.row.temperature === 3 ? "常温" : 
              "不明"
              }}
        </template>
      </el-table-column>

      <el-table-column prop="factor" label="要因" width="180">
      </el-table-column>

      <el-table-column prop="correspondenceperson" label="対応者" width="100">
      </el-table-column>

      <el-table-column prop="correspondence" label="対応方法" width="180">
      </el-table-column>

      <el-table-column prop="countermeasure" label="対策" width="180">
      </el-table-column>


      <!-- <el-table-column prop="createtime" label="作成日" width="180">
      </el-table-column> -->

      <!-- <el-table-column prop="updatetime" label="更新日" width="180">
      </el-table-column> -->

      <el-table-column prop="adminuserid" label="登録者" width="180">
      </el-table-column>


      <el-table-column prop="operate" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)" style="margin-left: 10px;">編集</el-button>
          <el-popconfirm
              title="本当に削除しますか？"
              @confirm="del(scope.row.no)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger" style="margin-left: 10px;">削除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[50, 100, 500,1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog
        title="編集画面"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
              <!-- 内嵌套 页面 就是点击新增的页面 然后在点击申请人按钮 又会跳出 另一个输入框  -->
      <el-dialog
          width="75%"
          title="起因者選択"
          :visible.sync="innerVisible"
          append-to-body>
        <SelectUser @doSelectUser="doSelectUser"></SelectUser>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmUser">确 定</el-button>
                  </span>
      </el-dialog>

      <el-dialog
          width="75%"
          title="企業体選択"
          :visible.sync="innerVisible1"
          append-to-body>
        <SelectCorporate @doSelectCorporate="doSelectCorporate"></SelectCorporate>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible1 = false">取 消</el-button>
                    <el-button type="primary" @click="confirmCorporate">确 定</el-button>
                  </span>
      </el-dialog>

      <el-dialog
          width="75%"
          title="営業所選択"
          :visible.sync="innerVisibleUnit"
          append-to-body>
        <SelectUnit @doSelectUnit="doSelectUnit"></SelectUnit>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisibleUnit = false">取 消</el-button>
                    <el-button type="primary" @click="confirmUnit">确 定</el-button>
                  </span>
      </el-dialog>

      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="発生日">
          <el-date-picker
            v-model="form.today"
            type="date"
            placeholder="日付選択">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="要因名称">
          <el-col :span="20">
            <el-input v-model="form.factor" readonly></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="起因者">
          <el-col :span="20">
            <el-input v-model="form.causeperson" readonly @click.native="selectUser"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="営業所">
          <el-col :span="20">
            <!-- 点击申请人按钮 触发 @click.native="selectUser" 事件 -->
            <el-input v-model="form.affiliationcode" readonly @click.native="selectUnit"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="企業体名">
          <el-col :span="20">
            <!-- 点击申请人按钮 触发 @click.native="selectUser" 事件 -->
            <el-input v-model="form.corporateentity" readonly @click.native="selectCorporate"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="店舗名" prop="storename">
          <el-col :span="20">
            <el-input v-model="form.storename"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="社内外">
          <el-select v-model="form.responsibility" placeholder="区分選択">
            <el-option label="社内" value="1"></el-option>
            <el-option label="社外" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区分">
          <el-select v-model="form.classification" placeholder="区分選択">
            <el-option label="TP" value="1"></el-option>
            <el-option label="WH" value="2"></el-option>
            <el-option label="LD" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="経緯" prop="progress">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.progress"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="報告者" prop="reporter">
          <el-col :span="20">
            <el-input v-model="form.reporter"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="温度帯">
          <el-select v-model="form.temperature" placeholder="温度帯選択">
            <el-option label="冷蔵" value="1"></el-option>
            <el-option label="チルド" value="2"></el-option>
            <el-option label="常温" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="対応方法" prop="correspondence">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.correspondence"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="対応者" prop="correspondenceperson">
          <el-col :span="20">
            <el-input v-model="form.correspondenceperson"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="対応策" prop="countermeasure">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.countermeasure"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取　消</el-button>
    <el-button type="primary" @click="save">確　定</el-button>
  </span>
    </el-dialog>



  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import SelectUser from "../user/SelectUser";
import SelectCorporate from "../corporate/SelectCorporate";
import SelectUnit from "../unit/SelectUnit";

export default {
  name: "RecordManage",
  components: {SelectUser,SelectCorporate,SelectUnit},
  data() {

    return {
      factorNames: [],
      unitNames: [], // 用于存储数据库中unit表的name字段数据
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      tableData: [],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      name: '',
      affiliationcode:'',
      factor:'',
      today:[],
      causeperson:'',
      centerDialogVisible: false,
      innerVisible: false,
      innerVisible1: false,
      innerVisibleUnit:false,
      tempUser: {},
      tempCorporate:{},
      tempUnit:{},

      form: {
        no:'',
        today:'', //登録日
        classification:'',//LD,TP,WH区分選択
        responsibility:'',//社内社外区分選択
        storename:'',//店舗名
        factor: '',//要因別
        reporter:'',//報告者
        corporateentity: '',//企業体名
        affiliationcode:'',//営業所
        temperature:'',//温度帯
        correspondence:'',//対応方法
        correspondenceperson:'',//対応者
        countermeasure:'',//対応策
        progress:'',//経過
        causeperson: '',//起因者
        userid: '',//起因者社員番号
        adminuserid: '',//登録者、ログインアカウント
      },
    }
  },
  mounted() {
    // 组件挂载时获取单位名
    this.fetchUnitNames(); // 在组件挂载时获取单位名称
    this.loadPost(); // 加载表格数据
    this.fetchFactorNames();
  },
  methods: {
    exportToExcel() {

        // 创建一个新数组，用于存储自定义标题和数据
      const dataWithCustomHeaders = this.tableData.map(row => ({
        'No': row.no,  // 'row.xxx' 是原始数据的属性名
        '発生日': row.today,  
        '要因別': row.factor,  
        '社内外': row.responsibility,  
        '区分': row.classification,  
        '所属': row.affiliationcode,  
        '起因者': row.causeperson,  
        '企業態': row.corporateentity,  
        '店舗名': row.storename,  
        '経緯': row.progress,  
        '報告者': row.reporter,  
        '温度帯': row.temperature,  
        '対応方法': row.correspondence,  
        '対応者': row.correspondenceperson,  
        '対策': row.countermeasure,  
        '作成日': row.createtime,  
        '更新日': row.updatetime,  
        '登録者': row.adminuserid,  
        
      }));
       // 此处转换数据并导出为Excel的代码
        // 创建工作簿
      const wb = XLSX.utils.book_new();
      // 将数据转换为工作表
      const ws = XLSX.utils.json_to_sheet(dataWithCustomHeaders);
      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      // 导出工作簿
      XLSX.writeFile(wb, 'report.xlsx');
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },

    doSelectUser(val) {
      console.log(val)
      this.tempUser = val
    },
    doSelectCorporate(val) {
      console.log(val)
      this.tempCorporate = val
    },
    doSelectUnit(val) {
      console.log(val)
      this.tempUnit = val
    },

    del(no) {
      console.log(no)

      this.$axios.get(this.$httpUrl + '/record/delete?no=' + no).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '削除完了！',
            type: 'success'
          });
          this.loadPost()
        } else {
          this.$message({
            message: '削除失败！',
            type: 'error'
          });
        }

      })
    },

    fetchUnitNames() {
      // 示例API请求，你需要替换成你实际的API请求
      this.$axios.get(this.$httpUrl + '/unit/names').then(response => {
        this.unitNames = response.data.data; // 假设response.data是一个包含unit对象的数组
      }).catch(error => {
        console.error('Error fetching units:', error);
        // 处理错误，可能是显示错误消息或其他
      });
    },

    fetchFactorNames() {
      this.$axios.get(this.$httpUrl +'/factor/names').then(response => {
        this.factorNames = response.data.data; // 假设服务器返回的数据结构是 { data: [...] }
      }).catch(error => {
        console.error('Error fetching factor names:', error);
        // 这里应该处理错误，如显示消息给用户
      });
    },

    confirmUser() {
      this.form.causeperson = this.tempUser.name
      this.form.userid = this.tempUser.id
      this.innerVisible = false
    },

    confirmCorporate() {
      this.form.corporateentity = this.tempCorporate.corporateentity
      this.innerVisible1 = false
    },

    confirmUnit() {
      this.form.affiliationcode = this.tempUnit.name
      this.innerVisibleUnit = false
    },
    selectUser() {
      this.innerVisible = true
    },

    selectCorporate() {
      this.innerVisible1 = true
    },
    selectUnit() {
      this.innerVisibleUnit = true
    },
    selectCurrentChange(val) {
      this.currentRow = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    resetParam() {
      this.affiliationcode = ''
      this.factor = ''
      this.causeperson = ''
      this.today = ''
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.no) {
            this.doMod();
          } else {
            alert('IR新規登録画面に戻してください。')
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/factor/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '変更しました！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '変更失敗です！',
            type: 'error'
          });
        }

      })
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/record/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          affiliationcode: this.affiliationcode,
          factor: this.factor,
          causeperson: this.causeperson,
          today:this.today,
          // roleId: this.user.roleId + '',
          userId: this.user.id + ''
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
    },
    mod(row) {
      console.log(row)

      this.centerDialogVisible = true
      // $nextTick 来确保赋值操作发生在 Vue 更新 DOM 之后是个好做法。这样做通常可以确保当数据更新时，视图也会相应更新。
      this.$nextTick(() => {
        //赋值到表单
        this.form.no = row.no
        this.form.today = row.today
        //this.form.classification = row.classification===1?'TP':row.classification===2?'WH':row.classification===3?'LD':'不明'
        // this.form.corporateentity = row.corporateentity
        // this.form.affiliationcode = row.affiliationcode
        // this.form.temperature = row.temperature===1?'冷凍':row.temperature===2?'冷凍':row.temperature===3?'常温':'不明'
        // this.form.responsibility = row.responsibility===1?'社内':row.responsibility===2?'社外':
        this.form.userid = row.userid
        this.form.adminuserid = row.adminuserid
        // this.form.correspondence = row.correspondence
        // this.form.correspondenceperson = row.correspondenceperson
        // this.form.countermeasure = row.countermeasure
        // this.form.progress = row.progress
        this.form.causeperson = row.causeperson
        // this.form.storename = row.storename+''
        this.form.factor = row.factor
        // this.form.reporter = row.reporter
        this.form.userid = row.userid //起因者社員番号
        this.form.adminuserid = row.adminuserid //登録者、ログインアカウント
      })
      console.log(row.correspondence)
    },
    
  },
  beforeMount() {
    //为记录管理页面的 上端仓库选中的回显内容 
    // this.loadStorage()
    // //为记录管理页面的 上端分类选中的回显内容 
    // this.loadGoodstype()
    //为记录管理页面的 初始回显内容 就是当切换到这一个页面的时候 就回显内容
    this.loadPost()

  }
}
</script>

<style scoped>



</style>