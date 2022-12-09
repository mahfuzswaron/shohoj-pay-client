import { useEffect, useState } from "react";

const useUser = (user) => {
  const [mongoUser, setMongoUser] = useState(null);
  const [mongoUserLoading, setMongoUserLoading] = useState(false);

  useEffect(() => {
    const email = user?.user?.email || user?.email;
    if (email) {
      setMongoUserLoading(true);
      fetch("https://shohoj-pay-server.onrender.com/getUserInfo", {
        method: "GET",
        headers: {
          email,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMongoUser(data);
          setMongoUserLoading(false);
        });
    }
  }, [user]);

  return [mongoUser, mongoUserLoading];
};

export default useUser;
