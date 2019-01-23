/**
 * 格式化数字
 * 1218807 => 121.9万
 */
export function formatTenThousand(num: number): string {
  const numStr = String(num);
  if (numStr.length <= 4) {
    return numStr;
  }
  let wholeNumber = numStr.substring(0, numStr.length - 4);
  const thousands = numStr.substring(numStr.length - 4);
  let decimalNumber = Number(thousands.substring(0, 1) + "." + thousands.substring(1)).toFixed(0);
  if (decimalNumber.length === 2) {
    decimalNumber = "0";
    wholeNumber = String(Number(wholeNumber) + 1);
  }
  return `${wholeNumber}.${decimalNumber}万`;
}

/**
 * 格式秒时间
 * second: 120
 * format
 * 0#:## => 02:00
 * ##:## => 2:00
 * 0#:##:## => 00:02:00
 * ##:##:## => 0:02:00
 */
export function formatDuration(second: number, format: string): string {
  let date = new Date();
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const tempstamp = date.getTime() + second * 1000;
  const newDate = new Date(tempstamp);
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();
  date = null;
  const toStr = (num) => {
    return num < 10 ? "0" + num : num;
  }
  let duration = `${toStr(hours)}:${toStr(minutes)}:${toStr(seconds)}`;
  if (format) {
    const formats = format.split(":");
    if (formats.length === 3) {
      duration = duration.match(/\d{2}:\d{2}:\d{2}$/)[0];
    } else if (formats.length === 2) {
      duration = duration.match(/\d{2}:\d{2}$/)[0];
    }
    if (format.indexOf("0") === -1) {
      duration = duration.replace(duration.charAt(0), "");
    }
  }
  return duration;
}
