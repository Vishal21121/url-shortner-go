import React, { useState } from "react";
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

function LinkPage() {
  const [position, setPosition] = useState("bottom");
  return (
    <div>
      <header>
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
                <DropdownMenuRadioItem value="top" className="cursor-pointer">
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
    </div>
  );
}

export default LinkPage;
