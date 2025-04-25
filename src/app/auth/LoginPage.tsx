import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery, useTheme } from "@mui/material";

import { GContainer } from '../../components/pagecomponents/GContainer';
import { GRow } from '../../components/pagecomponents/GRow';
import { GCol } from '../../components/pagecomponents/GCol';
import { GCard } from '../../components/pagecomponents/GCard';
import { GCardBody } from '../../components/pagecomponents/GCardBody';
import { GInput } from '../../components/pagecomponents/GInput';
import { GCheckbox } from '../../components/pagecomponents/GCheckbox';
import { GBtn } from '../../components/pagecomponents/GBtn';
import { GIcon } from '../../components/pagecomponents/GIcon';

import '../../styles/loginpagestyle.css';
import logo from '../../assets/logo.png';
import signInIcon from "../../assets/usergroup.png";

// Zod schema for validation
const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(1, { message: "Password is required" }),
});

type FormData = zod.infer<typeof schema>;

const defaultValues: FormData = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Detect xs screen

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    const params = new URLSearchParams();
    params.append("username", values.email);
    params.append("password", values.password);

    try {
      const response = await axios.post(
        "https://restapi.cwai.ykinnosoft.in/login",
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (!response || !response.status || !response.data) {
        throw new Error("No response from server.");
      }

      const data = response.data;

      if (response.status === 200 && data.access_token) {
        if (data.role === "Candidate") {
          throw new Error("Unauthorized user.");
        }

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("app_user_id", data.user_id);
        localStorage.setItem("app_access_token", data.access_token);
        localStorage.setItem("app_refresh_token", data.refresh_token);
        localStorage.setItem("app_user_name", data.name);
        localStorage.setItem("app_user_location", data.user_location);

        navigate("/admin");
      } else {
        throw new Error(data.detail || "Login failed. Please try again.");
      }
    } catch (error: any) {
      const status = error?.response?.status;
      let message = error?.response?.data?.detail || "An error occurred.";

      switch (status) {
        case 400:
          message = "Bad request. Check your input.";
          break;
        case 401:
          message = "Invalid credentials. Try again.";
          break;
        case 403:
          message = "Access denied.";
          break;
        case 404:
          message = "User not found.";
          break;
        case 429:
          message = "Too many attempts. Please wait.";
          break;
        case 500:
          message = "Server error. Try again later.";
          break;
      }

      setError("root", { type: "server", message });
    }
  };

  return (
    <GContainer fluid className="login-container full-height d-flex align-items-center">
      <img src={logo} alt="Logo" className="fixed-logo" />
      <GRow className="w-100">

        {/* Left Side (Hide on xs) */}
        {!isXs && (
          <GCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center" style={{ minHeight: "100vh" }}>
            <h1 className="my-5 display-5 fw-bold ls-tight px-3">
              Smart AI Interviews <br />
              <span className="text-primary">for Future Professionals</span>
            </h1>
            <p className="px-2" style={{ color: "hsl(217, 10%, 50.8%)" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, itaque
              accusantium odio, soluta, corrupti aliquam quibusdam tempora at cupiditate
              quis eum maiores libero veritatis? Dicta facilis sint aliquid ipsum atque?
            </p>
          </GCol>
        )}

        {/* Right Side - Always visible */}
        <GCol xs="12" sm="12" md="6">
          <GCard className="my-5">
            <GCardBody className="p-5">
              <div className="login-header">
                <img src={signInIcon} alt="Sign In" className="signin-icon" />
                <h2>Sign In</h2>
              </div>

              {errors.root && (
                <div className="error-message">{errors.root.message}</div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label>Email</label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <GInput type="email" {...field} />
                    )}
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-4 position-relative">
                  <label>Password</label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <GInput
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    )}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
                    <GIcon icon={showPassword ? "eye-slash" : "eye"} />
                  </span>
                  {errors.password && (
                    <div className="error-message">{errors.password.message}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <GCheckbox name="rememberMe" id="rememberMe" label="Remember me" />
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <GBtn className="w-100 mb-4" size="md" type="submit">
                  Sign In
                </GBtn>
              </form>
            </GCardBody>
          </GCard>
        </GCol>
      </GRow>
    </GContainer>
  );
};

export default LoginPage;
