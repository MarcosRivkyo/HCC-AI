import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import NavbarSecond from "../Components/InsideNavbar";
import ProfileModal from "../Components/ProfileModal";
import Assistant from "./AssistantView";
import SettingsModal from "../Components/SettingsModal";
import usePreventZoom from "../Components/usePreventZoom";
import { useModelsViewModel } from "../../viewmodels/useModelsViewModel";
import { ModelData } from "../../models/AiModels";
import Footer from "../Components/InsideFooter";

const Models = () => {
  const {
    user,
    userData,
    models,
    isProfileOpen,
    setIsProfileOpen,
    showAssistant,
    setShowAssistant,
    hoveredModelId,
    setHoveredModelId,
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    scale,
    setScale,
    highContrast,
    setHighContrast,
  } = useModelsViewModel();
  const { t, i18n } = useTranslation("global");

  usePreventZoom(true, true);

  useEffect(() => {
    document.documentElement.style.setProperty("zoom", scale.toString());
  }, [scale]);

  const renderModelCards = (filteredModels: ModelData[]) =>
    filteredModels.length === 0 ? null : (
      <div className="flex flex-col items-center gap-6">
        {filteredModels.map((model, index) => {
          const cleanModelId = model.modelId.trim();
          const isHovered = hoveredModelId === cleanModelId;
          const isGemini = model.modelId === "gemini-1.5-pro";
          const accuracy = Number(model.accuracy);
          const formattedAccuracy = isNaN(accuracy)
            ? "N/A"
            : `${(accuracy * 100).toFixed(2)}%`;

          return (
            <motion.div
              key={model.modelId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredModelId(model.modelId)}
              onMouseLeave={() => setHoveredModelId(null)}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-blue-700 mt-1 dark:text-blue-300">
                  {model.modelName}
                </h2>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {model.modelId === "sJNL0uZfOclYDPsLVavU"
                  ? t("models.metavir_ai_description")
                  : model.modelId === "2eq0qaAR4C3lHabTxp9z"
                    ? t("models.hcc_ai_description")
                    : model.modelId === "nbiJGYKysFXTCeONkSvv"
                      ? t("models.segmentator_ai_description")
                      : model.description}
              </p>

              {isGemini ? (
                <div className="text-sm text-gray-700 dark:text-white mt-4 space-y-1">
                  <p>
                    <strong>{t("models.application")}:</strong>{" "}
                    {t("models.application_value")}
                  </p>
                  <p>
                    <strong>{t("models.optimization")}:</strong>{" "}
                    {t("models.optimization_value")}
                  </p>
                  <p>
                    <strong>{t("models.provider")}:</strong> Google
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm text-gray-700 dark:text-white mt-4">
                  <div>
                    <p>
                      <strong>{t("models.accuracy")}</strong>{" "}
                      <span className="text-green-600  font-semibold">
                        {formattedAccuracy}
                      </span>
                    </p>
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        {model.modelId}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-white">
                      {t("models.trained_on")}
                    </p>
                    <p className="text-sm font-medium dark:text-white">
                      {model.trainDate?.seconds
                        ? new Date(
                            model.trainDate.seconds * 1000,
                          ).toLocaleDateString(i18n.language, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : t("models.no_date")}
                    </p>
                  </div>
                </div>
              )}

              {isHovered && model.modelId === "sJNL0uZfOclYDPsLVavU" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-4"
                >
                  <div>
                    <p className="font-semibold mb-1">
                      {t("models.metavir_title")}:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-100 list-disc pl-4">
                      <li>
                        <strong>F0:</strong> {t("models.metavir.f0")}
                      </li>
                      <li>
                        <strong>F1:</strong> {t("models.metavir.f1")}
                      </li>
                      <li>
                        <strong>F2:</strong> {t("models.metavir.f2")}
                      </li>
                      <li>
                        <strong>F3:</strong> {t("models.metavir.f3")}
                      </li>
                      <li>
                        <strong>F4:</strong> {t("models.metavir.f4")}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      {t("models.submodels.title")}:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-100">
                      <li>
                        <strong>ResNet:</strong> {t("models.submodels.resnet")}
                      </li>
                      <li>
                        <strong>VGG:</strong> {t("models.submodels.vgg")}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {isHovered && model.modelId === "nbiJGYKysFXTCeONkSvv" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-4"
                >
                  <div>
                    <p className="font-semibold mb-1">
                      {t("models.segmented_structures_title")}:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-100 list-disc pl-4 grid grid-cols-2 gap-y-1">
                      <li>
                        <strong>HCC:</strong>{" "}
                        {t("models.segmented_structures.HCC")}
                      </li>
                      <li>
                        <strong>HV:</strong>{" "}
                        {t("models.segmented_structures.HV")}
                      </li>
                      <li>
                        <strong>IVC:</strong>{" "}
                        {t("models.segmented_structures.IVC")}
                      </li>
                      <li>
                        <strong>K:</strong> {t("models.segmented_structures.K")}
                      </li>
                      <li>
                        <strong>K-C:</strong>{" "}
                        {t("models.segmented_structures.K-C")}
                      </li>
                      <li>
                        <strong>K-M:</strong>{" "}
                        {t("models.segmented_structures.K-m")}
                      </li>
                      <li>
                        <strong>TRANS:</strong>{" "}
                        {t("models.segmented_structures.TRANS")}
                      </li>
                      <li>
                        <strong>LVR:</strong>{" "}
                        {t("models.segmented_structures.LVR")}
                      </li>
                      <li>
                        <strong>PV:</strong>{" "}
                        {t("models.segmented_structures.PV")}
                      </li>
                      <li>
                        <strong>SAG:</strong>{" "}
                        {t("models.segmented_structures.SAG")}
                      </li>
                      <li>
                        <strong>SAG K:</strong>{" "}
                        {t("models.segmented_structures.SAG K")}
                      </li>
                      <li>
                        <strong>LT SAG:</strong>{" "}
                        {t("models.segmented_structures.LT SAG")}
                      </li>
                      <li>
                        <strong>RT TRANS:</strong>{" "}
                        {t("models.segmented_structures.RT TRANS")}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      {t("models.used_submodels_title")}:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-100">
                      <li>
                        <strong>YOLOv8:</strong>{" "}
                        {t("models.used_submodels.YOLOv8")}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  const classificationModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "classification",
  );
  const segmentationModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "segmentation",
  );

  const generativeModels = models.filter(
    (m) => m.modelType.toLowerCase().trim() === "generative",
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <NavbarSecond
        userData={userData}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAssistantClick={() => setShowAssistant(!showAssistant)}
        isPatientView={false}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
        user={user}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        scale={scale}
        setScale={setScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        userData={userData}
      />

      <div className="relative z-50">
        <div
          className={`fixed top-20 bottom-10 right-0 w-[30rem] bg-gray-800 text-white shadow-lg rounded-l-2xl p-4 transition-all duration-500 ease-in-out ${
            showAssistant ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold p-4 border-b border-gray-700">
              🧠 {t("assistant.title")}
            </h2>
            <button
              onClick={() => setShowAssistant(false)}
              className="text-white bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-md"
              title="Cerrar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <Assistant />
        </div>

        {!showAssistant && (
          <button
            onClick={() => setShowAssistant(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-all duration-300 ease-in-out"
            title="Abrir asistente"
          >
            <ChatBubbleLeftIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="flex-grow overflow-auto">
        <main className="flex-grow container mx-auto px-4 py-20">
          <h1 className="text-4xl mt-8 font-bold text-center text-gray-800 dark:text-white mb-16 flex items-center justify-center gap-2">
            <CubeTransparentIcon className="w-8 h-8 text-blue-500" />
            {t("models.title")}
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            <section className="flex-1">
              <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-300 pb-2 text-center">
                {t("models.classification")}
              </h2>
              {renderModelCards(classificationModels)}
            </section>

            <section className="flex-1">
              <h2 className="text-2xl font-semibold text-purple-600 mb-6 border-b border-purple-300 pb-2 text-center">
                {t("models.segmentation")}
              </h2>
              {renderModelCards(segmentationModels)}
            </section>

            <section className="flex-1">
              <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-300 pb-2 text-center">
                {t("models.generative")}
              </h2>
              {renderModelCards(generativeModels)}
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Models;
