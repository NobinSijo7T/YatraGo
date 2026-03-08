// LoginTemplate.jsx
import React from "react";
import LoginForm from "../organisms/LoginForm";
import SignupForm from "../organisms/SignupForm";

const LoginTemplate = ({ type }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — travel photo/branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center flex-col justify-end p-12"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, #003580, #009fe3, #00AF87)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 p-1">
              <img src="/black_ver.png" alt="YathraGo" className="w-full h-full object-contain filter invert" />
            </div>
            <span className="text-white text-2xl font-bold">YathraGo</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">
            Discover the world, <br className="hidden xl:block" />
            find your companion.
          </h2>
          <p className="text-white/80 text-base">
            Connect with travelers heading to the same destinations. Plan together, explore together.
          </p>
          <div className="flex gap-6 mt-8">
            <div>
              <p className="text-2xl font-bold text-white">400K+</p>
              <p className="text-white/70 text-sm">Travelers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">180+</p>
              <p className="text-white/70 text-sm">Countries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">50K+</p>
              <p className="text-white/70 text-sm">Stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          {type === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;
