import Image from "next/image";
import styles from "./page.module.css";
import BasePage from "@templates/base_page";

export default function Slider() {
  return (
    <div className="main">
      <BasePage>
        <h1>This is the Slider Page !</h1>
      </BasePage>
    </div>
  );
}
