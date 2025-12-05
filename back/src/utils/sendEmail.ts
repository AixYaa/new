import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// 创建发送邮件的传输对象
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP 服务器地址
    port: Number(process.env.SMTP_PORT), // SMTP 端口
    secure: true, // 如果端口是 465，则为 true，否则为 false
    auth: {
        user: process.env.SMTP_USER, // 发件人邮箱
        pass: process.env.SMTP_PASS, // 发件人邮箱密码或授权码
    },
});

// 读取并编译 HTML 模板
function compileTemplate(templateName: string, data: Record<string, any>): string {
    const templatePath = path.join(__dirname, '../../views', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf-8');

    // 简单的模板替换逻辑：{{key}} -> value
    for (const key in data) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, data[key]);
    }

    return html;
}

/**
 * 发送邮件函数
 * @param to 收件人邮箱
 * @param subject 邮件主题
 * @param templateName 模板名称（不含 .html 后缀）
 * @param data 模板数据
 */
export async function 发送邮件(to: string, subject: string, templateName: string, data: Record<string, any>) {
    try {
        const html = compileTemplate(templateName, data);

        const mailOptions = {
            from: process.env.SMTP_FROM, // 发件人地址
            to, // 收件人地址
            subject, // 邮件主题
            html, // 邮件内容（HTML）
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('邮件发送成功:', info.messageId);
        return info;
    } catch (error) {
        console.error('邮件发送失败:', error);
        throw error;
    }
}