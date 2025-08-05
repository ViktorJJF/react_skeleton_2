import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { es, enUS, type Locale } from "date-fns/locale";
import i18n from "@/i18n";

/**
 * Get the appropriate locale for date-fns based on current language
 */
export const getDateLocale = () => {
  return i18n.language === "es" ? es : enUS;
};

/**
 * Format a date string or Date object to a localized string
 * @param date - Date string, Date object, or timestamp
 * @param formatString - Format pattern (default: 'dd/MM/yyyy HH:mm')
 * @param locale - Optional locale override
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | number,
  formatString: string = "dd/MM/yyyy HH:mm",
  locale?: Locale
): string => {
  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      console.warn("Invalid date provided to formatDate:", date);
      return "Invalid Date";
    }

    const dateLocale = locale || getDateLocale();
    return format(dateObj, formatString, { locale: dateLocale });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 * @param date - Date string, Date object, or timestamp
 * @param locale - Optional locale override
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: string | Date | number,
  locale?: Locale
): string => {
  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      console.warn("Invalid date provided to formatRelativeTime:", date);
      return "Invalid Date";
    }

    const dateLocale = locale || getDateLocale();
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: dateLocale,
    });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid Date";
  }
};

/**
 * Format date for display in tables (short format)
 * @param date - Date string, Date object, or timestamp
 * @returns Short formatted date string
 */
export const formatTableDate = (date: string | Date | number): string => {
  return formatDate(date, "dd/MM/yyyy");
};

/**
 * Format date for display with time (long format)
 * @param date - Date string, Date object, or timestamp
 * @returns Long formatted date string with time
 */
export const formatDateTime = (date: string | Date | number): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm:ss");
};

/**
 * Format date for API requests (ISO string)
 * @param date - Date string, Date object, or timestamp
 * @returns ISO date string
 */
export const formatApiDate = (date: string | Date | number): string => {
  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      throw new Error("Invalid date");
    }

    return dateObj.toISOString();
  } catch (error) {
    console.error("Error formatting API date:", error);
    throw new Error("Invalid date provided");
  }
};

/**
 * Check if a date string is valid
 * @param date - Date string to validate
 * @returns Boolean indicating if date is valid
 */
export const isValidDate = (date: string | Date | number): boolean => {
  try {
    let dateObj: Date;

    if (typeof date === "string") {
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    return isValid(dateObj);
  } catch {
    return false;
  }
};
