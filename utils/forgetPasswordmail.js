import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "krishpradha543@gmail.com",
    pass: "wvqv zbgj psiy xtsl"
  }
});

const sendForgotPasswordMail = async (email, token) => {
    try {
      const mailOptions = {
        from: `Sata Sat <krishpradha543@gmail.com>`,
        to: email,
        subject: 'Reset Your Password - Sata Sat',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Sata Sat</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding: 20px 0;">
                  <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 20px; background-color: #2C5282; text-align: center; color: #fff; font-size: 22px;">
                        Sata Sat - Book Exchange Community
                      </td>
                    </tr>
  
                    <!-- Main content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px; color: #2C5282; font-size: 24px;">Reset Your Password</h2>
                        
                        <p style="margin: 0 0 20px; font-size: 16px;">Hello 👋,</p>
                        
                        <p style="margin: 0 0 20px; font-size: 16px;">
                          We received a request to reset your password for your <strong>Sata Sat</strong> account. If you made this request, please click the button below to set a new password:
                        </p>
                        
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="background-color: #2C5282; border-radius: 6px; text-align: center; padding: 15px;">
                              <a href="http://localhost:3000/reset-password?t=${token}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
  
                        <p style="margin: 30px 0 0; font-size: 14px; color: #555;">If you didn’t request a password reset, you can safely ignore this email.</p>
                        <p style="margin: 10px 0 0; font-size: 14px; color: #555;">This reset link will expire after a limited time.</p>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sata Sat. All rights reserved.</p>
                        <p style="margin: 5px 0 0;">Book Lovers Community, Nepal</p>
                      </td>
                    </tr>
  
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };
  
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    } catch (error) {
      console.log("Error while sending password reset mail:", error);
    }
  };
  
  export { sendForgotPasswordMail };
  