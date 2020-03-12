import * as nodemailer from 'nodemailer';

export const sendEmail = async (puser: string, pusername: string, useremail: string, username: string) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
      user: 'apikey',
      pass: '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',
    },
  });

  const info = await transporter.sendMail({
    from: `Admin ${puser}`,
    to: useremail,
    subject: 'Feedback Email From Admin',
    text: `feedback email from  ${pusername}`,
    html: `<strong>Hi ${username}!<br> I have analyes your last month work progress.
    And decided to inform you that your work report is not proper you have to improve
    your skills and complition rate.
    <br> thaks & regards <br>Name: ${pusername}, <br> Designation: Admin</strong>`,
  });

  };
