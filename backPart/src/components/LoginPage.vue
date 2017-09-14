<template>
  <div class="container">
    <div class="login">
      <div class="title">后台登录</div>
      <form ref="userLogin" name="formUser">
        <div class="user">
          <span class="user-icon"></span><input class="user-input" type="text"  v-model="name" name="userName">
        </div>
        <div class="password">
          <span class="password-icon"></span><input class="password-input" type="password"  v-model="password" name="passWord">
        </div>
      </form>
      <Button type="info" class="submit-button" @click="submit">登录</Button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data () {
        return {
          name: '',
          password: ''
        }
      },
      methods: {
        submit () {
          console.log(this.$refs.userLogin)
          var userInfo = new FormData(this.$refs.userLogin)
          console.log(this.name)
          console.log(this.password)
          this.axios.post(`${this.$mainUrl}login`, userInfo).then((res) => {
            console.log(res.data.content.data)
            if (res.data.content.data) {
              console.log(res.data.content.data.token)
              sessionStorage.token = res.data.content.data.token
              this.$router.push({path: '/dispose'})
            } else {
              alert('用户名或密码错误')
            }
          })
        }
      }
    }
</script>

<style lang="scss"
       rel="stylesheet/scss" scoped>
  .container {
    display:flex;
    width:100vw;
    height:100vh;
    background: #f4f7f9;
    justify-content: center;
    .login{
      width:600px;
      height: 318px;
      background:#fff;
      margin-top:200px;
      .title{
        text-align: center;
        height: 100px;
        line-height: 112px;
        font-size: 32px;
        font-weight: bolder;
      }
      .user{
        text-align: center;
        .user-icon{
          display:inline-block;
          height:31px;
          width:32px;
          vertical-align: top;
          background-color:#d8d8d8;
          background-image: url('../assets/res-1.png');
          background-size:70% 70%;
          background-repeat: no-repeat;
          background-position: 5px 4px;
        }
        .user-input{
          display:inline-block;
          height: 31px;
          line-height: 30px;
          font-size: 25px;
          margin-bottom:20px;
        }
      }
      .password{
        text-align: center;
        .password-icon{
          display:inline-block;
          height:30px;
          width:30px;
          vertical-align: top;
          background-color:#d8d8d8;
          background-image: url('../assets/res-2.png');
          background-size:70% 70%;
          background-repeat: no-repeat;
          background-position: 5px 4px;
        }
        .password-input{
          display:inline-block;
          height: 30px;
          line-height: 30px;
          font-size: 25px;
          margin-bottom:20px;
        }
      }
      .submit-button{
        margin-left:38%;
        width:150px;
      }
    }
  }
</style>
