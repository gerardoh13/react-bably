import React, { useEffect } from "react";

function ImageUpload({ uploadSuccess }) {
  useEffect(() => {
    const cloudName = "dolnu62zm"; // replace with your own cloud name
    const uploadPreset = "yssxueby"; // replace with your own upload preset
    //   https://cloudinary.com/documentation/upload_widget_reference

    const myWidget = window.cloudinary.createUploadWidget(
      { 
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        sources: ["local", "facebook", "instagram", "camera"], // restrict the upload sources to URL and local files
        multiple: false, //restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        context: { alt: "user_uploaded" }, //add the given context data to the uploaded files
        clientAllowedFormats: ["jpg"], //restrict uploading to image files only
        maxImageFileSize: 4000000, //restrict file size to less than 4MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
            uploadSuccess(error, result);
            myWidget.hide();
          } 
      }
    );
    document.getElementById("upload_widget").addEventListener(
      "click",
      function () {
        myWidget.open();
      },
      false
    );
  }, [uploadSuccess]);

  return (
    <button id="upload_widget" className="btn btn-primary">
      Upload
    </button>
  );
}

export default ImageUpload;
