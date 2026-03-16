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

  statusBadge: {
    position: "absolute",
    top: 140,
    right: 40,
    padding: "4 8",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },

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

  roomRowItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  roomLabel: {
    fontWeight: 700,
    width: 60,
  },
  roomValue: {
    color: "#ff7a00",
    fontWeight: "bold",
  },

  extraBedSection: {
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#ff7a00",
    borderTopStyle: "dashed",
  },
  extraBedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraBedLabel: {
    fontWeight: 700,
    width: 60,
  },
  extraBedValue: {
    color: "#ff7a00",
    fontWeight: "bold",
    marginRight: 4,
  },
  extraBedNote: {
    fontSize: 9,
    color: "#666",
    marginLeft: 4,
  },

  checkinBlock: { position: "absolute", top: 430, left: 40 },
  checkinRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  checkinLabel: {
    fontWeight: 700,
    width: 100,
  },
  checkinValue: {
    color: "#ff7a00",
    fontWeight: "bold",
  },

  remarksBlock: { position: "absolute", top: 520, left: 40, right: 40 },
  remarksRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  remarksLabel: {
    fontWeight: 700,
    width: 70,
  },
  remarksValue: {
    color: "#ff7a00",
    fontWeight: "bold",
    flex: 1,
  },

  signatureBlock: { position: "absolute", top: 620, left: 40 },
  signatureRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  signatureLabel: {
    fontWeight: 700,
    width: 50,
  },
  signatureValue: {
    color: "#ff7a00",
    fontWeight: "bold",
  },

  label: { fontWeight: 700 },
  value: { color: "#ff7a00", fontWeight: "bold" },
});

interface Props {
  data: VoucherData;
}

export default function VoucherPDF({ data }: Props) {
  // Helper function to safely convert to number
  const toNumber = (val: string | number | undefined): number => {
    if (val === undefined || val === "") return 0;
    return typeof val === 'string' ? parseInt(val) || 0 : val;
  };

  // Get booking text based on status
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

  // Get booking color based on status
  const getBookingColor = () => {
    switch (data.bookingStatus) {
      case "book":
        return "#008000";
      case "amend":
        return "#FFA500";
      case "cancel":
        return "#FF0000";
      default:
        return "#008000";
    }
  };

  // Check if extra bed should be shown
  const hasChildren = toNumber(data.children) > 0;
  const hasExtraBed = toNumber(data.extraBed) > 0;
  const childrenCount = toNumber(data.children);
  const extraBedCount = toNumber(data.extraBed);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logos */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logos/left-logo.png" />
          <Image style={styles.logo} src="/logos/right-logo.png" />
        </View>

        {/* Voucher Number */}
        <Text style={styles.voucherNo}>Voucher No: {data.voucherNo}</Text>

        {/* Date */}
        <Text style={styles.date}>Date: {data.date}</Text>

        {/* Status Badge - only show for non-book statuses */}
        {data.bookingStatus && data.bookingStatus !== "book" && (
          <View style={[styles.statusBadge, { 
            backgroundColor: data.bookingStatus === "cancel" ? "#FF0000" : "#FFA500" 
          }]}>
            <Text>{data.bookingStatus === "cancel" ? "CANCELLED" : "AMENDED"}</Text>
          </View>
        )}

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
          <View style={styles.roomRowItem}>
            <Text style={styles.roomLabel}>TWINS:</Text>
            <Text style={styles.roomValue}>{data.twins || ""}</Text>
          </View>
          
          <View style={styles.roomRowItem}>
            <Text style={styles.roomLabel}>DOUBLES:</Text>
            <Text style={styles.roomValue}>{data.doubles || ""}</Text>
          </View>
          
          <View style={styles.roomRowItem}>
            <Text style={styles.roomLabel}>SINGLES:</Text>
            <Text style={styles.roomValue}>{data.singles || ""}</Text>
          </View>
          
          <View style={styles.roomRowItem}>
            <Text style={styles.roomLabel}>TRIPLES:</Text>
            <Text style={styles.roomValue}>{data.triples || ""}</Text>
          </View>
          
          {/* Extra Bed - conditionally shown */}
          {hasChildren && hasExtraBed && (
            <View style={styles.extraBedSection}>
              <View style={styles.extraBedRow}>
                <Text style={styles.roomLabel}>EXTRA BED:</Text>
                <Text style={styles.roomValue}>{extraBedCount}</Text>
                <Text style={styles.extraBedNote}>
                  (for {childrenCount} child{childrenCount > 1 ? 'ren' : ''})
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Check-in / Check-out / Nights */}
        <View style={styles.checkinBlock}>
          <View style={styles.checkinRow}>
            <Text style={styles.checkinLabel}>Check in:</Text>
            <Text style={styles.checkinValue}>{data.checkIn}</Text>
          </View>
          
          <View style={styles.checkinRow}>
            <Text style={styles.checkinLabel}>Check out:</Text>
            <Text style={styles.checkinValue}>{data.checkOut}</Text>
          </View>
          
          <View style={styles.checkinRow}>
            <Text style={styles.checkinLabel}>Number of Nights:</Text>
            <Text style={styles.checkinValue}>{data.nights}</Text>
          </View>
        </View>

        {/* Remarks */}
        <View style={styles.remarksBlock}>
          <View style={styles.remarksRow}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <Text style={styles.remarksValue}>{data.remarks}</Text>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>Signed</Text>
          </View>
          
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>For:</Text>
            <Text style={styles.signatureValue}>{data.signedFor || "Jae Travel Expeditions"}</Text>
          </View>
          
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>Name:</Text>
            <Text style={styles.signatureValue}>{data.signedName || data.agentName || "Antony Waititu"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}