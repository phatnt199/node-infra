import dayjs from 'dayjs';
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const isWeekday: (date: dayjs.Dayjs) => boolean;
export declare const getPreviousWeekday: () => dayjs.Dayjs;
export declare const getNextWeekday: () => dayjs.Dayjs;
export declare const getDateTz: (opts: {
    date: string;
    timezone: string;
    useClientTz?: boolean;
    timeOffset?: number;
}) => dayjs.Dayjs;
export { dayjs };
