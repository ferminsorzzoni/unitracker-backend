import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import * as userRepository from './../modules/auth/user.repository.js';

passport.use(
    new JwtStrategy(
        {
            secretOrKey: env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (jwt_payload, done) => {
            try {
                const user = await userRepository.findById(jwt_payload.sub);
                if (user) return done(null, { id: user.id, role: user.role });
                return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.BASE_URL + '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) throw new Error('Email not provided');
                let user = await userRepository.findByGoogleId(profile.id);
                if (!user) {
                    user = await userRepository.create({
                        googleId: profile.id,
                        email: email,
                        name: profile.displayName,
                    });
                }
                return cb(null, { id: user.id, role: user.role });
            } catch (err) {
                return cb(err);
            }
        },
    ),
);
