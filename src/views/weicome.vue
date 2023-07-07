<template>
    <div>欢迎使用，工具箱</div>
    <div style="white-space: nowrap;">当前用户是：
        <a-input v-model:value="userName"></a-input>
    </div>
    <div style="white-space: nowrap;">配置比例：
        <a-input v-model:value="proportion"></a-input>
        元/万梦幻币
    </div>
    <div>
        <a-button @click="indb">测试</a-button>
        <a-button @click="dbBak">备份数据库</a-button>
        <a-button @click="reBak">导入</a-button>
    </div>
    <div>{{ JSON.stringify(data) }}</div>
</template>
<script setup lang="ts">
import {inject, ref} from "vue";
import db from "../dataStore/db.ts"
import {exportDB, importDB} from "dexie-export-import"

const data = ref({});
let dbdata = null;
const userName = inject('userName');
const proportion = inject('proportion');


const indb = () => {
    // 插入数据
    db.maps.add({key: 'a', value: {name: 'John', age: 25, aa: 11, bb: 22}});

    // 查询数据
    db.maps.toArray().then(users => {
        console.log(users);
    });
};

const dbBak = async () => {
    const blob = await exportDB(db);
    const text = await blobToJson(blob);
    console.log(text);
    data.value = text;
    db.dbBak.add({
        date: new Date(),
        value: blob
    })
}

const reBak = () => {
    db.dbBak.orderBy('id').reverse().first().then(async (data) => {
        await db.delete();
        await importDB(data.value);
        await db.open();
    })
}

const blobToJson = async (blob) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function (event) {
            try {
                const text = event.target.result; // 以文本形式获取Blob数据
                const jsonData = JSON.parse(text); // 将文本解析为JSON对象
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (event) {
            reject(new Error('Failed to read the Blob data.'));
        };

        reader.readAsText(blob); // 读取Blob数据为文本
    });
}
</script>