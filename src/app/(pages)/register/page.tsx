"use client"; 

import { BasePage } from "@templates";
import { RegisterForm } from "@components";

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