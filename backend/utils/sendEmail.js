const nodeMailer = require("nodemailer");

const sendEmail= async (options)=>{

    const transporter = nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMPT_PORT,

        service: process.env.SMPT_SERVICE,
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },

        // port: 465, // Use 465 for SSL/TLS or 587 for STARTTLS
        // secure: true, // true for 465, false for 587
        
    });
    const mailOptions ={
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject:options.subject,
        text: options.message,
    }
   
    await transporter.sendMail(mailOptions);

};

module.exports = sendEmail;