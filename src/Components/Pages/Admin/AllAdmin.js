import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAdmin } from "../../../app/slices/allAdminSlice";
import Spinner from "../../Shared/Spinner/Spinner";

const AllAdmin = () => {
  const dispatch = useDispatch();
  const { allAdmins, isLoading } = useSelector((state) => state.allAdmin);

  useEffect(() => {
    dispatch(fetchAllAdmin());
  }, []);

  const handleRemove = (email) => {
    fetch("https://shohoj-pay-server.onrender.com/manageAdmin", {
      method: "PUT",
      headers: {
        email: email,
        action: "remove",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          toast.error(data?.error, { id: "manageAdmin" });
        } else if (data?.success) {
          dispatch(fetchAllAdmin());
          toast.success(data?.success, { id: "manageAdmin" });
        } else {
          toast.error("Something went wrong.", { id: "manageAdmin" });
        }
      });
  };

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  return (
    <div>
      <h1 className="md:text-3xl lg:text-3xl text-2xl mt-6 ml-14">
        All Admins
      </h1>
      <div className="overflow-x-auto w-full mt-6">
        <table className="table w-[90%] mx-auto">
          {/* <!-- head --> */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* <!-- row  --> */}
            {allAdmins &&
              allAdmins.map((admin) => {
                const { name, email, avatar, address, phone } = admin;
                return (
                  <tr>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={
                                avatar
                                  ? avatar
                                  : "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                              }
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{name}</div>
                          <div className="text-sm opacity-50">{email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{address && address}</td>
                    <td>{phone && phone}</td>
                    <th>
                      <button
                        onClick={() => handleRemove(email)}
                        className="btn btn-primary btn-xs"
                      >
                        Remove
                      </button>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAdmin;
