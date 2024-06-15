import React, { useState, useEffect } from "react";
import GeoLocation from "./geolocation";

const Home = () => {
  const [userIpInfo, setUserIpInfo] = useState(null);

  useEffect(() => {
    // Fetch logged-in user's IP information from Node.js backend
    const fetchUserIpInfo = async () => {
      try {
        const response = await fetch("/api/user/ip");
        if (response.ok) {
          const data = await response.json();
          setUserIpInfo(data);
        } else {
          console.error("Failed to fetch user IP info");
        }
      } catch (error) {
        console.error("Error fetching user IP info:", error);
      }
    };

    fetchUserIpInfo();
  }, []);

  return <div><GeoLocation /></div>;
};

export default Home;
