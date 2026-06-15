import type { FieldValidator } from './types';

// ─── Raw patterns ────────────────────────────────────────────────────
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^https?:\/\/.+/;

// ─── Predicates (raw boolean checks for ad-hoc UI states) ────────────
export const isValidEmail = (value: string) => EMAIL_REGEX.test(value);
export const isValidUrl = (value: string) => URL_REGEX.test(value);

// ─── Validator factories (return a FieldValidator for useForm) ───────

interface ValidatorMessages {
  message?: string;
}

/** Required field — non-empty string, non-null, non-empty array. */
export function required<T>(opts: ValidatorMessages = {}): FieldValidator<T> {
  return (value) => {
    if (value === null || value === undefined || value === '') {
      return opts.message ?? 'Dit veld is verplicht';
    }
    if (Array.isArray(value) && value.length === 0) {
      return opts.message ?? 'Dit veld is verplicht';
    }

    return null;
  };
}

/** Valid email format (skipped if empty). */
export function email<T>(opts: ValidatorMessages = {}): FieldValidator<T> {
  return (value) => {
    if (!value) return null;
    if (!isValidEmail(String(value))) {
      return opts.message ?? 'Vul een geldig e-mailadres in';
    }

    return null;
  };
}

/** Valid http(s) URL (skipped if empty). */
export function url<T>(opts: ValidatorMessages = {}): FieldValidator<T> {
  return (value) => {
    if (!value) return null;
    if (!isValidUrl(String(value))) {
      return opts.message ?? 'URL moet beginnen met https://';
    }

    return null;
  };
}

interface NumberOptions extends ValidatorMessages {
  min?: number;
  max?: number;
}

/** Numeric value (skipped if empty). */
export function numeric<T>(opts: NumberOptions = {}): FieldValidator<T> {
  return (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value);

    if (isNaN(n)) return opts.message ?? 'Vul een geldig getal in';
    if (opts.min !== undefined && n < opts.min) {
      return opts.message ?? `Minimaal ${opts.min}`;
    }
    if (opts.max !== undefined && n > opts.max) {
      return opts.message ?? `Maximaal ${opts.max}`;
    }

    return null;
  };
}

/**
 * Validate every URL in an array. Returns an error pointing at the first
 * invalid entry. Items with empty `url` are skipped (they're treated as empty rows).
 */
export function urlList<T, I extends { url: string }>(
  opts: ValidatorMessages & { itemLabel?: string } = {}
): FieldValidator<T> {
  return (value) => {
    const list = (value as I[]) || [];
    const idx = list.findIndex((item) => item.url && !isValidUrl(item.url));

    if (idx >= 0) {
      const label = opts.itemLabel ?? 'Link';

      return opts.message ?? `${label} ${idx + 1} is geen geldige URL (begint met https://)`;
    }

    return null;
  };
}

/** Compose multiple validators — returns the first non-null error. */
export function compose<T>(...validators: FieldValidator<T>[]): FieldValidator<T> {
  return async (value, formData) => {
    for (const v of validators) {
      const result = await v(value, formData);

      if (result) return result;
    }

    return null;
  };
}
