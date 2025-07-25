import React from 'react';

const Loading = ({ 
  title = "Memuat Dashboard", 
  subtitle = "Menyiapkan data untuk Anda...",
  showLogo = true,
  logoSrc = "/lampung.png",
  logoAlt = "Logo Lampung",
  size = "default"
}) => {
  const sizeClasses = {
    small: {
      container: "min-h-64",
      logo: "w-16 h-16 md:w-20 md:h-20",
      spinner: "w-12 h-12",
      innerSpinner: "w-8 h-8",
      title: "text-lg md:text-xl",
      subtitle: "text-sm md:text-base",
      background: "w-48 h-48",
      backgroundSecondary: "w-32 h-32"
    },
    default: {
      container: "min-h-full",
      logo: "w-24 h-24 md:w-32 md:h-32",
      spinner: "w-16 h-16",
      innerSpinner: "w-12 h-12",
      title: "text-2xl md:text-3xl",
      subtitle: "text-lg",
      background: "w-64 h-64",
      backgroundSecondary: "w-48 h-48"
    },
    large: {
      container: "min-h-screen",
      logo: "w-32 h-32 md:w-40 md:h-40",
      spinner: "w-20 h-20",
      innerSpinner: "w-16 h-16",
      title: "text-3xl md:text-4xl",
      subtitle: "text-xl",
      background: "w-80 h-80",
      backgroundSecondary: "w-64 h-64"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} w-full bg-opacity-100 flex flex-col items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 ${currentSize.background} bg-blue-900/5 rounded-full animate-pulse`}></div>
        <div className={`absolute bottom-20 right-20 ${currentSize.backgroundSecondary} bg-orange-500/5 rounded-full animate-pulse`} style={{animationDelay: '0.3s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-900/10 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-orange-500/10 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
      </div>

      <div className="relative z-10 text-center">
        {showLogo && (
          <div className="mb-8">
            <div className="relative">
              <img
                src={logoSrc}
                alt={logoAlt}
                className={`${currentSize.logo} mx-auto object-contain animate-bounce`}
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-900/20 to-orange-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="relative mb-8">
          <div className="flex justify-center space-x-2">
            <div className="relative">
              <div className={`${currentSize.spinner} border-4 border-blue-900/20 rounded-full animate-spin`}>
                <div className={`absolute top-0 left-0 ${currentSize.spinner} border-4 border-transparent border-t-blue-900 rounded-full animate-spin`}></div>
              </div>
              <div className={`absolute top-2 left-2 ${currentSize.innerSpinner} border-4 border-orange-500/20 rounded-full animate-spin rotate-45`} style={{animationDelay: '0.15s'}}>
                <div className={`absolute top-0 left-0 ${currentSize.innerSpinner} border-4 border-transparent border-t-orange-500 rounded-full animate-spin`} style={{animationDelay: '0.15s'}}></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className={`${currentSize.title} font-bold text-gray-800 animate-pulse`}>
            {title}
          </h2>
          <p className={`${currentSize.subtitle} text-gray-600 animate-pulse`} style={{animationDelay: '0.3s'}}>
            {subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-orange-500 h-2 rounded-full animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;