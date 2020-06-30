const jwt = require('jsonwebtoken');
const firmaSeguraJWT = 'delilahResto2020';

function checkToken(req,res,next){
    let token = req.headers.authorization;
    if(token){
        next()
    }
    else{
        res.status(400).json("Falta token para autorización")
    }
}
async function checkAdmin(req,res,next){
    let token = req.headers.authorization.split(" ")[1];
    try{decode = await jwt.verify(token, firmaSeguraJWT)}
    catch(e){
        console.log(e);
        res.status(400).json("Hubo un error validando el token")
    }
    if(decode.isAdmin==true){
        next()
    }
    else{
        res.status(401).json("Usuario no autorizado")
    }
}

async function verifyToken(token){
    try{
        const decode = await jwt.verify(token, firmaSeguraJWT);
        return decode}
    catch(e){
        console.log(e);
        res.status(400).json("Hubo un error validando el token")
    }
}

module.exports = {checkToken, checkAdmin, verifyToken}