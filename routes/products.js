const server = require('express');
const router = server.Router();
const conectToDatabase = require('../database/index');
const sequelize = conectToDatabase.sequelize;
const authorizationFile = require('../authorization');
const checkAdmin = authorizationFile.checkAdmin;
const checkToken = authorizationFile.checkToken;
const functions = require('../utilities/functions');
const getProducts = functions.getElements;
const insertElements = functions.insertElements;
const updateElements = functions.updateElements;

const jwt = require('jsonwebtoken');
const firmaSeguraJWT = 'delilahResto2020';
const verifyToken = authorizationFile.verifyToken;

var isFavorite;
var favoritesArray = [];
var updatedFavoritesArray = [];

/***************************************************METODOS*******************************/
router.get('/', (req, res) => {
    const query = 'SELECT * FROM PRODUCTS'
    getProducts(query, res)
})

router.post('/', [checkToken, checkAdmin, verifyData], (req, res) => {
    const { title, price, img } = req.body;
    let params = {
        tableName: "PRODUCTS",
        keys: ["title", "price", "img"],
        replacements: [`"${title}","${price}","${img}"`]
    }
    insertElements(params, res)
})

router.patch('/modificar/:id',[verifyProductId,checkToken, checkAdmin], (req,res)=>{
    const productId = req.params.id;
    let keysArray = [];
    let replacementsArray = [];
    const {price, img, title} = req.body;
    function completeParams(data,keyParam){
        if(data){
            keysArray.push(keyParam);
            replacementsArray.push(data);
        }
        return
    }
    completeParams(price, "price");
    completeParams(img, "img");
    completeParams(title, "title");
    if(keysArray.length){
        let params = {
            tableName: "PRODUCTS",
            keys: keysArray,
            replacements: replacementsArray,
            filterKey: "productId",
            valueFilter:`${productId}`
        }
        updateElements(params,res)
    }
    else{
        res.status(400).json("Falta al menos un dato válido para modificar")
    }
    
})


router.get('/id/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM PRODUCTS WHERE productId=${id}`;
    getProducts(query, res, id)
})

router.delete('/id/:id', [verifyProductId,checkToken, checkAdmin], async (req,res)=>{
    const id = req.params.id;
    query = `DELETE FROM PRODUCTS WHERE productId=${id}`;
    await sequelize.query(query, {
        type: sequelize.QueryTypes.DELETE})
        .then(response=>{
            res.status(200).json("El producto fue eliminado")
        })
        .catch(e=>{res.status(400).json(e)})
})

router.get('/favoritos', checkToken, async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    const decode = await verifyToken(token)
    .then(response=>response)
    .catch(e=>e);
    const email = decode.email;
    await getFavoritesByUser(res, email)
    .then(response=>response)
    .catch(e=>e);
    if (favoritesArray.length) {
        let favorites = `productId=${favoritesArray[0]} `;
        for (let n = 1; n < favoritesArray.length; n++) {
            favorites = favorites + `OR productId=${favoritesArray[n]} `
        }
        const query = `SELECT * FROM PRODUCTS WHERE ${favorites}`
        getProducts(query, res)
    }
    else {
        res.status(404).json("No hay productos favoritos para mostrar")
    }
})

router.patch('/favoritos/:id', [verifyProductId, checkToken], async (req, res) => {
    const productId = req.params.id;
    let token = req.headers.authorization.split(" ")[1];
    const decode = await verifyToken(token);
    const email = decode.email;
    await getFavoritesByUser(res, email)
    .then(response=>response)
    .catch(e=>e);
    await checkFavorites(favoritesArray, productId);
    await updateFavoritesArray(favoritesArray, productId);
    let params = {
        tableName: "USERS",
        keys: "favoriteProductsById",
        replacements: `"[${updatedFavoritesArray}]"`,
        filterKey: "email",
        valueFilter: `${email}`
    }
    if (isFavorite) {
        const copy = "El producto se quitó de favoritos";
        updateElements(params, res, copy)
    }
    else {
        const copy = "El producto se agregó a favoritos";
        updateElements(params, res, copy)
    }

})


/***************************************************MIDDLEWARES*******************************/
async function verifyProductId(req,res,next){
    const id = req.params.id;
    let query = `SELECT * FROM PRODUCTS WHERE productId=${id}`;
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

function verifyData(req, res, next) {
    const { title, price, img } = req.body;
    if (!title || !price || !img) {
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else {
        next()
    }
}



/***************************************************FUNCIONES*******************************/

async function getFavoritesByUser(res, email) {
    const query = `SELECT * FROM USERS WHERE email="${email}"`
    const user = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
    })
        .then(response => response)
        .catch(e => { res.status(400).json(e) });
    if (user[0].favoriteProductsById) {
        favoritesArray = JSON.parse(user[0].favoriteProductsById)
    }
    else {
        favoritesArray = []
    }
}
function checkFavorites(favoritesArray, productId) {
    var found = favoritesArray.find(element => element == productId);
    if (found) {
        isFavorite = true
    }
    else {
        isFavorite = false
    }
}
function updateFavoritesArray(favoritesArray, productId) {
    productId = parseInt(productId);
    if (!isFavorite) {
        favoritesArray.push(productId)
        updatedFavoritesArray = favoritesArray;
    }
    else {
        updatedFavoritesArray = favoritesArray.filter(element => element != productId)
    }
}

module.exports = router;

