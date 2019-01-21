import * as React from "react";
import Header from "../../components/header/Header";
import { NestedRoute } from "../../router";

import banner from "../../assets/images/banner-top.png";
import style from "./space.styl?css-modules";

const Space = (props) => (
  <div className="space">
    <div className={style.topWrapper}>
      <Header />
    </div>
    <div className={style.banner}>
      <img src={banner} />
    </div>
    {
      props.router.map((route, i) =>
        <NestedRoute {...route} key={i} />
      )
    }
  </div>
);

export default Space;
