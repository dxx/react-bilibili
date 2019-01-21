import * as React from "react";
import { getTransitionEndName } from "../../util/compatible";

import style from "./drawer.styl?css-modules";

interface DataObj {
  id: number;
  name: string;
}

interface DrawerProps {
  data: DataObj[];
  onClick?: any;
  onPush?: any;
  onPullDown?: any;
  currentIndex?: number;
}

interface DrawerState {
  currentIndex: number;
}

class Drawer extends React.Component<DrawerProps, DrawerState> {
  private drawerWrapperRef: React.RefObject<HTMLDivElement>;
  public pull: boolean;
  constructor(props) {
    super(props);

    this.drawerWrapperRef = React.createRef();
    this.pull = false;

    this.state = {
      currentIndex: 0
    }
  }
  public static getDerivedStateFromProps(props, state) {
    if (props.currentIndex !== undefined) {
      if (props.currentIndex !== state.currentIndex) {
        return {
          currentIndex: props.currentIndex
        }
      }
    }
    return state;
  }
  public componentDidMount() {
    const drawerWrapperDOM = this.drawerWrapperRef.current;
    this.hide();
    const transitionEndName = getTransitionEndName(drawerWrapperDOM);
    drawerWrapperDOM.addEventListener(transitionEndName, () => {
      const { onPush, onPullDown } = this.props;
      if (this.pull === false) {
        drawerWrapperDOM.style.display = "none";
        if (onPush) {
          onPush();
        }
      } else {
        if (onPullDown) {
          onPullDown();
        }
      }
    });
  }
  private handleClick(item, index) {
    this.setState({
      currentIndex: index
    });
    if (this.props.onClick) {
      this.props.onClick(item);
    }
  }
  private push() {
    this.hide();
  }
  private setTranslateY(y) {
    const drawerWrapperDOM = this.drawerWrapperRef.current;
    drawerWrapperDOM.style.webkitTransform = `translate3d(0, ${y}, 0)`;
    drawerWrapperDOM.style.transform = `translate3d(0, ${y}, 0)`;
  }
  public show() {
    this.pull = true;
    const drawerWrapperDOM = this.drawerWrapperRef.current;
    drawerWrapperDOM.style.display = "block";
    setTimeout(() => {
      this.setTranslateY(0);
    }, 10);
  }
  public hide() {
    this.pull = false;
    this.setTranslateY("-100%");
  }
  public render() {
    const { data } = this.props;
    const items = data.map((item, i) => (
      <div className={style.drawerItem  + (i === this.state.currentIndex ? " " + style.current : "")}
        key={item.id} onClick={() => { this.handleClick(item, i); }}>
        <span>{item.name}</span>
      </div>
    ));
    return (
      <div className={style.drawer}>
        <div className={style.drawerWrapper} ref={this.drawerWrapperRef}>
          <div className={style.drawerItemContainer}>
            {items}
          </div>
          <div className={style.drawerSwitch}>
            <i className="icon-arrow-up" onClick={() => { this.push(); }} />
          </div>
        </div>
      </div>
    );
  }
}

export default Drawer;
