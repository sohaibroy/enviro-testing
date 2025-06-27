export function isTokenExpired() {
  const tokenExpirationTime = sessionStorage.getItem("tokenExpiration");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!tokenExpirationTime) {
    // If token is not provided, consider it expired
    destroySession();
    return true;
  }

  try {
    const expirationTime = new Date(tokenExpirationTime + " UTC");
    const currentTime = new Date();

    // Compare the expiration time with the current time
    if (expirationTime <= currentTime) {
      destroySession();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // If there's an error decoding the token, consider it expired
    console.error("Error decoding token:", error);
    destroySession();
    return true;
  }
}

export function createSession(
  token,
  accountType,
  expiration,
  username,
  companyName
) {
  if (accountType != null && typeof accountType === "boolean") {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("tokenExpiration", expiration);
    sessionStorage.setItem("accountType", accountType);
    sessionStorage.setItem("companyName", companyName);
    sessionStorage.removeItem("cartItems");
  }
}

export async function destroySession() {
  try {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      //const response = await fetch("http://localhost:80/api/logout", {
      const response = await fetch(`${baseUrl}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("accountType");
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("tokenExpiration");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("companyName");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
