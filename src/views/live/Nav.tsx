import * as React from "react";

import style from "./nav.styl?css-modules";

function Nav() {
  return (
    <nav className={style.navFixed}>
      <div className={style.nav}>
        <a href="/live"><i /></a>
      </div>
      <div className={style.tab}>
        <div className={style.tabItem}>
          <a href="/index">首页</a>
        </div>
        <div className={style.tabItem}>
          <a href="/channel/1">频道</a>
        </div>
        <div className={style.tabItem}>
          <a href="/live">直播</a>
        </div>
        <div className={style.tabItem}>
          <a href="/ranking/0">排行</a>
        </div>
        <div className={style.tabItem}>
          <a href="/space">我的</a>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
