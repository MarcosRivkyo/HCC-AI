import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../config/firebase";

interface Link {
  name: string;
  url: string;
  icon?: string;
}

interface Props {
  userId: string; // UID del usuario autenticado
}

const UsefulLinks: React.FC<Props> = ({ userId }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState<Link>({ name: "", url: "", icon: "" });
  const db = getFirestore(app);

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
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Enlaces útiles</h3>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Nombre del enlace"
          value={newLink.name}
          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
          className="border p-2 rounded w-full md:w-1/4"
        />
        <input
          type="url"
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="border p-2 rounded w-full md:w-2/4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleIconUpload}
          className="w-full md:w-auto"
        />
        <button
          onClick={addLink}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Añadir
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 rounded hover:bg-gray-200 transition flex flex-col items-center text-center"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline flex flex-col items-center"
            >
              <span className="mb-2">{link.name}</span>
              {link.icon && (
                <img
                  src={link.icon}
                  alt={link.name}
                  className="w-32 h-32 object-contain rounded border border-gray-300 hover:scale-105 transition"
                />
              )}
            </a>
            <button
              onClick={() => removeLink(index)}
              className="mt-2 text-red-500 text-sm hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;
