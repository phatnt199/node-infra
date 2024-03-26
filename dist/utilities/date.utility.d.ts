import internalDayJS from 'dayjs';
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const isWeekday: (date: internalDayJS.Dayjs) => boolean;
export declare const getPreviousWeekday: () => internalDayJS.Dayjs;
export declare const getNextWeekday: () => internalDayJS.Dayjs;
export declare const dayjs: typeof internalDayJS;
