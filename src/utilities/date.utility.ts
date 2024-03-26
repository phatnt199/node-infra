import internalDayJS from 'dayjs';

import CustomParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import IsoWeekPlugin from 'dayjs/plugin/isoWeek';
import TimezonePlugin from 'dayjs/plugin/timezone';
import UTCPlugin from 'dayjs/plugin/utc';
import WeekdayPlugin from 'dayjs/plugin/weekday';

internalDayJS.extend(CustomParseFormatPlugin);
internalDayJS.extend(UTCPlugin);
internalDayJS.extend(TimezonePlugin);
internalDayJS.extend(WeekdayPlugin);
internalDayJS.extend(IsoWeekPlugin);

const tz = process.env.APP_ENV_APPLICATION_TIMEZONE ?? 'Asia/Ho_Chi_Minh';
internalDayJS.tz.setDefault(tz);

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isWeekday = (date: internalDayJS.Dayjs) => {
  const isoWeekday = internalDayJS(date)?.isoWeekday();
  return isoWeekday > 0 && isoWeekday < 6;
};

export const getPreviousWeekday = () => {
  let date = internalDayJS();
  while (!isWeekday(date)) {
    date = date.subtract(1, 'day');
  }

  return date;
};

export const getNextWeekday = () => {
  let date = internalDayJS();
  while (!isWeekday(date)) {
    date = date.add(1, 'day');
  }

  return date;
};

export const getDateTz = (opts: { date: string; timezone: string; timeOffset?: number }) => {
  const { date, timezone, timeOffset = 0 } = opts;
  return internalDayJS(date).tz(timezone, true).add(timeOffset);
};

const dayjs = internalDayJS;
export { dayjs };
