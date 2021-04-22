const server = require('express');
const router = server.Router();
const conectToDatabase = require ('../database/index');
const sequelize = conectToDatabase.sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const firmaSeguraJWT = 'delilahResto2020';

const authorizationFile = require('../authorization');
const checkAdmin = authorizationFile.checkAdmin;
const checkToken = authorizationFile.checkToken;
const verifyToken = authorizationFile.verifyToken;

const functions = require('../utilities/functions');
const getUsers = functions.getElements;
const insertElements = functions.insertElements;
const updateElements = functions.updateElements;

var BCRYPT_SALT_ROUNDS = 12;

/***************************************************METODOS*******************************/

router.get('/',[checkToken,checkAdmin],(req,res)=>{
    const query='SELECT * FROM USERS';
    getUsers(query,res)
})

router.get('/id/:id', [checkToken, checkAdmin],(req,res)=>{
    const id = req.params.id;
    const query = `SELECT * FROM USERS WHERE userId=${id}`;
    getUsers(query,res,id)
})

router.get('/perfil', checkToken, async (req,res)=>{
    let token = req.headers.authorization.split(" ")[1];
    const decode = await verifyToken(token)
    .then(response=>response)
    .catch(e=>e);
    const email = decode.email;
    const query = `SELECT * FROM USERS WHERE email="${email}"`;
    getUsers(query, res)
})

router.post('/crearCuenta', [verifyData, verifyUser],async (req,res)=>{
    const {fullName, email, password, address, celphone}= req.body;
    var isAdmin=0;
    if(req.body.isAdmin){
        isAdmin = req.body.isAdmin
    }
    const criptedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(response=>response)
    .catch(e=>console.log(e))
    let params= {tableName: "USERS",
        keys:["fullName", "email", "password", "address", "celphone", "isAdmin"],
        replacements:[`"${fullName}","${email}","${criptedPassword}","${address}","${celphone}", ${isAdmin}`]
    }
    insertElements(params, res)
})

router.post('/login', verifyDataLogin, async (req,res)=>{
    const {email, password} = req.body;
    const validated = await validateUser(email, password)
    .then(response=>response)
    .catch(e=>e);
    if(!validated){
        res.status(404).json("Usuario y/o contraseña incorrectos")
    }
    else{
        const isAdmin = await isAdminFunc(email)
        .then(response=>response)
        .catch(e=>e);
        const token= jwt.sign({
            email: email, isAdmin: isAdmin }, firmaSeguraJWT);
        res.status(200).json({token})
    }
})

router.patch('/admin',[checkToken, checkAdmin], (req,res)=>{
    let {email, isAdmin} = req.body;
    if(!email || !isAdmin){
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else{
        if(typeof(isAdmin) !== "boolean"){
            res.status(400).json("Por favor indique valor correcto para isAdmin (boolean)")
            return
        }
        let params = {
            tableName: "USERS",
            keys: "isAdmin",
            replacements: `${isAdmin}`,
            filterKey: "email",
            valueFilter:`${email}`
        }
        updateElements(params, res)
    }  
})

router.patch('/modificar', [checkToken, checkInfo], async (req,res)=>{
    let token = req.headers.authorization.split(" ")[1];
    const decode = await verifyToken(token)
    .then(response=>response)
    .catch(e=>e);
    const email = decode.email;
    let keysArray = [];
    let replacementsArray = [];
    const {address, celphone} = req.body;
    let password = req.body.password;
    function completeParams(data,keyParam){
        if(data){
            keysArray.push(keyParam);
            replacementsArray.push(data)
        }
        return
    }
    if(password){
        password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then(response=>response)
        .catch(e=>console.log(e))
    }
    completeParams(password, "password");
    completeParams(address, "address");
    completeParams(celphone, "celphone");
    
    if(keysArray.length){
        let params = {
            tableName: "USERS",
            keys: keysArray,
            replacements: replacementsArray,
            filterKey: "email",
            valueFilter:`${email}`
        }
        updateElements(params,res)
    }
    else{
        res.status(400).json("Falta al menos un dato válido para modificar")
    }
    
})

/***************************************************MIDDLEWARES*******************************/

function verifyData(req,res,next){ 
    const {fullName, email, password, address, celphone}= req.body;
    if(!fullName || !email || !password || !address || !celphone){
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else{
        next()
    }
}
function verifyDataLogin(req,res,next){
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else{
        next()
    }
}
async function verifyUser(req,res,next){
    const email  = req.body.email;
    const query = `SELECT * FROM USERS WHERE email="${email}"`
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    if(result.length){
        res.status(404).json("El email es utilizado por otro usuario")
    }
    else{
        next()
    }
}

function checkInfo(req,res,next){
    const {password, address, celphone, email, fullName, userId} = req.body;
    if (email || fullName || userId){
        res.status(400).json('El/los id, email o nombre no pueden modificarse')
    }
    if(!password && !address && !celphone){
        res.status(400).json('Se necesita al menos un parámetro válido para modificar')
    }
    else{
        next()
    }
}

/***************************************************FUNCIONES*******************************/

async function validateUser(email, password){
    const query = `SELECT * FROM USERS WHERE email="${email}"`;
    const user = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)});
    if(user.length){
        const validated = await bcrypt.compare(password, user[0].password)
        .then(response=>response)
        .catch(e=>e);
        if(validated){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }    
}

async function isAdminFunc(email){
    const query = `SELECT * FROM USERS WHERE email="${email}"`;
    const user = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    if(user[0].isAdmin===1){
        return true
    }
    else{
        return false
    }
}
//ENCRIPTAR PASSWORD

module.exports=router;

