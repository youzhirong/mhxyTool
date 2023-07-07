<template>
<!--    结果区域-->
    <div>
        <a-input-number v-model:value="priceSum"/>
        当前值：{{ priceSum }}
        <a-button @click="resetPriceList">重置</a-button>
    </div>
    <div>
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="8" v-for="(good) in goodList">
                <div class="div-grid" @click="addGood(good)">
                    {{ good.name }}
                </div>
            </a-col>
        </a-row>
    </div>

</template>
<script setup lang="ts">
import {computed, getCurrentInstance, ref} from "vue";

const { proxy, ctx } = getCurrentInstance()
import db from '../dataStore/dataStore.ts';
    const sum = ref(0);
    const priceList = ref([]);
    const goodList = ref([
        {
            "name": "60武器",
            "price": 190000
        },{
            "name": "70武器",
            "price": 140000
        },{
            "name": "80武器",
            "price": 520000
        }
    ]);

    const addGood = (data) => {
        if(priceList.value.length < 3){
            priceList.value.push(data);
            db.insert({priceList: priceList},function(data){
                console.log('idata',data);
            })
        }
    }

    const resetPriceList = () => {
        db.find({},function(data){
            //获取查询的数据
            console.log('data',data);
        })
        priceList.value = [];
    }

    const priceSum = computed(() => {
        let temp = 0;
        for (let i = 0; i < priceList.value.length; i++) {
            temp = temp + priceList.value[0].price;
        }
        return temp;
    })
</script>

<style scoped>
.div-grid {
    height: 100px;
    max-height: 100px;
    background-color: salmon;
}
</style>