const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, { _id }) => {
            return User.findOne({ _id: _id })
        }
    },

    Mutation: {

        addUser: async (parent, { username, email, password }) => {
            const myUser = await User.create(username, email, password);
            if (!myUser) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return token, myUser
        },

        login: async (parent, { email, password }) => {
            const myUser = await User.findOne({ email: email, password: password });
            if (!myUser) {
                throw AuthenticationError;
            };
            const correctPw = await myUser.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            };
            const token = signToken(myUser);
            return token, myUser
        },
        saveBook: async (parent, { user, authors, description, title, image, link }) => {
            console.log(user)

            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $addToSet: {
                        savedBooks: {
                            authors: [authors],
                            description: description,
                            title: title,
                            image: image,
                            link: link
                        }
                    }
                },
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                throw AuthenticationError
            }
            return updatedUser
        },

        deleteBook: async (parent, { user, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw AuthenticationError
            };
            return updatedUser
        }
    }
}

module.exports = resolvers;