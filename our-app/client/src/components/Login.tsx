import React, { useState, useContext, FormEvent } from "react";
import { AuthContext } from "./AuthContext"; // Update the path if needed

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const { login, signup } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignup) {
        await signup(userName, email, password);
        alert(`Signed up as ${email}. Please login now.`);
        setIsSignup(false);
      } else {
        await login(email, password);
        alert(`Logged in as ${email}`);
      }

      setEmail("");
      setPassword("");
      setUserName("");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="p-4 rounded shadow bg-white"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="mb-4 text-center">{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isSignup ? "Sign up" : "Login"}
          </button>

          <p className="mt-3 text-center">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="btn btn-link ms-2 p-0"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
