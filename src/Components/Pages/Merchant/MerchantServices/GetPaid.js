import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useUser from "../../Hooks/useUser";
import { sendNotification } from "../../../../App";

const GetPaid = () => {
  const fullDate = new Date().toLocaleDateString();
  const date = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString();
  const [user] = useAuthState(auth);

  const [mongoUser] = useUser(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email, amount, payFor, productOrServiceName, reference } = data;

    if (amount.slice(0, 1) === "0") {
      toast.error("Invalid amount");
      return;
    }

    toast.loading("Money is being requested.", { id: "requestingMoney" });

    const requestMoneyInfo = {
      type: "getPaid",
      status: "Pending",
      requesterName: mongoUser?.name,
      amount: amount,
      from: user?.email,
      to: email,
      payFor,
      productOrServiceName,
      reference,
      fullDate,
      date,
      time,
      image: mongoUser?.avatar,
    };

    fetch("https://shohoj-pay-server.onrender.com/requestMoney", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ requestMoneyInfo }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.dismiss("requestingMoney");
        toast.dismiss();
        if (result?.error) {
          toast.error(result.error);
        } else {
          reset();
          sendNotification(email, "getPaid");
          toast.success(result.success);
        }
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center mt-20  ">
      <div className="eachServicesContainer md:w-[25rem] lg:w-[30rem] w-[22rem]">
        <h2 className="textColor text-[1.70rem] mb-11 pl-1">Get Paid</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email")}
            type="email"
            className="h-12 p-2 mt-4 w-full rounded"
            placeholder="Who to request from?"
            required
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <input
                {...register("payFor")}
                type="radio"
                name="payFor"
                value="product"
                className="radio radio-primary"
                id="product"
                required
              />
              <label>Product Payment</label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                {...register("payFor")}
                type="radio"
                name="payFor"
                value="service"
                className="radio radio-primary"
                id="service"
                required
              />
              <label>Service Payment</label>
            </div>
          </div>
          <input
            {...register("productOrServiceName")}
            type="text"
            className="h-12 p-2 mt-4 w-full rounded"
            placeholder="Product or service Name"
            required
          />
          <input
            {...register("amount", {
              min: {
                value: 5,
                message: "$5 is the minimum payment amount.",
              },
              max: {
                value: 1000,
                message: "$1000 is the maximum payment amount at a time.",
              },
            })}
            type="number"
            className="h-12 mt-4 p-2 w-full rounded"
            placeholder="Amount"
            required
          />
          {errors.amount?.message && (
            <span className="text-[12px] text-red-600">
              {errors.amount?.message}
            </span>
          )}
          <input
            {...register("reference")}
            type="text"
            className="h-12 p-2 mt-4 w-full rounded"
            placeholder="Reference"
            required
          />
          <input
            type="submit"
            className="actionButton mt-8 border-0"
            value="Request"
          />
        </form>
      </div>
    </div>
  );
};

export default GetPaid;
