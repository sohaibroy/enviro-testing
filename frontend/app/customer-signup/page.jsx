import { Signup } from "../components/sign-up/Signup";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Customer Sign up page

function CustomerSignup() {
    return (
        <div className="flex justify-center items-center h-[70vh]">
            <Signup
                title="Customer Signup"
                //apiPath="http://localhost:80/api/signup/account"
                apiPath={`${baseUrl}/api/signup/account`}
            />
        </div>
    )
}

export default CustomerSignup;