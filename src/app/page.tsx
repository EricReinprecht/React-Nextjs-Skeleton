import Image from "next/image";
import styles from "./page.module.css";
import BasePage from "./lib/templates/base_page";

export default function Home() {
  return (
    <div className="main">
      <BasePage>
        <div>Hallo</div>
      </BasePage>
    </div>
  );
}
