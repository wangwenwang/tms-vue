<template>
	<div class="SelectMeng">
	  <div class="SelectWarehouses" >
	    <div class="SelectTitle">请选择{{BouncedName}}</div>
		  <div class="SelectItem">
		    <div v-for='(dataItem,index) in SelectBoxList'  :id="index"  :key='index'  @click="SelectComit(index)">{{dataItem.name}}</div>
		  </div>
		  <div class="cancel"   @click="selectCancel">取消</div>
	  </div>
	</div>
</template>
<script type="text/javascript">
  export default{
  	data(){
  	  return{
  	  	
  	  }
  	},
  	props:{
  	  BouncedName:'',//弹框名称
  	  SelectBoxList:{
    	  type:Array,
      	default: () => {
    			return []
    		}
  	  },//数据
  	},
  	methods:{
  	  // 取消
  	  selectCancel(){
    		this.$emit('selectCancel');
  	  },
  	  // 选中item
  	  SelectComit(index){
    		this.$emit('selectedItem',index);
  	  }
  	}
  }
</script>
<style lang="less" scoped>
  @import "./publicLess.less";
</style>
