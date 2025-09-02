export const fakeHtml = `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Vouchify</title>
    <style>
      html, body { margin:0; padding:0; width:100%; background:#F3F4F6; font-family:Segoe UI, Roboto, Arial, sans-serif; }
      .container { width:100%; max-width:600px; margin:0 auto; }
      .card { background:#fff; border:1px solid #E5E7EB; border-radius:14px; }
      .px { padding-left:24px; padding-right:24px; }
      .py { padding-top:24px; padding-bottom:24px; }
      .heading { font-weight:700; color:#111827; }
      .body { color:#374151; line-height:1.55; }
      .muted { color:#6B7280; }
      .btn { background:#7C3AED; color:#fff; font-weight:600; padding:14px 22px; border-radius:10px; display:inline-block; text-decoration:none; }
      .coupon { border:2px dashed #E5E7EB; border-radius:12px; background:#FAFAFA; }
      .code { font-family:Consolas, monospace; font-size:20px; letter-spacing:0.08em; color:#111827; }
      .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; background:#ECFDF5; color:#065F46; border:1px solid #10B981; }
      .divider { height:1px; background:#E5E7EB; }
      .footer { font-size:12px; color:#6B7280; text-align:center; padding:16px 0; }
      @media (max-width:600px){
        .px { padding-left:18px; padding-right:18px; }
        .py { padding-top:20px; padding-bottom:20px; }
        .stack { display:block !important; width:100% !important; margin-bottom:20px; }
        .cta-center { text-align:center !important; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="100%" class="container" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:16px;">
                <div class="heading" style="font-size:22px; font-weight:800; color:#111827;">
                  <span style="display:inline-block; width:28px; height:28px; border-radius:8px; background:#7C3AED; vertical-align:-6px; margin-right:10px;"></span>
                  Vouchify
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <table role="presentation" width="100%" class="card">
                  <tr>
                    <td class="px py">
                      <h1 class="heading" style="font-size:28px; margin:0 0 8px 0;">
                        Hi There, welcome to <span style="color:#7C3AED;">Vouchify</span>!
                      </h1>
                      <p class="body" style="margin:0 0 16px 0;">
                        Thanks for joining us. Your workspace <strong>Acme Corp</strong> is ready.
                        Here’s a quick path to issue your first voucher and invite your team.
                      </p>

                      <div class="cta-center" style="margin:22px 0 8px 0;">
                        <a href="https://app.vouchify.test/dashboard" class="btn">Go to Dashboard</a>
                      </div>

                      <p class="muted" style="margin:8px 0 0 0; font-size:13px;">
                        Or explore the <a href="https://docs.vouchify.test" style="color:#7C3AED; text-decoration:underline;">API docs</a>.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:4px;"><div class="divider"></div></td>
                  </tr>

                  <tr>
                    <td class="px py">
                      <table role="presentation" width="100%">
                        <tr>
                          <td class="stack" width="50%" valign="top" style="padding-right:12px;">
                            <div class="heading" style="font-size:16px; margin-bottom:8px;">Your next steps</div>
                            <ol class="body" style="margin:0; padding-left:18px;">
                              <li>Create your first <strong>Campaign</strong> and set reward rules.</li>
                              <li>Issue a <strong>test voucher</strong> to yourself.</li>
                              <li>Invite teammates to collaborate.</li>
                              <li>Connect SMTP and customize email templates.</li>
                            </ol>
                          </td>
                          <td class="stack" width="50%" valign="top" style="padding-left:12px;">
                            <div class="heading" style="font-size:16px; margin-bottom:8px;">Sample voucher</div>
                            <table role="presentation" width="100%" class="coupon">
                              <tr>
                                <td style="padding:14px;">
                                  <div class="pill">25% OFF</div>
                                  <div class="code">WELCOME-25</div>
                                  <div class="muted" style="font-size:12px; margin-top:6px;">
                                    Apply at checkout • Expires 30 Sept 2025
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="px" style="padding-bottom:24px;">
                      <table role="presentation" width="100%">
                        <tr>
                          <td class="card" style="border:1px solid #E5E7EB; border-radius:12px;">
                            <table role="presentation" width="100%">
                              <tr>
                                <td class="px py">
                                  <div class="heading" style="font-size:16px; margin-bottom:8px;">Useful links</div>
                                  <p class="body" style="margin:0;">
                                    • API Keys: <a href="https://app.vouchify.test/api-keys" style="color:#7C3AED; text-decoration:underline;">Manage</a><br/>
                                    • Templates: <a href="https://app.vouchify.test/templates" style="color:#7C3AED; text-decoration:underline;">Customize</a><br/>
                                    • Support: <a href="mailto:support@vouchify.app" style="color:#7C3AED; text-decoration:underline;">support@vouchify.app</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="footer">
                You’re receiving this because you created an account at Vouchify.<br/>
                <a href="https://app.vouchify.test/settings/notifications">Manage notifications</a> • 
                <a href="https://app.vouchify.test/unsubscribe">Unsubscribe</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
