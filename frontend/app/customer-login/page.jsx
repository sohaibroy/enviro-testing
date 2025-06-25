import { Login } from "../components/login/Login";

// Signup button/Customer login page

function CustomerLogin() {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      
      <Login
        title="Customer Login"
        apiPath="http://localhost:80/api/login/account"
      />
    </div>
  );
}

export default CustomerLogin;
