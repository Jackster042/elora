import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { AppDispatch } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

// TODO: FIX RACE CONDITION FOR NAVIGATION WHEN REGISTER SUCCESS
const AuthRegister = () => {
  const [formData, setFormdata] = useState(initialState);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(registerUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Success",
            description: data?.payload?.message,
          });
          setRegistrationSuccess(true);
        } else {
          toast({
            title: "Error",
            description: data?.payload?.response?.message,
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Registration failed. Please try again.",
          variant: "destructive",
        });
      });
  }

  // Handle navigation after successful registration
  React.useEffect(() => {
    if (registrationSuccess) {
      // Add a small delay to ensure toast is visible
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1500);
    }
  }, [registrationSuccess, navigate]);

  return (
    <div className="mx-auto w-full max-w-md space-x-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            to="/auth/login"
            className="text-primary font-medium hover:underline ml-2"
          >
            Login
          </Link>
        </p>
      </div>

      {/* COMMON FORM */}
      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormdata}
        onSubmit={onSubmit}
        buttonText={"Sign Up"}
        isBtnDisabled={false}
      />
    </div>
  );
};

export default AuthRegister;
