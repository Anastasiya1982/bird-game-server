const nodemailer=require('nodemailer');
const nodemailMailgun=require('nodemailer-mailgun-transport');

class MailService {


    constructor() {
        this.auth={
            auth:{
                api_key:'3fc4de452e0b749bd3cf1e261d33de68-9776af14-9e24bcae',
                domain:'sandbox957b3f98c0044114b1158aa7db910190.mailgun.org'
            }
        }
        // this.transporter=nodemailer.createTransport({
        //      host:process.env.SMTP_HOST,
        //      port:process.env.SMTP_PORT,
        //      secure:false,
        //      auth:{
        //           user:process.env.SMTP_USER,
        //           pass:process.env.SMTP_PASSWORD,
        //      },
        // })

        this.transporter=nodemailer.createTransport(nodemailMailgun(this.auth));


    }
    async sendActivationMail(to, link) {
           await this.transporter.sendMail({
               from:'Excited User <me@samples.mailgun.org>',
               to:process.env.SMTP_USER,
               subject:"Activation of account"+process.env.API_URL,
               text:"",
               html:`
                  <div>
                  <h1>For activation your account you should press on link</h1>
                  <a href='${link}'>${link}</a>
</div>
               `
           },function (err, data) {
               if(err){
                   console.log("Error:" , err)
               }else{
                   console.log("send mail successfully")
               }

           })
    }
}

module.exports = new MailService();
