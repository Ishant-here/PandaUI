import React, { forwardRef, useState } from "react";

const ProfileCard = forwardRef(
  (
    {
      name = "John Doe",
      username,
      role = "Software Developer",
      bio,
      avatar,
      coverImage,

      email,
      location,
      website,

      stats = [],
      actions,
      socialLinks = [],

      variant = "default",
      size = "md",

      backgroundColor = "#ffffff",
      color = "#111827",
      secondaryColor = "#6b7280",
      borderColor = "#e5e7eb",
      accentColor = "#111827",

      borderRadius = "16px",
      shadow = "md",
      centered = true,
      hoverable = false,
      clickable = false,

      showAvatar = true,
      showCover = true,
      showBio = true,
      showStats = true,

      avatarSize,
      width = "100%",
      maxWidth = "420px",

      onClick,
      onMouseEnter,
      onMouseLeave,

      style,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizes = {
      sm: {
        avatar: "64px",
        padding: "16px",
        title: "18px",
        role: "13px",
        bio: "13px",
      },
      md: {
        avatar: "88px",
        padding: "20px",
        title: "21px",
        role: "14px",
        bio: "14px",
      },
      lg: {
        avatar: "110px",
        padding: "24px",
        title: "24px",
        role: "15px",
        bio: "15px",
      },
    };

    const currentSize = sizes[size] || sizes.md;

    const shadows = {
      none: "none",
      sm: "0 2px 6px rgba(0, 0, 0, 0.08)",
      md: "0 5px 16px rgba(0, 0, 0, 0.10)",
      lg: "0 12px 30px rgba(0, 0, 0, 0.14)",
      xl: "0 20px 45px rgba(0, 0, 0, 0.18)",
    };

    const variants = {
      default: {
        backgroundColor,
        border: `1px solid ${borderColor}`,
      },

      outlined: {
        backgroundColor: "transparent",
        border: `1px solid ${borderColor}`,
        boxShadow: "none",
      },

      filled: {
        backgroundColor: "#f9fafb",
        border: "none",
      },

      glass: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      },
    };

    const cardStyle = {
      ...variants[variant] || variants.default,

      width,
      maxWidth,

      color,
      borderRadius,

      overflow: "hidden",
      boxSizing: "border-box",

      boxShadow: shadows[shadow] || shadows.md,

      cursor: clickable ? "pointer" : "default",

      transform:
        hoverable && isHovered ? "translateY(-4px)" : "translateY(0)",

      transition:
        "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",

      ...style,
    };

    const handleMouseEnter = (event) => {
      if (hoverable) {
        setIsHovered(true);
      }

      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event) => {
      setIsHovered(false);
      onMouseLeave?.(event);
    };

    const handleKeyDown = (event) => {
      if (clickable && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onClick?.(event);
      }
    };

    const displayAvatarSize = avatarSize || currentSize.avatar;

    return (
      <div
        ref={ref}
        className={className}
        style={cardStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {showCover && coverImage && (
          <div
            style={{
              height: size === "lg" ? "140px" : "110px",
              overflow: "hidden",
              backgroundColor: "#f3f4f6",
            }}
          >
            <img
              src={coverImage}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        <div
          style={{
            padding: currentSize.padding,
            textAlign: centered ? "center" : "left",
          }}
        >
          {showAvatar && (
            <div
              style={{
                display: "flex",
                justifyContent: centered ? "center" : "flex-start",
                marginTop: coverImage && showCover ? `-${displayAvatarSize / 2}px` : "0",
                marginBottom: "12px",
                position: "relative",
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  style={{
                    width: displayAvatarSize,
                    height: displayAvatarSize,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: `4px solid ${backgroundColor}`,
                    backgroundColor: "#f3f4f6",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: displayAvatarSize,
                    height: displayAvatarSize,
                    borderRadius: "50%",
                    border: `4px solid ${backgroundColor}`,
                    backgroundColor: accentColor,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${parseInt(displayAvatarSize, 10) / 3}px`,
                    fontWeight: 700,
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}

          <div>
            <h2
              style={{
                margin: "0",
                fontSize: currentSize.title,
                fontWeight: 700,
                lineHeight: 1.3,
                color,
              }}
            >
              {name}
            </h2>

            {username && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: currentSize.role,
                  color: secondaryColor,
                }}
              >
                @{username}
              </p>
            )}

            {role && (
              <p
                style={{
                  margin: username ? "4px 0 0" : "6px 0 0",
                  fontSize: currentSize.role,
                  fontWeight: 500,
                  color: accentColor,
                }}
              >
                {role}
              </p>
            )}
          </div>

          {showBio && bio && (
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "340px",
                fontSize: currentSize.bio,
                lineHeight: 1.6,
                color: secondaryColor,
              }}
            >
              {bio}
            </p>
          )}

          {(email || location || website) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop: "16px",
                fontSize: "13px",
                color: secondaryColor,
              }}
            >
              {email && <span>{email}</span>}
              {location && <span>{location}</span>}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    color: accentColor,
                    textDecoration: "none",
                  }}
                >
                  {website}
                </a>
              )}
            </div>
          )}

          {showStats && stats.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(
                  stats.length,
                  4
                )}, 1fr)`,
                gap: "12px",
                marginTop: "20px",
                paddingTop: "18px",
                borderTop: `1px solid ${borderColor}`,
              }}
            >
              {stats.map((stat, index) => (
                <div key={stat.id || index}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      fontSize: "12px",
                      color: secondaryColor,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: centered ? "center" : "flex-start",
                alignItems: "center",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              {socialLinks.map((social, index) => (
                <a
                  key={social.id || index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f3f4f6",
                    color: accentColor,
                    textDecoration: "none",
                  }}
                >
                  {social.icon || social.label?.charAt(0)}
                </a>
              ))}
            </div>
          )}

          {actions && (
            <div
              style={{
                display: "flex",
                justifyContent: centered ? "center" : "flex-start",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;