export const paymentMethods = [
  { id: "card", name: "Credit/Debit Card" },
  { id: "upi", name: "UPI/Google Pay" },
  { id: "cod", name: "Cash on Delivery" },
];

export const paymentLabels = {
  card: "Credit/Debit Card",
  upi: "UPI/Google Pay",
  cod: "Cash on Delivery",
};

export const createEmptyPaymentDetails = () => ({
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  upiId: "",
  codName: "",
  codPhone: "",
  codAddress: "",
});

export function validatePaymentDetails(paymentMethod, details) {
  if (paymentMethod === "card") {
    const cardNumber = details.cardNumber.replace(/\s/g, "");
    if (!details.cardName.trim()) return "Enter the card holder name.";
    if (!/^\d{12,19}$/.test(cardNumber)) return "Enter a valid card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry.trim())) {
      return "Enter expiry in MM/YY format.";
    }
    if (!/^\d{3,4}$/.test(details.cvv.trim())) return "Enter a valid CVV.";
  }

  if (paymentMethod === "upi") {
    if (!/^[\w.-]+@[\w.-]+$/.test(details.upiId.trim())) {
      return "Enter a valid UPI ID, like name@upi.";
    }
  }

  if (paymentMethod === "cod") {
    if (!details.codName.trim()) return "Enter receiver name.";
    if (!/^\d{10}$/.test(details.codPhone.trim())) return "Enter a valid 10 digit phone number.";
    if (details.codAddress.trim().length < 8) return "Enter delivery address.";
  }

  return "";
}

export function getPaymentSummary(paymentMethod, details) {
  if (paymentMethod === "card") {
    const cardNumber = details.cardNumber.replace(/\s/g, "");
    return `Card ending ${cardNumber.slice(-4)}`;
  }

  if (paymentMethod === "upi") {
    return `UPI: ${details.upiId.trim()}`;
  }

  return `COD: ${details.codName.trim()}, ${details.codPhone.trim()}`;
}

export default function PaymentDetailsForm({ paymentMethod, details, onChange }) {
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    background: "white",
  };

  const update = (field, value) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
      {paymentMethod === "card" && (
        <>
          <input
            value={details.cardName}
            onChange={(e) => update("cardName", e.target.value)}
            placeholder="Card holder name"
            style={inputStyle}
          />
          <input
            value={details.cardNumber}
            onChange={(e) => update("cardNumber", e.target.value)}
            placeholder="Card number"
            inputMode="numeric"
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input
              value={details.expiry}
              onChange={(e) => update("expiry", e.target.value)}
              placeholder="MM/YY"
              style={inputStyle}
            />
            <input
              value={details.cvv}
              onChange={(e) => update("cvv", e.target.value)}
              placeholder="CVV"
              inputMode="numeric"
              style={inputStyle}
            />
          </div>
        </>
      )}

      {paymentMethod === "upi" && (
        <input
          value={details.upiId}
          onChange={(e) => update("upiId", e.target.value)}
          placeholder="UPI ID, like name@upi"
          style={inputStyle}
        />
      )}

      {paymentMethod === "cod" && (
        <>
          <input
            value={details.codName}
            onChange={(e) => update("codName", e.target.value)}
            placeholder="Receiver name"
            style={inputStyle}
          />
          <input
            value={details.codPhone}
            onChange={(e) => update("codPhone", e.target.value)}
            placeholder="Phone number"
            inputMode="numeric"
            style={inputStyle}
          />
          <textarea
            value={details.codAddress}
            onChange={(e) => update("codAddress", e.target.value)}
            placeholder="Delivery address"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </>
      )}
    </div>
  );
}
