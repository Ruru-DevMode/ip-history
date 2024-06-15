import React, { useState, useEffect } from "react";

const GeoLocation = () => {
  const [geoInfo, setGeoInfo] = useState({});
  const [ipAddress, setIpAddress] = useState("");
  const [searchIp, setSearchIp] = useState("");

  const fetchGeoInfo = async (ip) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ip?ip=${ip}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
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

  useEffect(() => {
    fetchGeoInfo("");
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchIp(ipAddress);
    fetchGeoInfo(ipAddress);
  };

  return (
    <div>
      <h2>Your Geographic Information:</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter IP address"
        />
        <button type="submit">Search</button>
      </form>
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
