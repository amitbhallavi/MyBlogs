import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderTwo from "../components/LoaderTwo";
import { loadOAuthUser } from "../components/features/blogs/auth/authSlice";

const providerLabels = {
  google: "Google",
  github: "GitHub",
};

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const provider = params.get("provider");
    const providerName = providerLabels[provider] || "OAuth";

    if (!token) {
      toast.error("Authentication failed. Please try again.");
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    dispatch(loadOAuthUser(token))
      .unwrap()
      .then(() => {
        toast.success(`${providerName} login successful`);
        navigate("/", { replace: true });
      })
      .catch(() => {
        toast.error("Authentication failed. Please try again.");
        navigate("/login?error=oauth_failed", { replace: true });
      });
  }, [dispatch, location.search, navigate]);

  return <LoaderTwo />;
};

export default AuthSuccess;
