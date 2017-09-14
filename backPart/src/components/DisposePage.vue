<template>
  <div>
    <div class="header-total"><div class="title"><strong>开票处理后台系统</strong></div></div>
    <div class="container">
      <Tabs class="content">
        <Tabs values="unTreated">
          <TabPane label="未处理" name="unTreated" class="unTreated">
            <span class="pages"><Page :total = "100" size="small" @on-change="unTreatedShowPageX" :current.sync="currentUnTreatedPage"></Page></span>
            <label for="query">检索框</label><input type="text" id="query" v-model="queryInput" placeholder="请输入要查询的订单号" @input="updateUnTreatedCheckList"><span class="query-logo" @click="filterTable"></span>
            <Table border :columns="columnsUnTreated" :data="dataUntreated" width="100%"></Table>
            <Modal v-model="disposeModal">
              <div class="dispose-container">
                <h2 class="title">用户信息</h2>
                <hr>
                  <div class="row"><tr><th>开票人账户:</th><td>{{getDataRow.buyerNick}}</td></tr></div>
                  <div class="row" v-if="getDataRow.list"><tr><th>开票人订单号:</th><td>{{getDataRow.list.join(',')}}</td></tr></div>
                <h2 class="title">收件信息</h2>
                <hr>
                  <div class="row"><tr><th>详细地址:</th><td>{{`${getDataRow.province} ${getDataRow.city} ${getDataRow.region} ${getDataRow.street}` }}</td></tr></div>
                  <div class="row"><tr><th>收件人:</th><td>{{getDataRow.receiver}}</td></tr></div>
                  <div class="row"><tr><th>联系方式:</th><td>{{getDataRow.telephone}}</td></tr></div>
                <h2 class="title">发票信息</h2>
                <hr>
                  <div class="row"><tr><th>详细地址:</th><td>{{getDataRow.companyName}}</td></tr></div>
                  <div class="row"><tr><th>纳税人识别号:</th><td>{{getDataRow.taxesNumber}}</td></tr></div>
                  <div class="row"><tr><th>开具方式:</th><td>{{getDataRow.way}}</td></tr></div>
                  <div class="row"><tr><th>发票内容:</th><td>{{getDataRow.content}} <input type="text" placeholder="如为产品明细请在此填写" v-model="getDataRow.productDetails"></td></tr></div>
                  <div class="row"><tr><th>发票金额:</th><td><input type="text" placeholder="请手动填写发票金额" v-model="getDataRow.fee"></td></tr></div>
                  <div class="row"><tr><th>备注:</th><td><input type="text" placeholder="请手动填写备注信息" v-model="getDataRow.memo"></td></tr></div>
                <hr>
                <h2>开票信息问题选择</h2>
                <span v-for="(item,index) in questions" class="question" @click="activeIt(index)" :class="{active:item.status}">{{item.question}}</span>
                <span class="question" @click="activeOthers" :class="{active:otherStatus}">其他问题</span>
                <textarea id="" cols="90" rows="5" placeholder="用文字描述其他问题" v-if="showOthers" v-model="otherProblem"></textarea>
              </div>
              <div slot="footer"><Button type="primary" v-if="pass" @click="submitSuccess">审核通过</Button><Button type="warning" v-else @click="submitFail">未通过</Button></div>
            </Modal>
          </TabPane>
          <TabPane label="已处理" name="treated" class="treated">
            <div class="header">
              <div class="header-left">
                <div class="results">已选{{this.selectedColumns.length}}个待处理</div>
                <!--<div>（可开票总金额:{{totalMoney}}）</div>-->
              </div>
              <div class="header-right">
                <span>点击“开票”将会打包下载选中的项目并保存为Excel报表</span>
                <span class="open-receipt" @click="openReceipt"></span>
              </div>
            </div>
            <label for="query2">检索框</label><input type="text" id="query2" v-model="queryInputTreated" @input="updateTreatedCheckList" placeholder="请输入要查询的订单号"><span class="query-logo" @click="filterTreatedTable"></span>
            <div class="results">
              <Tabs size="small" @on-click="activeTreated = $event">
                <TabPane label="审核成功" name="pass">
                  <span class="pages-pass"><Page :total = "100" size="small" @on-change="passShowPageX" :current.sync="currentPassedPage"></Page></span>
                  <Table border :columns="columnsSuccess" :data="dataSuccess" width="100%" @on-selection-change="getSelected"></Table>
                </TabPane>
                <TabPane label="审核失败" name="nopass">
                  <span class="pages-unpass"><Page :total = "100" size="small" @on-change="unPassShowPageX" :current.sync="currentUnPassedPage"></Page></span>
                  <Table border :columns= "columnsFailure" :data="dataFailure" width="100%"></Table>
                </TabPane>
              </Tabs>
            </div>
          </TabPane>
        </Tabs>
      </Tabs>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    const SUCCESS = 200
    export default{
      data () {
        return {
          currentUnpassedPage: 1,
          currentPassedPage: 1,
          currentUntreatedPage: 1,
          activeTreated: 'pass',
          queryInput: '',
          queryInputTreated: '',
          questions: [
            {
              question: '专票需要联系在线客服',
              status: false
            },
            {
              question: '收货地址不详',
              status: false
            },
            {
              question: '收件人电话号码有误',
              status: false
            },
            {
              question: '税号错误',
              status: false
            },
            {
              question: '部分订单编号已经开过发票,无法再次开具',
              status: false
            }
          ],
          dataUntreated: [
          ],
          dataUntreatedPreserve: [],
          getDataRow: {},
          columnsUnTreated: [
            {
              title: '登记日期',
              key: 'registerData'
            },
            {
              title: '发票抬头',
              key: 'receiptTitle'
            },
            {
              title: '订单编号',
              key: 'billNumber'
            },
            {
              title: '税号',
              key: 'taxNumber'
            },
            {
              title: '发票内容',
              key: 'receiptContent'
            },
            {
              title: '发票金额',
              key: 'receiptMoney'
            },
            {
              title: '备注',
              key: 'remarks'
            },
            {
              title: '操作',
              key: 'operation',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        var id = params.row.id
                        console.log(id)
                        this.questions.forEach((item) => {
                          item.status = false
                        })
                        this.pass = true
                        this.axios.get(`${this.$mainUrl}getid/${id}?token=${sessionStorage.token}`).then((res) => {
                          this.getDataRow = res.data.content.data
                          console.log(this.getDataRow, '获得数据')
                        })
                        this.disposeModal = true
                      }
                    }
                  }, '处理')
                ])
              }
            }
          ],
          columnsSuccess: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '登记日期',
              key: 'registerData'
            },
            {
              title: '发票抬头',
              key: 'receiptTitle'
            },
            {
              title: '订单编号',
              key: 'billNumber'
            },
            {
              title: '税号',
              key: 'taxNumber'
            },
            {
              title: '发票内容',
              key: 'receiptContent'
            },
            {
              title: '发票金额',
              key: 'receiptMoney'
            },
            {
              title: '备注',
              key: 'remarks'
            },
            {
              title: '状态',
              key: 'status',
              align: 'center',
              render: (h, params) => {
                console.log(params, 'params')
                return h('div', [
                  h('span', {
                    style: {
                      color: '#f6a623'
                    }
                  }, params.row.status)
                ])
              }
            }
          ],
          columnsFailure: [
            {
              title: '登记日期',
              key: 'registerData'
            },
            {
              title: '发票抬头',
              key: 'receiptTitle'
            },
            {
              title: '订单编号',
              key: 'billNumber'
            },
            {
              title: '税号',
              key: 'taxNumber'
            },
            {
              title: '发票内容',
              key: 'receiptContent'
            },
            {
              title: '发票金额',
              key: 'receiptMoney'
            },
            {
              title: '备注',
              key: 'remarks'
            },
            {
              title: '联系方式',
              key: 'contactInfo',
              render: (h, params) => {
                return h('div', [
                  h('span', params.row.buyerNick)
                ])
              }
            }
          ],
          dataFailure: [],
          dataSuccess: [],
          disposeModal: false,
          showOthers: false,
          pass: true,
          otherStatus: false,
          otherProblem: '',
          noProblemStatus: false,
          noTreated: [],
          failReceipt: [],
          successReceipt: [],
          selectedColumns: []
        }
      },
      created () {
        console.log(this.$mainUrl)
        console.log(sessionStorage.token)
        this.getUnTreatedCheckList()
        this.getPassCheckList()
        this.getUnpassedCheckList()
      },
      computed: {
        totalMoney: function () {
          return this.selectedColumns.reduce((totalMoney, currentItem) => {
            console.log(currentItem)
            return totalMoney + parseInt(currentItem.receiptMoney)
          }, 0)
        }
      },
      methods: {
        getUnTreatedCheckList (startRow = 0) {
          this.selectedColumns = []
          var unTreatedCheckListForm = new FormData()
          unTreatedCheckListForm.append('token', sessionStorage.token)
          unTreatedCheckListForm.append('startRow', startRow)
          console.log(`${this.$mainUrl}getticketList`)
          this.axios.post(`${this.$mainUrl}getticketList`, unTreatedCheckListForm).then((res) => {
            console.log(res.data.content, 'success get unTreatedcheck list')
            if (res.data.content.errorCode === SUCCESS) {
              var unTreatedCheckList = res.data.content.data
              if (res.data.content.data !== null) {
                this.dataUntreated = []
                unTreatedCheckList.forEach((item) => {
                  this.dataUntreated.push({
                    registerData: new Date(item.gmtCreate).toLocaleString(),
                    receiptTitle: item.companyName,
                    billNumber: item.list.join(','),
                    taxNumber: item.taxesNumber,
                    receiptContent: item.content,
                    receiptMoney: item.fee,
                    remarks: item.memo,
                    id: item.id
                  })
                })
              } else {
                this.dataUntreated = []
              }
            } else {
              alert('获取票单失败')
            }
          }).catch(() => {
            alert('网络错误')
          })
        },
        getPassCheckList (startRow = 0) {
          this.selectedColumns = []
          var passCheckListForm = new FormData()
          passCheckListForm.append('token', sessionStorage.token)
          passCheckListForm.append('startRow', startRow)
          passCheckListForm.append('isCheck', true)
          this.axios.post(`${this.$mainUrl}getticketList`, passCheckListForm).then((res) => {
            console.log(res.data.content.data, 'success get pass checklist')
            var passCheckList = res.data.content.data
            if (res.data.content.errorCode === SUCCESS) {
              if (res.data.content.data !== null) {
                this.dataSuccess = []
                passCheckList.forEach((item) => {
                  this.dataSuccess.push({
                    registerData: new Date(item.gmtCreate).toLocaleString(),
                    receiptTitle: item.companyName,
                    billNumber: item.list.join(','),
                    taxNumber: item.taxesNumber,
                    receiptContent: item.content,
                    receiptMoney: item.fee,
                    remarks: item.memo,
                    id: item.id,
                    status: item.status
                  })
                })
              } else {
                this.dataSuccess = []
              }
            } else {
              alert('获取审核通过表单失败')
            }
          }).catch(() => {
            alert('网络错误')
          })
        },
        getUnpassedCheckList (startRow = 0) {
          this.selectedColumns = []
          var unPassCheckListForm = new FormData()
          unPassCheckListForm.append('token', sessionStorage.token)
          unPassCheckListForm.append('startRow', startRow)
          unPassCheckListForm.append('isCheck', false)
          this.axios.post(`${this.$mainUrl}getticketList`, unPassCheckListForm).then((res) => {
            console.log(res.data.content.data, 'success get unPass checklist')
            if (res.data.content.errorCode === SUCCESS) {
              var unPassCheckList = res.data.content.data
              if (res.data.content.data !== null) {
                this.dataFailure = []
                unPassCheckList.forEach((item) => {
                  this.dataFailure.push({
                    registerData: new Date(item.gmtCreate).toLocaleString(),
                    receiptTitle: item.companyName,
                    billNumber: item.list.join(','),
                    taxNumber: item.taxesNumber,
                    receiptContent: item.content,
                    receiptMoney: item.fee,
                    remarks: item.memo,
                    id: item.id,
                    buyerNick: item.buyerNick
                  })
                })
              } else {
                this.dataFailure = []
              }
            } else {
              alert('获取未通过表单失败')
            }
          }).catch(() => {
            alert('网络错误')
          })
        },
        updateUnTreatedCheckList () {
          if (this.queryInput === '') {
            this.currentUnTreatedPage = 1
            this.getUnTreatedCheckList()
          }
        },
        updateTreatedCheckList () {
          if (this.queryInputTreated === '') {
            this.currentPassedPage = 1
            this.getPassCheckList()
            this.getUnpassedCheckList()
          }
        },
        filterTable () {
          console.log(this.queryInput)
          console.log(sessionStorage.token)
          if (this.queryInput !== '') {
            this.axios.get(`${this.$mainUrl}gettradeid/${this.queryInput}?token=${sessionStorage.token}`).then((res) => {
              console.log(res.data.content, 'hehehe')
              if (res.data.content.errorCode === SUCCESS) {
                var responseData = res.data.content.data
                console.log(responseData)
                this.dataUntreated = []
                this.dataUntreated.push({
                  registerData: responseData[0].gmtCreate,
                  receiptTitle: responseData[0].companyName,
                  billNumber: responseData[0].list.join(','),
                  taxNumber: responseData[0].taxesNumber,
                  receiptContent: responseData[0].content,
                  receiptMoney: responseData[0].fee,
                  remarks: responseData[0].memo,
                  id: responseData[0].id,
                  status: responseData[0].status
                })
                console.log(this.dataUntreated)
              } else {
                alert('获取未处理票单错误')
              }
            }).catch(() => {
              alert('网络错误')
            })
          } else {
            alert('订单号不能为空')
          }
//          this.dataUntreated = this.dataUntreated.filter((item) => {
//            var filterFlag = 0
//            var billArray = item.billNumber.split(',')
//            billArray.forEach((item) => {
//              if (item === this.queryInput) {
//                filterFlag = 1
//              }
//            })
//            return filterFlag === 1
//          })
        },
        filterTreatedTable () {
          console.log(this.queryInputTreated)
          console.log(this.activeTreated, 'haha')
          this.axios.get(`${this.$mainUrl}gettradeid/${this.queryInputTreated}?token=${sessionStorage.token}`).then((res) => {
            if (res.data.content.errorCode === SUCCESS) {
              var responseData = res.data.content.data
              console.log(responseData)
              if (this.activeTreated === 'pass') {
                this.dataSuccess = []
//            this.dataFailure = []
                this.dataSuccess.push({
                  registerData: responseData[0].gmtCreate,
                  receiptTitle: responseData[0].companyName,
                  billNumber: responseData[0].list.join(','),
                  taxNumber: responseData[0].taxesNumber,
                  receiptContent: responseData[0].content,
                  receiptMoney: responseData[0].fee,
                  remarks: responseData[0].memo,
                  id: responseData[0].id
                })
              }
              if (this.activeTreated === 'nopass') {
                this.dataFailure = []
                this.dataFailure.push({
                  registerData: responseData[0].gmtCreate,
                  receiptTitle: responseData[0].companyName,
                  billNumber: responseData[0].list.join(','),
                  taxNumber: responseData[0].taxesNumber,
                  receiptContent: responseData[0].content,
                  receiptMoney: responseData[0].fee,
                  remarks: responseData[0].memo,
                  id: responseData[0].id
                })
              }
//            this.dataFailure.push()
              console.log(this.dataSuccess)
            } else {
              alert('获取处理票单错误')
            }
          }).catch(() => {
            alert('网络错误')
          })
        },
        activeIt (index) {
          console.log(this.questions[index].status)
          if (this.questions[index].status === false) {
//            this.questions.forEach((item) => {
//              item.status = false
//            })
            this.questions[index].status = true
          } else {
            this.questions[index].status = false
          }
          this.judgeWeatherPass()
        },
        activeOthers () {
          this.pass = false
          this.showOthers = true
          if (this.otherStatus === false) {
            console.log(5)
            this.otherStatus = true
          } else {
            console.log(6)
            this.otherStatus = false
            this.showOthers = false
          }
          this.judgeWeatherPass()
        },
        judgeWeatherPass () {
          this.pass = true
          this.questions.forEach((item) => {
            if (item.status === true) {
              this.pass = false
            }
          })
          if (this.otherStatus === true) {
            this.pass = false
          }
        },
        unTreatedShowPageX ($event) {
          var startRow = ($event - 1) * 10
          this.getUnTreatedCheckList(startRow)
        },
        passShowPageX ($event) {
          var startRow = ($event - 1) * 10
          this.getPassCheckList(startRow)
        },
        unPassShowPageX ($event) {
          var startRow = ($event - 1) * 10
          this.getUnpassedCheckList(startRow)
        },
        submitSuccess () {
          var passForm = new FormData()
          passForm.append('id', this.getDataRow.id)
          if (this.getDataRow.productDetails !== undefined) {
            console.log(`${this.getDataRow.content}(${this.getDataRow.productDetails})`, '产品明细')
            passForm.append('content', `${this.getDataRow.content}(${this.getDataRow.productDetails})`)
          }
          passForm.append('memo', this.getDataRow.memo)
          passForm.append('fee', this.getDataRow.fee)
          passForm.append('isCheck', true)
          if (this.getDataRow.fee !== '') {
            this.axios.post(`${this.$mainUrl}statusUpdate?token=${sessionStorage.token}`, passForm).then((res) => {
              if (res.data.content.errorCode === SUCCESS) {
              } else { alert('提交失败') }
            }).catch(() => {
              alert('网络错误')
            })
            this.disposeModal = false
            this.getUnTreatedCheckList()
            this.getPassCheckList()
            this.getUnpassedCheckList()
          } else {
            alert('请务必填入发票金额')
          }
        },
        submitFail () {
          var failForm = new FormData()
          failForm.append('id', this.getDataRow.id)
          if (this.getDataRow.productDetails !== '') {
            failForm.append('content', `${this.getDataRow.content}(${this.getDataRow.productDetails})`)
          }
          failForm.append('memo', this.getDataRow.memo)
          failForm.append('fee', this.getDataRow.fee)
          failForm.append('isCheck', false)
          this.questions.forEach((item) => {
            if (item.status === true) {
              this.getDataRow.ques = ',' + item.question + this.getDataRow.ques
            }
          })
          this.getDataRow.ques = this.getDataRow.ques.slice(1)
          console.log(this.getDataRow)
          console.log(this.getDataRow.ques, 'ques ques')
          if (this.otherStatus === true) {
            this.getDataRow.ques = this.getDataRow.ques + ',' + this.otherProblem
          }
          console.log(this.getDataRow.ques)
          failForm.append('ques', this.getDataRow.ques)
          this.axios.post(`${this.$mainUrl}statusUpdate?token=${sessionStorage.token}`, failForm).then((res) => {
            if (res.data.content.errorCode === SUCCESS) {
              console.log(res)
              this.disposeModal = false
              this.getUnTreatedCheckList()
              this.getPassCheckList()
              this.getUnpassedCheckList()
            } else { alert('提交失败') }
          }).catch(() => {
            alert('网络错误')
          })
        },
        getSelected ($event) {
          this.selectedColumns = $event
        },
        openReceipt () {
          var ids = []
          this.selectedColumns.forEach((item) => {
            ids.push(item.id)
          })
          ids = ids.join(',')
          console.log(ids, 'ids')
          if (ids !== '') {
            window.open(`${this.$mainUrl}exportTicket/${ids}?token=${sessionStorage.token}`)
          } else {
            alert('请勾选开票订单')
          }
          this.getUnTreatedCheckList()
          this.getPassCheckList()
          this.getUnpassedCheckList()
        }
      }
    }
</script>

<style lang="scss"
       rel="stylesheet/scss" scoped>
  .header-total
  {
    padding-top:24px;
    padding-bottom: 24px;
    padding-left: 61px;
    color:#ffffff;
    background: #2d2d2d;
    .title{
      font-size: 18px;
    }
  }
  .container{
    background: #f4f7f9;
    padding: 0 76px 0 76px;
    height:100vh;
    .pages{
      vertical-align: top;
      position: absolute;
      display: inline-block;
      right:30px;
      z-index:99
    }
    .content{
      height: 100vh;
      background: #ffffff;
      box-shadow: 0 0 20px 0 rgba(0,0,0,0.5);
      padding: 0 71px 0 71px;
    }
    .query-logo{
      vertical-align: middle;
      margin-left:10px;
      display: inline-block;
      width:15px;
      height: 15px;
      background: url('../assets/res-6.png');
      background-size: 100% 100%;
    }
  }
  .unTreated{
    label{
      margin-right: 10px;
    }
    input{
      margin-bottom: 10px;
    }
  }
  .treated{
    .pages{
      vertical-align: top;
      position: relative;
      display: inline-block;
      margin-left:1290px;
      bottom:45px;
    }
    .header{
      height: 100px;
      display:flex;
      align-items: center;
      background: #e6ecef;
      .header-left{
        padding-left:26px;
        width:140px;
        .results{
          font-weight: 900;
          font-size: 1rem;
          margin-top:0px;
        }
      }
      .header-right{
        margin-left:1050px;
        display: inline-block;
        width:410px;
        span{
          display:inline-block;
          vertical-align: top;
          width:205px;
          margin-right: 12.6px;
        }
        .open-receipt{
          display:inline-block;
          width:175px;
          height: 62px;
          background: url('../assets/res-10.png');
          background-size: 100% 100%;
        }
      }
    }
    .results{
      margin-top:20px;
    }
    #query2{
      margin-top:10px;
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
  .dispose-container{
    h2{
      margin-top:2%;
      margin-bottom:2%
    }
    .row{
      margin-top: 10px;
      margin-bottom: 10px;
      th{
        width:100px;
        text-align: left;
        word-wrap: break-word;
      }
      td{
        word-wrap:break-word;
        word-break:break-all;
      }
    }
    .question{
      display: inline-block;
      border:1px solid;
      margin-right:20px;
      margin-bottom:5px;
      padding:5px;
    }
    .active{
      color:#f90;
    }
  }
</style>

<style>
  .treated .ivu-tabs-nav .ivu-tabs-tab-active{
    background: #78909c;
    color:#ffffff;
    border-radius: 5px;
  }
</style>
