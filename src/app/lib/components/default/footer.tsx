import "@styles/components/footer.scss";
import React from "react";
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="">
      <div className="footer-inner">
        <div className="column">
          <div className="content">
            <Link href="/page1" className="item">Link 1</Link>
            <a href="" className="item">Link 2</a>
            <a href="" className="item">Link 3</a>
            <a href="" className="item">Link 4</a>
            <a href="" className="item">Link 5</a>
          </div>
        </div>
        <div className="column">
          <div className="content">
            <a href="" className="item">Link 6</a>
            <a href="" className="item">Link 7</a>
            <a href="" className="item">Link 8</a>
            <a href="" className="item">Link 9</a>
            <a href="" className="item">Link 10</a>
          </div>
        </div>
        <div className="column">
          <div className="content">
          <div className="item"></div>
            <a href="" className="item">Link 11</a>
            <a href="" className="item">Link 12</a>
            <a href="" className="item">Link 13</a>
            <a href="" className="item">Link 14</a>
            <a href="" className="item">Link 15</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;