"use client"
import { useEffect, useState } from "react";
import { fetchCurrentUser, fetchhousedata } from "../lib/api";
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState(null);
  const [housedata, setHouse] = useState([]);

 useEffect(() => {
  const getData = async () => {
    try {
      const userRes = await fetchCurrentUser();
      const houseRes = await fetchhousedata();

      setUser(userRes);

      if (houseRes && houseRes.data) {
        setHouse(houseRes.data); // safe access
        console.log("House data:", houseRes.data);
      } else {
        console.warn("House data not available", houseRes);
        setHouse([]); // fallback to empty array
      }

      console.log("User:", userRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setHouse([]); // fallback
    }
  };
  getData();
}, []);


  return (
    <div>
      <h1>Welcome {user ? user.name : "Guest"}</h1>

      {housedata.length > 0 ? (
        <div>
          {housedata.map(room => (
            <div key={room.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{room.title}</h3>
              <p>{room.description}</p>
              <p>Rent: ₹{room.rent}</p>
              <p>Location: {room.location}</p>
              {room.photos && room.photos.length > 0 && (
                <Image src={room.photos[0]} width={200} height={150} alt={room.title} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms found.</p>
      )}
    </div>
  );
}
