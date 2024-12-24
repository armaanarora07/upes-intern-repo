import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve authToken from localStorage

      if (!token) {
        setErrorMessage("You need to log in first."); // Handle case where user is not logged in
        return;
      }

      try {
        const response = await axios.get("YOUR_API_ENDPOINT_HERE", {
          headers: {
            Authorization: `Bearer ${token}`, // Include authToken in the headers
          },
        });

        setData(response.data); // Set data to state
      } catch (error) {
        setErrorMessage("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Render the fetched data here */}
      {data ? (
        <div>
          {/* Example rendering of data */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
