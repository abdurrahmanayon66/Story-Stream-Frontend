import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="bg-lightPink grid-cols-12 grid py-4 items-center px-20 justify-between">
      <h1 className="col-span-3 text-3xl font-bold text-darkPurple">StoryStream</h1>
      <ul className="col-span-6 flex justify-evenly text-base font-medium text-darkPurple">
        <li>Home</li>
        <li>Explore</li>
        <li>My Blogs</li>
      </ul>
      <div className="col-span-3 flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger><Image alt="profile picture" src="https://github.com/shadcn.png" className="size-10 hover:cursor-pointer rounded-full ring-2 ring-purple-700" width={30} height={30}/></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
