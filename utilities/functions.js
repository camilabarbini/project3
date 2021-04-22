const conectToDatabase = require ('../database/index');
const sequelize = conectToDatabase.sequelize;


async function getElements(query, res, id){
await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT})
    .then(response=>{
        if(id){
            if(response.length){
                res.status(200).json(response)
            }
            else{
                res.status(404).json("No existe ningun elemento con ese id o para mostrar")
            }
        }
        else{
            if(response.length){
                res.status(200).json(response)}
            else{
                res.status(404).json("No hay elementos para mostrar")
            }
        }
    })
    .catch(e=>{res.status(400).json(e)})
}
async function insertElements(params, res){
    const tableName = params.tableName;
    const keys = params.keys
    let values=[];
    keys.forEach(element => {
        values.push("?")
    });
    const query = `INSERT INTO ${tableName} (${keys}) VALUES (${params.replacements})`;
    const results = await sequelize.query(query, {
        type: sequelize.QueryTypes.INSERT})
        .then(response=>{res.status(200).json("El elemento fue agregado")})
        .catch(e=>{console.log(e); res.status(400).json(e)})
}
async function updateElements(params, res,copy){
    const tableName = params.tableName;
    const keys = params.keys;
    const filterKey = params.filterKey;
    const valueFilter = params.valueFilter;
    if (!copy){
        copy="El elemento fue actualizado";
    };
    if(typeof(keys)=="object"){
        keys.forEach(async (element, index)=>{
            const query = `UPDATE ${tableName} SET ${element}="${params.replacements[index]}" WHERE ${filterKey}="${valueFilter}"`;
            await update(query) 
            .then(res.status(200).json(copy))
            .catch(e=>e)
        })
    }
    else{
        const query = `UPDATE ${tableName} SET ${keys}=${params.replacements} WHERE ${filterKey}="${valueFilter}"`;
        await update(query)
        .then(res.status(200).json(copy))
        .catch(e=>e)
    }
    async function update(query){
        await sequelize.query(query, {
        type: sequelize.QueryTypes.UPDATE})
        .then(response=>response)
        .catch(e=>res.status(400).json(e))
        }    
}

module.exports = {getElements, insertElements, updateElements}