import React from "react";

function ImageUpload({ uploadSuccess }) {
  //   https://cloudinary.com/documentation/upload_widget_reference

    const cloudName = "dolnu62zm";
    const uploadPreset = "yssxueby";

    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName, 
        uploadPreset: uploadPreset,
        cropping: true,
        sources: ["local", "facebook", "instagram", "camera"],
        multiple: false,
        context: { alt: "user_uploaded" },
        clientAllowedFormats: ["jpg"],
        maxImageFileSize: 4000000,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          uploadSuccess(error, result);
          myWidget.close();
        }
      }
    );

    // document.getElementById("upload_widget").addEventListener(
    //   "click",
    //   function () {
    //     myWidget.open();
    //   },
    //   false
    // );

  return (
    <>
      <button id="upload_widget" className="btn bablyBlue" type="button" onClick={() => myWidget.open()}>
        Upload
      </button>
    </>
  );
}

export default ImageUpload;
