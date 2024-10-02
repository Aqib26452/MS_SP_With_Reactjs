import React, { createContext, useContext, useState, useEffect } from "react";
import { PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "your-client-id", // Replace with your App's Client ID
    authority: "https://login.microsoftonline.com/your-tenant-id", // Replace with your Tenant ID
    redirectUri: "http://localhost:3000", // Redirect after login
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Create an Authentication Context
const AuthContext = createContext();

// Create AuthProvider to use in your app
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null); // Store access token
  const [user, setUser] = useState(null); // Store user info
  const [isMsalInitialized, setMsalInitialized] = useState(false); // Track MSAL initialization

  // Initialize MSAL instance on mount
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize(); // Initialize MSAL instance
        setMsalInitialized(true); // Flag as initialized
      } catch (error) {
        console.error("MSAL initialization error:", error);
      }
    };
    initializeMsal();
  }, []);

  // Login function
  const login = async () => {
    if (!isMsalInitialized) {
      console.error("MSAL is not initialized yet.");
      return;
    }

    try {
      const loginRequest = {
        scopes: ["https://your-tenant-name.sharepoint.com/.default"], // Permissions for SharePoint
      };
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      const tokenResponse = await msalInstance.acquireTokenSilent(loginRequest);

      // Save access token and user info
      setAccessToken(tokenResponse.accessToken);
      setUser(loginResponse.account);
      console.log("Token acquired:", tokenResponse.accessToken);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Logout function
  const logout = () => {
    if (!isMsalInitialized) {
      console.error("MSAL is not initialized yet.");
      return;
    }

    msalInstance.logout();
    setAccessToken(null);
    setUser(null);
  };

  // Provide the login, logout, and token to the whole app
  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in any component
export const useAuth = () => {
  return useContext(AuthContext);
};
