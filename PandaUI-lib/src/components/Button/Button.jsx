import React, { forwardRef, useState } from "react";

const Button = forwardRef(
  (
    {
      children = "Button",
      variant = "solid",
      size = "md",
      color = "#ffffff",
      backgroundColor = "#111827",
      hoverBackgroundColor = "#374151",
      borderColor = "#111827",
      textColor,
      borderRadius = "8px",
      width = "fit-content",
      fullWidth = false,
      disabled = false,
      loading = false,
      loadingText = "Loading...",
      type = "button",
      onClick,
      onMouseEnter,
      onMouseLeave,
      startIcon,
      endIcon,
      iconOnly = false,
      ariaLabel,
      style,
      className = "",
      children: _children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizes = {
      xs: {
        padding: "6px 10px",
        fontSize: "12px",
        gap: "6px",
      },
      sm: {
        padding: "8px 14px",
        fontSize: "14px",
        gap: "6px",
      },
      md: {
        padding: "10px 18px",
        fontSize: "16px",
        gap: "8px",
      },
      lg: {
        padding: "12px 22px",
        fontSize: "18px",
        gap: "8px",
      },
      xl: {
        padding: "14px 26px",
        fontSize: "20px",
        gap: "10px",
      },
    };

    const variants = {
      solid: {
        backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
        color: textColor || color,
        border: `1px solid ${backgroundColor}`,
      },

      outline: {
        backgroundColor: isHovered ? backgroundColor : "transparent",
        color: isHovered ? color : backgroundColor,
        border: `1px solid ${borderColor}`,
      },

      ghost: {
        backgroundColor: isHovered
          ? `${backgroundColor}15`
          : "transparent",
        color: textColor || backgroundColor,
        border: "1px solid transparent",
      },

      danger: {
        backgroundColor: isHovered ? "#b91c1c" : "#dc2626",
        color: "#ffffff",
        border: "1px solid #dc2626",
      },

      success: {
        backgroundColor: isHovered ? "#15803d" : "#16a34a",
        color: "#ffffff",
        border: "1px solid #16a34a",
      },

      warning: {
        backgroundColor: isHovered ? "#d97706" : "#f59e0b",
        color: "#ffffff",
        border: "1px solid #f59e0b",
      },

      link: {
        backgroundColor: "transparent",
        color: backgroundColor,
        border: "none",
        padding: "0",
      },
    };

    const currentSize = sizes[size] || sizes.md;
    const currentVariant = variants[variant] || variants.solid;

    const buttonStyle = {
      ...currentVariant,
      ...currentSize,

      width: fullWidth ? "100%" : width,

      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      borderRadius,
      fontFamily: "inherit",
      fontWeight: 600,
      lineHeight: 1.4,

      cursor: disabled || loading ? "not-allowed" : "pointer",

      opacity: disabled ? 0.6 : 1,

      pointerEvents: disabled || loading ? "none" : "auto",

      transition:
        "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",

      boxSizing: "border-box",

      userSelect: "none",

      ...style,
    };

    const handleMouseEnter = (event) => {
      if (!disabled && !loading) {
        setIsHovered(true);
      }

      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event) => {
      setIsHovered(false);
      onMouseLeave?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={className}
        style={buttonStyle}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading ? (
          <>
            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid currentColor",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "pandaui-button-spin 0.7s linear infinite",
              }}
            />

            {!iconOnly && loadingText}
          </>
        ) : (
          <>
            {startIcon && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {startIcon}
              </span>
            )}

            {!iconOnly && children}

            {iconOnly && children}

            {endIcon && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {endIcon}
              </span>
            )}
          </>
        )}

        <style>
          {`
            @keyframes pandaui-button-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;