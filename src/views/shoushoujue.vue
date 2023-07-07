<template>
    <a-input-number v-model:value="value" :min="1" :max="10"/>
    <a-button type="primary" @click="value = 88">Reset</a-button>
</template>
<script setup lang="ts">
import {ref} from "vue";

const value = ref(88);
</script>