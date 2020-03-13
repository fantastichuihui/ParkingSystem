<template>
  <el-upload
    class="upload-demo"
    action=""
    :on-change="handleChange"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :file-list="fileListUpload"
    :limit="limitUpload"
    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
    :auto-upload="false"
>
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div>
  </el-upload>
</template>
