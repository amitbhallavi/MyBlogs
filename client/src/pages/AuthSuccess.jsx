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

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[#111315] bg-white p-6 text-center shadow-[8px_8px_0_#1ccad8]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#263bff]">OAuth</p>
          <h1 className="mt-3 text-4xl font-black text-[#111315]">Finishing sign in</h1>
          <p className="mt-2 text-sm font-semibold text-zinc-500">Your account token is being verified.</p>
          <LoaderTwo />
        </div>
      </div>
    </main>
  );
};

export default AuthSuccess;
