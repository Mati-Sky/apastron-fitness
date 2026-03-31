const Toast = ({ toast }) => {

  if (!toast) return null;

  const colorMap = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500"
};

const color = colorMap[toast.type] || colorMap.success;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 text-white rounded-xl shadow-xl ${color}`}>
      {toast.message}
    </div>
  );
};

export default Toast;