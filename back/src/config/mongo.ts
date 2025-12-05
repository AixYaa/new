// 连接数据库 MongoDB 需要导出
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// 声明一个全局变量来存储 client 实例
let client: MongoClient;
let db: Db;

// 返回数据库连接客户端信息就行
export async function 连接数据库() {
    if (client) {
        return client;
    }

    const 数据库Url = process.env.MONGODB_URI || '';
    const 账号 = process.env.MONGODB_USER || '';
    const 密码 = process.env.MONGODB_PASSWORD || '';

    // 判断是否是生产环境
    const 是否是生产环境 = process.env.NODE_ENV === 'production';

    if (!是否是生产环境) {
        client = new MongoClient(数据库Url);
    } else {
        client = new MongoClient(数据库Url, {
            auth: {
                username: 账号,
                password: 密码,
            },
        });
    }

    await client.connect();
    db = client.db(); // 获取默认数据库实例
    return client;
}

// 导出一个获取 DB 实例的函数，方便直接操作
export function getDB(): Db {
    if (!db) {
        throw new Error('数据库未连接，请先调用 连接数据库()');
    }
    return db;
}