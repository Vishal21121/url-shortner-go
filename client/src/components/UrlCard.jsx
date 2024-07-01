import { CloudFog, Copy, Link } from "lucide-react";
import React from "react";
import QRCode from "react-qr-code";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function UrlCard({ aliase, redirectUrl, shortUrl, createdAt }) {
  const date = new Date(createdAt);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return (
    <div className="p-2 bg-gray-800 flex gap-4 rounded-lg justify-between">
      <div className="flex gap-4">
        <div className="ring-2 ring-blue-500 w-32">
          <QRCode
            style={{ height: "100%", maxWidth: "100%", width: "100%" }}
            value={redirectUrl}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div>
          <p className="text-3xl font-bold">{aliase}</p>
          <p className="text-lg text-blue-400">{shortUrl}</p>
          <div className="flex gap-1">
            <Link className="w-4" />
            <p>{redirectUrl}</p>
          </div>
          <p>{formattedDate}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Copy
                  onClick={async () => {
                    console.log("hey");
                    await navigator.clipboard.writeText(shortUrl);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default UrlCard;
