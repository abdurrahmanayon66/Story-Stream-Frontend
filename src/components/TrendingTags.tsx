import React from "react";
import Tag from "./Tag";

const TrendingTags = () => {
  return (
    <div>
      <h1 className="text-gray-800 font-bold">Trending Tags</h1>
      <div className="flex flex-wrap gap-x-2 gap-y-4 my-4">
        <Tag label={"React"} />
      </div>
    </div>
  );
};

export default TrendingTags;
