<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-input v-model="input" placeholder="Please input" />
    <el-button type="success" :icon="Check" circle />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Check } from '@element-plus/icons-vue';
const input = ref('');
</script>
