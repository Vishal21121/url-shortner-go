import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const data02 = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
  { name: "B5", value: 50 },
  { name: "C1", value: 100 },
  { name: "C2", value: 200 },
  { name: "D1", value: 150 },
  { name: "D2", value: 50 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PieGraph({ data }) {
  return (
    <div className="w-3/4 h-72 mt-8">
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={data}
            dataKey="count"
            labelLine={false}
            label={({ deviceType, percent }) =>
              `${deviceType}:${(percent * 100).toFixed(0)}%`
            }
          >
            {data &&
              data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
