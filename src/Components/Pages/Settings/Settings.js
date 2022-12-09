import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./settings.css";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Shared/Spinner/Spinner";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../../app/slices/countryCitySlice";
import { fetchUserInfo } from "../../../app/slices/userInfoSlice";
const Settings = () => {
  const [editAddress, setEditAddress] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editName, setEditName] = useState(false);
  const { isLoading, userInfo } = useSelector(
    (state) => state.userInfo
  );
  const { isCountryLoading, allCountries } = useSelector(
    (state) => state.countryCity
  );
  const [firebaseUser, loading] = useAuthState(auth);
  const [user, setUser] = useState({})
  const [userName, setUserName] = useState(user?.name);
  const [userEmail] = useState(user?.email);
  const [userPhone, setUserPhone] = useState(user?.phone);
  const [nameCanSave, setNameCanSave] = useState(false);
  const [AddressCanSave, setAddressCanSave] = useState(false);
  // address
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  // -----------
  const [PhoneCanSave, setPhoneCanSave] = useState(false);
  const [updatedImg, setUpdatedImg] = useState(user?.avatar);
  const navigate = useNavigate();
  const imageStorageKey = `d65dd17739f3377d4d967e0dcbdfac26`;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserInfo(firebaseUser));
  }, [firebaseUser, dispatch]);

  useEffect(() => {
    setUser(userInfo);
    setCountry(userInfo?.country)
    setCity(userInfo.city);
  }, [userInfo])

  useEffect(() => {
    dispatch(fetchCountries());
  }, [userInfo, dispatch]);

  useEffect(() => {
    setCountries([...new Set(allCountries.map((item) => item.country))]);
  }, [allCountries])

  useEffect(() => {
    const cities = allCountries.filter((c) => c.country === country);
    setCities(cities.map((c) => c.name).sort());
  }, [countries, allCountries, country]);

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
    toast.loading("image is being uploaded", { id: "img-upload-loading" });
    const imgUploadRes = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const imgUploadResult = await imgUploadRes.json();
    toast.dismiss("img-upload-loading");
    if (imgUploadResult.success) {
      setUpdatedImg(imgUploadResult.data.url);
      setNameCanSave(true);
      toast.success("press save to keep change");
    } else {
      toast.error("something went wrong!");
    }
  };

  const updateUser = (updatedUser) => {
    fetch("https://shohoj-pay-server.onrender.com/updateUserInfo", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        email: user.email,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          if (updatedUser.name || updatedUser.avatar) {
            setEditName(false);
            setNameCanSave(false);
          } else if (updatedUser.city || updatedUser.country) {
            setEditAddress(false);
            setAddressCanSave(false);
          } else if (updatedUser.phone) {
            setEditContact(false);
            setPhoneCanSave(false);
          }
        }
      });
  };
  if (isCountryLoading || loading || isLoading) return <Spinner />;
  return (
    <section className="px-3 pt-20 lg:px-20 lg:pb-20 lg:pt-40 lg:flex w-full">
      {/* right part */}
      <div className="w-full lg:w-1/2 order-2 p-3 lg:p-10 ">
        {/* user div */}
        <div className="rounded-lg p-5 w-full lg:w-10/12 bg-white relative">
          <div className="w-full flex-col items-center ">
            <div>
              <figure className="flex justify-start items-end  relative ">
                <img
                  src={updatedImg || user?.avatar}
                  alt="profile "
                  className="h-44 w-44 mask mask-circle"
                />
                <label
                  htmlFor="imgInput"
                  title="upload new picture"
                  className={`${editName
                    ? " cursor-pointer p-1 flex justify-center items-center bg-base-100 relative right-12 rounded-full"
                    : "hidden"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path
                      fillRule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <input
                  className="hidden"
                  id="imgInput"
                  type={"file"}
                  accept="image/*"
                  onChange={(e) => uploadImg(e)}
                />
              </figure>
            </div>
            <div className="w-full">
              <input
                disabled={!editName}
                className="input input-text text-2xl lg:text-3xl lg:text-left text-center bg-white w-full"
                type="text"
                value={userName || user?.name}
                onChange={(e) => {
                  setNameCanSave(true);
                  setUserName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center justify-around">
            <div
              onClick={() => setEditName(true)}
              className={`${editName && "hidden"
                } cursor-pointer place-self-center`}
            >
              {/* edit  */}
              <FontAwesomeIcon className=" text-gray-500" icon={faPen} />
            </div>
            <div
              onClick={() => {
                setEditName(false);
                setUpdatedImg(user?.avatar);
                setUserName(user?.name);
              }}
              className={`${!editName && "hidden"
                } cursor-pointer px-4 py-2 rounded-lg place-self-center`}
            >
              {/* cancel  */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <button
              disabled={!nameCanSave}
              onClick={() => {
                if (user.avatar !== updatedImg && userName) {
                  updateUser({ name: userName, avatar: updatedImg });
                } else if (user.avatar !== updatedImg) {
                  updateUser({ avatar: updatedImg });
                } else {
                  updateUser({ name: userName });
                }
              }}
              className={`${!editName && "hidden"
                }  btn btn-sm btn-primary place-self-center`}
            >
              {/* save  */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* security div */}
        <div className="rounded-lg p-5 w-full lg:w-10/12 place-self-end  mr-0 mt-5 bg-white ">
          {/* title div */}
          <div className="w-1/2 ">
            <h3 className="text-xl text-left ">Security</h3>
          </div>
          <p
            onClick={() => navigate("/resetPassword")}
            className={"cursor-pointer btn-link"}
          >
            change your current password
          </p>
        </div>
      </div>

      {/* left part  */}
      <div className=" w-full lg:w-1/2 grid grid-cols-1 gap-5 p-5">
        {/* address section */}
        <div className="rounded-lg p-5 w-full lg:w-10/12 place-self-end  bg-white ">
          {/* title div */}
          <div className="flex justify-between items-center relative">
            <h3 className="text-xl text-left ">Address</h3>

            <div className=" flex items-center justify-around">
              <div
                onClick={() => setEditAddress(true)}
                className={`${editAddress && "hidden"
                  } cursor-pointer place-self-center`}
              >
                {/* edit  */}
                <FontAwesomeIcon className=" text-gray-500" icon={faPen} />
              </div>

              <div
                onClick={() => {
                  setEditAddress(false);
                  setCity(user?.city);
                  setCountry(user?.country);
                }}
                className={`${!editAddress && "hidden"
                  } cursor-pointer px-4 py-2 rounded-lg place-self-center`}
              >
                {/* cancel  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <button
                disabled={!AddressCanSave}
                onClick={() => {
                  if (country && city) {
                    updateUser({ country: country, city: city });
                  } else if (country) {
                    updateUser({ city: city });
                  } else {
                    updateUser({ country: country });
                  }
                }}
                className={`${!editAddress && "hidden"
                  }  btn btn-sm btn-primary place-self-center`}
              >
                {/* save  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2">
            {/* country  */}
            <form className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <label className="flex items-center font-semibold ">
                Country:
              </label>
              <select
                disabled={!editAddress}
                className="select select-bordered col-span-5"
                onChange={(e) => {
                  setCountry(e.target.value);
                  setAddressCanSave(true);
                }}
                value={country || user?.country}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </form>
            <hr />

            <form className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <label className="flex items-center font-semibold ">City:</label>
              <select
                disabled={!editAddress}
                className="select select-bordered col-span-5"
                onChange={(e) => {
                  setCity(e.target.value);
                  setAddressCanSave(true);
                }}
                value={city || user?.city}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>
        {/* contact div */}
        <div className="rounded-lg p-5 w-full lg:w-10/12 place-self-end  mr-0 bg-white ">
          {/* title div */}
          <div className="flex justify-between items-center relative">
            <h3 className="text-xl text-left ">Contact</h3>

            <div className=" flex items-center justify-around">
              <div
                onClick={() => setEditContact(true)}
                className={`${editContact && "hidden"
                  } cursor-pointer place-self-center`}
              >
                {/* edit  */}
                <FontAwesomeIcon className=" text-gray-500" icon={faPen} />
              </div>
              <div
                onClick={() => {
                  setEditContact(false);
                  setUserPhone(user?.phone);
                }}
                className={`${!editContact && "hidden"
                  } cursor-pointer px-4 py-2 rounded-lg place-self-center`}
              >
                {/* cancel  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <button
                disabled={!PhoneCanSave}
                onClick={() => updateUser({ phone: userPhone })}
                className={`${!editContact && "hidden"
                  }  btn btn-sm btn-primary place-self-center`}
              >
                {/* save  */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* options container */}

          <div className="mt-5 grid grid-cols-1 gap-2">
            {/* Email */}
            <form className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <label className="flex items-center font-semibold ">Email:</label>
              <input
                disabled={true}
                className="input input-text  bg-white col-span-5"
                type="email"
                value={userEmail || user?.email}
              />
            </form>
            <hr />

            {/* phone number */}
            <form className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <label className="flex items-center font-semibold ">
                Phone :
              </label>
              <input
                onChange={(e) => {
                  setUserPhone(e.target.value);
                  setPhoneCanSave(true);
                }}
                disabled={!editContact}
                className="input input-text  bg-white col-span-5"
                type={"tel"}
                value={userPhone || user?.phone}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
