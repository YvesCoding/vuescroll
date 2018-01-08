<template>
     <vueScroll :scrollContentStyle="{height:'100%',background:'#ecf1f5'}" >
       <el-collapse 
          v-model="activeName" 
          accordion 
          class="project-tree"
          @change="handleCollapse"
        >
  <el-collapse-item title="规划条件（2）" name="1">
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      @check-change="handleCheckChange">
    </el-tree>
  </el-collapse-item>
  <el-collapse-item title="规划条件（2）" name="2">
   <el-tree
  :props="props"
  :load="loadNode"
  lazy
  show-checkbox
  @check-change="handleCheckChange">
</el-tree>
  </el-collapse-item>
  <el-collapse-item title="规划条件（2）" name="3">
   <el-tree
  :props="props"
  :load="loadNode"
  lazy
  show-checkbox
  @check-change="handleCheckChange">
</el-tree>
  </el-collapse-item>
  <el-collapse-item title="规划条件（2）" name="4">
    <el-tree
  :props="props"
  :load="loadNode"
  lazy
  show-checkbox
  @check-change="handleCheckChange">
</el-tree>
  </el-collapse-item>
</el-collapse>
    </vueScroll>
     
 </template>

<script> 
  export default {
    data() {
      return {
        activeName: '1',
         props: {
          label: 'name',
          children: 'zones'
        },
        count: 1
      };
    },
    methods: {
        handleCollapse(name) {
            console.log(name);
        },
        handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      }
    }
  }
</script>

<style> 
.project-tree .el-collapse-item__header {
  height: 30px;
  line-height: 30px;
  background: #2989b9;
  color: #fff;
  text-align: center; 
} 
.project-tree .el-collapse-item__wrap,
.project-tree .el-tree
 {
  padding: 5px;
  background-color: #ecf1f5;
}
.project-tree .el-collapse-item__arrow {
  line-height: 30px;
}
</style>
