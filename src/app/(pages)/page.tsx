import BasePage from "@templates/base_page";
import DefaultPartyList from "@components/lists/default_party_list";

export default function Home() {
  return (
    <div className="main">
      <BasePage>
        <h1>This is the Home Page !</h1>
        {process.env.TEST}
        {process.env.FIREBASE_PROJECT_ID}
        <DefaultPartyList />
      </BasePage>
    </div>
  );
}
