import React from "react";
import Image from "next/image";
import images from "../assets/images";

interface Category {
  name: string;
  imageUrl: string;
  colSpan: string;
  rowSpan: string;
}

const categories: Category[] = [
  {
    name: "Education",
    imageUrl: images.education,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Environment",
    imageUrl: images.environment,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Business",
    imageUrl: images.business,
    colSpan: "col-span-1",
    rowSpan: "row-span-3",
  },
  {
    name: "Lifestyle",
    imageUrl: images.lifestyle,
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    name: "Medical Science",
    imageUrl: images.medical,
    colSpan: "col-span-1",
    rowSpan: "row-span-2",
  },
  {
    name: "Leadership",
    imageUrl: images.leadership,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Technology",
    imageUrl: images.technology,
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    name: "Fashion",
    imageUrl: images.fashion,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Art",
    imageUrl: images.education,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Sports",
    imageUrl: images.leadership,
    colSpan: "col-span-1",
    rowSpan: "row-span-2",
  },
  {
    name: "Travel",
    imageUrl: images.lifestyle,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    name: "Food",
    imageUrl: images.food,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
];

const ImageGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-md shadow-lg ${category.colSpan} ${category.rowSpan} group`}
          style={{
            gridRowEnd: `span ${category.rowSpan === "row-span-2" ? 2 : 1}`,
          }}
        >
          <Image
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover absolute transition-transform duration-300 group-hover:scale-150"
          />
          <div className="absolute inset-0 bg-black opacity-15"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {category.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
