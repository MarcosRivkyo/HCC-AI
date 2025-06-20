// src/viewmodels/useAppNavbarViewModel.ts
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";
import { UserDAO } from "../data/dao/UserDAO";

export const useAppNavbarViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string>("home");
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = AuthDAO.subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const data = await UserDAO.getUserById(currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSelectedSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.6 },
    );

    const sectionIds = ["home", "objectives", "services", "technology"];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  const scrollToSection = (id: string) => {
    setSelectedSection(id);
    const target = document.getElementById(id);
    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ease = easeInOutCubic(Math.min(progress / duration, 1));
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return {
    user,
    userData,
    selectedSection,
    isOpen,
    setIsOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    dropdownRef,
    navigate,
    scrollToSection,
  };
};
