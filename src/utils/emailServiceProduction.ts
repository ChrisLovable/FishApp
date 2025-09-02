// Production-ready email service using EmailJS (free tier available)
// Alternative: Use this for actual email sending in production

export interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class ProductionEmailService {
  private static instance: ProductionEmailService
  private serviceId: string | null = null
  private templateId: string | null = null
  private publicKey: string | null = null

  private constructor() {
    // Initialize with EmailJS credentials
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || null
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || null
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || null
  }

  public static getInstance(): ProductionEmailService {
    if (!ProductionEmailService.instance) {
      ProductionEmailService.instance = new ProductionEmailService()
    }
    return ProductionEmailService.instance
  }

  public async sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      // If EmailJS is configured, use it
      if (this.serviceId && this.templateId && this.publicKey) {
        return await this.sendWithEmailJS(email, code)
      }

      // Fallback to mock service for development
      console.log('📧 EmailJS not configured, using mock service')
      return await this.sendMock(email, code)
    } catch (error) {
      console.error('Error sending verification email:', error)
      return false
    }
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
        this.serviceId!,
        this.templateId!,
        templateParams,
        this.publicKey!
      )

      console.log('✅ Email sent successfully:', response)
      return true
    } catch (error) {
      console.error('❌ EmailJS error:', error)
      return false
    }
  }

  private async sendMock(email: string, code: string): Promise<boolean> {
    console.log('📧 Mock Email Service - Sending verification code:')
    console.log('To:', email)
    console.log('🔑 VERIFICATION CODE:', code)
    console.log('💡 Copy this code and paste it in the verification form!')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true
  }
}

// Export singleton instance
export const productionEmailService = ProductionEmailService.getInstance()
