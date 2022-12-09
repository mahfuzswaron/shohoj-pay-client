import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useToken from "../../Hooks/useToken";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import Spinner from "../../../Shared/Spinner/Spinner";
import useUser from "../../Hooks/useUser";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateSignUpLoading } from "../../../../app/slices/signUpLoadingSlice";
import FirstPart from "./FirstPart";
import SecondPart from "./SecondPart";
import LastPart from "./LastPart";

const SignUp = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showNamePart, setShowNamePart] = useState(true);
  const [showPasswordPart, setShowPasswordPart] = useState(false);
  const [showTypePart, setShowTypePart] = useState(false);
  const [progress, setProgress] = useState(1);
  const [dbUserCreationLoading, setDbUserCreationLoading] = useState(false);
  const imageStorageKey = `d65dd17739f3377d4d967e0dcbdfac26`;
  const passwordShowRef = useRef("");
  const date = new Date().toLocaleDateString();
  const dispatch = useDispatch();

  const [
    createUserWithEmailAndPassword,
    user,
    userCreatLoading,
    userCreateError,
  ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });
  const [updateProfile, updating, uerror] = useUpdateProfile(auth);

  const [token, tokenLoading] = useToken(user);
  const [mongoUser, mongoUserLoading] = useUser(user);
  // const { signUpLoading } = useSelector((state) => state.signUpLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(updateSignUpLoading(true));
    const email = data.email;
    const password = data.password;
    if (data.password !== data.ConfirmPassword) {
      dispatch(updateSignUpLoading(false));
      return toast.error("Opps Password Not Match");
    }

    const emailCheckResponse = await axios.get(
      `https://shohoj-pay-server.onrender.com/checkemailexists/${email}`
    );
    if (emailCheckResponse?.data?.error) {
      dispatch(updateSignUpLoading(false));
      return toast.error(emailCheckResponse.data.error, {
        id: "emailExistsErr",
      });
    }

    setDbUserCreationLoading(true);
    const defautlAvatar = "https://i.ibb.co/W3KKWsd/default-avatar.png";
    const file = data.avatar[0];
    let avatarImg = "";
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
      const imgUploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const imgUploadResult = await imgUploadRes.json();

      if (!imgUploadResult.success === true) {
        dispatch(updateSignUpLoading(false));
        setDbUserCreationLoading(false);
        return toast.error("Something went wrong.", {
          id: "signUpERR",
        });
      }
      if (imgUploadRes) {
        avatarImg = imgUploadResult.data.url;
      }
    }
    const userInfo = {
      ...data,
      avatar: avatarImg || defautlAvatar,
      date,
      status: "active",
    };
    delete userInfo.password;
    delete userInfo.ConfirmPassword;

    const userUploadRes = await fetch("https://shohoj-pay-server.onrender.com/createAccount", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userInfo }),
    });

    const userUploadResult = await userUploadRes.json();

    if (!userUploadResult?.userResult?.insertedId) {
      dispatch(updateSignUpLoading(false));
      setDbUserCreationLoading(false);
      return toast.error("Something went wrong.", {
        id: "signUpERR",
      });
    }
    await setDbUserCreationLoading(false);
    await createUserWithEmailAndPassword(email, password);
    await updateProfile({ displayName: data.name });
  };

  if (
    userCreatLoading ||
    tokenLoading ||
    mongoUserLoading ||
    dbUserCreationLoading ||
    updating
  ) {
    return <Spinner />;
  }

  if (user && token && mongoUser) {
    dispatch(updateSignUpLoading(false));
    if (mongoUser.type === "admin") {
      navigate("/adminpanel/summary");
    } else if (mongoUser?.type === "merchant") {
      navigate("/merchant/dashboard");
    } else if (mongoUser.type === "personal") {
      navigate("/dashboard");
    }
  }

  const handleShow = () => {
    const passShow = passwordShowRef.current.checked;
    setShow(passShow);
  };

  if (userCreateError || uerror) {
    dispatch(updateSignUpLoading(false));
    const error =
      userCreateError?.message.split(":")[1] || uerror?.message.split(":")[1];
    toast.error(error, {
      id: "userCreationToast",
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-center w-full h-full">
      <div className=" bg-secondary w-full h-full p-20 hidden lg:block">
        <ul className="steps steps-vertical h-full text-white">
          <li className={`step step-primary`}>Name and Address</li>
          <li className={`step ${progress > 1 && "step-primary"}`}>
            Contact, Type, Image
          </li>
          <li className={`step ${progress > 2 && "step-primary"}`}>Password</li>
        </ul>
      </div>

      <div className=" lg:p-24 px-5 py-16 col-span-2 place-self-center">
        <div className="lg:w-96 w-full">
          <h2
            data-testid="signUp-heading"
            className="text-center font-bold text-xl"
          >
            Sign Up
          </h2>
          <form autoComplete="new-off" onSubmit={handleSubmit(onSubmit)}>
            {/* Name and Email part  */}

            <FirstPart
              showNamePart={showNamePart}
              setShowNamePart={setShowNamePart}
              setShowTypePart={setShowTypePart}
              setProgress={setProgress}
              errors={errors}
              register={register}
            />
            {/* --------------------------- */}

            {/* Account Type  and Address */}

            <SecondPart
              showNamePart={showNamePart}
              showTypePart={showTypePart}
              setShowNamePart={setShowNamePart}
              setShowTypePart={setShowTypePart}
              setShowPasswordPart={setShowPasswordPart}
              setProgress={setProgress}
              errors={errors}
              register={register}
            />
            {/* ------------------------------- */}
            {/* Password Part  */}

            <LastPart
              setProgress={setProgress}
              setShowPasswordPart={setShowPasswordPart}
              setShowTypePart={setShowTypePart}
              showPasswordPart={showPasswordPart}
              handleShow={handleShow}
              passwordShowRef={passwordShowRef}
              show={show}
              register={register}
              errors={errors}
            />
            {/* ---------------------------------- */}
          </form>
          <p
            className={`${showNamePart ? "block text-center my-2" : "hidden"}`}
          >
            Already have an account ?{" "}
            <Link className="font-bold text-secondary" to="/login">
              Login
            </Link>
          </p>

          <div className="grid grid-cols-3 gap-3 w-full mt-10 mb-5 lg:hidden">
            <div className={`h-2 rounded-full bg-primary`} />
            <div
              className={`h-2 rounded-full ${progress > 1 ? "bg-primary" : "bg-white"
                }`}
            />
            <div
              className={`h-2 rounded-full ${progress > 2 ? "bg-primary" : "bg-white "
                }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
