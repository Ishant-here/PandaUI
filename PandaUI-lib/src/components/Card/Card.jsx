import React, { forwardRef, useState } from "react";

const Card = forwardRef(
  (
    {
      children,
      title,
      description,
      header,
      footer,

      width = "100%",
      maxWidth = "400px",
      minHeight = "auto",

      padding = "20px",
      margin = "0",
      borderRadius = "12px",

      backgroundColor = "#ffffff",
      color = "#111827",
      borderColor = "#e5e7eb",

      border = true,
      shadow = "0 4px 12px rgba(0, 0, 0, 0.08)",

      hoverable = false,
      hoverShadow = "0 8px 24px rgba(0, 0, 0, 0.12)",
      hoverTransform = "translateY(-2px)",

      clickable = false,
      onClick,

      image,
      imageAlt = "",
      imageHeight = "200px",
      imageFit = "cover",

      disabled = false,

      style,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
      width,
      maxWidth,
      minHeight,
      margin,
      backgroundColor,
      color,
      borderRadius,
      border: border ? `1px solid ${borderColor}` : "none",

      boxShadow:
        hoverable && isHovered
          ? hoverShadow
          : shadow,

      transform:
        hoverable && isHovered
          ? hoverTransform
          : "translateY(0)",

      overflow: "hidden",
      boxSizing: "border-box",

      cursor:
        disabled
          ? "not-allowed"
          : clickable
          ? "pointer"
          : "default",

      opacity: disabled ? 0.6 : 1,

      transition:
        "box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease",

      pointerEvents: disabled ? "none" : "auto",

      ...style,
    };

    const contentStyle = {
      padding,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={cardStyle}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => {
          if (hoverable && !disabled) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        role={clickable ? "button" : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        {...props}
      >
        {image && (
          <img
            src={image}
            alt={imageAlt}
            style={{
              display: "block",
              width: "100%",
              height: imageHeight,
              objectFit: imageFit,
            }}
          />
        )}

        {header && (
          <div
            style={{
              padding,
              paddingBottom: 0,
            }}
          >
            {header}
          </div>
        )}

        {(title || description || children) && (
          <div style={contentStyle}>
            {title && (
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color,
                }}
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#6b7280",
                }}
              >
                {description}
              </p>
            )}

            {children}
          </div>
        )}

        {footer && (
          <div
            style={{
              padding,
              paddingTop: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;