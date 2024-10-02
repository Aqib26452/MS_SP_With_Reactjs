import React, { useState } from "react";
import { useAuth } from "./authProvider"; // Import the useAuth hook

const App = () => {
  const { login, logout, user, accessToken } = useAuth(); // Get login, logout, user, and token
  const [sharePointData, setSharePointData] = useState([]); // Store SharePoint data

  // Fetch data from SharePoint
  const fetchSharePointData = async () => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const response = await fetch(
        "https://your-tenant-name.sharepoint.com/_api/web/lists/getbytitle('Rajpoot')/items",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use access token
            Accept: "application/json;odata=verbose",
          },
        }
      );

      const data = await response.json();
      console.log("SharePoint List Items:", data);
      setSharePointData(data.d.results); // Store the SharePoint list items in state
    } catch (error) {
      console.error("Error fetching SharePoint data:", error);
    }
  };

  return (
    <div>
      <h1>SharePoint Integration App</h1>

      {/* If user is not logged in, show login button */}
      {!user && <button onClick={login}>Login to SharePoint</button>}

      {/* If user is logged in, show logout button and user info */}
      {user && (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={logout}>Logout</button>
          <p>Your Access Token: {accessToken}</p>

          {/* Button to fetch SharePoint data */}
          <button onClick={fetchSharePointData}>Fetch SharePoint Data</button>

          {/* Display fetched SharePoint data */}
          <div>
            {sharePointData.length > 0 ? (
              <ul>
                {sharePointData.map((item) => (
                  <li key={item.Id}>{item.Title}</li>
                ))}
              </ul>
            ) : (
              <p>No data fetched yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
