import { VoucherData } from "@/lib/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#000",
  },

  header: {
    position: "absolute",
    top: 25,
    left: 40,
    right: 40,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: { width: 130, height: "auto" },

  voucherNo: {
    position: "absolute",
    top: 115,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
    fontWeight: 700,
  },

  date: { position: "absolute", top: 145, left: 40 },

  hotelRow: { position: "absolute", top: 175, left: 40, flexDirection: "row" },
  roomRow: { position: "absolute", top: 200, left: 40, flexDirection: "row" },

  orangeBar: {
    position: "absolute",
    top: 235,
    left: 40,
    width: 515,
    height: 28,
    backgroundColor: "#ff7a00",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },

  adultsRow: {
    position: "absolute",
    top: 280,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bookText: { 
    position: "absolute", 
    top: 330, 
    left: 40, 
    fontWeight: 700,
    fontSize: 12,
  },
  roomsSection: { position: "absolute", top: 330, left: 260 },

  extraBedSection: {
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderTopStyle: "dashed",
  },
  extraBedText: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  extraBedValue: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  extraBedNote: {
    fontSize: 9,
    color: "#666",
    marginLeft: 4,
  },

  checkinBlock: { position: "absolute", top: 430, left: 40 },
  remarksBlock: { position: "absolute", top: 520, left: 40, right: 40 },
  signatureBlock: { position: "absolute", top: 620, left: 40 },

  statusBadge: {
    position: "absolute",
    top: 100,
    right: 40,
    padding: "4 8",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },

  label: { fontWeight: 700 },
  value: { color: "#c00" },
});

interface Props {
  data: VoucherData;
}

export default function VoucherPDF({ data }: Props) {
  // Get booking text based on status
  const getBookingText = () => {
    switch (data.bookingStatus) {
      case "book":
        return "Please Book";
      case "amend":
        return "Please Amend";
      case "reserve":
      default:
        return "Please Reserve";
    }
  };

  // Get booking color based on status
  const getBookingColor = () => {
    switch (data.bookingStatus) {
      case "book":
        return "#008000";
      case "amend":
        return "#FFA500";
      default:
        return "#000";
    }
  };

  // Check if extra bed should be shown
  const hasChildren = data.children && parseInt(data.children.toString()) > 0;
  const hasExtraBed = data.extraBed && parseInt(data.extraBed.toString()) > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logos */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logos/left-logo.png" />
          <Image style={styles.logo} src="/logos/right-logo.png" />
        </View>

        {/* Status Badge */}
        {data.bookingStatus && data.bookingStatus !== "reserve" && (
          <View style={[styles.statusBadge, { 
            backgroundColor: data.bookingStatus === "book" ? "#4CAF50" : "#FFA500" 
          }]}>
            <Text>{data.bookingStatus === "book" ? "BOOKED" : "AMENDED"}</Text>
          </View>
        )}

        {/* Voucher Number */}
        <Text style={styles.voucherNo}>Voucher No: {data.voucherNo}</Text>

        {/* Date */}
        <Text style={styles.date}>Date: {data.date}</Text>

        {/* Hotel Name */}
        <View style={styles.hotelRow}>
          <Text style={styles.label}>Hotel Name: </Text>
          <Text style={styles.value}>{data.hotelName}</Text>
        </View>

        {/* Room Type */}
        <View style={styles.roomRow}>
          <Text style={styles.label}>Room Type : </Text>
          <Text style={styles.value}>{data.roomType}</Text>
        </View>

        {/* Orange CLIENTS bar */}
        <View style={styles.orangeBar}>
          <Text style={{ fontWeight: 700, marginRight: 10 }}>CLIENTS:</Text>
          <Text>{data.clients}</Text>
        </View>

        {/* Adults & Children */}
        <View style={styles.adultsRow}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of Adults: </Text>
            <Text style={styles.value}>{data.adults}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of children under 12 years </Text>
            <Text style={styles.value}>{data.children}</Text>
          </View>
        </View>

        {/* Dynamic Booking Text */}
        <Text style={[styles.bookText, { color: getBookingColor() }]}>
          {getBookingText()}
        </Text>

        {/* Room Breakdown */}
        <View style={styles.roomsSection}>
          <Text>
            TWINS: <Text style={styles.value}>{data.twins || ""}</Text>
          </Text>
          <Text>
            DOUBLES: <Text style={styles.value}>{data.doubles || ""}</Text>
          </Text>
          <Text>
            SINGLES: <Text style={styles.value}>{data.singles || ""}</Text>
          </Text>
          <Text>
            TRIPLES: <Text style={styles.value}>{data.triples || ""}</Text>
          </Text>
          
          {/* Extra Bed - conditionally shown */}
          {hasChildren && hasExtraBed && (
            <View style={styles.extraBedSection}>
              <Text>
                <Text style={styles.extraBedText}>EXTRA BED: </Text>
                <Text style={styles.extraBedValue}>{data.extraBed}</Text>
                <Text style={styles.extraBedNote}>
                  {' '}(for {data.children} child{parseInt(data.children.toString()) > 1 ? 'ren' : ''})
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Check-in / Check-out / Nights */}
        <View style={styles.checkinBlock}>
          <Text>
            Check in: <Text style={styles.value}>{data.checkIn}</Text>
          </Text>
          <Text>
            Check out: <Text style={styles.value}>{data.checkOut}</Text>
          </Text>
          <Text>
            Number of Nights: <Text style={styles.value}>{data.nights}</Text>
          </Text>
        </View>

        {/* Remarks */}
        <View style={styles.remarksBlock}>
          <Text style={styles.label}>Remarks: </Text>
          <Text style={styles.value}>{data.remarks}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Text>Signed</Text>
          <Text>For: {data.signedFor || "Jae Travel Expeditions"}</Text>
          <Text>Name: {data.signedName || data.agentName || "Antony Waititu"}</Text>
        </View>
      </Page>
    </Document>
  );
}