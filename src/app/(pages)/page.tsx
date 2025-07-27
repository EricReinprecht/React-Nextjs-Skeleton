import BasePage from "@templates/base_page";
import DefaultPartyList from "@components/lists/default_party_list";

export default function Home() {
  return (
    <div className="main">
      <BasePage>
        <DefaultPartyList />
      </BasePage>
    </div>
  );
}
