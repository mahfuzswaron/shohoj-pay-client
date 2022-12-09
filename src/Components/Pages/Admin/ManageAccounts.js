import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Pagination from "../../Shared/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "../../../app/slices/allUserSlice";
import Spinner from "../../Shared/Spinner/Spinner";

const ManageAccounts = () => {
  // const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailToSearch, setEmailToSearch] = useState("");

  const dispatch = useDispatch();
  const { isLoading, allUsers, error } = useSelector((state) => state.allUser);

  useEffect(() => {
    dispatch(fetchAllUser(emailToSearch));
  }, []);

  // PAGINATION HERE
  let PageSize = 15;
  const paginateUsers = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return allUsers.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, allUsers, PageSize]);

  // User acc status update
  const updateUserStatus = (email, action) => {
    fetch("https://shohoj-pay-server.onrender.com/updateAccountStatus", {
      method: "PUT",
      headers: {
        email: email,
        action: action,
        authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          dispatch(fetchAllUser(emailToSearch));
          toast.success(data.success, {
            id: "accStatusUpdateToast",
          });
        } else if (data?.error) {
          toast.error(data.error, {
            id: "accStatusUpdateToast",
          });
        } else {
          toast.error("Something went wrong.", {
            id: "accStatusUpdateToast",
          });
        }
      });
  };

  return (
    <div>
      <h2 className="md:text-3xl lg:text-3xl text-2xl mt-6 ml-14">
        Manage Accounts
      </h2>
      <div className="w-[90%] mx-auto">
        <div className="max-w-fit ml-auto flex align-center mt-3 md:mt-0 lg:mt-0">
          <input
            onChange={(e) => setEmailToSearch(e.target.value)}
            type="text"
            placeholder="Search by email"
            className="input input-bordered h-[35px] mr-2 block"
          />
          <button
            onClick={() => {
              dispatch(fetchAllUser(emailToSearch));
            }}
            className="btn btn-primary btn-sm block"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto md:mt-4 lg:mt-4 mt-2">
        {isLoading && <Spinner />}
        {!isLoading && allUsers?.length !== 0 && (
          <table className="table w-[90%] mx-auto">
            {/* <!-- head --> */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers &&
                paginateUsers.map((user) => {
                  const {
                    name,
                    email,
                    avatar,
                    address,
                    phone,
                    type,
                    city,
                    country,
                  } = user;
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
                      <td>{type && type}</td>
                      <td>{country && city && city + "," + " " + country}</td>
                      <td>{phone && phone}</td>
                      <th>
                        {user.status === "active" ? (
                          <button
                            onClick={() => updateUserStatus(email, "deactive")}
                            className="btn btn-primary btn-xs"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(email, "active")}
                            className="btn btn-primary btn-xs"
                          >
                            Activate
                          </button>
                        )}
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
        {allUsers.length === 0 && (
          <div className="min-h-[60vh] flex justify-center items-center">
            <h2 className="text-2xl">No user found ;(</h2>
          </div>
        )}
        <div className={`mt-8  ${allUsers.length < 10 && "hidden"}`}>
          {/* START PAGINATION */}
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={allUsers?.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAccounts;
