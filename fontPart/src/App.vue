<template>
  <div id="app">
    <form @submit="openInsureModel($event)" id="receiptForm">
      <div class="header"><span class="back"></span><strong>填写开票信息</strong><span class="explanation" @click="showExplanation">开票说明</span></div>
      <div class="body">
        <div class="taobao-name">
          <div class="name-title">淘宝会员名</div>
          <div class="name-body">
              <label for="taobaoName"><span class="required-sign">*</span>淘宝会员名:</label><input type="text" id="taobaoName" v-model="receiptInfo.taobaoName" placeholder="请填写会员名" required="required">
          </div>
        </div>
        <div class="bill-info">
          <div class="bill-title">订单信息</div>
          <div class="bill-body">
            <div class="bill" v-for="(item,index) in receiptInfo.billArray">
              <span class="delete" @click="deleteBill(index)" v-show="index!==0"></span><label for="billNumber"><span class="required-sign">*</span>{{item.title}}{{index+1}}:</label>
              <div class="input-tradeId"><input type="text" id="billNumber" v-model="item.number" placeholder="请填写订单号" required="required" @input="judgeWhetherShowClear(item)"><span v-show="item.clearStatus" class="clear-sign" @click="item.number = ''" ></span></div>
            </div>
            <hr class="separator">
            <Button class="add-button" type="primary" @click="addBill"><span class="add-icon"></span></Button>
          </div>
        </div>
        <div class="receipt-info">
          <div class="receipt-title">发票详情</div>
          <div class="receipt-body">
            <div class="receipt-company">
              <span class="company"><span class="required-sign">*</span>发票抬头:</span>
              <Radio-group v-model="receiptInfo.comeup">
                <Radio label="个人" class="radio"></Radio>
                <Radio label="公司(普票)" class="radio"></Radio>
              </Radio-group>
            </div>
            <div v-if="receiptInfo.comeup === '个人'">
              <input type="text" v-model="receiptInfo.Name" placeholder="请填你的名字" class="company-name" required="required">
            </div>
            <div v-if="receiptInfo.comeup === '公司(普票)'">
              <input type="text" v-model="receiptInfo.Name" placeholder="请填写公司名称" class="company-name" required="required"><input type="text" v-model="receiptInfo.receiverNumber" placeholder="请填写纳税人识别号" class="receiver-number" required="required">
            </div>
            <div class="receipt-means">
              <div class="receipt-content">
                <span class="content"><span class="required-sign">*</span>发票内容:</span>
                <Select v-model="receiptInfo.receiptContent" style="width:65%">
                  <Option v-for="item in contentArray" :value="item" >{{item}}</Option>
                </Select>
              </div>
              <div class="remarks">
                <label class="remarks-label" for="remarks">备注(选填):</label>
                <textarea id="remarks" cols="30" rows="10" class="remarks-content" v-model="receiptInfo.remarks" placeholder="如果你有特殊的要求，可在此填写."></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="receiver-info">
          <div class="receiver-title">收件信息</div>
          <div class="receiver-body">
            <label for="person" class="person"><span class="required-sign">*</span>收件人:</label>
            <input type="text" id="person" v-model="receiptInfo.person" class="receiver-input" placeholder="请填写收件人" required="required">
            <label for="iphone" class="iphone"><span class="required-sign">*</span>联系方式:</label>
            <input type="number" id="iphone" v-model="receiptInfo.phone" class="receiver-input" placeholder="请填写手机号" required="required">
            <label for="region" class="region"><span class="required-sign">*</span>所在地区: </label>
            <AddressInput @provinceSelected = "receiptInfo.province = $event"
                            @citySelected = "receiptInfo.city = $event"
                            @districtSelected = "receiptInfo.district = $event"></AddressInput>
            <label for="addressDetail" class="address-detail"><span class="required-sign">*</span>详细地址:</label>
            <textarea class="input-detail" id="addressDetail" cols="32" rows="3" v-model="receiptInfo.addressDetail" placeholder="请填写详细地址" required="required"></textarea>
          </div>
        </div>
      </div>
      <div class="footer">
        <button class="submit-button" type="submit">确认提交</button>
      </div>
    </form>
    <Modal v-model="explanationModel" class="explanation-modal">
      <h1>开票说明</h1>
        <div class="explanation-container">
          <h2>开票注意事项</h2>
          <ul>1、该页面提交默认开具增值税普通发票，如果需要开具专票请联系客服。</ul>
          <ul>2、一张发票可以合并开具多个订单，但是一个订单不能分多个发票开出。</ul>
          <ul>3、发票将会在您提供发票信息之后的7个工作日左右发出，大促除外。</ul>
          <ul>4、如果需要寄往与包裹收货地址不一样的地址，请必说明发票寄往的详细地址。</ul>
          <ul>5、一个订单不能分开两张发票，如果写不了发票明细可另附清单。</ul>
          <ul>6、如果需要在发票上体现发票抬头公司的地址、电话、开户行及账号的，请联系客服备注说明（电动牙刷需要添加购买日期，需要单独跟客服说明）。</ul>
          <ul>7、发票抬头只能为个人真实姓名或者公司、企业名称。</ul>
          <ul>8、抬头为公司的普通发票需要提供对应的纳税人识别号</ul>
          <h2>填写步骤注意事项</h2>
          <ul>1、“*”为必填项。</ul>
          <ul>2、订单编号必须与购买的淘宝会员名保持一致，否则无法开出。</ul>
          <ul>3、多个订单开在一个发票上，请选择“合并开具”，如果需要单独开票，请选择“分开开具”。</ul>
          <ul>4、收件信息为发票寄往地址的收件信息</ul>
          <ul>5、请填写详细的收件信息，如因为收件地址不详导致派送不成功，二次寄出运费需要消费者补邮费。</ul>
          <ul>6、发票信息提供之后财务会进行审核并通过旺旺与您核对，旺旺上核对完成才能正常为您开出，请务必及时查看旺旺消息并确认回复，如果信息提供不全或者开票信息不匹配，将无法正常为您开出，请谅解。</ul>
          <ul>7、我们会在您提交发票登记信息后的72小时内审核，审核失败将通过旺旺通知您需要完善或者提供的发票信息，如果审核成功，将会与您在旺旺上进行再次核对，请注意查看旺旺消息并回复“确认”，否则无法正常开出。</ul>
          <ul>8、该页面仅为已经正常购买的消费者，提供发票信息登记服务，商家将会严格遵守平台规则保护好消费者隐私，详情请通过旺旺咨询店铺客服</ul>
        </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="notifyModel" class="notify-modal">
      <div class="notify-container">
        <h2>开票须知</h2>
        <p>应国家税务总局要求，自2017年7月1日起，您若开具增值税普通发票，须同时提供企业抬头及税号，否则发票将无法用于企业报销。</p>
      </div>
      <div slot="footer"><button class="look-explanation" @click="showExplanation">查看开票说明</button></div>
    </Modal>
    <Modal v-model="insureModel"
           class="insure-modal"
           @on-ok="ok">
      <div class="insure-container">
        <h1>开票信息确认</h1>
        <div class="insure-separator-large"></div>
        <h2>开票信息:</h2>
        <div class="insure-separator-small"></div>
          <div><tr class="taobao-name"><th>淘宝会员名:</th><td>{{receiptInfo.taobaoName}}</td></tr></div>
          <div><tr class="bill-number"><th>订单号:</th><td><span v-for="item in receiptInfo.billArray">{{item.number}}|</span></td></tr></div>
        <div class="insure-separator-large"></div>
        <h2>收件信息:</h2>
        <div class="insure-separator-small"></div>
          <div><tr class="detail-address"><th>详细地址:</th><td>{{receiptInfo.addressDetail}}</td></tr></div>
          <div><tr class="receiver"><th>收件人:</th><td><span>{{receiptInfo.person}}</span></td></tr></div>
          <div><tr class="detail-address"><th>联系方式:</th><td>{{receiptInfo.phone}}</td></tr></div>
        <div class="insure-separator-large"></div>
        <h2>发票信息:</h2>
        <div class="insure-separator-small"></div>
          <div><tr class="company-name"><th>公司名称:</th><td>{{receiptInfo.Name}}</td></tr></div>
          <div><tr class="receiver-number"><th>纳税人识别号:</th><td><span>{{receiptInfo.receiverNumber}}</span></td></tr></div>
          <div><tr class="means"><th>开具方式:</th><td>{{receiptInfo.means}}</td></tr></div>
          <div><tr><th>发票内容:</th><td>{{receiptInfo.receiptContent}}</td></tr></div>
          <div><tr><th>备注:</th><td><span>{{receiptInfo.remarks}}</span></td></tr></div>
          <div><tr><th>申请时间:</th><td><span>{{(new Date()).toLocaleString()}}</span></td></tr></div>
      </div>
    </Modal>
    <Modal v-model="finishModel" class="finish-modal">
      <h1>完成</h1>
      <div class="finish-container">
        <div class="ok-container">
          <span class="ok-icon"></span>
        </div>
        <div class="finish-explanation">
          <h2>温馨提示</h2>
          <ul>1、发票信息提供之后财务会进行审核并通过旺旺与您核对，旺旺上核对完成才能正常为您开出，请务必及时查看旺旺消息并确认回复，如果信息提供不全或者开票信息不匹配，将无法正常为您开出，请谅解</ul>
          <ul>2、我们会在您提交发票登记信息后的72小时内审核，审核失败将通过旺旺通知您需要完善或者提供的发票信息，如果审核成功，将会与您在旺旺上进行再次核对，请注意查看旺旺消息并回复“确认”，否则无法正常开出。</ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import AddressInput from './components/AddressInput.vue'
  export default {
    name: 'app',
    data () {
      return {
        receiptInfo: {
          taobaoName: '',
          billArray: [{title: '订单号', number: '', clearStatus: false}],
          comeup: '',
          means: '合并开具',
          Name: '',
          receiverNumber: '',
          receiptContent: '',
          person: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          addressDetail: '',
          remarks: '',
          showClear: false
        },
        contentArray: [ '玉兰油套餐', '洗涤用品', '产品明细' ],
        index: 2,
        explanationModel: false,
        notifyModel: true,
        insureModel: false,
        finishModel: false
      }
    },
    components: {
      AddressInput
    },
    created () {
      console.log(JSON.parse(localStorage.receiptInfo), 'haha1')
      this.receiptInfo = JSON.parse(localStorage.receiptInfo)
    },
    updated () {
      console.log(this.receiptInfo, 'haha9')
      localStorage.receiptInfo = JSON.stringify(this.receiptInfo)
      console.log(localStorage.receiptInfo)
    },
    methods: {
      showExplanation () {
        this.notifyModel = false
        this.explanationModel = true
      },
      addBill () {
//        console.log(this.receiptInfo, 'haha4')
        this.receiptInfo.billArray.push({title: '订单号', number: ''})
        this.index = this.index + 1
      },
      openInsureModel (event) {
        event.preventDefault()
        console.log(event)
        if (this.receiptInfo.comeup === ''
//          this.receiptInfo.receiverNumber === '' ||
        ) {
          alert('请选择发票抬头')
        } else if (this.receiptInfo.receiptContent === '') {
          alert('请填写发票内容')
        } else if (this.receiptInfo.billArray[0].number === '') {
          alert('请填写订单内容')
        } else if (this.receiptInfo.person === '') {
          alert('请填写收件人')
        } else if (this.receiptInfo.phone === '') {
          alert('请填写手机号')
        } else if (this.receiptInfo.city === '' || this.receiptInfo.province === '' || this.receiptInfo.district === '') {
          alert('请填写所在地区')
        } else if (this.receiptInfo.addressDetail === '') {
          alert('请填写详细地址信息')
        } else if (this.receiptInfo.Name === '') {
          alert('请填发票抬头写个人或公司名字')
        } else {
          localStorage.receiptInfo = this.receiptInfo
          this.insureModel = true
        }
      },
      ok () {
        var receiptForm = new FormData()
        console.log(this.receiptInfo)
        receiptForm.append('buyerNick', this.receiptInfo.taobaoName)
        receiptForm.append('comeup', this.receiptInfo.comeup)
        receiptForm.append('companyName', this.receiptInfo.Name)
        receiptForm.append('taxesNumber', this.receiptInfo.receiverNumber)
        receiptForm.append('way', this.receiptInfo.means)
        receiptForm.append('content', this.receiptInfo.receiptContent)
        receiptForm.append('memo', this.receiptInfo.remarks)
        receiptForm.append('receiver', this.receiptInfo.person)
        receiptForm.append('telephone', this.receiptInfo.phone)
        receiptForm.append('province', this.receiptInfo.province)
        receiptForm.append('city', this.receiptInfo.city)
        receiptForm.append('region', this.receiptInfo.district)
        receiptForm.append('street', this.receiptInfo.addressDetail)
        console.log(this.receiptInfo.billArray)
        var tradeIds = []
        this.receiptInfo.billArray.forEach((item) => {
          tradeIds.push(item.number)
        })
        tradeIds = tradeIds.join()
        console.log(tradeIds)
        receiptForm.append('tradeIds', tradeIds)
        this.axios.post(`save`, receiptForm).then((res) => {
          console.log(res, 12321)
          this.finishModel = true
        })
        this.receiptInfo = {
          taobaoName: '',
          billArray: [{title: '订单号', number: '', clearStatus: false}],
          comeup: '',
          means: '合并开具',
          Name: '',
          receiverNumber: '',
          receiptContent: '',
          person: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          addressDetail: '',
          remarks: '',
          showClear: false
        }
      },
      deleteBill (indexDele) {
        if (indexDele !== 0) {
          this.receiptInfo.billArray = this.receiptInfo.billArray.filter((element, index) => {
            return index !== indexDele
          })
        } else {
          alert('请至少填一个订单')
        }
      },
      judgeWhetherShowClear (item) {
        if (item.number === '') {
          item.clearStatus = false
        } else {
          item.clearStatus = true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin titleStyle{
    height: 40px;
    background-color: #E6ECEF;
    line-height: 40px;
    padding-left: 15px;
    font-size: 1rem;
    margin-top:3%;
    margin-bottom: 3%;
  }
  @mixin required{
    .required-sign{
      color:#ff0000;
    }
  }

  input{
    height: 45px;
    padding-left:5px;
  }
  .header{
    margin-top:3%;
    position: relative;
    text-align: center;
    font-size: 1.2rem;
    margin-bottom:3%;
    .back{
      display:inline-block;
      position: absolute;
      left:18px;
      width:12px;
      height:21px;
    }
    .explanation{
      position: absolute;
      right:3%;
      bottom: 0%;
      font-size:1rem;
    }
  }
  .body{
    .taobao-name {
      .name-title {
        @include titleStyle
      }
      .name-body{
        @include required;
        text-align: center;
        font-size:1.0rem;
        label{
          margin-right:5%;
        }
        #taobaoName{
          width:60%;
        }
      }
    }
    .bill-info {
      .bill-title {
        @include titleStyle
      }
      .bill-body{
        margin-top:3%;
        @include required;
        text-align: center;
        font-size:1.0rem;
        .bill{
          margin-bottom:10px;
          .delete{
            display:inline-block;
            width:15px;
            height:15px;
            background: url('assets/delete.png');
            background-size: 100% 100%;
            background-repeat:no-repeat ;
            margin-right: 5px;
          }
          .input-tradeId{
            position: relative;
            display: inline-block;
            width:60%;
          }
          .clear-sign{
            display: inline-block;
            width:15px;
            height: 15px;
            background: url('assets/clean.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: absolute;
            top:15px;
            right:4px;
          }
        }
        label{
          display: inline-block;
        }
        #billNumber{
          width:100%;
        }
        .separator{
          margin-top: 3%;
          margin-bottom: 4%;
        }
        .add-button{
          margin-left:10%;
          width:145px;
          border:#fff;
          height: 34px;
          border-radius: 20px;
          background: url('assets/res-4.png');
          background-size: 100% 100%;
          margin-bottom:3%;
        }
      }
    }
    .receipt-info{
      .receipt-title{
        @include titleStyle
      }
      .receipt-body{
        @include required;
        text-align: center;
        font-size: 1rem;
        .receipt-company {
          .radio {
            font-size: 1rem;
            margin-left: 40px;
          }
        }
        .receipt-means{
          margin-top: 3%;
          .radio{
            font-size: 1rem;
            margin-left: 30px;
          }
        }
        .receipt-content{
          width:90%;
          margin: 0 auto;
          margin-top: 3%;
          @include required;
          .content{
            margin-right: 10%;
          }
        }
        .remarks{
          margin-top: 3%;
          .remarks-content{
            vertical-align: top;
            margin-left: 7%;
            width:58%;
            padding-left:3%;
          }
        }
      }
      .company-name, .receiver-number{
        width:90%;
        margin-top:2%;
      }
    }
    .receiver-info{
      .receiver-title {
        @include titleStyle;
      }
      .receiver-body{
        font-size: 1rem;
        margin-left:2%;
        margin-top: 3%;
        display:flex;
        flex-wrap: wrap;
        label{
          padding-top:2%;
        }
        .person{
          margin-right: 5%;
        }
        .iphone{
          margin-right: 1.1%;
        }
        .region{
          margin-right: 1.1%;
        }
        .address-detail{
          margin-right:1%;
        }
        .input-detail{
          margin-top:3%;
          margin-bottom: 4%;
          padding-left: 2%;
        }
        @include required;
        label{
          margin-left: 3%;
          margin-top: 3%;
        }
        .receiver-input{
          width:70%;
          margin-top: 3%;
        }
      }
    }
  }
  .footer {
    text-align: center;
    background: #f2f4f6;
    height:142px;
    .submit-button {
      margin-top:25px;
      color:#fff;
      background: #7ab2f3;
      width:193px;
      height: 43px;
      border-radius: 10px;
      border: 0px;
    }
  }
  .explanation-modal{
    h1{
      text-align: center;
      margin-bottom: 2%;
    }
    .explanation-container{
      display:inline-block;
      width:90%;
      margin-left: 5%;
      h2 {
        margin-top: 2%;
        margin-bottom: 3%;
      }
      ul{
        margin-bottom: 1%;
      }
    }
  }
  .notify-modal {
    .notify-container {
      text-align: center;
      p {
        margin-top: 4%;
      }
      .look-explanation {
        margin-right: 5%;
      }
    }
    .look-explanation{
      display:inline-block;
      margin-right: 30%;
      width:40%;
      background: #fff;
      border: solid 1px #4990e2;
      color: #4990e2;
      padding:10px;
    }
  }
  .finish-modal{
    h1{
      text-align: center;
    }
  }
  .insure-container{
    h1{
      text-align: center;
      margin-bottom:3%;
    }
    h2{
      margin-top:2%;
      margin-bottom:2%;
    }
    .insure-separator-large{
      margin-top: 3%;
      height: 10px;
      background-color:#f2f4f6;
    }
    .insure-separator-small{
      height: 3px;
      margin-bottom: 2%;
      background-color:#f2f4f6;
    }
    tr{
      font-size: 0.9rem;
    }
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
  .finish-container{
      height: 450px;
      background: #f2f4f6;
      padding-top: 30px;
    .ok-container {
      text-align: center;
      .ok-icon {
        display: inline-block;
        background: url('assets/res-3.png');
        background-size: 100% 100%;
        width: 100px;
        height: 100px;
      }
    }
    .finish-explanation{
      padding:20px;
    }
  }
</style>

<style lang="scss">
  .body{
    input{
      border: solid #e6ecef 2px;
      border-radius: 5px;
    }
    textarea{
      border: solid #e6ecef 2px;
      border-radius:5px;
    }
  }
  .explanation-modal{
    .ivu-modal{
      top:0px;
    }
  }
  .insure-modal{
    .ivu-modal{
      top:0px;
    }
  }
  .finish-modal{
    .ivu-modal{
      top:0px;
    }
  }
  .ivu-radio-group{
    vertical-align: top;
  }
  .ivu-radio-checked{
    .ivu-radio-inner {
      background: #fff;
      background: url('assets/res-2.png');
      background-size: 100% 100%;
      &:after{
        background-color:transparent ;
      }
    }
  }
</style>

