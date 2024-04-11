// src/pages/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const authMiddleware = require('../middleware/checkAuth');

const config = require('../../config.json');
const User = require('../backend/models/user');

const clientId = config.discord.client_id || '';
const clientSecret = config.discord.client_secret || '';
const redirectUri = config.discord.redirect_uri;

passport.use(
    new DiscordStrategy(
        {
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: redirectUri,
            scope: ['identify', 'email'],
        },
        (accessToken, refreshToken, profile, done) => {
            User.updateOrCreate(profile.id, profile.username, profile.email, profile.avatar, 0).then((user) =>
                done(null, user)
            );
        }
    )
);

router.get('/discord', passport.authenticate('discord'));

router.get(
    '/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: '/auth/discord',
    }),
    (req, res) => {
        res.redirect('/');
    }
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    User.updateOrCreate(user.discordId, user.username, user.email, user.avatar, user.permission || 0)
        .then((user) => done(null, user))
        .catch((err) => {
            console.error(err);
            done(err);
        });
});

router.get('/profile', authMiddleware, (req, res) => {
    res.send(`Welcome, ${req.user.username}#${req.user.discriminator}`);
});

module.exports = router;
