import Dexie from 'dexie';

const db = new Dexie('myDatabase');
// 初始化表
db.version(1).stores({
    maps: '++id, key, value',
    dbBak: '++id, userName ,date, value',
    baobaohuanList: '++id, currentProgress ,itemReward, itemMHB, spendMHB, totalMHB, recordTime, data'
});
export default db;