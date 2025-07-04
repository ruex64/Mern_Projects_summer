const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');

// https://www.uuidgenerator.net/
const secret = process.env.JWT_SECRET;

const authController = {
    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(401).json({ errors: errors.array() });
            }

            // The body contains username and password because of the express.json()
            // middleware configured in the server.js
            const { username, password } = request.body;

            // Call Database to fetch user by the email
            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user: user, message: 'User authenticated' });
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({ message: 'Logout successfull' });
    },

    isUserLoggedIn: (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, (error, user) => {
            if (error) {
                return response.status(401).json({ message: 'Unauthorized access' });
            } else {
                response.json({ message: 'User is logged in', user: user });
            }
        });
    },

    register: async (request, response) => {
  try {
    const { username, password, name } = request.body;

    const data = await Users.findOne({ email: username });
    if (data) {
      return response.status(409).json({ message: 'Account already exists with given email' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new Users({
      email: username,
      password: encryptedPassword,
      name: name
    });

    await user.save();

    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(userDetails, secret, {
      expiresIn: '1h'
    });

    response.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ only secure in prod
      sameSite: 'lax',
      path: '/'
    });

    response.json({ message: 'User registered', user: userDetails });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
},


    googleAuth: async (request, response) => {
        try {
            const { idToken } = request.body;
            if (!idToken) {
                return response.status(401).json({ message: 'Invalid request' });
            }

            const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const googleResponse = await googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = googleResponse.getPayload();
            const { sub: googleId, name, email } = payload;

            let data = await Users.findOne({ email: email });
            if (!data) {
                data = new Users({
                    email: email,
                    name: name,
                    isGoogleUser: true,
                    googleId: googleId
                });
                await data.save();
            }

            const user = {
                id: data._id ? data._id : googleId,
                username: email,
                name: name
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            response.json({ user: user, message: 'User authenticated' });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = authController;