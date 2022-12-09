import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Spinner from "../../../Shared/Spinner/Spinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const Statistic = ({ user }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(
      `https://shohoj-pay-server.onrender.com/get-transaction-amount-by-type/${user?.email}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  if (!data) return <Spinner />;
  return (
    <div className="rounded-lg w-full p-10">
      <div className="flex justify-between items-center w-full">
        <h4 className="text-2xl font-semibold">Statistic</h4>
      </div>

      <div className="flex items-center">
        {/* chart */}
        <div className="w-[220px] md:w-72 lg:w-72 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx={120}
                cy={140}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* titles */}
        <div>
          <ul>
            {data.map((d, i) => (
              <li
                key={d.name}
                className="flex items-center space-x-4 lg:space-x-8 md:space-x-8 my-4"
              >
                <div
                  style={{ backgroundColor: d.color }}
                  className={`w-3 h-3 rounded-full`}
                ></div>
                <div>
                  <p className="text-xl font-medium">{d.value}</p>
                  <small className="text-gray-400">{d.name}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
