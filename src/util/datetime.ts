export function formatDate(date: Date, format: string): string {
  const reg = {
    "M+" : date.getMonth() + 1,               // 月份
    "d+" : date.getDate(),                    // 日
    "h+" : date.getHours(),                   // 小时
    "m+" : date.getMinutes(),                 // 分
    "s+" : date.getSeconds(),                 // 秒
    "q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
    "S"  : date.getMilliseconds()             // 毫秒
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in reg) {
    if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
          reg[k] : ("00" + reg[k]).substr(("" + reg[k]).length));
    }
  }
  return format;
}
