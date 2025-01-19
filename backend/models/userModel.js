const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ("bcrypt");

const userSchema = new mongoose.Schema({
    userName :{
        type: String,
        unique: true,
        required: [true, "UserName is required"],
        trim: true,
        minlength:3,
        maxlength: 20,
    },
    email :{
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        maxlength: 150,
        lowercase: true
    },
    phoneNumber :{
        type: String,
        unique: true,
        required: [true, "Phone Number is required"],
        trim: true,
        maxlength: 20,
    },
    profilePicture :{
        type: String,
        default:"",
    },
    password :{
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    passwordConfirm :{
        type: String,
        // required: true,
        trim: true,
        minlength: 8,
    },
    passwordChangedAt: Date,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]

    },
    {timestamps: true}
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