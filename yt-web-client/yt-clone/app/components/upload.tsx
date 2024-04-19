"use client";

import React, { Fragment, useState } from "react";
import { uploadVideo } from "../firebase/functions";

export default function Upload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await uploadVideo(file);
      alert("File uploaded successfully!");
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      // TODO add additional error handling here (max file size, valid file types, etc)
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
        disabled={uploading}
      />
      <label
        htmlFor="upload"
        className={`inline-block border border-gray-400 text-blue-600 px-5 py-2 rounded-full font-roboto text-sm font-medium ${
          uploading ? "cursor-not-allowed" : "cursor-pointer"
        } hover:bg-blue-200 hover:border-transparent`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </label>
    </Fragment>
  );
}
