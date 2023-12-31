const pool = require('../database')
const bcryptjs= require('bcryptjs');

const controladorUsuario={}

controladorUsuario.uniUsuario = async(req,res )=>{
    const [usuario] = await pool.query("select *  From usuarios ");
    res.send(usuario)
}

controladorUsuario.regisUsu=async(req,res)=>{

    const contra = req.body.password;

    let passwordHash= await bcryptjs.hash(contra,8)

        const {user,correo,apellidos}=req.body

        try{
            await pool.query('INSERT INTO usuarios (correo_electronico,nombre_usuario,apelidos,contrasena) VALUES (?,?,?,?)',[correo,user,apellidos,passwordHash])
            res.send("el usuario se inserto correctamente");

        } catch(Excepcion){
            res.send("el correo que insertaste ya esta registrado")
        }
}    

controladorUsuario.comparacion= async(req,res)=>{
    const correo= req.body.correo;

    const [bdpassword] =  await pool.query('select contrasena from usuarios where correo_electronico= ? ',[correo]); 

    const contra = req.body.password;

    contrabd = JSON.stringify(bdpassword);
    let encriptedbd = contrabd.substring(16,76);
    let compare =bcryptjs.compareSync(contra,encriptedbd);
    if(compare){
        res.send("Bienvenido")
    }else
        res.send("no se encuentra el usuario")
}

controladorUsuario.eliminar =async(req,res)=>{
    const correo = req.body.correo;

    const [bdpassword] =  await pool.query('select contrasena from usuarios where correo_electronico= ? ',[correo]); 
    contrabd = JSON.stringify(bdpassword);
    let encriptedbd = contrabd.substring(16,76);

    const contrasena = req.body.password;

    let compare =bcryptjs.compareSync(contrasena,encriptedbd);
    if(compare){
        await pool.query('Delete From usuarios Where correo_electronico= ? ',[correo]);
        res.send("Usuario eliminado");
    }else{
        res.send("contraseña o correo electronico no es correcto")
    } 
}

controladorUsuario.actualizarContrasena=async(req,res)=>{

    const correo= req.body.correo;
    const contranueva= req.body.passnuevo
    
    const [bdpassword] =  await pool.query('select contrasena from usuarios where correo_electronico= ? ',[correo]); 
    const contra = req.body.password;
    // const passwor = bdpassword[0].params.contrasena;
    contrabd = JSON.stringify(bdpassword);
    let encriptedbd = contrabd.substring(16,76);
    let compare =bcryptjs.compareSync(contra,encriptedbd);
    if(compare){
        let passwordHash= await bcryptjs.hash(contranueva,8)
        await pool.query(`UPDATE usuarios SET contrasena=ifNULL(?,contrasena) WHERE correo_electronico=?`,[passwordHash,correo]);
        res.send("se actualizon con exito")
    }else{

        res.send("no se encuentra el usuario")
    }
 }


module.exports=controladorUsuario