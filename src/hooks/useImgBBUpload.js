import { useState } from "react";
import axios from "axios";
import { imgbbAPI } from "config/apiConfig";

export default function useImgBBUpload(setValue, getValues) {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setProgress(0);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios({
        method: "post",
        url: imgbbAPI,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      const imageUrl = response.data.data.url;
      setImage(imageUrl);
      setValue("image", imageUrl);
      setProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      setProgress(0);
    }
  };

  const handleDeleteImage = () => {
    setImage("");
    setValue("image", "");
    setProgress(0);
  };

  const handleResetUpload = () => {
    setImage("");
    setValue("image", "");
    setProgress(0);
  };

  return {
    image,
    setImage,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  };
}