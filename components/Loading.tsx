const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        className="animate-spin"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="white"
          strokeWidth="4"
          opacity="0.2"
        />
        <path
          d="M36 20a16 16 0 1 1-9.372-14.59"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Loading;
