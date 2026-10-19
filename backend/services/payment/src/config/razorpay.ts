import Razorpay from "razorpay";

let client: Razorpay | null | undefined;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

/**
 * Razorpay is optional: without keys the service still boots and the store
 * falls back to cash-on-delivery. The client is created lazily so a missing
 * key can never crash the process at import time.
 */
export const isRazorpayConfigured = (): boolean =>
    Boolean(keyId && keySecret);

export const getRazorpayKeyId = (): string | undefined => keyId;

export const getRazorpay = (): Razorpay => {
    if (!isRazorpayConfigured()) {
        throw new Error("Payment gateway is not configured");
    }

    if (client === undefined) {
        client = new Razorpay({
            key_id: keyId as string,
            key_secret: keySecret as string,
        });
    }

    return client as Razorpay;
};
