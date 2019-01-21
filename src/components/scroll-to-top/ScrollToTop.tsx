import * as React from "react";
import ToTopBtn from "../ToTopBtn";

import style from "./scroll-to-top.styl?css-modules";

class ScrollToTop extends React.Component {
  private toTopBtnRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);

    this.toTopBtnRef = React.createRef();
  }
  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  private handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop >= window.innerHeight) {
      this.toTopBtnRef.current.style.display = "block";
    } else {
      this.toTopBtnRef.current.style.display = "none";
    }
  }
  private handleClick() {
    const scroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      window.scrollTo(0, scrollTop - 50);
      if (scrollTop > 0) {
        requestAnimationFrame(scroll);
      }
    }
    requestAnimationFrame(scroll);
  }
  public render() {
    return (
      <div className={style.toTopBtn} ref={this.toTopBtnRef}
        onClick={() => {this.handleClick()}}>
        <ToTopBtn />
      </div>
    );
  }
}

export default ScrollToTop;
