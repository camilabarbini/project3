const server = require('express');
const router = server.Router();

let dataDB = {
    user: "sNUbrPBJdI",
    password: "GdTXgKAFV9",
    host: "remotemysql.com",
    port: 3306,
    database: "sNUbrPBJdI",
}

const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${dataDB.user}:${dataDB.password}@${dataDB.host}:${dataDB.port}/${dataDB.database}`);

var isFavorite;

/***************************************************METODOS*******************************/
router.get('/', (req,res)=>{
    const query = 'SELECT * FROM PRODUCTS'
    getProducts(query,res)
})

router.post('/', verifyData,(req,res)=>{
    const {productId, title, price, img } = req.body;
    insertProduct(productId, title, price, img, res);
})

router.get('/id/:id', (req,res)=>{
    const id = req.params.id
    const query = `SELECT * FROM PRODUCTS WHERE productId=${id}`
    getProducts(query,res,id)
})

router.get('/favoritos', (req,res)=>{
    const query = 'SELECT * FROM PRODUCTS WHERE isFavorite=1'
    getProducts(query,res)
})

router.patch('/favoritos/:id', verifyProducts,(req,res)=>{
    if(isFavorite){
        const query = `UPDATE PRODUCTS SET isFavorite = 0 WHERE productId=${req.params.id}`
        const copy = "El producto se quitó de favoritos"
        updateFavorite(query,copy)
    }
    else{
        const query = `UPDATE PRODUCTS SET isFavorite = 1 WHERE productId=${req.params.id}`
        const copy = "El producto se agregó a favoritos"
        updateFavorite(query,copy)
    }    
    async function updateFavorite(query,copy){
        await sequelize.query(query, {
        type: sequelize.QueryTypes.UPDATE})
        .then(response=>res.status(200).json(copy))
        .catch(e=>{res.status(400).json(e)})
    }
}
)

/***************************************************MIDDLEWARES*******************************/

function verifyData(req,res,next){
    const { title, price, img } = req.body;
    if(!title || !price || !img){
        res.status(400).json("Falta ingresar uno o más datos")
    }
    else{
        next()
    }
}

async function verifyProducts(req,res,next){
    const query = `SELECT * FROM PRODUCTS WHERE productId=${req.params.id}`
    const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    if(result.length){
        if(result[0].isFavorite==0){
            isFavorite=false
        }
        else{
            isFavorite=true
        }
        next();
    }
    else{
        res.json("No existe producto con ese id")
    }
}

/***************************************************FUNCIONES*******************************/

async function getProducts(query, res, id){
    const result =await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>{res.status(400).json(e)})
    if(id){
        console.log(id, result.length)
        if(result.length){
            res.status(200).json(result)
                }
                else{
                    res.status(404).json("No existe ningún producto con ese id")
                }
            }
            else{
                if(result.length){
                res.status(200).json(result)}
                else{
                    res.status(200).json("No hay productos para mostrar")
                }
            }
        
        
}

async function insertProduct(productId, title, price, img, res){
    const query = 'INSERT INTO PRODUCTS (productId, title, price, img, isFavorite) VALUES(?,?,?,?,?)'
    await sequelize.query(query, {
        replacements: [productId, title, price, img, 0],
        type: sequelize.QueryTypes.INSERT})
        .then(response=>{res.status(200).json("El producto fue agregado"),getAllProducts()})
        .catch(e=>{console.log(e); res.status(400).json(e)})
}

/**********************************************************************************/
async function getAllProducts(){
    const query = 'SELECT * FROM PRODUCTS'
    const productsInDb = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>response)
        .catch(e=>e);
    console.log(productsInDb)
    productsInDb.forEach(element => {
      updatePriceList(element.productId, element.price)
    });
  };
  
  async function updatePriceList(productId, price){
    const query = 'INSERT INTO PRICELIST (productId, price) VALUES(?,?)'
      await sequelize.query(query, {
          replacements: [productId, price],
          type: sequelize.QueryTypes.INSERT})
          .then(response=>response)
          .catch(e=>e)
  }
module.exports=router;

