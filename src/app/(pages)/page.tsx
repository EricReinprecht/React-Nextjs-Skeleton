import { BasePage } from "@templates";
import { DefaultPartyList } from "@components";


const Home = (props) => {
    return(
        <div className="main">
            <BasePage backgroundType="default">
                <DefaultPartyList />
            </BasePage>
        </div>
    )
}

export default Home;