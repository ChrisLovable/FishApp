import { createClient } from '@supabase/supabase-js'
import { APP_VERSION } from '../constants/version'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export interface LogEntry {
  message: string
  stack?: string
  url?: string
  userAgent?: string
  errorType?: string
  component?: string
  severity?: 'error' | 'warning' | 'info'
  userEmail?: string
  appVersion?: string
}

export class Logger {
  private static instance: Logger
  private userEmail: string | null = null

  private constructor() {
    // Get user email from localStorage
    this.userEmail = localStorage.getItem('userEmail')
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public setUserEmail(email: string) {
    this.userEmail = email
    localStorage.setItem('userEmail', email)
  }

  public async logError(entry: LogEntry): Promise<void> {
    try {
      const logData = {
        message: entry.message,
        stack: entry.stack || null,
        url: entry.url || window.location.href,
        user_agent: entry.userAgent || navigator.userAgent,
        error_type: entry.errorType || 'JavaScript',
        component: entry.component || 'Unknown',
        severity: entry.severity || 'error',
        user_email: this.userEmail || null,
        app_version: entry.appVersion || APP_VERSION
      }

      const { error } = await supabase
        .from('logs')
        .insert([logData])

      if (error) {
        console.error('Failed to log error to Supabase:', error)
      } else {
        console.log('Error logged to Supabase successfully')
      }
    } catch (err) {
      console.error('Failed to log error:', err)
    }
  }

  public async logWarning(entry: Omit<LogEntry, 'severity'>): Promise<void> {
    await this.logError({ ...entry, severity: 'warning' })
  }

  public async logInfo(entry: Omit<LogEntry, 'severity'>): Promise<void> {
    await this.logError({ ...entry, severity: 'info' })
  }
}

// Global error handler
export const setupGlobalErrorHandling = () => {
  const logger = Logger.getInstance()

  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    logger.logError({
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      errorType: 'JavaScript',
      component: 'Global'
    })
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.logError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      errorType: 'Promise',
      component: 'Global'
    })
  })

  // Handle React errors (if using Error Boundary)
  window.addEventListener('react-error', (event: any) => {
    logger.logError({
      message: event.detail.message,
      stack: event.detail.stack,
      component: event.detail.component || 'React'
    })
  })

  console.log('Global error handling setup complete')
}



// Export the logger instance
export const logger = Logger.getInstance()
