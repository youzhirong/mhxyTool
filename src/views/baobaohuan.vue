<template>
  <!--    结果区域-->
    <div>当前用户：{{ userName }}</div>
<!--    <div>{{ JSON.stringify(dataSource) }}</div>-->
<!--    <div>{{ itemKey }}</div>-->
    <div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="宝宝环统计表">
                <div>
                    <a-row>
                        <a-col :span="12">
                            <a-statistic title="累计获得梦幻币" :value="priceSum"/>
                        </a-col>
                        <a-col :span="12">
                            <a-statistic title="累计获得人民币(RMB)" :precision="2" :value="priceRmb"/>
                        </a-col>
                    </a-row>
                </div>
                <div style="text-align: left">
                    <a-space>
                        <a-button @click="addBBHList">新增记录</a-button>
                        <a-button @click="initData">刷新数据</a-button>
                    </a-space>
                </div>
                <div>
                    <a-table :dataSource="dataSource" :columns="columns">
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button style="margin: 0 8px" type="primary" @click="editModal(record)">
                                    编辑
                                </a-button>
                                <a-button danger @click="deleteModal(record)">
                                    删除
                                </a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="itemKey ? '明细'+itemKey : '新增明细'" :disabled="itemKey == 0" force-render>
                <div>
                    <a-row :gutter="16">
                        <a-col class="gutter-row" :span="12">
                            <div style="text-align: left;">
                                <div>当前等级：
                                    <a-input-number v-model:value="itemData.dengji"/>
                                </div>
                                <div>当前环数：第【{{ itemStatistics.huanshu }}】环，进度({{ itemData.itemList.length }}/100)</div>
                                <div>累计得分：获得【{{ itemStatistics.fenshu }}】分</div>
                                <div>累计花费：花费【{{ itemStatistics.huafei }}】梦幻币</div>
                                <div>最终收益：收益【{{ itemStatistics.totalMHB }}】梦幻币</div>
                                <div>保底奖励：【{{ itemStatistics.baodi }}】书铁</div>
                                <div>预测奖励：【{{ itemStatistics.yuche }}】书铁</div>
                                <div>温馨提示：下环【{{ itemStatistics.chafen }}】分，书铁预测等级+10"</div>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div style="text-align: left;">
                                <div>修炼果价格：
                                    <a-input-number style="width: 200px" v-model:value="itemData.xiulianguoMHB"/>
                                    梦幻币
                                </div>
                                <div>修炼积分：【{{ itemStatistics.xiulianfen }}】修炼积分</div>
                                <div>奖励内容：
                                    <a-input v-model:value="itemData.itemReward"/>
                                </div>
                                <div>价值梦幻币：
                                    <a-input-number style="width: 200px" v-model:value="itemData.itemMHB"/>
                                </div>
                                <div>
                                    <a-button type="primary" @click="saveItem()">
                                        保存
                                    </a-button>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                    <div>
                        <a-slider
                                v-model:value="columnCountKey"
                                :min="0"
                                :max="columnCountList.length - 1"
                                :marks="columnCountList"
                                :step="null"
                        />
                    </div>
                    <a-row :gutter="[16, 16]">
                        <a-col class="gutter-row" :span="24 / columnCountList[columnCountKey]"
                               v-for="(good) in itemData.goodList">
                            <div class="div-grid" @click="addItem(good)">
                                <div>{{ good.name }}</div>
                                <div>{{ good.price / 10000 + 'W' }}</div>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col class="gutter-row" :span="12">
                            <div style="">
                                <a-table :pagination="false" bordered :scroll="{y: 300}"
                                         :columns="[{title:'宝宝环历史上交列表',align: 'center'}]" size="small"
                                         :data-source="itemData.itemList">
                                    <template #bodyCell="{text, record, index, column}">
                                        <div>{{ '第【' + (itemData.itemList.length - index) + '】环-->' }}{{ record }}</div>
                                    </template>
                                </a-table>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div>
                                <a-textarea
                                        placeholder="返回值"
                                        :auto-size="{ minRows: 8, maxRows: 8 }"
                                />
                            </div>
                        </a-col>
                    </a-row>

                </div>
            </a-tab-pane>
        </a-tabs>
    </div>


</template>
<script setup lang="ts">
import {computed, getCurrentInstance, inject, onMounted, ref} from "vue";
import dayjs from "dayjs";
import db from "../dataStore/db.ts"


const userName = inject('userName');
const proportion = inject('proportion');

const activeKey = ref("1");
const columnCountList = ref([2, 3, 4, 6, 8, 12]);
const columnCountKey = ref(3);

const itemKey = ref(0);
const itemData = ref({
    dengji: 175,
    xiulianguoMHB: 850000,
    itemReward: '',
    itemMHB: 0,
    itemKey: 0,
    itemList: [],
    goodList: [{"name": "找人", "price": 0, "quantity": 0, "fen": 1}, {
        "name": "60武器",
        "price": 170000,
        "quantity": 0,
        "fen": 2
    }, {"name": "60环装", "price": 170000, "quantity": 0, "fen": 2}, {
        "name": "70武器",
        "price": 90000,
        "quantity": 0,
        "fen": 3
    }, {"name": "70环装", "price": 80000, "quantity": 0, "fen": 3}, {
        "name": "80武器",
        "price": 430000,
        "quantity": 0,
        "fen": 5
    }, {"name": "80环装", "price": 390000, "quantity": 0, "fen": 5}, {
        "name": "3级药",
        "price": 13000,
        "quantity": 0,
        "fen": 2
    }, {"name": "烹饪", "price": 10000, "quantity": 0, "fen": 2}, {
        "name": "1级家具",
        "price": 15000,
        "quantity": 0,
        "fen": 2
    }, {"name": "2级家具", "price": 30000, "quantity": 0, "fen": 5}, {
        "name": "牡丹",
        "price": 10000,
        "quantity": 0,
        "fen": 4
    }, {"name": "百合", "price": 20000, "quantity": 0, "fen": 4}, {
        "name": "康乃馨",
        "price": 20000,
        "quantity": 0,
        "fen": 4
    }, {"name": "红玫瑰", "price": 320000, "quantity": 0, "fen": 4}, {
        "name": "竖琴",
        "price": 80000,
        "quantity": 0,
        "fen": 4
    }, {"name": "笛子", "price": 80000, "quantity": 0, "fen": 4}, {
        "name": "编钟",
        "price": 120000,
        "quantity": 0,
        "fen": 4
    }, {"name": "唢呐", "price": 120000, "quantity": 0, "fen": 4}, {
        "name": "木鱼",
        "price": 120000,
        "quantity": 0,
        "fen": 4
    }, {"name": "琵琶", "price": 120000, "quantity": 0, "fen": 4}, {
        "name": "垃圾变异",
        "price": 1600000,
        "quantity": 0,
        "fen": 5
    }, {"name": "指定变异", "remark": "变异花妖", "price": 5000000, "quantity": 0, "fen": 10}, {
        "name": "垃圾野生",
        "price": 10000,
        "quantity": 0,
        "fen": -15
    }, {"name": "取消跳过", "price": 0, "quantity": 0, "fen": -20}],
});


const dataSource = ref([]);
const columns = ref([
    {
        title: '目前进度',
        dataIndex: 'currentProgress',
        key: 'currentProgress',
        customRender: (render) => {
            const {text, record, index, column} = render;
            let str = '' + record.data.itemStatistics.fenshu + '分，进度(' + record.data.itemList.length + '/100)';
            return str;
        }
    },
    {
        title: '物品奖励',
        dataIndex: 'itemReward',
        key: 'itemReward',
    },
    {
        title: '物品梦幻币',
        dataIndex: 'itemMHB',
        key: 'itemMHB',
    },
    {
        title: '花费梦幻币',
        dataIndex: 'spendMHB',
        key: 'spendMHB',
    },
    {
        title: '收益梦幻币',
        dataIndex: 'totalMHB',
        key: 'totalMHB',
    },
    {
        title: '记录时间',
        dataIndex: 'recordTime',
        key: 'recordTime',
    }, {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作'
    }
]);

const addBBHList = () => {
    activeKey.value = '2';
    reset();
}

const saveItem = (toGo = true) => {
    const currentDate = dayjs();
    let itemStatisticsTemp = JSON.parse(JSON.stringify(itemStatistics.value));
    let data = {
        currentProgress: itemData.value.itemList.length,
        itemReward: itemData.value.itemReward,
        itemMHB: itemData.value.itemMHB,
        totalMHB: itemStatistics.value.totalMHB,
        spendMHB: itemStatistics.value.huafei,
        recordTime: currentDate.format("YYYY-MM-DD HH:mm:ss"),
        data: { ...itemData.value, ...{itemStatistics: itemStatisticsTemp} }
    }
    if (itemKey.value != null) {
        // let index = dataSource.value.findIndex(item => item.id == itemKey.value);
        // data.id = itemKey.value;
        // dataSource.value[index] = data;
        data = JSON.parse(JSON.stringify(data))
        db.baobaohuanList.update(itemKey.value, data);
    } else {
        // itemKey.value = data.id;
        // dataSource.value.splice(0, 0, data);
        db.baobaohuanList.add(JSON.parse(JSON.stringify(data))).then((res) => {
            console.log('add', res);
            itemKey.value = res;

        });
    }
    if(toGo){
        activeKey.value = '1';
    }
    initData();
}

const editModal = (record) => {
    itemKey.value = record.id;
    itemData.value = record.data;
    activeKey.value = '2';
}

const deleteModal = (record) => {
    db.baobaohuanList.delete(record.id).then((res) => {
        if(itemKey.value == record.id){
            itemKey.value = 0;
        }
        initData();
    });
}

const reset = () => {
    itemKey.value = null;
    resetItemList();
}
const resetItemList = () => {
    itemData.value.itemList = [];
}


const addItem = (data) => {
    if (itemData.value.itemList.length < 100) {
        itemData.value.itemList.splice(0, 0, data);
        saveItem(false);
    }
}


const priceSum = computed(() => {
    let temp = 0;
    for (let i = 0; i < dataSource.value.length; i++) {
        temp = temp + dataSource.value[i].totalMHB;
    }
    return temp;
})

const priceRmb = computed(() => {
    return (priceSum.value / 10000) * proportion.value;
})

const itemStatistics = computed(() => {
    let itemListTemp = itemData.value.itemList;
    let dengjiTemp = itemData.value.dengji;
    let itemMHBTemp = itemData.value.itemMHB;
    let xiulianguoMHBTemp = itemData.value.xiulianguoMHB;
    let data = {};
    let huanshu = itemListTemp.length + 1 >= 100 ? 100 : itemListTemp.length + 1;
    let fenshu = 0;
    let huafei = 0;
    itemListTemp.forEach((item) => {
        fenshu = fenshu + item.fen;
        huafei = huafei + item.price;
    });

    let jiangliwupin = parseInt(dengjiTemp / 3) + fenshu - 130;
    let baodi = jiangliwupin + (100 - (huanshu || 0))
    let yincangfen = jiangliwupin + 2 * (100 - (huanshu || 0));
    let yuche = 10 * parseInt(yincangfen / 10);
    let chafen = 10 - yincangfen % 10 + 2
    let xiulianfen = 0;
    for (let t = itemListTemp.length, a = 1; a <= t; a++) xiulianfen += xiulianfenshu(a);
    let totalMHB = parseInt(itemMHBTemp + (xiulianguoMHBTemp * xiulianfen / 170) - huafei)

    data.huanshu = huanshu;
    data.fenshu = fenshu;
    data.huafei = huafei;
    data.baodi = 10 * parseInt(baodi / 10);
    data.yincangfen = yincangfen;
    data.yuche = yuche;
    data.chafen = chafen;
    data.xiulianfen = xiulianfen;
    data.totalMHB = totalMHB;
    return data;
})

const xiulianfenshu = (t) => {
    let fen = 0
    for (let a = 1; a <= 11; a++) t >= 10 * (a - 1) && t < 10 * a && (fen = a + 2);
    return fen;
}

const initData = () => {
    db.baobaohuanList.toArray().then(arr => {
        console.log(arr);
        dataSource.value = arr.reverse();
    });
}

onMounted(() => {
    initData();
})
</script>

<style scoped>
.div-grid {
    height: 50px;
    max-height: 50px;
    background-color: salmon;
}
</style>