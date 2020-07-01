const server = require('express');
const router = server.Router();
const conectToDatabase = require ('../database/index');
const sequelize = conectToDatabase.sequelize;
const authorizationFile = require('../authorization');
const moment = require('moment');
const checkAdmin = authorizationFile.checkAdmin;
const checkToken = authorizationFile.checkToken;
const verifyToken = authorizationFile.verifyToken;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const firmaSeguraJWT = 'delilahResto2020';

const functions = require('../utilities/functions');
const getElements = functions.getElements;
const insertElements = functions.insertElements;
const updateElements = functions.updateElements;

let productsArray = [];
/***************************************************METODOS*******************************/

router.get('/', [checkToken, checkAdmin] ,(req,res)=>{
    const query = 'SELECT * FROM ORDERS';
    getElements(query,res)
})

router.post('/', [checkToken, verifyOrderData, verifyUserId,verifyProductDetail],async(req,res)=>{
    var { userId, productsDetail, payloadMethod } = req.body;
    const address = await getAddress(userId, req)
    .then(response=>response)
    .catch(e=>e);
    const dateAndTime = moment().format('YYYY-MM-DD, HH:mm:ss');
    const date = dateAndTime.split(", ")[0];
    const time = dateAndTime.split(", ")[1];
    await getProductsArray(productsDetail, res)
    .then(response=>response)
    .catch(e=>e);
    productsDetail = productsArray;
    const total = getTotal(productsArray);
    productsDetail = JSON.stringify(productsArray);
    if(productsArray.length){
        let params= {tableName: "ORDERS",
        keys:["userId", "productsDetail", "status", "total", "payloadMethod", "address", "date", "time"],
        replacements:[ `${userId},'${productsDetail}',"nuevo",${total},"${payloadMethod}","${address}","${date}","${time}"`]
        };
        insertElements(params, res)
    }
    
})

router.patch('/',[checkToken,checkAdmin,checkStatus], async (req,res)=>{
    const {status, orderId} = req.body;
    let query = `SELECT * FROM ORDERS WHERE orderId="${orderId}"`;
    const order = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>e)
    if(order.length){
        let params = {
            tableName: "ORDERS",
            keys: "status",
            replacements: `"${status}"`,
            filterKey: "orderId",
            valueFilter: `${orderId}`
            };
        updateElements(params,res)
    }
    else{
        res.status(404).json("No existe ningun elemento con ese id")
    }
    
})

router.get('/estado/:status',[checkToken,checkAdmin,checkStatus],async (req,res)=>{
    const status = req.params.status;
    const query=`SELECT * FROM ORDERS WHERE STATUS="${status}"`;
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>res.status(400).json(e))
    if(result.length){
        res.status(200).json(result)
    }
    else{
        res.status(200).json("No hay elementos para mostrar")
    }
})

router.get('/id/:id', [checkToken,checkAdmin] ,(req,res)=>{
    const id = req.params.id;
    const query = `SELECT * FROM ORDERS WHERE orderId=${id}`;
    getElements(query,res,id)
})

router.get('/mispedidos', [checkToken] ,async (req,res)=>{
    let token = req.headers.authorization.split(" ")[1];
    let userId;
    const decode = await verifyToken(token)
    .then(response=>response)
    .catch(e=>e);
    const email = decode.email;
    let query = `SELECT * FROM USERS WHERE email="${email}"`;
    const user = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>e)
    userId = user[0].userId;
    query = `SELECT * FROM ORDERS WHERE userId=${userId}`;
    getElements(query,res,userId)
})

router.delete('/id/:id', [verifyOrderId,checkToken, checkAdmin], async (req,res)=>{
    const id = req.params.id;
    query = `DELETE FROM ORDERS WHERE orderId=${id}`;
    await sequelize.query(query, {
        type: sequelize.QueryTypes.DELETE})
        .then(response=>{
            res.status(200).json("El pedido fue eliminado")
        })
        .catch(e=>{res.status(400).json(e)})
})


/*******************************************************MIDDLEWARES***********************/

async function checkStatus(req,res,next){
    let status = req.body.status || req.params.status;
    const query=`SELECT * FROM STATUS WHERE STATUS="${status}"`;
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>console.log(e))
    if(result.length){
        next()
    }
    else{
        res.status(400).json("Estado de pedido inválido")
    }
}
function verifyOrderData(req,res,next){
    const { userId, productsDetail, payloadMethod } = req.body;
    if(!userId || !productsDetail || !payloadMethod){
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else if(payloadMethod=="efectivo"||payloadMethod=="tarjeta"){
        next()
    }
    else{
        res.status(400).json("Metodo de pago inválido")
    }
}
function verifyProductDetail(req,res,next){
    const productsDetail = req.body.productsDetail[0];
    if(!productsDetail){
        res.status(400).json("Falta/n ingresar producto/s")
    }
    else if(typeof(productsDetail.productId)!="number"||typeof(productsDetail.qty)!= "number"){
        res.status(400).json("Detalle de producto/s inválido")
    }
    else{next()}
}

async function verifyUserId(req,res,next){
    const userId  = req.body.userId;
    const query = `SELECT * FROM USERS WHERE userId=${userId}`
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    if(result.length){
        next()
    }
    else{
        res.status(404).json("No existe usuario con ese id")
    }
}
async function verifyOrderId(req,res,next){
    const id = req.params.id;
    let query = `SELECT * FROM ORDERS WHERE orderId=${id}`;
    await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>{
            if(!response.length){
                res.status(404).json("No existe ningun elemento con ese id")
            }
            else{
                next()
            }
        })
        .catch(e=>{res.status(400).json(e)})
}
/*******************************************************FUNCIONES***********************/
async function getProductsArray(productsDetail, res){
    productsArray = [];
    for(let i=0; i<productsDetail.length; i++){
        const productId = productsDetail[i].productId;
        let query = `SELECT * FROM PRODUCTS WHERE productId="${productId}"`
        const product = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
            .then(response=>response)
            .catch(e=>e)
        if(product.length){
            const qty = productsDetail[i].qty;
            const price = product[0].price;
            productsArray.push({"productId":productId,"qty":qty,"price":price})
        }
        else{
            res.status(404).json("Uno o más id de productos no existen")
        }
    }
}

function getTotal(productsArray){
    var total = 0;
    productsArray.forEach(element => {
        total = total + (element.qty*element.price)
    });
    return total
}

async function getAddress(userId, req){
    if(req.body.address){
        const address = req.body.address;
        return address
    }
    const query = `SELECT * FROM USERS WHERE userId=${userId}`;
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    const address = result[0].address;
    return address
}


module.exports=router;
