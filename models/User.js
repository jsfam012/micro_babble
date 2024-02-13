// Import 'model' and 'Schema' from mongoose
const { model, Schema } = require('mongoose');

// Import 'hash' and 'compare' from bcrypt
const { hash, compare } = require('bcrypt');

// Create the userSchema with the following criteria
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'You must enter a username'],
      unique: true,
      minLength: [2, 'Your username must be at least 2 characters in length']
    },

    email: {
      type: String,
      required: [true, 'You must enter a valid email'],
      unique: true,
      validate: {
        validator(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ig.test(val);
        },
        message: 'Your email address is not formatted correctly'
      }
    },
    password: {
      type: String,
      required: [true, 'You must enter a password'],
      minLength: [6, 'Your password must be at least 6 characters in length']
    }

  }
  );

// * Define the username, email and password fields
//   - Validation for username
//     • required
//     • unique
//     • minLength of 2
//   - Validation for email
//     • required
//     • unique
//     • must be a valid email string
//   - Validation for password
//     • required
//     • minLength of 6

// * Use the userSchema.set() method to hash the password on new user creation or on password update
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
      this.password = await hash(this.password, 10);
  }

  next();  //if you don't call next then user will not be saved
});

// * Use the userSchema.methods property to create a custom instance method called 'validatePass' that takes a form password and compares it to the user's hashed password to return a boolean true if they match
userSchema.methods.validatePass = async function (formPassword) {
  const is_valid = await compare(formPassword, this.password);

  return is_valid;
}

userSchema.set('toJSON', {
  transform: (_, user) => {
      delete user.password;
      delete user.__v; 
      return user;
  },
});

// * Create the 'User' model variable using the model function from mongoose
const User = model('User', userSchema);

// * Export the model
module.exports = User;

