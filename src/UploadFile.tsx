import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config/firebase.ts";

const UploadFile: React.FC = () => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const uploadFile = () => {
    if (!imageUpload) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(imageUpload.type)) {
      alert("Solo se permiten imágenes PNG o JPG.");
      return;
    }

    const imageRef = ref(storage, `HCC-AI/images/${imageUpload.name}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        setImageUrl(url);
        alert("Imagen subida correctamente");
        console.log("URL de la imagen:", url);
      })
      .catch((error) => {
        console.error("Error al subir la imagen:", error);
      });
  };

  return (
    <div className="App">
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={(event) => {
          if (event.target.files && event.target.files[0]) {
            setImageUpload(event.target.files[0]);
          }
        }}
      />
      <button onClick={uploadFile}>Subir imagen</button>
    </div>
  );
};

export default UploadFile;
