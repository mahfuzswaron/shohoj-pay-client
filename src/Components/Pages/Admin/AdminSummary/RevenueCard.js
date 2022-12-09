import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RevenueCard = () => {
  const date = new Date().toLocaleDateString("en-us", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [shohojPayInfo, setShohojPayInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const loadRevenue = async () => {
    try {
      setInfoLoading(true);
      fetch("https://shohoj-pay-server.onrender.com/getShohojPayInfo", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setShohojPayInfo(data);
          setInfoLoading(false);
        });
    } catch (error) {
      toast.error(error.message);
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  return (
    <div className="px-2">
      <div className="lg:px-12 md:px-12 py-8 ">
        <h4 className="mb-5 text-xl ml-2">Total Revenue</h4>
        {!infoLoading ? (
          <h1 className="lg:text-6xl md:text-6xl text-5xl font-medium">
            ${shohojPayInfo?.revenue}
          </h1>
        ) : (
          <h1 className="lg:text-6xl md:text-6xl text-5xl font-medium">
            Loading...
          </h1>
        )}
        <div className="mt-6 ml-2 flex justify-between">
          <p className="">{date}</p>
          <button
            onClick={() => loadRevenue()}
            class={`btn btn-xs btn-ghost btn-primary ${infoLoading && "loading"
              }`}
          >
            Reload Revenue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
