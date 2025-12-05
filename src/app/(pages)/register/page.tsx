"use client"; 

import BasePage from "@templates/base_page";
import RegisterForm from "@components/forms/register_form";

const Register: React.FC  = () => {
    return (
        <div className="main">
            <BasePage>
                <RegisterForm />
            </BasePage>
        </div>
    );
}

export default Register;