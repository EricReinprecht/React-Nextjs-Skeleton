import "@styles/components/header.scss";
import Link from "next/link";

import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <div className="header-inner">
        <Link href="/page1" className="nav-item-outer"><div className="nav-item">Page 1</div></Link>
        <Link href="/page2" className="nav-item-outer"><div className="nav-item">Page 2</div></Link>
        <Link href="/page3" className="nav-item-outer"><div className="nav-item">Page 3</div></Link>
        <Link href="/page4" className="nav-item-outer"><div className="nav-item">Page 4</div></Link>
        <Link href="/page5" className="nav-item-outer"><div className="nav-item">Page 5</div></Link>
        <Link href="/page6" className="nav-item-outer"><div className="nav-item">Page 6</div></Link>
      </div>
    </header>
  );
};

export default Header;