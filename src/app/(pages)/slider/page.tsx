import Image from "next/image";
import styles from "./page.module.css";
import BasePage from "@templates/base_page";
import DefaultSlider from "@components/slider/default_slider";

export default function Slider() {
  return (
    <div className="main">
      <BasePage>
        <h1>This is the Slider Page !</h1>
        <DefaultSlider />
      </BasePage>
    </div>
  );
}
