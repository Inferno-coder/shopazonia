const nodemailer=require('nodemailer')
const sendEmail=async options =>{
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "c592268b436e3f",
          pass: "f220b6547aaa74"
        }
      });
      const message={
        from:`noreply@gmail.com`,
        to:options.email,
        subject:options.subject,
        text:options.text
      }
      await transport.sendMail(message)
    }


    module.exports=sendEmail