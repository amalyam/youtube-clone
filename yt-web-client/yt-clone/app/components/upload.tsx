"use client";

import React, { Fragment } from "react";
import { uploadVideo } from "../firebase/functions";

export default function Upload() {
  const handleUpload = async (file: File) => {
    try {
      const response = await uploadVideo(file);
      alert(
        `File uploaded successfully. Response: ${JSON.stringify(response)}`
      );
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      // wrapper for error handling
      handleUpload(file);
    }
  };

  return (
    <Fragment>
      <input
        id="upload"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="sr-only"
      />
      <label
        htmlFor="upload"
        className="inline-block border border-gray-400 text-blue-600 px-5 py-2 rounded-full font-roboto text-sm font-medium cursor-pointer hover:bg-blue-200 hover:border-transparent"
      >
        Upload
      </label>
    </Fragment>
  );
}
