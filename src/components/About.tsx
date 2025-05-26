import React from "react";
import ImageGallery from "./ImageGallery";

const About = () => {
  return (
    <div className="grid grid-cols-12">
      <section className="col-span-4">
        <p className="text-4xl text-darkPurple font-semibold">
          Discover Knowledge & Inspiration with StoryStream's Categories
        </p>
      </section>
      <section className="col-span-8">
        <ImageGallery/>
      </section>
    </div>
  );
};

export default About;
