import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function Button(props) {
  return (
    <button
      {...props}
      class="block w-full rounded-md border border-transparent px-5 py-3 bg-blue-500 text-base font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-10"
    >
      {props?.loading === true ? (
        <ClipLoader color="white" size={20} />
      ) : (
        props?.title
      )}
    </button>
  );
}
