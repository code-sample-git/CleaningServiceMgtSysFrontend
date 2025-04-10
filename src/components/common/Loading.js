import React from 'react';

const Loading = ({ fullScreen, message = 'Loading...' }) => {
  const loadingContent = (
    <div className="loading">
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading; 