import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineGraph({ data }) {
  return (
    <>
      {data && data.length > 0 ? (
        <div className="w-3/4 h-72 mt-8 border">
          <ResponsiveContainer>
            <LineChart width={700} height={300} data={data}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip labelStyle={{ color: "green" }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
