import React, { useState, useEffect } from "react";

const GeoLocation = () => {
  const [geoInfo, setGeoInfo] = useState({});

  console.log(geoInfo);

  useEffect(() => {
    const fetchGeoInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip", {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          }
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGeoInfo(data);
      } catch (error) {
        console.error("Error fetching geo information:", error);
        setGeoInfo({ error: "Unable to fetch geo information" });
      }
    };

    fetchGeoInfo();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <div>
      <h2>Your Geographic Information:</h2>
      {geoInfo && (
        <div>
          <p>IP Address: {geoInfo.ip}</p>
          <p>City: {geoInfo.city}</p>
          <p>Region: {geoInfo.region}</p>
          <p>Country: {geoInfo.country}</p>
          <p>Latitude: {geoInfo.latitude}</p>
          <p>Longitude: {geoInfo.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default GeoLocation;
