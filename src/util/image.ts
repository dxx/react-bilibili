/**
 * 图片后缀 iOS使用.jpg Android使用webp
 */
export function getPicSuffix() {
  const terminal = {
    isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent),
    isAndroid: /(Android)/i.test(navigator.userAgent)
  }
  let suffix = ".webp";
  if (terminal.isIOS ===  true) {
    suffix = ".jpg";
  } else if (terminal.isAndroid === true) {
    suffix = ".webp";
  } else {
    suffix = ".jpg";
  }
  return suffix;
}
