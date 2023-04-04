import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(CustomParseFormat);
dayjs.extend(timezone);

const tz = process.env.APP_ENV_APPLICATION_TIMEZONE ?? 'Asia/Ho_Chi_Minh';
dayjs.tz.setDefault(tz);

export { dayjs };

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
