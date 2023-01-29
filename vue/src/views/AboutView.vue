<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-input v-model="input" placeholder="Please input" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const input = ref('');
</script>
