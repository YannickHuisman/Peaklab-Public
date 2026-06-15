type FormatPreset = 'date' | 'datetime' | 'shortDate' | 'shortDatetime';

const FORMAT_PRESETS: Record<FormatPreset, Intl.DateTimeFormatOptions> = {
  date: { year: 'numeric', month: 'long', day: 'numeric' },
  datetime: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  shortDate: { year: 'numeric', month: 'short', day: 'numeric' },
  shortDatetime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
};

interface FormatDateOptions {
  locale?: string;
  preset?: FormatPreset;
}

export function formatDate(
  dateString?: string | null,
  { locale = 'nl-NL', preset = 'date' }: FormatDateOptions = {}
): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions =
    typeof preset === 'string' ? FORMAT_PRESETS[preset] : preset;

  return new Intl.DateTimeFormat(locale, options).format(date as Date);
}
