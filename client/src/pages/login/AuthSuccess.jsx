import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            // For Google login, we might not have user object in URL, 
            // but we could extend the redirect if needed. 
            // For now, setting just the token or a placeholder user.
            dispatch(setCredentials({ user: { email: 'google-user' }, token }));
            navigate("/"); // Redirect to home
        } else {
            navigate("/login?error=no_token");
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Authenticating...</h2>
        </div>
    );
};

export default AuthSuccess;
