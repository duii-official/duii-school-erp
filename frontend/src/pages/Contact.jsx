const Contact = () => {
    return (
      <div className="w-full flex flex-col items-center mt-10 px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center">Contact Us</h2>
        <p className="text-lg text-gray-700 mt-2 text-center max-w-2xl">
          Have any questions? Feel free to reach out!
        </p>
  
        <form className="mt-8 bg-gray-100 p-6 rounded-xl shadow-xl shadow-gray-500 max-w-3xl w-full flex flex-col space-y-4 ">
          <input type="text" placeholder="Your Name" className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black" />
          <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black" />
          <textarea placeholder="Your Message" rows="4" className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"></textarea>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-500 transition duration-300">
            Send Message
          </button>
        </form>
      </div>
    );
  };
  
  export default Contact;
  