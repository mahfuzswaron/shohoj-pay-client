import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import "./CardForm.css";
import useUser from "../../Hooks/useUser";

const CardForm = ({ addAmount, setAmountErr }) => {
  const fullDate = new Date().toLocaleDateString();
  const date = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString();

  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [user, loading] = useAuthState(auth);
  const [mongoUser, mongoUserLoading] = useUser(user);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (addAmount < 10) {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("$10 is the minimum add amount.");
      return;
    }
    if (addAmount > 1000) {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("$1000 is the maximum add amount at a time.");
      return;
    }
    if (addAmount.slice(0, 1) === "0") {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("Invalid add amount.");
      return;
    }

    if (addAmount)
      if (
        addAmount >= 5 &&
        addAmount <= 1000 &&
        addAmount.slice(0, 1) !== "0"
      ) {
        setAmountErr("");
        fetch("https://shohoj-pay-server.onrender.com/create-payment-intent", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ addAmount }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.clientSecret) {
              setClientSecret(data.clientSecret);
            }
          });
      }
  }, [addAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addAmount < 5) {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("$5 is the minimum add amount.");
      return;
    }
    if (addAmount > 1000) {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("$1000 is the maximum add amount at a time.");
      return;
    }
    if (addAmount.slice(0, 1) === "0") {
      setClientSecret("");
      setAmountErr("");
      setAmountErr("Invalid add amount.");
      return;
    }

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    toast.loading("Money is being added.", {
      id: "waitingToast",
    });

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    setCardError(error?.message || "");

    const { paymentIntent, error: intentErr } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: `${mongoUser?.name}`,
            email: `${user?.email}`,
          },
        },
      }
    );
    const image = "https://static.thenounproject.com/png/1109435-200.png";
    if (intentErr) {
      toast.dismiss("waitingToast");
      setCardError(intentErr?.message);
    } else {
      const id = paymentIntent?.id;
      const addMoneyInfo = {
        image,
        type: "Add Money",
        email: user?.email,
        name: mongoUser?.name,
        amount: addAmount,
        transactionId: id,
        fullDate,
        date,
        time,
      };

      fetch("https://shohoj-pay-server.onrender.com/addMoney", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ addMoneyInfo }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.dismiss("waitingToast");
          setCardError("");
          setClientSecret("");
          if (data?.success) {
            document.getElementById("addAmountInput").value = "";
            card.clear();
            toast.success(data.success);
          } else {
            toast.error(data.error);
          }
        });
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              padding: "10px",
              base: {
                fontSize: "16px",
                color: "#424770",
                lineHeight: "3rem",
                borderRadius: 30,
                "::placeholder": {
                  color: "#aab7c4",
                },
                backgroundColor: "#fff",
                // height: "12rem"
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <p className="text-xs text-red-500 mt-1">{cardError && cardError}</p>
        <p className="ml-1 gray text-sm mt-4">Enjoy free add money.</p>
        <button
          className="actionButton btn mt-9"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default CardForm;
