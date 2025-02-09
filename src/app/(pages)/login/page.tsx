import BasePage from "@templates/base_page";
import LoginForm from "@components/forms/login_form";

export default function Login() {
  return (
    <div className="main">
      <BasePage>
        <LoginForm/>
      </BasePage>
    </div>
  );
}