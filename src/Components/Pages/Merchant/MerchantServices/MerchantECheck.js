import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { sendNotification } from "../../../../App";
import auth from "../../../../firebase.init";
import useUser from "../../Hooks/useUser";
import emailjs from "@emailjs/browser";
import { v4 as uuidv4 } from "uuid";

const MerchantECheck = () => {
  const fullDate = new Date().toLocaleDateString();
  const date = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString();
  const [user] = useAuthState(auth);
  const [mongoUser] = useUser(user);
  const seriulNumber = uuidv4();
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAmount, setReceiverAmount] = useState("");
  const [receiverReference, setReceiverReference] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const form = useRef();
  const onSubmit = (data) => {
    const amount = data?.amount;
    setReceiverAmount(amount);
    const email = data?.email;
    setReceiverEmail(email);
    const reference = data?.reference;
    setReceiverReference(reference);
    const eCheckInfo = {
      type: "E-Check",
      email: user?.email,
      amount: amount,
      name: mongoUser?.name,
      from: user?.email,
      to: email,
      reference: reference,
      fullDate,
      date,
      time,
      serialNumber: seriulNumber,
      image: mongoUser?.avatar,
    };

    fetch("https://shohoj-pay-server.onrender.com/eCheck", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ eCheckInfo }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.dismiss("apply-eCheck");
        toast.dismiss();
        if (result?.error) {
          toast.error(result.error);
        } else {
          reset();
          sendNotification(email, "merchantECheck");
          emailjs
            .sendForm(
              // "YOUR_SERVICE_ID",
              "service_q11i3to",
              // "YOUR_TEMPLATE_ID",
              "template_60e7bmp",
              form.current,
              // "YOUR_PUBLIC_KEY"
              "_BZVGBP7_QzIIrIGO"
            )
            .then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
          console.log(result);
          toast.success(result.success);
        }
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center mt-20">
      <div className="eachServicesContainer md:w-[25rem] lg:w-[30rem] w-[22rem] relative">
        <h2 className="textColor text-[1.70rem] mb-11 pl-1">E-Check</h2>
        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("amount", {
              min: {
                value: 5,
                message: "$5 is the minimum amount.",
              },
              max: {
                value: 1000,
                message: "$1000 is the maximum amount at a time.",
              },
            })}
            type="number"
            className="h-12 p-2 w-full rounded"
            placeholder="How much to be paid?"
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
            placeholder="Who to issue"
            required
          />
          <input
            {...register("reference")}
            type="text"
            className="h-12 p-2 mt-4 w-full rounded"
            placeholder="Write reference"
            required
          />
          <div className="hidden">
            <input
              name="user_amount"
              type="text"
              defaultValue={receiverAmount}
            />
            <input name="user_email" type="text" defaultValue={receiverEmail} />
            <input
              name="user_reference"
              type="text"
              defaultValue={receiverReference}
            />
            <input
              name="sender_name"
              type="text"
              defaultValue={mongoUser?.name}
            />
            <input name="sender_email" type="text" defaultValue={user?.email} />

            <input
              name="user_serialNumber"
              type="text"
              defaultValue={seriulNumber}
            />
            <input name="user_date" type="text" defaultValue={fullDate} />
          </div>
          <input
            type="submit"
            className="actionButton mt-12 border-0"
            value="Issue"
          />
        </form>
      </div>
    </div>
  );
};

export default MerchantECheck;
