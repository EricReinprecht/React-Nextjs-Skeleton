import BasePage from "@templates/base_page";
import DefaultPartyList from "@components/lists/default_party_list";


const Home = () => {
    return(
        <div className="main">
            <BasePage backgroundType="default">
                <DefaultPartyList />
            </BasePage>
        </div>
    )
}

export default Home;