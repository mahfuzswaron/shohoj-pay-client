import React, { useEffect, useRef, useState } from "react";
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

const SignUp = () => {
  const [show, setShow] = useState(false);
  const date = new Date().toLocaleDateString();

  const passwordShowRef = useRef("");
  const [
    createUserWithEmailAndPassword,
    user,
    userCreatLoading,
    userCreateError,
  ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });
  const [token] = useToken(user);
  const navigate = useNavigate();
  const [updateProfile] = useUpdateProfile(auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const dispatch = useDispatch()

  useEffect(() => {
    if (userCreateError) {
      const error = userCreateError?.message.split(":")[1];
      toast.error(error);
    }
  }, [userCreateError]);
  useEffect(() => {
    if (user?.user?.displayName) {
      const userInfo = {
        type: "personal",
        name: user.user.displayName,
        email: user?.user?.email,
        date,
      };
      const createAccount = async () => {
        fetch("http://localhost:5000/createAccount", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ userInfo }),
        })
          .then((res) => res.json())
          .then((result) => console.log(result));
      };

      // dispatch(setUser(userInfo))
      createAccount();

      if (token) {
        setTimeout(() => {
          toast.success("Create Account SuccessFully");
        }, 1000);
        navigate("/");
      }
    }
  }, [user, navigate, user?.user?.displayName, date, token]);
  if (userCreatLoading) {
    return <Spinner />;
  }
  const onSubmit = async (data) => {
    if (data.password !== data.ConfirmPassword) {
      return toast.error("Opps Password Not Match");
    }
    await createUserWithEmailAndPassword(data?.email, data?.password);
    await updateProfile({ displayName: data.name });
  };
  const handleShow = () => {
    const passShow = passwordShowRef.current.checked;
    setShow(passShow);
  };
  return (
    <div className="flex items-center justify-center w-screen my-10 mt-24 lg:mt-32">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2
            data-testid="signUp-heading"
            className="text-center font-bold text-xl"
          >
            Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs ">
              <label htmlFor="inputName" className="label">
                Name
              </label>
              <input
                id="inputName"
                type="text"
                placeholder="Name"
                className="input input-bordered w-full max-w-xs"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Name Is Required",
                  },
                })}
              />
              <label className="label">
                {errors.name?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs ">
              <label htmlFor="inputEmail" className="label">
                Email
              </label>
              <input
                id="inputEmail"
                type="email"
                placeholder="Email"
                className="input input-bordered w-full max-w-xs"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email Is Required",
                  },
                  pattern: {
                    value: /[a-z0-9]+@.[a-z]{3}/,
                    message: "Your Email Have Must Be A Special characters",
                  },
                })}
              />
              <label className="label">
                {errors.email?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
                {errors.email?.type === "pattern" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>
            <div className="relative form-control w-full max-w-xs ">
              <label htmlFor="inputPass1" className="label">
                Password
              </label>
              {/* PASSWORD SHOW HIDE */}
              <div
                onClick={handleShow}
                className="absolute inset-y-0 right-3 flex items-center px-2 top-6"
              >
                <label className="swap swap-rotate">
                  <input ref={passwordShowRef} type="checkbox" />
                  <i className="fa-solid fa-eye-low-vision swap-on fill-current"></i>
                  <i className="fa-solid fa-eye swap-off fill-current"></i>
                </label>
              </div>
              <input
                id="inputPass1"
                type={show ? "text" : "password"}
                // type="password"
                placeholder="Password"
                className="input input-bordered w-full max-w-xs"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password Is Required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password Must Be 6 characters",
                  },
                })}
              />
              <label className="label">
                {errors.password?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs ">
              <label htmlFor="inputPass2" className="label">
                Confirm Password
              </label>

              <input
                id="inputPass2"
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                className="input input-bordered w-full max-w-xs"
                {...register("ConfirmPassword", {
                  required: {
                    value: true,
                    message: "Please Type A Confirm Password",
                  },
                })}
              />
              <label className="label">
                {errors.ConfirmPassword?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.ConfirmPassword.message}
                  </span>
                )}
              </label>
            </div>
            <input
              role="submit"
              className="btn w-full"
              type="submit"
              value="Register"
            />
          </form>
          <p className="text-center my-2">
            Already have an account ?{" "}
            <Link className="font-bold text-secondary" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
