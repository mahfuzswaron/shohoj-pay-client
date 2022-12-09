import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateSignUpLoading } from "../../../app/slices/signUpLoadingSlice";
import auth from "../../../firebase.init";
import { useDispatch } from "react-redux";
const useToken = (user) => {
  const [token, setToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const userEmail = user?.user?.email || user?.email;
    if (userEmail) {
      setTokenLoading(true);
      fetch(`https://shohoj-pay-server.onrender.com/getjwttoken/${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.token) {
            const accessToken = data.token;
            window.localStorage.setItem("accessToken", accessToken);
            setToken(accessToken);
            setTokenLoading(false);
          }
          if (data?.error) {
            signOut(auth);
            setTokenLoading(false);
            dispatch(updateSignUpLoading(false));
            toast.error(data.error, {
              id: "tokenError",
            });
          }
        });
    }
  }, [user]);
  return [token, tokenLoading];
};

export default useToken;
