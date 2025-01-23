const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ("bcrypt");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, 'UserName is required'],
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
      maxlength: 150,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      minlength: 8,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

  

    userSchema.pre("save", async function(next){
        try {
            if(!this.isModified("password")){
                return next;
            }
            this.password = await bcrypt.hash(this.password, 12);
            this.passwordConfirm = undefined;
        } catch (err) {
            console.log(err);
        }
    }
)

userSchema.methods.checkPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfterTokenIssue = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passwordChangedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return passwordChangedTime > JWTTimestamp;
    }
    return false;
};
module.exports = mongoose.model("User", userSchema);