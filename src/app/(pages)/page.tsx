import BasePage from "@templates/base_page";

export default function Home() {
  return (
    <div className="main">
      <BasePage>
        <h1>This is the Home Page !</h1>
        <div className="lol">{process.env.TEST}</div>
      </BasePage>
    </div>
  );
}
