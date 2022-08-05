import { Result } from "postcss";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import auth from "../../../../firebase.init";
import "./SendMoney.css";

const SendMoney = () => {
  const date = new Date().toLocaleDateString();
  const [user] = useAuthState(auth);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const amount = data?.amount;
    const email = data?.email;

    if (amount.slice(0, 1) === "0") {
      toast.error("Invalid amount");
      return;
    }

    toast.loading("Money is being sended.", { id: "sendingMoney" });

    const sendMoneyInfo = {
      type: "sendMoney",
      name: user?.displayName,
      email: user?.email,
      from: user?.email,
      to: email,
      amount: amount,
      date: date,
    };

    fetch("http://localhost:5000/sendMoney", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ sendMoneyInfo }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.dismiss("sendingMoney");
        if (result?.error) {
          toast.error(result.error);
        } else {
          reset();
          toast.success(result.success);
        }
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="eachServicesContainer md:w-[25rem] lg:w-[30rem] w-[22rem]">
        <h2 className="textColor text-[1.70rem] mb-11 pl-1">Send Money</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("amount", {
              min: {
                value: 5,
                message: "$5 is the minimum send amount.",
              },
              max: {
                value: 1000,
                message: "$1000 is the maximum send amount at a time.",
              },
            })}
            type="number"
            className="h-12 p-2 w-full rounded"
            placeholder="How much to send?"
            required
          />
          {errors.amount?.message && (
            <span className="text-[12px] text-red-600">
              {errors.amount?.message}
            </span>
          )}
          <input
            {...register("email")}
            type="email"
            className="h-12 p-2 mt-4 w-full rounded"
            placeholder="Receivers email"
            required
          />
          <input
            type="submit"
            className="actionButton mt-12 border-0"
            value="Send"
          />
        </form>
      </div>
    </div>
  );
};

export default SendMoney;
