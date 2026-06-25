"use client";

import React from "react";

// ─── Field View Component ──────────────────────────────────────────────────────
function FieldView({ label, value, badge }) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {badge && <span className="field-badge">{badge}</span>}
      </label>
      <p className={`field-value${!value ? " field-value--empty" : ""}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

// ─── Field Edit Component ──────────────────────────────────────────────────────
function FieldEdit({ id, label, type = "text", name, value, onChange, error, placeholder, badge, disabled }) {
  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">
        {label}
        {badge && <span className="field-badge">{badge}</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`field-input${error ? " field-input--error" : ""}`}
      />
      {error && (
        <span id={`${id}-err`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function OwnerProfileInfo({
  isEditing,
  display,
  setDraft,
  fieldErrors,
  setFieldErrors,
  isSaving,
  handleEdit,
  handleSave,
  handleCancel,
  handleChange,
  showAddressSuggestions,
  setShowAddressSuggestions,
  addressSuggestionsToDisplay,
}) {
  return (
    <section className="dash-card" id="section-info" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
      <div className="dash-card__header">
        <h2 className="dash-card__title">
          <span className="dash-card__title-icon" aria-hidden="true">👤</span>
          Profile Information
        </h2>
        {!isEditing ? (
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={handleEdit}
            aria-label="Edit profile information"
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSave}
              disabled={isSaving}
              aria-label="Save profile changes"
            >
              {isSaving ? "Saving…" : "💾 Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="dash-card__body">
        <div className="field-grid">
          
          {/* Full Name */}
          {isEditing ? (
            <FieldEdit
              id="field-name"
              label="Full Name"
              name="name"
              value={display.name}
              onChange={handleChange}
              error={fieldErrors.name}
              placeholder="Your full name"
            />
          ) : (
            <FieldView label="Full Name" value={display.name} />
          )}

          {/* Email Address */}
          {isEditing ? (
            <FieldEdit
              id="field-email"
              label="Email Address"
              type="email"
              name="email"
              value={display.email}
              error={fieldErrors.email}
              badge="Cannot be changed"
              disabled
            />
          ) : (
            <FieldView label="Email Address" value={display.email} badge="Verified" />
          )}

          {/* Phone Number */}
          {isEditing ? (
            <FieldEdit
              id="field-phone"
              label="Phone Number"
              type="tel"
              name="phone"
              value={display.phone}
              onChange={handleChange}
              error={fieldErrors.phone}
              placeholder="+92 300 0000000"
            />
          ) : (
            <FieldView label="Phone Number" value={display.phone} />
          )}

          {/* Address */}
          {isEditing ? (
            <div className="field-group" style={{ position: "relative" }}>
              <label htmlFor="field-address" className="field-label">
                Address
              </label>
              <input
                id="field-address"
                type="text"
                name="address"
                value={display.address || ""}
                onChange={(e) => {
                  handleChange(e);
                  setShowAddressSuggestions(true);
                }}
                onFocus={() => setShowAddressSuggestions(true)}
                onBlur={() => {
                  // Slight delay to allow list select
                  setTimeout(() => setShowAddressSuggestions(false), 200);
                }}
                placeholder="City, Country"
                className={`field-input${fieldErrors.address ? " field-input--error" : ""}`}
              />
              {showAddressSuggestions && addressSuggestionsToDisplay.length > 0 && (
                <ul 
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    left: 0,
                    right: 0,
                    top: "100%",
                    marginTop: "4px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    borderRadius: "8px",
                    border: "1px solid var(--clr-border, #e5e7eb)",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    listStyle: "none",
                    padding: "4px 0",
                    margin: 0
                  }}
                >
                  {addressSuggestionsToDisplay.map((suggestion) => (
                    <li
                      key={suggestion}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setDraft((prev) => ({ ...prev, address: suggestion }));
                        if (fieldErrors.address) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.address;
                            return next;
                          });
                        }
                        setShowAddressSuggestions(false);
                      }}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "#1f2937",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {fieldErrors.address && (
                <span id="field-address-err" className="field-error" role="alert">
                  {fieldErrors.address}
                </span>
              )}
            </div>
          ) : (
            <FieldView label="Address" value={display.address} />
          )}

        </div>
      </div>
    </section>
  );
}
