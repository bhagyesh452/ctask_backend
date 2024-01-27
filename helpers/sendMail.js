const nodemailer = require("nodemailer");
const mime = require('mime-types');

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
  const attachments = [];

  const processAttachments = (files, prefix) => {
    files.forEach((file, index) => {
      const mimeType = mime.lookup(file.originalname);

      if (mimeType) {
        attachments.push({
          filename: `${prefix}${index + 1}.${mime.extension(mimeType)}`,
          content: file, // Assuming file is a buffer, adjust if needed
        });
      } else {
        console.warn(`Unknown file type for ${file.originalname}`);
        // Handle unknown file type, for example, skip or log a warning
      }
    });
  };

  // Append files from otherDocs
  processAttachments(otherDocs, 'otherDocs');

  // Append files from paymentReceipt
  processAttachments(paymentReceipt, 'paymentReceipt');

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
