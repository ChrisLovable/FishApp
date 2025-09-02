// Email service utility for sending verification codes
// This is a placeholder - in production, you'd integrate with a real email service

export interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  private static instance: EmailService
  private apiKey: string | null = null

  private constructor() {
    // Initialize with your email service API key
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY || null
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  public async sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      // Try EmailJS first if configured
      if (this.apiKey) {
        return await this.sendWithEmailJS(email, code)
      }

      // Fallback to mock service for development
      console.log('📧 EmailJS not configured, using mock service')
      return await this.sendEmailMock(email, code)
    } catch (error) {
      console.error('Error sending verification email:', error)
      return false
    }
  }

  private generateVerificationEmailHTML(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FishApp Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: #1d4ed8; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .fish-emoji { font-size: 48px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="fish-emoji">🐟</div>
              <h1>Welcome to FishApp!</h1>
              <p>Your Complete Fishing Companion</p>
            </div>
            <div class="content">
              <h2>Email Verification</h2>
              <p>Thank you for signing up for FishApp! To complete your registration and start using all the fishing features, please verify your email address using the code below:</p>
              
              <div class="code">${code}</div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 15 minutes</li>
                <li>Enter this code in the FishApp verification screen</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
              
              <p>Once verified, you'll have access to:</p>
              <ul>
                <li>🐠 Fish identification with AI</li>
                <li>📏 Length-to-weight calculator</li>
                <li>🌊 Tide and moon information</li>
                <li>🎣 Catch tracking and sharing</li>
                <li>📍 Location-based fishing reports</li>
                <li>📚 Species information database</li>
              </ul>
              
              <p>Happy fishing!</p>
              <p><strong>The FishApp Team</strong></p>
            </div>
            <div class="footer">
              <p>This email was sent from FishApp. If you have any questions, please contact us at support@fishapp.com</p>
              <p>© 2024 FishApp. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateVerificationEmailText(code: string): string {
    return `
Welcome to FishApp - Your Complete Fishing Companion!

Email Verification Code: ${code}

Thank you for signing up for FishApp! To complete your registration and start using all the fishing features, please verify your email address using the code above.

Important:
- This code will expire in 15 minutes
- Enter this code in the FishApp verification screen
- If you didn't request this code, please ignore this email

Once verified, you'll have access to:
- Fish identification with AI
- Length-to-weight calculator
- Tide and moon information
- Catch tracking and sharing
- Location-based fishing reports
- Species information database

Happy fishing!

The FishApp Team

---
This email was sent from FishApp. If you have any questions, please contact us at support@fishapp.com
© 2024 FishApp. All rights reserved.
    `
  }

  private async sendWithEmailJS(email: string, code: string): Promise<boolean> {
    try {
      // Load EmailJS dynamically
      const emailjs = await import('@emailjs/browser')
      
      const templateParams = {
        to_email: email,
        verification_code: code,
        app_name: 'FishApp',
        from_name: 'FishApp Team'
      }

      const response = await emailjs.send(
        'service_fishapp', // Service ID - you'll get this from EmailJS
        'template_verification', // Template ID - you'll get this from EmailJS
        templateParams,
        this.apiKey!
      )

      console.log('✅ Email sent successfully via EmailJS:', response)
      return true
    } catch (error) {
      console.error('❌ EmailJS error:', error)
      // Fallback to mock service
      return await this.sendEmailMock(email, code)
    }
  }

  private async sendEmailMock(email: string, code: string): Promise<boolean> {
    // Mock email service - in production, replace with actual service
    console.log('📧 Mock Email Service - Sending verification code:')
    console.log('To:', email)
    console.log('🔑 VERIFICATION CODE:', code)
    console.log('💡 Copy this code and paste it in the verification form!')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For development, we'll always return true
    return true
  }

  // Production email service integration examples:
  
  // Example with SendGrid
  private async sendEmailWithSendGrid(emailData: EmailData): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('SendGrid API key not configured')
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.to }],
          subject: emailData.subject,
        }],
        from: { email: 'noreply@fishapp.com', name: 'FishApp' },
        content: [
          { type: 'text/plain', value: emailData.text },
          { type: 'text/html', value: emailData.html },
        ],
      }),
    })

    return response.ok
  }

  // Example with Mailgun
  private async sendEmailWithMailgun(emailData: EmailData): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('Mailgun API key not configured')
    }

    const formData = new FormData()
    formData.append('from', 'FishApp <noreply@fishapp.com>')
    formData.append('to', emailData.to)
    formData.append('subject', emailData.subject)
    formData.append('text', emailData.text)
    formData.append('html', emailData.html)

    const response = await fetch(`https://api.mailgun.net/v3/your-domain.mailgun.org/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
      body: formData,
    })

    return response.ok
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()
