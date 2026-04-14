import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";
import { findUserById, findUserByProviderId, createUser } from "../modules/auth/auth.repository.js";

passport.use(new JwtStrategy({ 
        secretOrKey: env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (jwt_payload, done) => {
        try {
            const user = await findUserById(jwt_payload.sub);
            if(user) return done(null, user);
            return done(null, false);
        } catch(err) {
            return done(err, false);
        }
    })
);

passport.use(new GoogleStrategy({
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            let user = await findUserByProviderId(profile.id);
            if(!user) user = await createUser({
                providerId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
            return cb(null, user);
        } catch(err) {
            return cb(err);
        }
    })
);