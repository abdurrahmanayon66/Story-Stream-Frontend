import React from 'react';

type TagProps = {
  label: string;
};

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="bg-customNeutral text-darkPurple font-medium px-2 py-1 text-sm rounded-md">
      {label}
    </span>
  );
};

export default Tag;
