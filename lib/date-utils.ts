// Utility functions for consistent date handling without timezone issues

/**
 * Format date to YYYY-MM-DD in local timezone (avoiding UTC conversion)
 * This prevents the ±1 day shift that occurs with toISOString()
 */
export function formatDateToLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse date string (YYYY-MM-DD) to Date object in local timezone
 * This ensures consistent date handling without timezone shifts
 */
export function parseDateFromLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Check if a date string represents today in local timezone
 */
export function isToday(dateStr: string): boolean {
  const today = formatDateToLocal(new Date())
  return dateStr === today
}

/**
 * Check if a date string represents a past date in local timezone
 */
export function isPastDate(dateStr: string): boolean {
  const today = formatDateToLocal(new Date())
  return dateStr < today
}