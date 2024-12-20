const JWT=require("jsonwebtoken");

const secret="mysecretkey";

function createTokenuser(user){
    const payload={
        _id:user._id,
        email:user.email,
        balance:user.balance,
        name:user.name
    };
    const token=JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={createTokenuser,validateToken};