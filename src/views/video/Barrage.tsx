import * as React from "react";
import { getTransitionEndName } from "../../util/compatible";

/**
 * 弹幕类型
 * RANDOM: 随机位置
 * FIXED: 固定在中间
 */
enum BarrageType {
  RANDOM = 1,
  FIXED
}

interface BarrageData {
  type: BarrageType;
  color: string;
  content: string;
}

interface BarrageProps {
  fontSize?: string;
  opacity?: number;
  barrages?: BarrageData[];
}

/**
 * 使用纯组件，不发生update，发射弹幕采用DOM操作
 */
class Barrage extends React.PureComponent<BarrageProps> {
  public viewWidth: number;
  public viewHeight: number;
  private barrageRef: React.RefObject<HTMLDivElement>;
  private contentHeight: number;
  private randomTop: number = 0;
  private fixedTop: number = 0;
  private fontSize: string;
  private opacity: number;
  constructor(props) {
    super(props);

    this.barrageRef = React.createRef();
    
    this.fontSize = props.fontSize || "0.8rem";
    this.opacity = props.opacity || 1;
  }
  private init() {
    this.refresh();

    const div = document.createElement("div");
    div.innerHTML = "div";
    div.style.fontSize = this.fontSize;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(div);
    // 弹幕内容高度
    this.contentHeight = div.offsetHeight;
    body.removeChild(div);

    const { barrages } = this.props;
    if (barrages) {
      for (const barrage of barrages) {
        this.send(barrage);
      }
    }
  }
  public componentDidMount() {
    this.init();
  }
  public componentWillUnmount() {
    this.clear();
  }
  /**
   * 发送弹幕
   */
  public send(barrage: BarrageData) {
    const barrageDOM  = this.barrageRef.current;
    const barrageElem = this.createBarrageElem(barrage);
    barrageDOM.appendChild(barrageElem);

    if (barrage.type !== BarrageType.FIXED) {
      const x = - (this.viewWidth + barrageElem.offsetWidth);
      setTimeout(() => {
        barrageElem.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
        barrageElem.style.transform = `translate3d(${x}px, 0, 0)`;
      }, 10);
    } else {
      barrageElem.style.left = (this.viewWidth - barrageElem.offsetWidth ) / 2 + "px";
      // 移除弹幕
      setTimeout(() => {
        if (barrageElem.parentNode === barrageDOM) {
          barrageDOM.removeChild(barrageElem);

          // 距顶端位置减少一个弹幕内容高度
          this.fixedTop -= this.contentHeight;
          if (this.fixedTop < 0) {
            this.fixedTop = 0;
          }
        }
      }, 5000);
    }
  }
  /**
   * 清除弹幕
   */
  public clear() {
    this.randomTop = 0;
    this.fixedTop = 0;
    const barrageDOM = this.barrageRef.current;
    const children = barrageDOM.children;
    for (const child of Array.from(children)) {
      barrageDOM.removeChild(child);
    }
  }
  /**
   * 刷新弹幕容器宽高
   */
  public refresh() {
    const barrageDOM  = this.barrageRef.current;
    // 弹幕区域宽
    this.viewWidth = barrageDOM.offsetWidth;
    // 弹幕区域高
    this.viewHeight = barrageDOM.offsetHeight;
  }
  /**
   * 创建弹幕元素
   */
  private createBarrageElem(barrage: BarrageData) {
    const div = document.createElement("div");
    div.innerHTML = barrage.content;

    const style: any = {
      position: "absolute",
      fontFamily: "黑体",
      fontSize: "0.8rem",
      fontWeight: "bold",
      whiteSpace: "pre",
      textShadow: "rgb(0, 0, 0) 1px 1px 2px",
      color: barrage.color,
      opacity: this.opacity
    };
    // 随机滚动
    if (barrage.type !== BarrageType.FIXED) {
      style.top = `${this.randomTop}px`,
      style.left = `${this.viewWidth}px`,
      style.webkitTransition = "-webkit-transform 5s linear 0s";
      style.transition = "transform 5s linear 0s";

      const transitionName = getTransitionEndName(div);
      const handleTransitionEnd = () => {
        // 弹幕运动完成后移除监听，清除弹幕
        div.removeEventListener(transitionName, handleTransitionEnd);
        this.barrageRef.current.removeChild(div);

        // 距顶端位置减少一个弹幕内容高度
        this.randomTop -= this.contentHeight;
        // 最小值边界判断
        if (this.randomTop < 0) {
          this.randomTop = 0;
        }
      };
      div.addEventListener(transitionName, handleTransitionEnd);
      // 距离顶端位置增加一个弹幕内容高度，防止滚动弹幕重叠
      this.randomTop += this.contentHeight;
      // 最大值边界判断
      if (this.randomTop > this.viewHeight - this.contentHeight) {
        this.randomTop = 0;
      }
    } else {
      div.style.top = this.fixedTop + "px";
      // 距离顶端位置增加一个弹幕内容高度，防止固定弹幕重叠
      this.fixedTop += this.contentHeight;
      // 最大值边界判断
      if (this.fixedTop > this.viewHeight - this.contentHeight) {
        this.fixedTop = 0;
      }
    }

    for (const k in style) {
      if (style[k] !== void 0) {
        div.style[k] = style[k];
      }
    }

    return div;
  }
  public render() {
    const style: any = {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden"
    };
    return (
      <div style={style} ref={this.barrageRef} />
    );
  }
}

export { BarrageType };

export default Barrage;
