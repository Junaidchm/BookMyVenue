import React, { useState, useEffect } from "react";
import { SkeletonCard, ErrorMessage } from "../ui/Skeletons";
import { updateProfile } from "../services/profileService";

const SUGGESTED_LOCATIONS = [
  "Madhya Pradesh, India",
  "Uttar Pradesh, India",
  "Maharashtra, India",
  "Kerala, India",
  "Karnataka, India",
  "Delhi, India",
  "Tamil Nadu, India",
  "Gujarat, India",
  "Rajasthan, India",
  "Punjab, India",
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Napa Valley, CA",
  "Seattle, WA",
  "London, United Kingdom",
  "Kensington, London",
  "Chelsea, London",
  "Shoreditch, London",
];

// ─── Field validation ─────────────────────────────────────────────────────────
function validate(data) {
  const errors = {};

  // 1. Name validation
  if (!data.name || data.name.trim() === "") {
    errors.name = "Name cannot be empty.";
  }

  // 2. Phone validation (expects 10-12 digits to accommodate optional country codes)
  const cleanPhone = data.phone ? data.phone.trim() : "";
  const digitsOnly = cleanPhone.replace(/\D/g, "");
  if (!cleanPhone) {
    errors.phone = "Phone number cannot be empty.";
  } else if (digitsOnly.length < 10 || digitsOnly.length > 12 || /[a-zA-Z]/.test(cleanPhone)) {
    errors.phone = "Phone number must be a valid 10 to 12 digit mobile number.";
  }

  // 3. Address/Location validation
  if (!data.address || data.address.trim() === "") {
    errors.address = "Address cannot be empty.";
  }

  return errors;
}

// ─── Read-only Field ──────────────────────────────────────────────────────────
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

// ─── Editable Field ───────────────────────────────────────────────────────────
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
        aria-describedby={error ? `${id}-err` : undefined}
        aria-invalid={!!error}
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

/**
 * ProfileInfoCard
 * Displays and allows inline editing of the user's personal information.
 */
export default function ProfileInfoCard({ user, loading, error, onSaved }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Address Autocomplete state
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [apiAddressSuggestions, setApiAddressSuggestions] = useState([]);

  useEffect(() => {
    if (!draft.address || draft.address.trim().length < 3 || !showAddressSuggestions) {
      setApiAddressSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(draft.address)}&format=json&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          const suggestions = data.map((item) => item.display_name);
          setApiAddressSuggestions(suggestions);
        } else {
          throw new Error("Nominatim API response not OK");
        }
      } catch (error) {
        console.warn("Failed to fetch from Nominatim, using local fallback:", error);
        const fallback = SUGGESTED_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes(draft.address.toLowerCase())
        );
        setApiAddressSuggestions(fallback);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [draft.address, showAddressSuggestions]);

  const addressSuggestionsToDisplay = apiAddressSuggestions.length > 0
    ? apiAddressSuggestions
    : SUGGESTED_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(draft.address ? draft.address.toLowerCase() : "")
      );

  if (loading) return <SkeletonCard rows={5} style={{ padding: "2rem" }} />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message={error || "Profile data could not be loaded. Please ensure services are running."} />;

  const handleEdit = () => {
    setDraft({
      name: user.name,
      phone: user.phone,
      address: user.address,
    });
    setFieldErrors({});
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldErrors({});
    setSaveError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      // TODO: updateProfile() will call PATCH /api/v1/users/me
      const { data, error: apiError } = await updateProfile(draft);
      if (apiError) throw new Error(apiError);
      onSaved?.(data);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const display = isEditing ? draft : user;

  return (
    <section className="dash-card" id="section-info" aria-labelledby="info-heading">
      {/* Card Header */}
      <div className="dash-card__header">
        <h2 id="info-heading" className="dash-card__title">
          <span className="dash-card__title-icon" aria-hidden="true">👤</span>
          Profile Information
        </h2>
        {!isEditing ? (
          <button
            id="btn-edit-profile"
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
              id="btn-save-profile"
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSave}
              disabled={saving}
              aria-label="Save profile changes"
            >
              {saving ? "Saving…" : "💾 Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Save error */}
      {saveError && <ErrorMessage message={saveError} />}

      {/* Fields */}
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

          {/* Email — always read-only */}
          {isEditing ? (
            <FieldEdit
              id="field-email"
              label="Email Address"
              type="email"
              name="email"
              value={user.email}
              badge="Cannot be changed"
              disabled
            />
          ) : (
            <FieldView label="Email Address" value={user.email} badge="Verified" />
          )}

          {/* Phone */}
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
                onBlur={() => setShowAddressSuggestions(false)}
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
                          setFieldErrors((prev) => ({ ...prev, address: undefined }));
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
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
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
