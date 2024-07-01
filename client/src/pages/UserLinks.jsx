import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudFog, Filter } from "lucide-react";
import UrlCard from "@/components/UrlCard";
import { useUrlContext } from "@/context/urlContext";
import { useUserContext } from "@/context/userContext";

function UserLinks() {
  const { fetchUrls, urls } = useUrlContext();
  const { user } = useUserContext();
  const [inputBox, setInputBox] = useState("");
  const [localUrls, setLocalUrls] = useState(urls);

  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const filterUrls = debounce((inputText) => {
    if (inputText) {
      setLocalUrls(urls.filter((el) => el.aliase.startsWith(inputText)));
    } else {
      setLocalUrls(urls);
    }
  }, 500);

  useEffect(() => {
    fetchUrls(user.data.data._id);
    console.log(user);
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex w-full justify-center gap-4">
        <div className="w-1/2 p-4 border rounded-lg">
          <p className="text-xl">Links Created</p>
          <p className="text-lg">1</p>
        </div>
        <div className="w-1/2 p-4 border rounded-lg">
          <p className="text-xl">Total Clicks</p>
          <p className="text-lg">1</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-between">
          <p className="text-3xl font-bold">My links</p>
          <Button>Create New Link</Button>
        </div>
        <div className="flex w-full gap-4 items-center focus-within:ring-2 focus-within:ring-blue-400 bg-background rounded-lg p-2 border">
          <input
            type="text"
            className="bg-background w-[99%] focus:outline-none"
            placeholder="filter Links..."
            value={inputBox}
            onChange={(e) => {
              filterUrls(e.target.value);
              setInputBox(e.target.value);
            }}
          />
          <Filter />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {localUrls &&
          localUrls.map(({ _id, aliase, redirectUrl, shortUrl, createdAt }) => (
            <UrlCard
              key={_id}
              aliase={aliase}
              redirectUrl={redirectUrl}
              shortUrl={shortUrl}
              createdAt={createdAt}
            />
          ))}
      </div>
    </div>
  );
}

export default UserLinks;
