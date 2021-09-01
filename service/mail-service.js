const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Activation of account" + process.env.API_URL,
            text: "",
            html: `
                  <div>
                    <h1>For activation your account you should press on link</h1>
                    <a href='${link}'>${link}</a>
                 </div>
               `
        }, function (err, data) {
            if (err) {
                console.log("Error:", err)
            } else {
                console.log("send mail successfully")
            }
        })
    }
}

module.exports = new MailService();
