import { useLoginViewModel } from "../../viewmodels/useLoginViewModel";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import ImageSlider from "../Components/ImageSlider";
import usePreventZoom from "../Components/usePreventZoom";
import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";

const Login = () => {
  const {
    authing,
    email,
    password,
    resetEmail,
    error,
    successMessage,
    showResetInput,
    showPassword,
    setEmail,
    setPassword,
    setResetEmail,
    setShowResetInput,
    setShowPassword,
    signInWithEmail,
    handlePasswordReset,
  } = useLoginViewModel();

  usePreventZoom(true, true);

  const { t } = useTranslation("global");

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
        <ImageSlider />
      </div>
      <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-10 text-white">
            <img
              src={logoHCC_AI}
              alt="Logo HCC-AI"
              className="w-80 rounded-md center mx-auto mb-10 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            />
            <h3 className="text-4xl font-bold mb-2 text-center">
              {t("login.login_text")}
            </h3>
            <p className="text-lg mb-4 text-center">
              {t("login.welcome_text")}
            </p>
          </div>

          <div className="w-full flex flex-col mb-6">
            <input
              type="email"
              placeholder={t("login.email_placeholder")}
              className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("login.passwd_placeholder")}
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
          </div>

          <div className="w-full flex flex-col mb-4">
            <button
              className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={signInWithEmail}
              disabled={authing}
            >
              {t("login.login_text")}
            </button>
          </div>

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          {successMessage && (
            <div className="text-green-500 mb-4 text-center">
              {successMessage}
            </div>
          )}

          {!showResetInput ? (
            <div className="text-center">
              <button
                onClick={() => setShowResetInput(true)}
                className="text-gray-400 text-sm underline"
              >
                {t("login.forgot_passwd")}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col mb-6">
              <input
                type="email"
                placeholder="Introduce tu correo para restablecer la contraseña"
                className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <div className="w-full flex flex-col mb-4">
                <button
                  onClick={handlePasswordReset}
                  className="w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                >
                  {t("login.error_send_email")}
                </button>
              </div>
              <div className="text-center mt-2">
                <button
                  onClick={() => setShowResetInput(false)}
                  className="text-gray-400 text-sm underline"
                >
                  {t("login.error_remake")}
                </button>
              </div>
            </div>
          )}

          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-gray-500"></div>
            <p className="text-lg absolute text-gray-500 bg-black px-2">OR</p>
          </div>

          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-sm font-normal text-gray-400">
              {t("login.no_account")}
              <span className="font-semibold text-white cursor-pointer underline">
                <Link to="/signup"> {t("login.register")}</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
