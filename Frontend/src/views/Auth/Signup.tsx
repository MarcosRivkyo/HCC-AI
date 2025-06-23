import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignupViewModel } from "../../viewmodels/useSignupViewModel";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";
import ImageSlider from "../Components/ImageSlider";
import usePreventZoom from "../Components/usePreventZoom";

export default function Signup() {
  const {
    authing,
    email,
    password,
    rol,
    confirmPassword,
    accessCode,
    userName,
    firstName,
    lastName,
    phone,
    error,
    verificationMessage,
    showPassword,
    showConfirmPassword,
    setEmail,
    setPassword,
    setRol,
    setConfirmPassword,
    setAccessCode,
    setUserName,
    setFirstName,
    setLastName,
    setPhone,
    setShowPassword,
    setShowConfirmPassword,
    signUpWithEmail,
  } = useSignupViewModel();

  usePreventZoom(true, true);
  const { t } = useTranslation("global");

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Slider (oculto en móviles) */}
      <div className="hidden md:flex w-full md:w-1/2 h-64 md:h-full flex-col bg-[#282c34]">
        <ImageSlider />
      </div>

      {/* Formulario */}
      <div className="w-full md:w-1/2 h-full bg-black flex flex-col px-6 py-10 md:p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-10 text-white">
            <img
              src={logoHCC_AI}
              alt="Logo HCC-AI"
              className="w-60 md:w-80 rounded-md mx-auto mb-10 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            />
            <h3 className="text-2xl md:text-4xl font-bold mb-2 text-center">
              {t("signup.title")}
            </h3>
            <p className="text-md md:text-lg mb-4 text-center">{t("signup.subtitle")}</p>
          </div>

          <input
            type="text"
            placeholder={t("signup.username")}
            className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-4"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder={t("signup.firstname")}
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder={t("signup.lastname")}
              className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            type="email"
            placeholder={t("signup.email")}
            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("signup.password")}
                className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative flex-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("signup.confirm_password")}
                className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
            <select
              className="flex-1 text-white bg-black appearance-none py-2 border-b border-gray-500 focus:outline-none focus:border-white"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="Paciente">{t("signup.role.patient")}</option>
              <option value="Médico">{t("signup.role.doctor")}</option>
              <option value="Administrador">{t("signup.role.admin")}</option>
            </select>

            {rol !== "Paciente" && (
              <input
                type="text"
                placeholder={t("signup.access_code")}
                className="flex-1 text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            )}
          </div>

          <input
            type="text"
            placeholder={t("signup.phone")}
            className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white mb-6"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {verificationMessage && (
            <div className="text-green-500 mb-4 text-center">{verificationMessage}</div>
          )}

          <div className="w-full flex flex-col mb-4">
            <button
              onClick={signUpWithEmail}
              disabled={authing}
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              {t("signup.button")}
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-gray-500"></div>
            <p className="text-sm md:text-lg absolute text-gray-500 bg-black px-2">OR</p>
          </div>

          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-sm font-normal text-gray-400 text-center">
              {t("signup.have_account")}{" "}
              <span className="font-semibold text-white cursor-pointer underline">
                <Link to="/login">{t("signup.login_link")}</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
