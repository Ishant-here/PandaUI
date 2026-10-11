import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { motion } from "motion/react";
import { FiRefreshCw } from "react-icons/fi";

export const LiveComponentPreview = ({ code }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Sanitize the code
  let sanitized = code
    // Remove imports
    .replace(/import\s+.*?from\s+["'].*?["'];?/g, "")
    // Remove export keyword
    .replace(/export\s+/g, "");

  // 2. Fix positioning (fixed -> absolute)
  sanitized = sanitized
    .replace(/position\s*:\s*["']fixed["']/g, 'position: "absolute"')
    .replace(/position\s*:\s*`fixed`/g, 'position: "absolute"')
    .replace(/\bfixed\b/g, "absolute");

  // 3. Extract component name
  const match = sanitized.match(/const\s+([A-Z]\w+)/);
  const componentName = match ? match[1] : null;

  // 4. Wrap the code to auto-render the component
  const wrappedCode = componentName
    ? `${sanitized}\n\nrender(<${componentName} />)`
    : sanitized;

  const refreshPreview = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Don't render if no component name
  if (!componentName) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          marginTop: "10px",
          padding: "16px",
          background: "rgba(30,41,59,0.5)",
          borderRadius: "8px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        Preview is not available. Copy the code and paste it into your project.
      </motion.div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Refresh Button */}
      <motion.button
        onClick={refreshPreview}
        whileTap={{ scale: 0.9, rotate: 90 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          position: "absolute",
          right: "12px",
          top: "12px",
          background: "rgba(30,41,59,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#94a3b8",
          padding: "6px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Refresh Preview"
      >
        <FiRefreshCw size={14} />
      </motion.button>

      {/* Live Provider Sandbox */}
      <LiveProvider
        key={refreshKey}
        code={wrappedCode}
        scope={{ 
          React, 
          useState, 
          useEffect, 
          useRef, 
          useCallback,
          useMemo,
        }}
        noInline
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "100%",
            minHeight: "300px",
            maxWidth: "100%",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            background: "#020617",
            position: "relative",
            overflow: "hidden",
            padding: "clamp(16px, 3vw, 32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LivePreview />
          </motion.div>
        </motion.div>

        {/* Error Display */}
        <LiveError
          style={{
            marginTop: "12px",
            padding: "14px 16px",
            background: "rgba(69,10,10,0.6)",
            color: "#fca5a5",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "monospace",
            overflowX: "auto",
            lineHeight: "1.6",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        />
      </LiveProvider>
    </div>
  );
};