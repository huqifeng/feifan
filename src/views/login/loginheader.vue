<template>
  <div class="loginheader">
    <h2 class="title">{{msgLogintitle}}</h2>
    <ul class="mui">
      <li :class="[this.isPnone?'':'active','muiLi']" @click="loginChange('left')">{{msgLeftname}}</li>
      <li :class="[this.isPnone?'active':'','muiLi']" @click="loginChange('right')">{{msgRightname}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data(){
    return {
      isPnone:false
    }
  },
  methods:{
    loginChange(ev){
      if(ev == 'left'){ 
        this.isPnone = false
      }else if(ev == 'right'){
        this.isPnone = true
      }
      this.$emit("loginHeaderChange", ev)
    }
  },
  props:['msgLeftname','msgRightname','msgLogintitle']
}
</script>
<style lang="scss" scoped>
.loginheader{
  .title{
    height:36px;
    font-size:36px;
    line-height: 36px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(23,155,255,1);
    text-align: center;
  }
  .mui{
    height: 20px;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-top: 19px;
    color:rgba(153,153,153,1);
    font-weight:400;
    margin-bottom: 40px;
  }
  .muiLi{
    display: inline-block;
    margin: 0 16px;
    font-weight:400;
  }
  .muiLi:hover{
    cursor: pointer;
  }
  .active{
    color: #333;
  }
}
  
</style>


