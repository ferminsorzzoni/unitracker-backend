import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "./env.js";
import { findUserById } from "../modules/auth/auth.repository.js";

const opts = {};
opts.secretOrKey = env.JWT_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await findUserById(jwt_payload.sub);
            if(user) return done(null, user);
            return done(null, false);
        } catch(err) {
            return done(err, false);
        }
    })
);