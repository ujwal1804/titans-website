"use client";

import { createContext, useContext, useState, useEffect } from "react";
import GetStartedModal from "@/app/components/GetStartedModal";

const GetStartedContext = createContext();

export function GetStartedProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if form was already submitted
    const submitted = localStorage.getItem("getStartedFormSubmitted");
    if (submitted === "true") {
      setHasSubmitted(true);
    }
  }, []);

  const openModal = () => {
    // If already submitted, redirect directly
    if (hasSubmitted) {
      window.open("https://my.dooprime.com/register/?lid=54744&pid=704210", "_blank");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setHasSubmitted(true);
  };

  return (
    <GetStartedContext.Provider value={{ openModal, closeModal, hasSubmitted }}>
      {children}
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </GetStartedContext.Provider>
  );
}

export function useGetStarted() {
  const context = useContext(GetStartedContext);
  if (!context) {
    throw new Error("useGetStarted must be used within GetStartedProvider");
  }
  return context;
}

