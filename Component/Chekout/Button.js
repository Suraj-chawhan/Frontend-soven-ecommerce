export default function Button({ val, onClick, enable, selected }) {
  return (
    <button
      onClick={() => onClick(val)}
      className={`w-full border-2 shadow-lg p-2 px-4 rounded-md ${
        enable
          ? selected
            ? "bg-black text-white" // Selected size button is black
            : "bg-white text-black hover:bg-black hover:text-white" // Unselected button is white
          : "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled button
      }`}
      disabled={!enable}
    >
      {val}
    </button>
  );
}
