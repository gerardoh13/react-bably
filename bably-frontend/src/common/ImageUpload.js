import React, { useEffect, useState, useRef } from "react";

function ImageUpload({ uploadSuccess, setUrl, formKey }) {
  //   https://cloudinary.com/documentation/upload_widget_reference
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);
  const widgetRef = useRef();

  const cloudName = "dolnu62zm";
  const uploadPreset = "yssxueby";

  useEffect(() => {
    if (!cloudinaryWidget) {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          cropping: true,
          sources: ["local", "facebook", "instagram", "camera"],
          multiple: false,
          context: { alt: "user_uploaded" },
          clientAllowedFormats: ["jpg", "HEIF"],
          maxImageFileSize: 5000000,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            uploadSuccess(error, result);
            myWidget.close();
          }
        }
      );
      setCloudinaryWidget(myWidget);
      widgetRef.current = myWidget;
    }
  }, [cloudinaryWidget, formKey, setUrl, uploadSuccess]);

  const openWidget = () => {
    // Access the widget instance from the ref and open it
    widgetRef.current.open();
  };

  return (
    <>
      <button className="btn btn-bablyBlue" type="button" onClick={openWidget}>
        Upload
      </button>
    </>
  );
}

export default ImageUpload;
