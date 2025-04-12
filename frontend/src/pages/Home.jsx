const Home = () => {
  return (
    <div className="w-full flex flex-col items-center mt-10 px-4 md:px-6 ">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center ">Welcome to Our School</h2>
      <p className="text-lg text-gray-700 mt-2 text-center">We provide quality education for the future.</p>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-2 md:px-6 max-w-6xl ">
        <div className="bg-gray-100 p-6 rounded-xl shadow-xl hover:scale-105 transition duration-300 shadow-gray-400">
          <h3 className="text-xl md:text-2xl font-semibold text-blue-600">Experienced Teachers</h3>
          <p className="mt-2 text-gray-700">Highly skilled professionals to guide students.</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-xl hover:scale-105 transition duration-300 shadow-gray-400">
          <h3 className="text-xl md:text-2xl font-semibold text-blue-600">Modern Facilities</h3>
          <p className="mt-2 text-gray-700">Equipped with latest technology & smart classrooms.</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-xl hover:scale-105 transition duration-300 shadow-gray-400">
          <h3 className="text-xl md:text-2xl font-semibold text-blue-600">Student Support</h3>
          <p className="mt-2 text-gray-700">Focus on holistic student growth & mental wellness.</p>
        </div>
      </div>

      {/* Call to Action */}
      {/* <button className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-500 transition duration-300">
        Join Us Now
      </button> */}
    </div>
  );
};

export default Home;
