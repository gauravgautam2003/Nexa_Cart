import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId) {
    throw new Error("RAZORPAY_KEY_ID is not defined");
}

if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not defined");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

export default razorpay;