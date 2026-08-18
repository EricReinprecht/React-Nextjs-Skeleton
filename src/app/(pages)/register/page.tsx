"use client"; 

import { BasePage } from "@frontend/templates";
import { RegisterForm } from "@frontend/components";

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
