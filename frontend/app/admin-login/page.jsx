import { Login } from "../components/login/Login";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;  //added

// this is the "Admin Login" Button - not the actual page

function AdminLogin() {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <Login
        title="Admin Login"
        link="./admin-selection/"
        // apiPath="http://localhost:80/api/login/admin"
        apiPath={`${baseUrl}/api/login/admin`}
      />
    </div>
  );
}

export default AdminLogin;
