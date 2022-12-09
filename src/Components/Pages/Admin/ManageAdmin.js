import { Result } from "postcss";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import auth from "../../../firebase.init";

const ManageAdmin = () => {
  const [action, setAction] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    fetch("https://shohoj-pay-server.onrender.com/manageAdmin", {
      method: "PUT",
      headers: {
        email: email,
        action: action,
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          toast.error(data?.error, { id: "manageAdmin" });
        } else if (data?.success) {
          toast.success(data?.success, { id: "manageAdmin" });
          reset();
        } else {
          toast.error("Something went wrong.", { id: "manageAdmin" });
        }
      });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="eachServicesContainer md:w-[25rem] lg:w-[30rem] w-[22rem]">
        <h2 className="textColor text-[1.50rem] mb-6 pl-1">Manage Admin</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email")}
            required
            type="email"
            className="h-12 p-2 mb-4 w-full rounded-lg"
            placeholder="Enter email"
          />
          <button
            onClick={() => setAction("add")}
            type="submit"
            className="btn btn-sm btn-primary px-7 mr-2 rounded-lg"
            value="Add"
          >
            Add
          </button>
          <button
            onClick={() => setAction("remove")}
            type="submit"
            className="btn btn-sm btn-primary px-7  rounded-lg"
            value="Remove"
          >
            Remove
          </button>
        </form>
        <Link className="block mt-9 link" to={"/adminpanel/allAdmin"}>
          All Admins
        </Link>
      </div>
    </div>
  );
};

export default ManageAdmin;
