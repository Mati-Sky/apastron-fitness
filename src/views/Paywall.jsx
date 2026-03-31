import { signOut } from "firebase/auth";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Paywall = ({ onSuccess, setView , signOut,auth}) => {
  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Unlock Premium</h1>
        <p className="text-slate-800 mb-8 text-center">
          Access workout tracking, program generation, and more.
        </p>
         <p className="text-red-400 mb-8 text-center">
          **This is just a demo simulating payment, no actual money is handled by this unit yet**
        </p>

        {/* PAYMENT OPTIONS */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">

          {/* PAYPAL CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-bold text-blue-700 mb-2">PayPal</h2>
            <p className="text-sm text-slate-800 mb-4">
              Pay securely with PayPal
            </p>

            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: "5.00" } }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                await onSuccess(details);
              }}
            />
          </div>

          {/* MPESA CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-bold mb-2 text-green-600">
              M-Pesa
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Pay via mobile money (Demo)
            </p>

            <button
              onClick={() => {
                alert("Simulating M-Pesa payment...");
                setTimeout(() => {
                  onSuccess({ method: "mpesa-demo" });
                }, 1500);
              }}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl"
            >
              Pay with M-Pesa
            </button>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex gap-4">

          <button
            onClick={() => setView("dashboard")}
            className="px-4 py-2 bg-red-600 text-white rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={async () => {  
              await signOut(auth);        
              setView("auth");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl"
          >
            Back to Login
          </button>

        </div>

      </div>
    </PayPalScriptProvider>
  );
};

export default Paywall;