import dayjs from 'dayjs';

// 定义 DateFormatProps 类型
interface DateFormatProps {
    short?: boolean;
    value?: string | null;
    format?: string;
}

// 提取默认格式字符串常量
const DEFAULT_SHORT_FORMAT = "YYYY-MM-DD";
const DEFAULT_LONG_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default function DateFormat({ short, value, format }: DateFormatProps) {
    // 根据 short 参数选择默认格式
    const f: string = short ? DEFAULT_SHORT_FORMAT : DEFAULT_LONG_FORMAT;

    try {
        // 如果 value 存在且有效，则格式化日期，否则返回 "-"
        return value ? dayjs(value).format(format || f) : "-";
    } catch (error) {
        // 处理日期格式化失败的情况
        console.error("Date formatting error:", error);
        return "-";
    }
}
