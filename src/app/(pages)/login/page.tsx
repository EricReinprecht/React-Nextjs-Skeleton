import { BasePage } from "@templates";
import { LoginForm } from "@components";

export default function Login(props) {
  return (
    <div className="main">
      <BasePage>
        <LoginForm/>
      </BasePage>
    </div>
  );
}