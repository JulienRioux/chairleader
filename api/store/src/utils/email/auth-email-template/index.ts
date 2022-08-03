import { styles } from './styles';
import english from './translations/english.json';

const { PRIMARY_COLOR, BORDER_RADIUS, BACKGROUND_COLOR, TEXT_COLOR } = styles;

export const emailTemplate = ({ link, validationCode }) => {
  const {
    header,
    subHeader,
    ifLinkNotWorking,
    thanks,
    teamName,
    copyAndPasteText,
  } = english;

  return `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
      /* FONTS */
      @media screen {
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;600&display=swap');
      }

      /* CLIENT-SPECIFIC STYLES */
      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        -ms-interpolation-mode: bicubic;
      }

      /* RESET STYLES */
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }

      table {
        border-collapse: collapse !important;
      }

      body {
        height: 100% !important;
        margin: 0 !important;
        padding: ${BORDER_RADIUS} !important;
        width: 100%;

        * {
          font-family: 'Inconsolata', monospace;
        }
      }

      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* MOBILE STYLES */
      @media screen and (max-width:600px) {
        h1 {
          font-size: 28px !important;
          line-height: 28px !important;
        }
      }

      /* ANDROID CENTER FIX */
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
    </style>
  </head>
  <body style="background-color: ${BACKGROUND_COLOR};">
    <!-- HERO -->
    <table style="margin: 0 auto; width: 100%;">
      <tr>
        <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 10px 0px 10px;">
          <!--[if (gte mso 9)|(IE)]>
						<table align="left" border="0" cellspacing="0" cellpadding="0" width="600" style="margin: 0 auto;">
							<tr>
								<td align="left" valign="top" width="600">
									<![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto;">
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" valign="top" style="padding: 0px  0px 20px  0px; border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 0px 0px; color: #111111; font-family: 'Inconsolata', monospace; font-size: 48px; font-weight: 400; letter-spacing: 0px; line-height: 48px;">
                <div style="display: flex; align-content: center; margin: 20px 0;">
                  <img style="height: 40px;" src="https://cdn.sanity.io/images/fc5brcyr/production/ea382e95cec9a0a0b7193f7d96694ab66a7f1d3c-512x512.png" alt="" />
                  <h1 style="font-size: 40px; margin: 0 0 4px 12px; line-height: 1;">Alt Gate</h1>
                </div>
                <h3 style="font-size: 24px; font-weight: bold; margin: 0;">${header}</h3>
              </td>
            </tr>
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 0px 0px 0px; color: ${TEXT_COLOR}; font-family: 'Inconsolata', monospace; font-size: 16px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0; text-align: left;">${subHeader}</p>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
								</td>
							</tr>
						</table>
						<![endif]-->
        </td>
      </tr>
      <!-- COPY BLOCK -->
      <tr>
        <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 10px 0px 10px;">
          <!--[if (gte mso 9)|(IE)]>
						<table align="left" border="0" cellspacing="0" cellpadding="0" width="600">
							<tr>
								<td align="left" valign="top" width="600">
									<![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto;">
            <!-- COPY -->
            <tr></tr>
            <!-- BULLETPROOF BUTTON -->
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 40px 0px 60px 0px;">
                      <table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                        <tr>
                          <td align="center" style="border-radius: ${BORDER_RADIUS};" bgcolor=${PRIMARY_COLOR}>
                            <a href="${link}" target="_blank" style="font-size: 20px; font-family: 'Inconsolata', monospace; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 8px 0px; border-radius: 8px; border: 1px solid #oof; display: inline-block;min-width: 220px; font-weight: bold; line-height: 1.5;">Authenticate</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- COPY -->
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 0px 0px 0px; color: ${TEXT_COLOR}; font-family: 'Inconsolata', monospace; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">${copyAndPasteText}</p>
              </td>
            </tr>
            <!-- COPY -->
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 0px 20px 0px; color: #000; font-family: 'Inconsolata', monospace; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="border-radius: ${BORDER_RADIUS};padding: 12px;width: min-content;border: 1px solid #0002;margin: 20px auto;letter-spacing: 6px;font-size: 20px;width: auto;text-align: center;">${validationCode}</p>

                <p>The code above expires 20 minutes after you received this email.</p>
              </td>
            </tr>
            <!-- COPY -->
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 0px 20px 0px; color: ${TEXT_COLOR}; font-family: 'Inconsolata', monospace; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">${ifLinkNotWorking}</p>
              </td>
            </tr>
            <!-- COPY -->
            <tr>
              <td bgcolor="${BACKGROUND_COLOR}" align="left" style="padding: 0px 0px 40px 0px; border-radius: 0px 0px ${BORDER_RADIUS} ${BORDER_RADIUS}; color: #222222; font-family: 'Inconsolata', monospace; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">${thanks}</p>
                <p style="margin: 10px 0;">${teamName}</p>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
								</td>
							</tr>
						</table>
						<![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
