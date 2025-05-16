import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../config/firebase";
import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa";

interface Link {
  name: string;
  url: string;
  icon?: string;
}

interface Props {
  userId: string;
}

const UsefulLinks: React.FC<Props> = ({ userId }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState<Link>({ name: "", url: "", icon: "" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const db = getFirestore(app);
  const { t , i18n } = useTranslation("global");

  useEffect(() => {
    const fetchLinks = async () => {
      if (!userId) return;
      const userRef = doc(db, "hcc_ai_users", userId);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      if (data?.useful_links) {
        setLinks(data.useful_links);
      }
    };
    fetchLinks();
  }, [userId]);

  const saveLinksToFirestore = async (updatedLinks: Link[]) => {
    const userRef = doc(db, "hcc_ai_users", userId);
    await updateDoc(userRef, { useful_links: updatedLinks });
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
    await saveLinksToFirestore(updated);
  };

  const removeLink = async (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    await saveLinksToFirestore(updated);
  };

return (
  <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
      {t("links.title")}
    </h3>

    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <input
        type="text"
        placeholder={t("links.name_placeholder")}
        value={newLink.name}
        onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full md:w-1/4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      />
      <input
        type="url"
        placeholder={t("links.url_placeholder")}
        value={newLink.url}
        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full md:w-2/4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      />

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleIconUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
        >
          <FaUpload className="mr-2" />
          {t("links.upload_icon")}
        </button>
        {newLink.icon && (
          <img
            src={newLink.icon}
            alt="preview"
            className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 object-cover"
          />
        )}
      </div>

      <button
        onClick={addLink}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        {t("links.add")}
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link, index) => (
        <div
          key={index}
          className="p-4 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex flex-col items-center text-center"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-blue-400 font-semibold hover:underline flex flex-col items-center"
          >
            <span className="mb-2">{link.name}</span>
            {link.icon && (
              <img
                src={link.icon}
                alt={link.name}
                className="w-32 h-32 object-contain rounded border border-gray-300 dark:border-gray-600 hover:scale-105 transition"
              />
            )}
          </a>
          <button
            onClick={() => removeLink(index)}
            className="mt-2 text-red-500 text-sm hover:underline"
          >
            {t("links.remove")}
          </button>
        </div>
      ))}
    </div>
  </div>
);

};

export default UsefulLinks;
