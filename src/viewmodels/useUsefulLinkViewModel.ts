// ViewModel: useUsefulLinksViewModel.ts
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { UserDAO } from "../data/dao/UserDAO";

export interface Link {
  name: string;
  url: string;
  icon?: string;
}

export const useUsefulLinksViewModel = (userId: string) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState<Link>({ name: "", url: "", icon: "" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      if (!userId) return;
      const fetchedLinks = await UserDAO.getUserLinks(userId);
      if (fetchedLinks) {
        setLinks(fetchedLinks);
      }
    };
    fetchLinks();
  }, [userId]);

  const saveLinks = async (updatedLinks: Link[]) => {
    await UserDAO.updateUserLinks(userId, updatedLinks);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewLink({ ...newLink, icon: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addLink = async () => {
    if (!newLink.name || !newLink.url) return;
    const updated = [...links, newLink];
    setLinks(updated);
    setNewLink({ name: "", url: "", icon: "" });
    await saveLinks(updated);
  };

  const removeLink = async (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    await saveLinks(updated);
  };

  return {
    links,
    newLink,
    setNewLink,
    addLink,
    removeLink,
    handleIconUpload,
    fileInputRef,
  };
};
