export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-30 blur-2xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative text-center max-w-4xl px-6">
        {/* Heading */}
        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-wide">
          Welcome to HealthConnect
        </h1>
        <p className="mt-4 text-lg lg:text-2xl text-gray-200">
          Your trusted platform to find doctors, book appointments, and explore hospitals.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="/api/auth/signin"
            className="px-10 py-3 bg-white text-blue-600 font-medium rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Signin
          </a>
          <a
            href="/signup"
            className="px-10 py-3 bg-blue-800 text-white font-medium rounded-full shadow-lg hover:bg-blue-900 hover:scale-105 transition-transform duration-300"
          >
            Signup
          </a>
        </div>
      </div>
    </div>
  );
}
