import Datastore from 'nedb';
import path from 'path';
// import { remote } from 'electron';

// const path = require("path");

export default new Datastore({
    autoload: true,
    filename: './data.db' //指定数据库文件路径
    // filename: path.join(remote.getPath('userData'), '/data.db')  //指定数据库文件路径
    // 路径参考https://www.w3cschool.cn/electronmanual/electronmanual-electronapp.html
})