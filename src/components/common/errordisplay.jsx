import "./errordisplay.css";

export default function ErrorDisplay({ error, onRetry, onDismiss }) {
  if (!error) return null;

  const getErrorIcon = () => {
    if (error.retryable) return "🔄";
    if (error.message?.includes("not found")) return "🔍";
    if (error.message?.includes("network") || error.message?.includes("connection")) return "📡";
    return "⚠️";
  };

  return (
    <div className={`error-display ${error.retryable ? "retryable" : ""}`}>
      <div className="error-icon">{getErrorIcon()}</div>
      <div className="error-content">
        <h3 className="error-title">{error.message}</h3>
        {error.details && <p className="error-details">{error.details}</p>}
        <div className="error-actions">
          {error.retryable && onRetry && (
            <button className="error-btn retry-btn" onClick={onRetry}>
              🔄 Try Again
            </button>
          )}
          {onDismiss && (
            <button className="error-btn dismiss-btn" onClick={onDismiss}>
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
