export default function forgotpasswordTemplate(name,password){
    return `<!DOCTYPE HTML>

    <head>
    
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="shortcut icon" href="https://vaidik-backend.onrender.com/api/v1/logo/favicon" />
        <!-- <link rel="shortcut icon" href="./font/" /> -->
        <title>DoubtQ</title>
    
        <style type="text/css">
            @media only screen and (min-width: 620px) {
                .u-row {
                    width: 600px !important;
                }
    
                .u-row .u-col {
                    vertical-align: top;
                }
    
                .u-row .u-col-100 {
                    width: 600px !important;
                }
            }
    
            @media (max-width: 620px) {
                .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                }
    
                .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
    
                .u-row {
                    width: 100% !important;
                }
    
                .u-col {
                    width: 100% !important;
                }
    
                .u-col>div {
                    margin: 0 auto;
                }
            }
    
            body {
                margin: 0;
                padding: 0;
            }
    
            table,
            tr,
            td {
                vertical-align: top;
                border-collapse: collapse;
            }
    
            p {
                margin: 0;
            }
    
            .ie-container table,
            .mso-container table {
                table-layout: fixed;
            }
    
            * {
                line-height: inherit;
            }
    
            a[x-apple-data-detectors='true'] {
                color: inherit !important;
                text-decoration: none !important;
            }
    
            table,
            td {
                color: #000000;
            }
    
            #u_body a {
                color: #0000ee;
                text-decoration: underline;
            }
        </style>
    
        <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
    
    </head>
    
    <body class="clean-body u_body"
        style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
    
        <table id="u_body"
            style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;box-shadow: 0px 8px 15px 3px #c3b5ac;"
            cellpadding="0" cellspacing="0">
            <tbody>
                <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    
                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;color: #ffff;">
    
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                        <div style="height: 100%;width: 100% !important;">
                                            <div
                                                style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family: Arial;" role="presentation"
                                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family: Arial;background: #ffffff"
                                                                align="center">
    
                                                                <table width="100%" cellpadding="0" cellspacing="0"
                                                                    border="0">
                                                                    <tr>
                                                                        <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                                                            <img border="0" 
                                                                                src="https://vaidik-backend.onrender.com/api/v1/logo/doubtq" alt="Image"
                                                                                title="Image"
                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;"
                                                                                width="179.2" />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <!-- <hr style=" border: 0.5px solid #d8d8d8; "> -->
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                        <div style="height: 100%;width: 100% !important;">
                                            <div
                                                style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family: Arial;" role="presentation"
                                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:14px 10px 7px;font-family: Arial;"
                                                                align="left">
    
                                                                <table width="100%" cellpadding="0" cellspacing="0"
                                                                    border="0">
                                                                    <tr>
                                                                        <td style="padding-right: 0px;padding-left: 0px;"
                                                                            align="center">
    
                                                                            <img align="center" border="0"
                                                                                src="https://vaidik-backend.onrender.com/api/v1/logo/Email"
                                                                                alt="Image" title="Image"
                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;"
                                                                                width="150.8" />
    
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
    
    
                                                <table style="font-family: Arial;" role="presentation"
                                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 15px;font-family: Arial;"
                                                                align="left">
    
                                                                <div
                                                                    style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 140%;"><span
                                                                            style="font-size: 18px; line-height: 39.2px;"><span
                                                                                    style="line-height: 39.2px; font-size: 18px;">Password Recovery</span>
                                                                        </span>
                                                                    </p>
                                                                </div>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                        <div style="height: 100%;width: 100% !important;">
                                            <div
                                                style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family: Arial;" role="presentation"
                                                    cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 20px;font-family: Arial;"
                                                                >
    
                                                                <div style="line-height: 160%;margin-top: 10px; word-wrap: break-word;">
                                                                   <p style="line-height: 160%; font-size: 14px;"><span
                                                                        style="font-size: 15px; line-height: 28.8px;">Dear ${name},</span>
                                                                </p>
                                                                </div>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
    
                                                
    <table style="font-family: Arial;" role="presentation" cellpadding="0" cellspacing="0" width="100%"
        border="0">
        <tbody>
            <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding-left:20px;font-family: Arial;"
                    >
    
                    <div style="line-height: 160%; word-wrap: break-word;">
                        <p style="line-height: 160%; font-size: 14px;">
                            <span style="font-size: 15px; line-height: 28.8px;">
                                We noticed that you may have forgotten the password to your DoubtQ account.
                                Don't worry, we have you covered!
                            </span>
                        </p>
                        <p style="line-height: 160%; font-size: 14px;padding: 9px 30px 0px 0px;">
                            <span style="font-size: 15px; line-height: 28.8px;">
                                Here is the new password :  ${password}
                                
                                <br>
                                If you ever have any questions or concerns
                                    regarding your account, feel free to let us know anytime.
                            </span>
                        </p>
                        <p style="line-height: 160%; font-size: 14px;"><span
                                style="font-size: 15px; line-height: 28.8px;"><br>Thanks!</span>
                        </p>
                        <p style="line-height: 160%; font-size: 14px;padding-bottom: 20px;">
                            <span style="font-size: 15px; line-height: 28.8px;">
                                DoubtQ team
                            </span>
                        </p>
                    </div>
    
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
    </div>
                        </div>
    
                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                        <div style="height: 100%;width: 100% !important;">
                                            <div
                                                style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family: Arial;" role="presentation" cellpadding="0"
                                                    cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px;font-family: Arial;"
                                                                align="left">
    
                                                                <div
                                                                    style="color: #714FEC; line-height: 160%; text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 160%;"><span
                                                                            style="font-size: 20px; line-height: 32px;"><strong>Get
                                                                                in touch</strong></span></p>
                                                                    <p style="font-size: 14px; line-height: 160%;"><span
                                                                            style="font-size: 16px; line-height: 25.6px; color: #000000;">DoubtQ@gmail.com</span>
                                                                    </p>
                                                                </div>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
    
                                                <table style="font-family: Arial;" role="presentation" cellpadding="0"
                                                    cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 13px;font-family: Arial;"
                                                                align="left">
    
                                                                <div align="center">
                                                                    <div style="display: table; max-width:244px;">
                                                                        <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                                            width="32" height="32"
                                                                            style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top">
                                                                                    <td align="left" valign="middle"
                                                                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                        <a href="https://facebook.com/" title="Facebook"
                                                                                            target="_blank">
                                                                                            <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png"
                                                                                                alt="Facebook" title="Facebook" width="32"
                                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                                            width="32" height="32"
                                                                            style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top">
                                                                                    <td align="left" valign="middle"
                                                                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                        <a href="https://linkedin.com/" title="LinkedIn"
                                                                                            target="_blank">
                                                                                            <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png"
                                                                                                alt="LinkedIn" title="LinkedIn" width="32"
                                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                                            width="32" height="32"
                                                                            style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top">
                                                                                    <td align="left" valign="middle"
                                                                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                        <a href="https://instagram.com/" title="Instagram"
                                                                                            target="_blank">
                                                                                            <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png"
                                                                                                alt="Instagram" title="Instagram" width="32"
                                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                                            width="32" height="32"
                                                                            style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 17px">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top">
                                                                                    <td align="left" valign="middle"
                                                                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                        <a href="https://youtube.com/" title="YouTube"
                                                                                            target="_blank">
                                                                                            <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/youtube.png"
                                                                                                alt="YouTube" title="YouTube" width="32"
                                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                                            width="32" height="32"
                                                                            style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top">
                                                                                    <td align="left" valign="middle"
                                                                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                        <a href="https://email.com/" title="Email"
                                                                                            target="_blank">
                                                                                            <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/email.png"
                                                                                                alt="Email" title="Email" width="32"
                                                                                                style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="u-row-container" style="padding: 0px;background-color: transparent">
                            <div class="u-row"
                                style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                    <div class="u-col u-col-100"
                                        style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                        <div style="height: 100%;width: 100% !important;">
    
                                            <div
                                                style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                <table style="font-family: Arial;" role="presentation" cellpadding="0"
                                                    cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family: Arial;"
                                                                align="left">
    
                                                                <div
                                                                    style="color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                                                    <p style="font-size: 14px; line-height: 180%;"><span
                                                                            style="font-size: 14px; line-height: 16.8px;">Copyrights
                                                                            &copy; DoubtQ.com ${(new Date().getFullYear())}</span></p>
                                                                </div>
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`
}