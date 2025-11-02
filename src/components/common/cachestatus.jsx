import { useState, useEffect } from "react";
import {
  getCacheStats,
  cleanupExpiredCache,
  clearAllCache,
} from "../../../utils/cache";
import "./cachestatus.css";

function CacheStatus() {
  const [stats, setStats] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const updateStats = () => {
    setStats(getCacheStats());
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCleanup = () => {
    const cleaned = cleanupExpiredCache();
    updateStats();
    alert(`Cleaned ${cleaned} expired cache entries`);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all cached data?")) {
      clearAllCache();
      updateStats();
    }
  };

  if (!stats) return null;

  return (
    <div className="cache-status">
      <button
        className="cache-toggle"
        onClick={() => setShowDetails(!showDetails)}
        type="button"
        aria-label={`Cache status: ${stats.totalEntries} entries`}
        aria-expanded={showDetails}
        aria-controls="cache-details-panel"
      >
        💾 Cache: {stats.totalEntries} entries
      </button>

      {showDetails && (
        <div
          id="cache-details-panel"
          className="cache-details"
          role="region"
          aria-label="Cache details"
        >
          <div className="cache-header">
            <h3>Cache Status</h3>
            <button
              className="close-cache"
              onClick={() => setShowDetails(false)}
              type="button"
              aria-label="Close cache details"
            >
              ✕
            </button>
          </div>

          <div className="cache-summary">
            <div className="cache-stat">
              <span className="stat-label">Total Entries:</span>
              <span className="stat-value">{stats.totalEntries}</span>
            </div>
            <div className="cache-stat">
              <span className="stat-label">Valid:</span>
              <span className="stat-value stat-success">
                {stats.entries.filter((e) => !e.expired).length}
              </span>
            </div>
            <div className="cache-stat">
              <span className="stat-label">Expired:</span>
              <span className="stat-value stat-warning">
                {stats.entries.filter((e) => e.expired).length}
              </span>
            </div>
          </div>

          <div className="cache-entries" role="list" aria-label="Cache entries">
            {stats.entries.length === 0 ? (
              <p className="no-cache">No cached entries</p>
            ) : (
              stats.entries.map((entry, index) => (
                <div
                  key={index}
                  className={`cache-entry ${entry.expired ? "expired" : ""}`}
                  role="listitem"
                >
                  <span className="entry-key">{entry.key}</span>
                  <span className="entry-age">
                    {entry.expired ? "Expired" : `${entry.age}s old`}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="cache-actions">
            <button
              className="cache-btn cleanup-btn"
              onClick={handleCleanup}
              type="button"
              aria-label="Cleanup expired cache entries"
            >
              🧹 Cleanup Expired
            </button>
            <button
              className="cache-btn clear-btn"
              onClick={handleClearAll}
              type="button"
              aria-label="Clear all cache"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CacheStatus;
