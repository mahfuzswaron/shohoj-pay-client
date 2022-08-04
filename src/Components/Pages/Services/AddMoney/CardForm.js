import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import "./CardForm.css";
import { Doughnut } from "react-chartjs-2";
import id from "date-fns/esm/locale/id/index.js";

const CardForm = ({ addAmount, setMinAmountErr }) => {
  const date = new Date().toLocaleDateString();

  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [user] = useAuthState(auth);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (
      addAmount >= 5 &&
      addAmount <= 999998.99 &&
      addAmount.slice(0, 1) !== "0"
    ) {
      setMinAmountErr("");
      fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ addAmount }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        });
    } else {
      setMinAmountErr("$5 is the minimum add amount.");
      setClientSecret("");
    }
  }, [addAmount]);

  const addMoneyToBackend = (id) => {
    const addMoneyInfo = {
      type: "addMoney",
      email: user.email,
      amount: addAmount,
      transactionId: id,
      date: date,
    };
    fetch("http://localhost:5000/addMoney", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ addMoneyInfo }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      addAmount <= 5 ||
      addAmount >= 999998.99 ||
      addAmount.slice(0, 1) == "0"
    ) {
      console.log(addAmount);
      setClientSecret("");
      console.log("true");
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
    const { error, paymentMethod } = await stripe.createPaymentMethod({
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
            name: `${user?.displayName}`,
            email: `${user?.email}`,
          },
        },
      }
    );

    if (intentErr) {
      toast.dismiss("waitingToast");
      setCardError(intentErr?.message);
    } else {
      const id = paymentIntent?.id;
      addMoneyToBackend(id);
      toast.dismiss("waitingToast");
      setClientSecret("");
      document.getElementById("addAmountInput").value = "";
      card.clear();
      setCardError("");
      toast.success(`$${addAmount} Added Successfully.`);
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
        <button
          className="actionButton btn mt-11"
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
