const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { googleLoginService } = require("../services/auth.service"); // Reuse existing service logic
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                // profile contains: id, displayName, email, photos
                const { id, displayName, email } = profile;
                // Logic to find or create user
                // We reuse googleLoginService which expects (email, name, role_id)
                // Note: Role ID might need default for OAuth users (e.g., 'customer') or passed via state

                // For now, we'll just pass the profile details. 
                // Real implementation usually needs to know 'role' if it's strict, 
                // or default to a Customer role.

                // Let's assume default role is 'customer' or handled later
                // or we just return the user profile and let controller handle it

                return done(null, profile);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
