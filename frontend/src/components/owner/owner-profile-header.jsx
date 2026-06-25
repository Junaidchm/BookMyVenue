"use client";

import React from "react";

export function OwnerProfileHeader({
  profile,
  isUploading,
  handleAvatarClick,
  fileInputRef,
  handleAvatarUpload,
  memberYear,
}) {
  return (
    <div className="profile-header-card" id="section-profile">
      <div
        className="profile-header__avatar"
        style={{ cursor: isUploading ? "not-allowed" : "pointer", position: "relative" }}
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        aria-label="Change profile picture"
        title="Click to upload profile picture"
      >
        {isUploading ? (
          <span className="avatar-spinner" style={{ animation: "spin 1s linear infinite" }}>🔄</span>
        ) : profile.avatar ? (
          <img
            src={profile.avatar}
            alt={`${profile.name}'s avatar`}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          "?"
        )}

        {!isUploading && (
          <div
            className="avatar-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s ease",
              color: "#fff",
              fontSize: "1.25rem",
            }}
          >
            📷
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleAvatarUpload}
        disabled={isUploading}
      />

      <div className="profile-header__info">
        <h1 className="profile-header__name">{profile.name}</h1>
        <p className="profile-header__email">{profile.email}</p>
        <div className="profile-header__meta">
          <span className="badge badge--confirmed badge--sm">Active</span>
          <span 
            className="badge badge--sm" 
            style={{ 
              backgroundColor: "var(--clr-primary-faint)", 
              color: "var(--clr-primary-dark)", 
              borderColor: "var(--clr-primary-muted)" 
            }}
          >
            Premium Partner
          </span>
          <span className="profile-header__since">
            Member since {memberYear}
          </span>
        </div>
      </div>
    </div>
  );
}
