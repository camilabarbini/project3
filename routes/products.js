const server = require('express');
const router = server.Router();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://sNUbrPBJdI:GdTXgKAFV9@remotemysql.com:3306/sNUbrPBJdI');
var isFavorite;

/***************************************************METODOS*******************************/
router.get('/', (req,res)=>{
    const query = 'SELECT * FROM PRODUCTS'
    getProducts(query,res)
})

router.post('/', verifyData,(req,res)=>{
    const {id, title, price, img } = req.body;
    insertProduct(id, title, price, img, res);
})

router.get('/id/:id', (req,res)=>{
    const id = req.params.id
    const query = `SELECT * FROM PRODUCTS WHERE id=${id}`
    getProducts(query,res,id)
})

router.get('/favoritos', (req,res)=>{
    const query = 'SELECT * FROM PRODUCTS WHERE favorite=1'
    getProducts(query,res)
})

router.patch('/favoritos/:id', verifyProducts,(req,res)=>{
    if(isFavorite){
        const query = `UPDATE PRODUCTS SET favorite = 0 WHERE id=${req.params.id}`
        const copy = "El producto se quitó de favoritos"
        updateFavorite(query,copy)
    }
    else{
        const query = `UPDATE PRODUCTS SET favorite = 1 WHERE id=${req.params.id}`
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
    const query = `SELECT * FROM PRODUCTS WHERE id=${req.params.id}`
    await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>{
            if(response.length){
                response[0].favorite==0?isFavorite=false:isFavorite=true
                next();
            }
            else{
                res.json("No existe producto con ese id")
            }
        })
}

/***************************************************FUNCIONES*******************************/

async function getProducts(query, res, id){
    await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT})
        .then(response=>{
            if(id){
                console.log(id, response.length)
                if(response.length){
                    res.status(200).json(response)
                }
                else{
                    res.status(404).json("No existe ningún producto con ese id")
                }
            }
            else{
                if(response.length){
                res.status(200).json(response)}
                else{
                    res.status(200).json("No hay productos para mostrar")
                }
            }
        })
        .catch(e=>{res.status(400).json(e)})
}

async function insertProduct(id, title, price, img, res){
    const query = 'INSERT INTO PRODUCTS (id, title, price, img) VALUES(?,?,?,?)'
    await sequelize.query(query, {
        replacements: [id, formatText(title), price, formatText(img)],
        type: sequelize.QueryTypes.INSERT})
        .then(response=>res.status(200).json("El producto fue agregado"))
        .catch(e=>{console.log(e); res.status(400).json(e)})
}

const formatText = text=>text?"'"+text+"'":null

/**********************************************************************************/
module.exports=router;

