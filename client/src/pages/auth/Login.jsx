import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const phonePattern = /^\d{10}$/;

function Login({ initialMode = false }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();

    if (isRegistering && !normalizedName) errors.name = "Full name is required.";
    else if (isRegistering && !namePattern.test(normalizedName)) errors.name = "Enter a valid name using letters only.";
    if (!normalizedEmail) errors.email = "Email address is required.";
    else if (!emailPattern.test(normalizedEmail)) errors.email = "Enter a valid email address.";
    if (isRegistering && !normalizedPhone) errors.phone = "Phone number is required.";
    else if (isRegistering && !phonePattern.test(normalizedPhone)) errors.phone = "Phone number must contain exactly 10 digits.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) errors.password = "Password must contain a letter and a number.";
    if (isRegistering && password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    if (isRegistering && !["student", "admin"].includes(role)) errors.role = "Choose Student or Admin.";

    setFieldErrors(errors);
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (Object.keys(validateForm()).length) return;

    const result = isRegistering
      ? await register({ name, email, phone, password, role })
      : await login(email.trim(), password, role);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const targetRole = result.user?.role || role;
    navigate(`/${targetRole}/dashboard`);
  };

  const switchMode = () => {
    setError("");
    setFieldErrors({});
    navigate(isRegistering ? "/login" : "/register");
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="login-page">
      <div className="login-brand-section">
        <div className="brand-content">
          <div className="brand-logo"><ShieldCheck size={34} /></div>
          <h1>HostelHub</h1>
          <p>Smart Hostel Management System</p>
          <div className="brand-features">
            <div><span>✓</span>Easy hostel management</div>
            <div><span>✓</span>Secure student portal</div>
            <div><span>✓</span>Real-time management</div>
          </div>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-card">
          <div className="mobile-logo"><ShieldCheck size={30} /></div>
          <h2>{isRegistering ? "Create your account" : "Welcome back"}</h2>
          <p className="login-subtitle">{isRegistering ? "Register to manage your hostel experience" : "Sign in to continue to your dashboard"}</p>

          <form onSubmit={handleSubmit} noValidate>
            {isRegistering && <div className={`form-group ${fieldErrors.name ? "has-error" : ""}`}>
              <label htmlFor="name">Full name</label>
              <div className="input-wrapper"><UserRound size={18} /><input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div>
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>}

            <div className={`form-group ${fieldErrors.email ? "has-error" : ""}`}>
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper"><Mail size={18} /><input id="email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>

            {isRegistering && <div className={`form-group ${fieldErrors.phone ? "has-error" : ""}`}>
              <label htmlFor="phone">Phone number</label>
              <div className="input-wrapper"><Phone size={18} /><input id="phone" type="tel" placeholder="Enter 10-digit phone number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" maxLength={10} autoComplete="tel" /></div>
              {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
            </div>}

            <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
              <label htmlFor="password">Password</label>
              <div className="input-wrapper"><LockKeyhole size={18} /><input id="password" type={showPassword ? "text" : "password"} placeholder="Use 8+ characters with a number" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegistering ? "new-password" : "current-password"} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            {isRegistering && <div className={`form-group ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
              <label htmlFor="confirm-password">Confirm password</label>
              <div className="input-wrapper"><LockKeyhole size={18} /><input id="confirm-password" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>
              {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
            </div>}

            <div className={`form-group ${fieldErrors.role ? "has-error" : ""}`}>
              <label>{isRegistering ? "Account type" : "Login As"}</label>
              <div className="role-selector"><button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>Student</button><button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Admin</button></div>
              {fieldErrors.role && <p className="field-error">{fieldErrors.role}</p>}
            </div>

            {error && <div className="error-message">{error}</div>}
            {!isRegistering && <div className="login-options"><label><input type="checkbox" />Remember me</label><button type="button">Forgot password?</button></div>}
            <button className="login-button" type="submit" disabled={isRegistering ? !name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword : !email.trim() || !password}>{isRegistering ? "Create account" : "Sign in securely"}</button>
          </form>

          <p className="login-footer">Hostel Management System © 2026</p>
          <p className="auth-switch">{isRegistering ? "Already have an account?" : "New to HostelHub?"}<button type="button" onClick={switchMode}>{isRegistering ? "Sign in" : "Create an account"}</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
