<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="factor" placeholder="要因検索" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">検索</el-button>
      <el-button type="success" @click="resetParam">クリア</el-button>
      
      <!-- 要因の新規登録が要因別管理の画面より登録する、この画面で追加しても可能ですが、下記のコメントを解除必要です。 -->
      <!-- <el-button type="primary" style="margin-left: 5px;" @click="add" >要因　新規</el-button> -->
      <el-button type="primary" style="margin-left: 5px;" @click="inGoods" >IR新規登録</el-button>
      <!-- <el-button type="primary" style="margin-left: 5px;" @click="outGoods">出库</el-button> -->
    </div>

    <!-- 选中当前行 单机事件 -->
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
              highlight-current-row
              @current-change="selectCurrentChange">
      <el-table-column prop="no" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="id" label="管理番号" width="100">
      </el-table-column>
      <el-table-column prop="factor" label="要因名称" width="200">
      </el-table-column>
      <!-- <el-table-column prop="storage" label="仓库" width="180" :formatter="formatStorage">
      </el-table-column>
      <el-table-column prop="goodstype" label="分类" width="180" :formatter="formatGoodstype">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180">
      </el-table-column> -->
      <el-table-column prop="comment" label="備考" width="200">
      </el-table-column>

      <!-- <el-table-column prop="operate" label="操作" v-if="user.roleId!=2">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.no)"
              style="margin-left: 5px;">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column> -->

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
        title="要因新規登録"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="管理番号" prop="id">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="要因名称" prop="factor">
          <el-col :span="20">
            <el-input v-model="form.factor"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="備考" prop="comment">
          <el-col :span="20">
            <el-input type="textarea"  v-model="form.comment"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        title="IR登録"
        :visible.sync="inDialogVisible"
        width="50%"
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



      <!-- 内嵌套 页面 就是点击新增的页面 然后在点击申请人按钮 又会跳出 另一个输入框  -->
      
      <el-form ref="form1" :rules="rules1" :model="form1" label-width="80px">
        <el-form-item label="要因名称">
          <el-col :span="20">
            <el-input v-model="form1.factor" readonly></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="発生日">
          <el-date-picker
            v-model="form1.today"
            type="date"
            placeholder="日付選択">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="起因者">
          <el-col :span="20">
            <el-input v-model="form1.causeperson" readonly @click.native="selectUser"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="営業所">
          <el-col :span="20">
            <!-- 点击申请人按钮 触发 @click.native="selectUser" 事件 -->
            <el-input v-model="form1.affiliationcode" readonly @click.native="selectUnit"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="企業体名">
          <el-col :span="20">
            <!-- 点击申请人按钮 触发 @click.native="selectUser" 事件 -->
            <el-input v-model="form1.corporateentity" readonly @click.native="selectCorporate"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="店舗名" prop="storename">
          <el-col :span="20">
            <el-input v-model="form1.storename"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="社内外">
          <el-select v-model="form1.responsibility" placeholder="区分選択">
            <el-option label="社内" value="1"></el-option>
            <el-option label="社外" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区分">
          <el-select v-model="form1.classification" placeholder="区分選択">
            <el-option label="TP" value="1"></el-option>
            <el-option label="WH" value="2"></el-option>
            <el-option label="LD" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="経緯" prop="progress">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.progress"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="報告者" prop="reporter">
          <el-col :span="20">
            <el-input v-model="form1.reporter"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="温度帯">
          <el-select v-model="form1.temperature" placeholder="温度帯選択">
            <el-option label="冷蔵" value="1"></el-option>
            <el-option label="チルド" value="2"></el-option>
            <el-option label="常温" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="対応方法" prop="correspondence">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.correspondence"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="対応者" prop="correspondenceperson">
          <el-col :span="20">
            <el-input v-model="form1.correspondenceperson"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="対応策" prop="countermeasure">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.countermeasure"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="inDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doInGoods">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
//传入 selectuser 的员工信息
import SelectUser from "../user/SelectUser";
import SelectCorporate from "../corporate/SelectCorporate";
import SelectUnit from "../unit/SelectUnit";

export default {
  name: "GoodsManage",
  components: {SelectUser,SelectCorporate,SelectUnit},
  data() {
    let checkCount = (rule, value, callback) => {
      if (value > 9999) {
        callback(new Error('数量输入过大'));
      } else {
        callback();
      }
    };

    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      storageData: [],
      goodstypeData: [],
      tableData: [],
      pageSize: 30,
      pageNum: 1,
      total: 0,
      factor: '',
      storage: '',
      today:'',
      goodstype: '',
      centerDialogVisible: false,
      inDialogVisible: false,
      innerVisible: false,
      innerVisible1: false,
      innerVisibleUnit:false,
      currentRow: {},
      tempUser: {},
      tempCorporate:{},
      tempUnit:{},
      form: {
        id: '',
        factor: '',
        comment: ''
      },
      form1: {
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
        // employeeId:'',//社員ID
        userid: '',//起因者社員番号
        adminuserid: '',//登録者、ログインアカウント
        // remark: '',
        // action: '1' //出库和入库 入库为1 出库为2 
      },
      rules1: {},
      rules: {
      }
    }
  },
  methods: {
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

    confirmUser() {
      this.form1.causeperson = this.tempUser.name
      this.form1.userid = this.tempUser.id
      this.innerVisible = false
    },

    confirmCorporate() {
      this.form1.corporateentity = this.tempCorporate.corporateentity
      this.innerVisible1 = false
    },

    confirmUnit() {
      this.form1.affiliationcode = this.tempUnit.name
      this.innerVisibleUnit = false
    },
    selectCurrentChange(val) {
      this.currentRow = val;
    },

    //如果item的id值和 当前选中行的仓库名字一样，那么就return结果  temp等于取到的对于仓库名  
    formatStorage(row) {
      let temp = this.storageData.find(item => {
        return item.id == row.storage
      })

      return temp && temp.name
    },
    //如果item的id值和 当前选中行的仓库名字一样，那么就return结果  temp等于取到的对于商品的归类信息
    formatGoodstype(row) {
      let temp = this.goodstypeData.find(item => {
        return item.id == row.goodstype
      })

      return temp && temp.name
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    resetInForm() {
      this.$refs.form1.resetFields();
    },

    //要因のテーブル
    del(no) {
      console.log(no)

      this.$axios.get(this.$httpUrl + '/factor/delete?no=' + no).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '変更完了！',
            type: 'success'
          });
          this.loadPost()
        } else {
          this.$message({
            message: '変更失敗！',
            type: 'error'
          });
        }

      })
    },
    mod(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.no = row.no
        this.form.id = row.id
        this.form.factor = row.factor
        this.form.comment = row.comment
      })
    },
    add() {

      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm()

        this.form.id = ''
      })

    },
    inGoods() {

      // 当点击新增的时候,它的id存在的话 就是当某个商品的行是在选中的状态下,
      // 就可以进行入库,如果没有id的值话 就弹出一个  请选择记录的 窗口
      if (!this.currentRow.no) {
        alert('要因別選択してください！');
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(() => {
        this.resetInForm()
      })
      this.form1.factor = this.currentRow.factor
      // this.form1.goods = this.currentRow.id
      this.form1.adminuserid = this.user.name
      // this.form1.action = '1' //入库
    },
    outGoods() {
      if (!this.currentRow.id) {
        alert('请选择记录');
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(() => {
        this.resetInForm()
      })

      // this.form1.goodsname = this.currentRow.name
      // this.form1.goods = this.currentRow.id
      this.form1.adminuserid = this.user.name
      // this.form1.action = '2' //出库

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
    doSave() {
      this.$axios.post(this.$httpUrl + '/factor/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/factor/update', this.form).then(res => res.data).then(res => {
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
    doInGoods() {
      this.$axios.post(this.$httpUrl + '/record/save', this.form1).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.inDialogVisible = false
          this.loadPost()
          this.resetInForm()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
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
    // 重置按钮，查找输入框的内容清除
    resetParam() {
      this.factor = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/factor/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          factor: this.factor,
          //强转方式， 不加 + '', 强行转换的话，那么它是Integer类型，后端接受的String类型，
          //就会出现类型不匹配错误 所以要加强转  ⭐⭐⭐⭐⭐⭐⭐⭐
          // goodstype: this.goodstype + '',
          // storage: this.storage + ''
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
    this.loadPost()

  }
}
</script>

<style scoped>

</style>