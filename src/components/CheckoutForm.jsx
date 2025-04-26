import { useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@clerk/clerk-react";

// Load Stripe with the publishable key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.error("Stripe publishable key is missing. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.");
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;
const BACKEND_URL = "https://aidf-horizone-backend-zafra.onrender.com";

const CheckoutForm = ({ bookingId }) => {
  console.log("Booking ID:", bookingId);

  const { getToken } = useAuth();

  const fetchClientSecret = useCallback(async () => {
    try {
      const token = await getToken(); // Get the Clerk JWT token
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Create a Checkout Session by calling the backend
      const res = await fetch(`${BACKEND_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create checkout session: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.clientSecret) {
        throw new Error("Client secret not returned from server");
      }

      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error; // Let Stripe handle the error display
    }
  }, [bookingId, getToken]);

  const options = { fetchClientSecret };

  if (!stripePromise) {
    return (
      <div className="text-red-500 text-center">
        Payment processing is unavailable due to a configuration error. Please contact support.
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;