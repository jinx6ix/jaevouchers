import { VoucherData } from "@/lib/types";

const red = "#c00";
const orange = "#ff7a00";

interface Props {
  data: VoucherData;
}

export default function VoucherPreview({ data }: Props) {
  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        background: "white",
        padding: "36px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 13, // slightly smaller to help fit content better
        lineHeight: 1.4,
        position: "relative",
        boxSizing: "border-box",
        color: "#000",
        margin: "0 auto",
        overflow: "hidden", // prevent content from spilling outside A4
      }}
    >
      {/* Voucher No - centered */}
      <div
        style={{
          position: "absolute",
          top: "75px",
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
      <div style={{ position: "absolute", top: "110px", left: "40px" }}>
        Date: {data.date || ""}
      </div>

      {/* Hotel & Room */}
      <div style={{ position: "absolute", top: "150px", left: "40px" }}>
        Hotel Name: <span style={{ color: red }}>{data.hotelName || ""}</span>
      </div>

      <div style={{ position: "absolute", top: "175px", left: "40px" }}>
        Room Type: <span style={{ color: red }}>{data.roomType || ""}</span>
      </div>

      {/* Clients - orange bar */}
      <div
        style={{
          position: "absolute",
          top: "230px",
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
          top: "275px",
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

      {/* Booking instruction */}
      <div style={{ position: "absolute", top: "320px", left: "40px" }}>
        Please Reserve BOOK
      </div>

      {/* Room types */}
      <div
        style={{
          position: "absolute",
          top: "320px",
          left: "300px",
          lineHeight: 1.6,
        }}
      >
        <div>TWINS: —</div>
        <div>
          DOUBLES: <span style={{ color: red }}>{data.doubles || "0"}</span>
        </div>
        <div>SINGLES: —</div>
        <div>TRIPLES: —</div>
      </div>

      {/* Check-in / Check-out / Nights */}
      <div
        style={{
          position: "absolute",
          top: "430px",
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
          top: "520px",
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
          top: "590px",
          left: "40px",
          lineHeight: 1.5,
        }}
      >
        <div>Signed</div>
        <div>For: Jae Travel Expeditions</div>
        <div>Name: {data.agentName || "Antony Waititu"}</div>
      </div>
    </div>
  );
}