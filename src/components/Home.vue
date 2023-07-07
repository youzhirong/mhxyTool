<template>

    <a-row :gutter="16">
        <template v-for="(menu) in menuList">
            <a-col v-if="!menu.meta.hidden" class="gutter-row" :span="6">
                <router-link :to="menu.path">{{ menu.meta.title }}</router-link>
            </a-col>
        </template>

    </a-row>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<script setup lang="ts">
import {provide, ref} from "vue";
import {routes} from "../router/index.ts"

const userName = ref('小地球');
provide('userName', userName);

const proportion = ref(0.0725);
provide('proportion', proportion);



const menuList = ref(routes);

</script>