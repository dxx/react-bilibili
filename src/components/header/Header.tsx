import * as React from "react";
import Logo from "../../components/Logo";
import Avatar from "../../components/Avatar";

import style from "./header.styl?css-modules";

const Header = () => {
  return (
    <div className={style.header}>
      <a className={style.logo} href="/index">
        <Logo />
      </a>
      <a className={style.searchIcon} href="/search">
        <i className="icon-search" />
      </a>
      <a className={style.avatar} href="/space">
        <Avatar />
      </a>
    </div>
  );
}

export default Header;
