// src/viewmodels/useImageCarouselViewModel.ts

import { useEffect, useState } from "react";
import { FileDAO } from "../data/dao/FileDAO";

export const useImageCarouselViewModel = () => {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const user: any = await FileDAO.getCurrentUser();
      if (!user) return setLoading(false);

      const folder = `HCC-AI/users/${user.uid}/images/masks`;
      const files = await FileDAO.listFiles(folder);
      const urls = files.map((f) => f.url);
      setImagenes(urls);
      setLoading(false);
    };

    fetchImages();
  }, []);

  return {
    imagenes,
    loading,
  };
};
