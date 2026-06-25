"use client";

import React from "react";

export function OwnerProfileMetrics({ profile }) {
  return (
    <section className="dash-card" id="section-metrics">
      <div className="dash-card__header">
        <h2 className="dash-card__title">
          <span className="dash-card__title-icon" aria-hidden="true">📊</span>
          Dashboard Performance Overview
        </h2>
      </div>
      <div className="dash-card__body">
        <div className="stats-grid">
          <div className="stat-tile stat-tile--accent">
            <span className="stat-tile__icon" aria-hidden="true">🏢</span>
            <span className="stat-tile__value">{profile.venuesCount}</span>
            <span className="stat-tile__label">Venues Managed</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon" aria-hidden="true">🗓️</span>
            <span className="stat-tile__value">{profile.bookingsReceived}</span>
            <span className="stat-tile__label">Bookings Received</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon" aria-hidden="true">✅</span>
            <span className="stat-tile__value">{profile.completedEvents}</span>
            <span className="stat-tile__label">Completed Events</span>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon" aria-hidden="true">⭐</span>
            <span className="stat-tile__value">{profile.averageRating}</span>
            <span className="stat-tile__label">Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
