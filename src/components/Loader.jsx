import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#8F659A"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
