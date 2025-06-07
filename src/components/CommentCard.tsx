import { Pi } from "lucide-react";
import Image from "next/image";
import React from "react";
import { PiChatCircleLight, PiHeartStraight } from "react-icons/pi";

const CommentCard = () => {
  return (
    <div className="space-y-2">
      <section>
        <div className="flex gap-x-3">
          <div>
            <Image
              src={"https://github.com/shadcn.png"}
              alt="123"
              width={80}
              height={80}
              className="md:w-[40px] md:h-[40px] object-cover rounded-full"
            />
          </div>
          <div className="grid grid-rows-2 text-sm">
            <span className="text-gray-700 font-medium">Abdur Rahman Ayon</span>
            <span className="text-gray-700 text-xs">2 days ago</span>
          </div>
        </div>
      </section>
      <section>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae fuga
          soluta, odio velit deserunt sint impedit nihil beatae quam, maxime,
          molestias iusto ratione incidunt qui natus. Quibusdam consequuntur
          porro distinctio! Necessitatibus itaque hic blanditiis earum provident
          voluptatem eaque pariatur, assumenda, consectetur aperiam voluptates
          consequatur? Voluptates, numquam suscipit blanditiis quam deleniti
          magni eveniet veniam quidem maiores similique omnis tempore, rerum
          velit!
        </p>
      </section>
      <section className="flex gap-x-6 text-gray-500 text-sm">
        <div className="flex gap-x-1 items-center">
          <span className="hover:cursor-pointer"><PiHeartStraight /></span>
          <span>2</span>
        </div>
        <div className="flex gap-x-1 items-center hover:cursor-pointer">
          <span><PiChatCircleLight /></span>
          <span>3 replies</span>
        </div>
        <div><button className="text-gray-800 hover:cursor-pointer">Reply</button></div>
      </section>
    </div>
  );
};

export default CommentCard;
