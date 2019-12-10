<template>
  <div class="publishGoods">
    <div class="container">
  		<div class="publish"><div @click='pushlish'>发货</div></div>
    </div>
    <FooterIndex/>
  </div>
</template>
<script type="text/javascript">
  import FooterIndex from '../../components/footer.vue'
  export default{
    name:"publishGoods",
    data(){
      return{

      }
    },
    components:{
      FooterIndex
    },
    created(){
      
    },
    methods:{
      pushlish:function(){
        this.$router.push({
          name:"pg_publish"
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .publishGoods{
    overflow: hidden;
    text-align:center;
    .container{
      overflow: hidden;
      .publish{
        width: 100%;
        height: 90/50rem;
        position: fixed;
        bottom: 180/50rem;
        text-align:center;
        &>div{
          width: 210/50rem;
          height: 100%;
          background-color: blue;
          margin:0 auto;
          line-height: 90/50rem;
          font-size: 33/50rem;
          color: white;
          border-radius: 9/50rem;
        }
      }
    }
  }
</style>