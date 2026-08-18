import { BasePage } from "@frontend/templates";
import { LoginForm } from "@frontend/components";

export default function Login() {
  return (
    <div className="main">
      <BasePage>
        <LoginForm/>
      </BasePage>
    </div>
  );
}
