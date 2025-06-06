import React from "react";

interface ErrorMessageProps {
  message: string | unknown;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const displayMessage =
    typeof message === "string" ? message : "An unexpected error occurred.";

  return (
    <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md max-w-md mx-auto text-center">
      <p className="mb-3">{displayMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
