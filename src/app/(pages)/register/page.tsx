"use client"; 

import BasePage from "@templates/base_page";
import RegisterForm from "../../lib/components/forms/register_form";

export default function Register(props) {
    return (
        <div className="main">
            <BasePage>
                <RegisterForm />
            </BasePage>
        </div>
    );
}