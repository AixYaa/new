// 连接数据库 MongoDB 需要导出
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
// 返回数据库连接客户端信息就行
export async function 连接数据库() {
    const 数据库Url = process.env.MONGODB_URI || '';
    const 账号 = process.env.MONGODB_USER || '';
    const 密码 = process.env.MONGODB_PASSWORD || '';

    // 判断是否是生产环境
    const 是否是生产环境 = process.env.NODE_ENV === 'production';

    // 是开发环境就直接使用数据库Url连接 ，生产环境就使用账号密码连接
    if (!是否是生产环境) {
        const client = new MongoClient(数据库Url);
    } else {
        const client = new MongoClient(数据库Url, {
            auth: {
                username: 账号,
                password: 密码,
            },
        });
    }
    let client: MongoClient;
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
    return client;
}



