import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// COMPONENTS
import CommonForm from "@/components/common/form";

// CONFIG
import { loginFormControls } from "@/config";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// REDUX
import { loginUser } from "@/store/auth-slice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { mergeGuestCart, getCart } from "@/store/shop/cart-slice";
import { localCart } from "@/utils/localCart";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormdata] = useState(initialState);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.authStore
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(loginUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Success",
            description: data?.payload?.message,
          });
        } else {
          toast({
            title: "Error",
            description: data?.payload?.response?.message,
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        // Handle error silently or log to monitoring service
      });
  }

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Merge guest cart if exists
      const hasLocalCart = localCart.hasItems();
      if (hasLocalCart && user?.id) {
        dispatch(mergeGuestCart(user.id)).then(() => {
          dispatch(getCart(user.id));
          toast({
            title: "Cart synced",
            description: "Your cart items have been saved",
          });
        });
      }

      // Navigation is handled by CheckAuth component
      // which checks for redirectAfterLogin in sessionStorage
    }
  }, [isAuthenticated, user, dispatch, toast]);

  return (
    <div className="mx-auto w-full max-w-md space-x-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            to="/auth/register"
            className="text-primary font-medium hover:underline ml-2"
          >
            Register
          </Link>
        </p>
      </div>

      {/* COMMON FORM */}
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormdata}
        onSubmit={onSubmit}
        buttonText={"Sign In"}
        isBtnDisabled={false}
      />
    </div>
  );
};

export default AuthLogin;
