import React,{useState} from "react";
import "./booking-modal.css";
import { bookingService } from "@/services/booking.service";
import { formatVenuePrice } from "@/lib/venues/listing";

export function BookingModal({
  isOpen,
  onClose,
  date,
  total,
  venue,
  startTime,
  hours,
  sessionIndex,
}) {
  const [selectedDate, setSelectedDate] = useState(date);
const [isSubmitting, setIsSubmitting] = useState(false);

 
  if (!isOpen) return null; 
const handleConfirm = async () => {
  setIsSubmitting(true);
  try {
    const payload = {
      venueId: venue.id,
      type: venue.pricingType === "PER_SESSION" ? "SESSION" : "HOURLY",
      bookingDate: date,
      startTime: startTime,
      totalPrice: total,
    };

    await bookingService.createBooking(payload);
    alert("Booking created successfully!");
    onClose();
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Something went wrong, please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



   return (
    
    <div className="modal-overlay" onClick={onClose}>
      
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <h3>Confirm Your Booking</h3>
                <div className="booking-details-grid">
          
          <div className="detail-box">
            <span>Date:</span>
            <span>{date}</span>
          </div>

          {venue?.pricingType === "PER_SESSION" ? (
            <div className="detail-box">
              <span>Session:</span>
              <span>
                {venue.sessions?.[parseInt(sessionIndex)]?.name || "Selected Session"}  
              </span>
            </div>
          ) : (
            <>
              <div className="detail-box">
                <span>Start Time:</span>
                <span>{startTime}</span>
              </div>

              <div className="detail-box">
                <span>Duration:</span>
                <span>{hours} Hours</span>
              </div>
            </>
          )}

          <div className="detail-box font-bold">
            <span>Total:</span>
            <span>PKR {total}</span>
          </div>

        </div>


        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Confirm"}
          </button>
        </div>
</div>
</div>
            
  );
}


