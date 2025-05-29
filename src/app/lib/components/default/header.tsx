import "@styles/components/header.scss";
import Link from "next/link";

import React from "react";
import Profile from "../../svgs/profile";

const Header: React.FC = () => {
  return (
    <header>
      <div className="header-inner">
        <Link href="/browse" className="nav-item-outer"><div className="nav-item">Browse</div></Link>
        <Link href="/page2" className="nav-item-outer"><div className="nav-item">Page 2</div></Link>
        <Link href="/page3" className="nav-item-outer"><div className="nav-item">Page 3</div></Link>
        <Link href="/page4" className="nav-item-outer"><div className="nav-item">Page 4</div></Link>
        <Link href="/page5" className="nav-item-outer"><div className="nav-item">Page 5</div></Link>
        <Link href="/page6" className="nav-item-outer"><div className="nav-item">Page 6</div></Link>
      </div>
      <div className="left">
        <Link href="/profile" className="nav-item-outer">
          <div className="nav-item">
            <Profile width={40} height={40} color="orange" border_color="red"/>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;