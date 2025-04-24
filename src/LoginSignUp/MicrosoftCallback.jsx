import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MicrosoftCallback = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Assuming the backend redirects with token in query string
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const name = params.get("name");
        const email = params.get("email");

        if (token) {
          // Save to local storage
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("studentData", JSON.stringify({ name, email }));

          onLogin(); // update app state
          navigate("/"); // redirect to About
        } else {
          console.error("No token found in callback");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error handling Microsoft callback:", err);
      }
    };

    fetchToken();
  }, [navigate, onLogin]);

  return <div>    <div className="bg-[#f8f9fc] lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 shadow-lg rounded-lg">
  <h1 className="text-2xl font-semibold mb-4">Connexion</h1>



  <button
            onClick={handleLoginMicroSoft}
            style={{
                padding: '10px 20px',
                backgroundColor: '#4285F4',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
            }}
        >
            Sign in with Microsoft
        </button>



</div></div>;
};

export default MicrosoftCallback;