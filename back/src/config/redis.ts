// 连接 Redis 数据库
import Redis, { RedisOptions } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let client: Redis;

// 返回 Redis 客户端
// REDIS_HOST=localhost
// REDIS_PORT=6379
// REDIS_PASSWORD=123456
export async function 连接Redis() {
    if (client) {
        return client;
    }
    const Redis主机 = process.env.REDIS_HOST || 'localhost';
    const Redis端口 = Number(process.env.REDIS_PORT) || 6379;
    const Redis密码 = process.env.REDIS_PASSWORD;

    const options: RedisOptions = {
        host: Redis主机,
        port: Redis端口,
        lazyConnect: true, // 开启延迟连接，允许手动调用 connect
    };

    // 只有当密码存在且不为空时才设置，避免无密码 Redis 报错
    if (Redis密码) {
        options.password = Redis密码;
    }

    client = new Redis(options);

    // 添加错误监听，防止未捕获的异常导致程序崩溃
    client.on('error', (err) => {
        console.error('Redis Client Error', err);
    });

    try {
        await client.connect();
        // console.log(`Redis 连接成功: ${Redis主机}:${Redis端口}`);
        return client;
    } catch (error) {
        console.error('Redis 连接失败，请检查配置或服务是否启动:', error);
        throw error;
    }
}

// 导出一个获取 Redis 实例的函数
export function getRedis(): Redis {
    if (!client) {
        throw new Error('Redis 未连接，请先调用 连接Redis()');
    }
    return client;
}