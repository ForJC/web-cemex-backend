const { join } = require('path');
const pool = require('../database')
const controllerPlanta ={};

controllerPlanta.obtenerPlanta = async(req,res)=>{
    const planta = ({id_planta:req.params.cb})
    id=JSON.stringify(planta);
        const recid=/(\d+)/g;
        const idrecu= id.match(recid);
    try{    
    const [infoPlanta]= await pool.query('Select * FROM unidad_operativa WHERE id_planta =?',[idrecu])
    
        if(infoPlanta!="")
    res.send(infoPlanta);
        else{

            res.status(500).json({message
                :"no se encuentra la planta registrada"})
        }
    }catch(Excepcion){
        res.status(500).json({message:"hay un error con el servidor"})
    }
    
}

controllerPlanta.obtenerPlantas=async(req,res)=>{
    try{
        const [plantas]= await pool.query('select * From unidad_operativa')
    res.json(plantas)
    }catch{
        res.status(500).json("no hay coneccion en la base de datos")
    }
    
}
controllerPlanta.activasFijas=async(req,res)=>{
    try{
        const activo=req.body.activa;
        const fija= req.body.fija;

        const [plantas] = await pool.query('Select * FROM unidad_operativa WHERE fija=? and activo =?',[fija,activo])
        res.json(plantas)
    }catch(exepcion){
        console.log(exepcion)
        res.status(500).json("no hay coneccion en la base de datos")
        
    }
}



controllerPlanta.insertPlanta = async(req,res)=>{

    const {nombre_planta, segmento,zona,estado,porcentaje_cumplimiento,fija,activa }=req.body
    try{ 
    const [reg]= await pool.query(`INSERT INTO unidad_operativa (nombre_planta, segmento, zona, Estado, porcentaje_cumplimiento,fija,activo) Values (?,?,?,?,?,?,?)`, [nombre_planta,segmento,zona,estado,porcentaje_cumplimiento,fija,activa])
    
    console.log("Se resivio la peticon ")
    console.log(nombre_planta, segmento,zona,estado,porcentaje_cumplimiento,fija,activa)
    res.json("planta insertada en la base de datos")
    }catch(Exception){
        res.status(500).json({message:'Estas intentando insertar una planta que ya esta registrada'})
    }
}

controllerPlanta.actualizar = async(req, res)=>{
    const planElej=({id_planta:req.params.cb})
    const {nombre_planta,segmento,zona, estado,porcentaje_cumplimiento,fija,activo}=req.body

    id=JSON.stringify(planElej);
    const recid=/(\d+)/g;
    let idrecu= id.match(recid);
    idrecu=idrecu.join();
    let ids=parseInt(idrecu,10);
    try{
         const [infoPlanta]= await pool.query(`Select id_planta FROM unidad_operativa WHERE id_planta =?`,[ids]);
         if(infoPlanta!=""){
            // console.log(ids)
        await pool.query(`UPDATE unidad_operativa SET nombre_planta=ifNULL(?,nombre_planta), segmento=ifNULL(?,segmento), zona=ifNULL(?,zona), Estado=ifNULL(?,Estado), porcentaje_cumplimiento=ifNULL(?,porcentaje_cumplimiento), fija=ifNULL(?,fija), activo=ifNULL(?,activo) 
        WHERE id_planta=?`,[nombre_planta,segmento,zona,estado,porcentaje_cumplimiento,fija,activo,ids]);
        res.json({message:"estatus actualizado"})
        console.log("se actualizo correctamente")
    }
    else{
        res.status(404).json({message:"No se encuentra el registro"})
        console.log("no se encontro la planta que intentas actualizar")
    }
    } catch(Excepcion){
        res.status(500).json({message:"error interno del sistema"})
        console.log("error interno con el sistema",excepcion);
    }
   
}

controllerPlanta.eliminar = async(req, res)=>{
    
    const planta = ({id_planta:req.params.cb})
    
        id=JSON.stringify(planta);
        const recid=/(\d+)/g;
        const idrecu= id.match(recid);           
        const [infoPlanta]= await pool.query('Select * FROM unidad_operativa WHERE id_planta =?',[idrecu])
        try{
            if(infoPlanta!=""){
                await pool.query('DELETE FROM unidad_operativa WHERE id_planta=?',[idrecu]);
                res.send("se elimino Correctamente ")
            }else{
                res.send("no esta")
            }
        }catch(excepcion){
            res.status(500).json("No se encontro la planta que se desea eliminar")
        }
}    
    module.exports=controllerPlanta

    