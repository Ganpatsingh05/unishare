"use client"
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../lib/api";
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setUser(user);
        console.log("User : ",user);
      } catch (err) {
        console.log("No user logged in");
      }
    };
    getUser();
  }, []);

  return (
    <header>
      <h1>UniShare</h1>

      {user ? (
        <div>
          <Image
            src={user.picture}
            alt={user.name}
            width={40}
            height={40}
          />
          <span>{user.name}</span>
          <br></br>
          <span>{user.email}</span>
        </div>
      ) : (
        <span>Guest</span>
      )}
    </header>
  );
}