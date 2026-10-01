# Password Reset Email Template Reference

## Backend Email Service Configuration

The backend `MailService.sendPasswordResetEmail()` needs to be configured to send emails with the reset token.

---

## Email Template Example

### Subject Line
```
UniShare - Password Reset Request
```

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - UniShare</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🔐 Password Reset Request
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                                Hi there,
                            </p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                                We received a request to reset your UniShare password. Click the button below to create a new password:
                            </p>
                            
                            <!-- Reset Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${FRONTEND_URL}/reset-password?token=${TOKEN}" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Alternative Link -->
                            <p style="margin: 20px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            
                            <div style="padding: 12px; background-color: #f9fafb; border-radius: 6px; border-left: 3px solid #667eea; margin: 10px 0 20px;">
                                <a href="${FRONTEND_URL}/reset-password?token=${TOKEN}" 
                                   style="color: #667eea; text-decoration: none; word-break: break-all; font-size: 13px;">
                                    ${FRONTEND_URL}/reset-password?token=${TOKEN}
                                </a>
                            </div>
                            
                            <!-- Warning Box -->
                            <div style="padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
                                    ⚠️ Important Security Information:
                                </p>
                                <ul style="margin: 10px 0 0; padding-left: 20px; font-size: 14px; color: #92400e; line-height: 1.6;">
                                    <li>This link will expire in <strong>5 minutes</strong></li>
                                    <li>Can only be used once</li>
                                    <li>Never share this link with anyone</li>
                                </ul>
                            </div>
                            
                            <!-- Didn't Request -->
                            <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                If you didn't request a password reset, please ignore this email or 
                                <a href="${FRONTEND_URL}/support" style="color: #667eea; text-decoration: none;">contact support</a> 
                                if you have concerns about your account security.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                                <strong>UniShare</strong> - Your Campus. Connected.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                This is an automated email. Please do not reply.
                            </p>
                            <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                                © ${YEAR} UniShare. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

### Email Body (Plain Text Alternative)

```
UniShare - Password Reset Request

Hi there,

We received a request to reset your UniShare password.

To reset your password, click the link below or copy and paste it into your browser:

${FRONTEND_URL}/reset-password?token=${TOKEN}

IMPORTANT SECURITY INFORMATION:
- This link will expire in 5 minutes
- Can only be used once
- Never share this link with anyone

If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.

---
UniShare - Your Campus. Connected.
This is an automated email. Please do not reply.
© ${YEAR} UniShare. All rights reserved.
```

---

## Backend Implementation Example

### Java (Spring Boot)

```java
@Service
@RequiredArgsConstructor
public class MailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("UniShare - Password Reset Request");
            helper.setFrom("noreply@unishare.com");
            
            // Build the reset URL
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            
            // Get current year
            String year = String.valueOf(LocalDate.now().getYear());
            
            // Load HTML template and replace variables
            String htmlContent = loadEmailTemplate()
                .replace("${FRONTEND_URL}", frontendUrl)
                .replace("${TOKEN}", resetToken)
                .replace("${YEAR}", year);
            
            helper.setText(htmlContent, true); // true = HTML
            
            // Send email
            mailSender.send(message);
            
            log.info("Password reset email sent to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    private String loadEmailTemplate() {
        // Load from resources or use string above
        return """
            <!DOCTYPE html>
            <html>
            ... (HTML template here)
            </html>
        """;
    }
}
```

---

## Environment Configuration

### application.properties (Development)
```properties
# Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-specific-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Frontend URL
app.frontend.url=http://localhost:3000
```

### application.properties (Production)
```properties
# Mail Configuration
spring.mail.host=${SMTP_HOST}
spring.mail.port=${SMTP_PORT}
spring.mail.username=${SMTP_USERNAME}
spring.mail.password=${SMTP_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Frontend URL
app.frontend.url=https://unisharebeta.vercel.app
```

---

## SMTP Provider Options

### 1. Gmail (Development)
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=app-specific-password
```

**Setup Steps:**
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Use app password in configuration

### 2. SendGrid (Production Recommended)
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY
```

### 3. AWS SES (Production)
```properties
spring.mail.host=email-smtp.us-east-1.amazonaws.com
spring.mail.port=587
spring.mail.username=YOUR_SMTP_USERNAME
spring.mail.password=YOUR_SMTP_PASSWORD
```

### 4. Mailgun (Production)
```properties
spring.mail.host=smtp.mailgun.org
spring.mail.port=587
spring.mail.username=postmaster@yourdomain.com
spring.mail.password=YOUR_MAILGUN_PASSWORD
```

---

## Testing Email Service

### Test Controller (Development Only)
```java
@RestController
@RequestMapping("/api/test")
public class EmailTestController {
    
    private final MailService mailService;
    
    @PostMapping("/send-test-email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String email) {
        mailService.sendPasswordResetEmail(email, "TEST_TOKEN_123456");
        return ResponseEntity.ok("Test email sent to: " + email);
    }
}
```

### cURL Test
```bash
curl -X POST "http://localhost:7500/api/test/send-test-email?email=your-email@gmail.com"
```

---

## Email Deliverability Best Practices

### 1. SPF Records
Add to DNS:
```
v=spf1 include:_spf.google.com ~all
```

### 2. DKIM Signing
Configure in your email service provider

### 3. DMARC Policy
Add to DNS:
```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

### 4. Sender Reputation
- Use consistent "From" address
- Implement proper email headers
- Monitor bounce rates
- Handle unsubscribes properly

---

## Troubleshooting

### Email Not Received
1. **Check spam folder**
2. **Verify SMTP credentials**
3. **Check backend logs for errors**
4. **Test SMTP connection**:
   ```bash
   telnet smtp.gmail.com 587
   ```
5. **Verify email service is enabled**

### Common Errors

#### "Authentication Failed"
- Check SMTP username/password
- For Gmail: use app-specific password
- Verify 2FA is enabled (Gmail)

#### "Connection Timeout"
- Check firewall rules
- Verify SMTP port is correct
- Check network connectivity

#### "Relay Access Denied"
- Verify sender email is authorized
- Check SMTP authentication is enabled

---

## Security Checklist

- [ ] Use environment variables for credentials
- [ ] Never commit email passwords to git
- [ ] Use app-specific passwords (Gmail)
- [ ] Enable STARTTLS encryption
- [ ] Implement rate limiting on password reset
- [ ] Monitor for suspicious patterns
- [ ] Log all email sending attempts
- [ ] Use HTTPS for reset links
- [ ] Set proper SPF/DKIM/DMARC records

---

## Monitoring & Alerts

### Metrics to Track
- Email send success rate
- Delivery failures
- Bounce rates
- Token usage rate
- Average time from request to reset

### Alert Conditions
- High failure rate (> 5%)
- Unusual number of requests from single IP
- Multiple failed token attempts
- SMTP connection failures

---

## Email Service Costs (Approximate)

| Provider | Free Tier | Paid Pricing |
|----------|-----------|--------------|
| SendGrid | 100 emails/day | $14.95/month for 40k emails |
| AWS SES | 62,000 emails/month (first year) | $0.10 per 1,000 emails |
| Mailgun | 5,000 emails/month | $35/month for 50k emails |
| Gmail SMTP | ~100 emails/day | Not recommended for production |

---

## Next Steps

1. **Choose email provider** (SendGrid recommended for production)
2. **Configure SMTP in backend** application.properties
3. **Create email template** (use HTML above)
4. **Test in development** environment
5. **Set up DNS records** (SPF, DKIM, DMARC)
6. **Monitor deliverability** after launch
7. **Set up alerts** for failures
