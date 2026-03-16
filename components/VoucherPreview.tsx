import { VoucherData } from "@/lib/types";

const red = "#c00";
const orange = "#ff7a00";

interface Props {
  data: VoucherData;
}

export default function VoucherPreview({ data }: Props) {
  // Determine the text to display based on booking status
  const getBookingText = () => {
    switch (data.bookingStatus) {
      case "book":
        return "Please Book";
      case "amend":
        return "Please Amend";
      case "cancel":
        return "Please Cancel";
      default:
        return "Please Book";
    }
  };

  // Get color based on booking status
  const getBookingColor = () => {
    switch (data.bookingStatus) {
      case "book":
        return "#008000"; // Green for book
      case "amend":
        return "#FFA500"; // Orange for amend
      case "cancel":
        return "#FF0000"; // Red for cancel
      default:
        return "#008000";
    }
  };

  // Check if extra bed should be shown
  const hasChildren = data.children && parseInt(data.children.toString()) > 0;
  const hasExtraBed = data.extraBed && parseInt(data.extraBed.toString()) > 0;

  // Helper to safely convert to number
  const toNumber = (val: string | number | undefined): number => {
    if (val === undefined || val === "") return 0;
    return typeof val === 'string' ? parseInt(val) || 0 : val;
  };

  const childrenCount = toNumber(data.children);
  const extraBedCount = toNumber(data.extraBed);

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        background: "white",
        padding: "36px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 13,
        lineHeight: 1.4,
        position: "relative",
        boxSizing: "border-box",
        color: "#000",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Logos */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "40px",
          right: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img 
          src="/logos/left-logo.png" 
          alt="Left Logo" 
          style={{ width: "130px", height: "auto" }}
        />
        <img 
          src="/logos/right-logo.png" 
          alt="Right Logo" 
          style={{ width: "130px", height: "auto" }}
        />
      </div>

      {/* Voucher No - centered */}
      <div
        style={{
          position: "absolute",
          top: "95px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        Voucher No: {data.voucherNo || ""}
      </div>

      {/* Date */}
      <div style={{ position: "absolute", top: "130px", left: "40px" }}>
        Date: {data.date || ""}
      </div>

      {/* Status Badge - only show for non-book statuses */}
      {data.bookingStatus && data.bookingStatus !== "book" && (
        <div
          style={{
            position: "absolute",
            top: "125px",
            right: "40px",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "bold",
            backgroundColor: data.bookingStatus === "cancel" ? "#FF0000" : "#FFA500",
            color: "white",
            textTransform: "uppercase",
          }}
        >
          {data.bookingStatus === "cancel" ? "CANCELLED" : "AMENDED"}
        </div>
      )}

      {/* Hotel & Room Type */}
      <div style={{ position: "absolute", top: "170px", left: "40px" }}>
        Hotel Name: <span style={{ color: red }}>{data.hotelName || ""}</span>
      </div>

      <div style={{ position: "absolute", top: "195px", left: "40px" }}>
        Room Type: <span style={{ color: red }}>{data.roomType || ""}</span>
      </div>

      {/* Clients - orange bar */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "40px",
          width: "515px",
          height: "26px",
          backgroundColor: orange,
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        CLIENTS:{" "}
        <span style={{ fontWeight: "normal", marginLeft: "10px" }}>
          {data.clients || ""}
        </span>
      </div>

      {/* Guest counts */}
      <div
        style={{
          position: "absolute",
          top: "295px",
          left: "40px",
          right: "40px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
        }}
      >
        <div>
          No. of Adults: <span style={{ color: red }}>{data.adults || "0"}</span>
        </div>
        <div>
          No. of children under 12 years:{" "}
          <span style={{ color: red }}>{data.children || "0"}</span>
        </div>
      </div>

      {/* Dynamic booking instruction */}
      <div 
        style={{ 
          position: "absolute", 
          top: "340px", 
          left: "40px", 
          fontWeight: "bold",
          color: getBookingColor(),
          fontSize: 14,
        }}
      >
        {getBookingText()}
      </div>

      {/* Room Breakdown */}
      <div
        style={{
          position: "absolute",
          top: "340px",
          left: "300px",
          lineHeight: 1.6,
        }}
      >
        <div>
          TWINS: <span style={{ color: red }}>{data.twins || ""}</span>
        </div>
        <div>
          DOUBLES: <span style={{ color: red }}>{data.doubles || ""}</span>
        </div>
        <div>
          SINGLES: <span style={{ color: red }}>{data.singles || ""}</span>
        </div>
        <div>
          TRIPLES: <span style={{ color: red }}>{data.triples || ""}</span>
        </div>
        
        {/* Extra Bed - conditionally shown with same red color as room types */}
        {hasChildren && hasExtraBed && (
          <div style={{ marginTop: "8px", borderTop: "1px dashed #ccc", paddingTop: "4px" }}>
            <span style={{ fontWeight: "bold" }}>EXTRA BED: </span>
            <span style={{ color: red, fontWeight: "bold" }}>{extraBedCount}</span>
            <span style={{ fontSize: "11px", marginLeft: "4px", color: "#666" }}>
              (for {childrenCount} child{childrenCount > 1 ? 'ren' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Check-in / Check-out / Nights */}
      <div
        style={{
          position: "absolute",
          top: "450px",
          left: "40px",
          lineHeight: 1.6,
        }}
      >
        <div>
          Check in: <span style={{ color: red }}>{data.checkIn || ""}</span>
        </div>
        <div>
          Check out: <span style={{ color: red }}>{data.checkOut || ""}</span>
        </div>
        <div>
          Number of Nights:{" "}
          <span style={{ color: red }}>{data.nights || ""}</span>
        </div>
      </div>

      {/* Remarks */}
      <div
        style={{
          position: "absolute",
          top: "540px",
          left: "40px",
          display: "flex",
          maxWidth: "515px",
          lineHeight: 1.4,
        }}
      >
        Remarks:{" "}
        <span style={{ color: red, marginLeft: "8px" }}>
          {data.remarks || ""}
        </span>
      </div>

      {/* Signature block */}
      <div
        style={{
          position: "absolute",
          top: "610px",
          left: "40px",
          lineHeight: 1.5,
        }}
      >
        <div>Signed</div>
        <div>For: {data.signedFor || "Jae Travel Expeditions"}</div>
        <div>Name: {data.signedName || data.agentName || "Antony Waititu"}</div>
      </div>
    </div>
  );
}