
const PageContainer = ({ title, children }) => {
  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-4xl font-black text-teal-600 mb-8 ">
        {title}
      </h1>

      <div className="bg-gradient-to-r from-green-300 via-teal-300 to-blue-500 p-6 rounded-xl shadow-lg">
        {children}
      </div>

    </div>
  );
};

export default PageContainer;