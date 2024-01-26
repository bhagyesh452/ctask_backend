const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "aakashseth452@gmail.com",
    pass: "jywhpjugzmoummid",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, subject, text, html, otherDocs, paymentReceipt) {
  // send mail with defined transport object
  const attachments = [];

  // Append each file to attachments array
   // Append files from otherDocs
   otherDocs.forEach((file, index) => {
    attachments.push({
      filename: `otherDoc${index + 1}.pdf`,
      content: file, // Assuming file is a buffer, adjust if needed
    });
  });

  // Append files from paymentReceipt
  paymentReceipt.forEach((file, index) => {
    attachments.push({
      filename: `paymentReceipt${index + 1}.pdf`,
      content: file, // Assuming file is a buffer, adjust if needed
    });
  });

  const info = await transporter.sendMail({
    from: 'aakashseth452@gmail.com', // sender address
    to,
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
}


 
module.exports = {sendMail}
