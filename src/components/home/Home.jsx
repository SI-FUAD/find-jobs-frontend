function Home() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/assets/hero-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-4">
          <div className="max-w-4xl mx-auto text-center text-white mt-[-120px]">

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your <span className="text-blue-400">Dream Job</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Discover thousands of opportunities with top companies worldwide.
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Job title or keyword"
                className="flex-1 px-4 py-3 rounded-lg outline-none text-black"
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 px-4 py-3 rounded-lg outline-none text-black"
              />
              <button className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                Search
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;