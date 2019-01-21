import * as React from "react";

import style from "./tab-bar.styl?css-modules";
import { PartitionType } from "../../models";

interface TabBarProps {
  type: string;
  data: PartitionType[];
  onClick?: any;
  currentIndex?: number;
}

interface TabBarState {
  currentIndex: number;
}

class TabBar extends React.Component<TabBarProps, TabBarState> {
  private tabBarRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);

    this.tabBarRef = React.createRef();

    this.state = {
      currentIndex: 0
    }
  }
  /** 第一次render或组件将要更新时调用 */
  public static getDerivedStateFromProps(props, state) {
    // 传入currentIndex且不等于旧state中的currentIndex时，使用传入的currentIndex
    if (props.currentIndex !== undefined) {
      if (props.currentIndex !== state.currentIndex) {
        return {
          currentIndex: props.currentIndex
        }
      }
    }
    return state;
  }
  public componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentIndex !== this.state.currentIndex) {
      this.resetScroll();
    }
  }
  public componentDidMount() {
    // 等待样式添加后再获取位置
    setTimeout(() => {
      this.resetScroll();
    }, 10);
  }
  private resetScroll() {
    const tabBarDOM = this.tabBarRef.current;
    const children = tabBarDOM.getElementsByTagName("div");
    if (children.length > 0) {
      const currentTabDOM = children[this.state.currentIndex];
      // 当前tab不显示在父元素中，滚动当前tab到父元素中的第二个位置
      if (currentTabDOM.offsetLeft > tabBarDOM.offsetWidth + tabBarDOM.scrollLeft) {
        // tab在左边
        tabBarDOM.scrollLeft = currentTabDOM.offsetLeft - currentTabDOM.offsetWidth;
      } else if (currentTabDOM.offsetLeft + currentTabDOM.offsetWidth < tabBarDOM.scrollLeft) {
        // tab在右边
        tabBarDOM.scrollLeft = currentTabDOM.offsetLeft - currentTabDOM.offsetWidth;
      }
    }
  }
  private handleClick(tab, index) {
    this.setState({
      currentIndex: index
    });
    if (this.props.onClick) {
      this.props.onClick(tab);
    }
  }
  public render() {
    const { data, type } = this.props;
    const cls = type === "indicate" ? style.indicate : style.highlight;
    const tabs = data.map((tab, i) => (
      <div className={style.tab + (i === this.state.currentIndex ? " " + cls : "")}
        key={tab.id} onClick={() => { this.handleClick(tab, i); }}>
        <span>{tab.name}</span>
      </div>
    ));
    return (
      <div className={style.tabBar} ref={this.tabBarRef}>
        {tabs}
      </div>
    );
  }
}

export default TabBar;
