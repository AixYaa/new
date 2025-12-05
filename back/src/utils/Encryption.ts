// 加密 data 数据
export function encryptData(data: string): string {
    // 对 data 进行排序
    const sortedData = JSON.stringify(JSON.parse(data));
    // 对排序后的数据进行 Base64 编码
    const encryptedData = Buffer.from(sortedData).toString('base64');
    // 实现加密逻辑，这里简单地返回排序后的数据
    return encryptedData;
}