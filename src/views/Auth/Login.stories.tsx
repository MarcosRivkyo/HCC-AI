import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logoHCC_AI from '../../assets/images/logo_hcc_ai.jpg';
import ImageSlider from '../Components/ImageSlider';
import usePreventZoom from '../Components/usePreventZoom';

interface LoginProps {
  /** Simula mensaje de error */
  errorMessage?: string;
  /** Valor inicial del email (útil para testing) */
  defaultEmail?: string;
}

const MockLogin: React.FC<LoginProps> = ({
  errorMessage,
  defaultEmail = '',
}) => {
  const { t } = useTranslation("global");
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);


  usePreventZoom(true, true);

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full flex flex-col bg-[#282c34]">
        <ImageSlider />
      </div>
      <div className="w-1/2 h-full bg-black flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto text-white">
          <img
            src={logoHCC_AI}
            alt="Logo HCC-AI"
            className="w-80 rounded-md mx-auto mb-10 cursor-pointer"
          />
          <h3 className="text-4xl font-bold mb-2 text-center">
            {t("login.login_text")}
          </h3>
          <p className="text-lg mb-4 text-center">
            {t("login.welcome_text")}
          </p>

          <input
            type="email"
            placeholder={t("login.email_placeholder")}
            className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwd_placeholder")}
              className="w-full text-white py-2 bg-transparent border-b border-gray-500 focus:outline-none pr-10"
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

          <button
            className="w-full bg-transparent border border-white text-white font-semibold rounded-md p-4"
            onClick={() => alert(`Login as: ${email}`)}
          >
            {t("login.login_text")}
          </button>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockLogin> = {
  title: 'Pages/Login (Mock)',
  component: MockLogin,
  decorators: [
    (Story) => (
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MockLogin>;

export const Default: Story = {
  args: {
    defaultEmail: 'doctor@example.com',
    errorMessage: '',
  },
};