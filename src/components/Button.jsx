const Button = ({ text, bgColor, textColor }) => {
    return (
      <button className={`px-6 py-3 ${bgColor} ${textColor} font-semibold rounded-lg shadow-md transition duration-300 hover:opacity-80`}>
        {text}
      </button>
    );
};
export default Button;