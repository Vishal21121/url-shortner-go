import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { useUrlContext } from "@/context/urlContext";
import QRCode from "react-qr-code";
import LineGraph from "@/components/LineGraph";
import PieGraph from "@/components/PieGraph";

function LinkPage() {
  const { urlId } = useParams();
  const [url, setUrl] = useState();
  const { urls } = useUrlContext();
  const [date, setDate] = useState();
  const [clicksData, setClicksData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [clicksCount, setClicksCount] = useState(0);
  const navigate = useNavigate();

  function findUrl(urlId) {
    console.log("urlId", urlId);
    let foundUrl = urls?.find((el) => el._id === urlId);
    setUrl(foundUrl);
    const date = new Date(foundUrl?.createdAt);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    setDate(formattedDate);
    fetchClicks(foundUrl?.aliase);
  }

  const createLineDataFormat = (rawData) => {
    const LineResult = [];
    const barResult = [];
    rawData?.map((root) => {
      let index = LineResult.findIndex((el) => el.city === root.city);
      let barIndex = barResult.findIndex(
        (el) => el.deviceType === root.deviceType
      );
      if (index !== -1) {
        LineResult[index]["count"] = LineResult[index]["count"] + 1;
      } else {
        LineResult.push({ city: root.city, count: 1 });
      }
      if (barIndex !== -1) {
        barResult[barIndex]["count"] = barResult[barIndex]["count"] + 1;
      } else {
        barResult.push({ deviceType: root.deviceType, count: 1 });
      }
    });
    console.log("barResult", barResult);
    setLineChartData(LineResult);
    setBarChartData(barResult);
  };

  const fetchClicks = async (aliase) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/click/get?aliase=${aliase}`
      );
      const data = await response.json();
      console.log("clicks", data.data.data);
      if (data.data.data) {
        setClicksCount(data.data.data.length);
      }
      setClicksData(data.data.data);
      createLineDataFormat(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findUrl(urlId);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <header className="w-full">
        <nav className="flex w-full items-center p-2 bg-gray-800">
          <p className="text-xl font-bold">Url Shortner</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="absolute right-10 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuLabel className="text-center text-lg">
                User
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem
                  value="top"
                  className="cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <div className="flex gap-2 items-center">
                    <Link className="w-4" />
                    <p className=""> My links</p>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="bottom"
                  className="cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <LogOut className="w-4 text-red-500" />
                    <p className="text-red-500">Logout</p>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      {url && (
        <div className="flex gap-16 justify-center w-full p-8 h-full">
          <div className="p-8 w-3/4 h-full">
            <div className="flex">
              <div className="flex flex-col gap-4">
                <p className="text-4xl font-bold">{url?.aliase}</p>
                <p className="text-3xl text-blue-300">{url?.shortUrl}</p>
                <div className="flex items-center gap-1">
                  <Link className="w-4" />
                  <p className="text-xl">{url?.redirectUrl}</p>
                </div>
                <p>{url && date}</p>
              </div>
              <div></div>
            </div>
            <div className="w-1/2 mt-4">
              <QRCode
                style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                value={url?.redirectUrl}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-8 ">
            <p className="text-4xl font-bold">Stats</p>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-3xl font-semibold">Total Clicks</p>
              <p className="text-2xl font-bold ml-8">{clicksCount}</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">Location Data</p>
              <LineGraph data={lineChartData} />
            </div>
            <div>
              <p className="text-4xl font-semibold">Device Data</p>
              <PieGraph data={barChartData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkPage;
