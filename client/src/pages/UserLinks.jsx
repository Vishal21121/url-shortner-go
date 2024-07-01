import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import UrlCard from "@/components/UrlCard";
import { useUrlContext } from "@/context/urlContext";
import { useUserContext } from "@/context/userContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function UserLinks() {
  const { fetchUrls, urls, createUrl } = useUrlContext();
  const { user } = useUserContext();
  const [inputBox, setInputBox] = useState("");
  const [localUrls, setLocalUrls] = useState(null);

  const urlFormSchema = z.object({
    aliase: z.string({ required_error: "Please provide aliase" }),
    url: z.string({ required_error: "Please provide url" }),
  });

  const urlForm = useForm({
    resolver: zodResolver(urlFormSchema),
  });

  const handleUrlForm = (value) => {
    createUrl({
      aliase: value.aliase,
      redirectUrl: value.url,
      userId: user.data.data._id,
    });
    urlForm.reset({
      aliase: "",
      url: "",
    });
  };

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
    setLocalUrls(urls);
    console.log(user);
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex w-full justify-center gap-4">
        <div className="w-1/2 p-4 border rounded-lg">
          <p className="text-xl">Links Created</p>
          <p className="text-lg">{urls && urls?.length}</p>
        </div>
        <div className="w-1/2 p-4 border rounded-lg">
          <p className="text-xl">Total Clicks</p>
          <p className="text-lg">0</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-between">
          <p className="text-3xl font-bold">My links</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <Form {...urlForm}>
                <form
                  onSubmit={urlForm.handleSubmit(handleUrlForm)}
                  className="space-y-4"
                >
                  <FormField
                    control={urlForm.control}
                    name="aliase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aliase</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Aliase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your Url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
        {(localUrls ? localUrls : urls) &&
          (localUrls ? localUrls : urls).map(
            ({ _id, aliase, redirectUrl, shortUrl, createdAt }) => (
              <UrlCard
                key={_id}
                aliase={aliase}
                redirectUrl={redirectUrl}
                shortUrl={shortUrl}
                createdAt={createdAt}
              />
            )
          )}
      </div>
    </div>
  );
}

export default UserLinks;
