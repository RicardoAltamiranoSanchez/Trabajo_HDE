const {response,request}=require('express');
const {Categoria,Producto}=require('../models');


const obtenerProductos=async  (req,res)=>{

      try {        
    const {limite=10,desde=0}=req.query;
    const query={estado:true};
    const [total,productos]=await Promise.all([
                    Producto.countDocuments(query),
                    Producto.find(query)
                    .populate('usuario','nombre')
                    .populate('categoria','nombre')
                    .skip(desde)
                    .limit(limite)
    ]);
    return res.status(200).json({
        msg:`Todos los productos registrados ${total}`,
        productos 
    })
         } catch (error) {
          console.log(`Hubo un errro ${error}`)
          }


}

const crearProducto=async (req,res) => {
      try {
      const {estado,usuario,...resto}=req.body;
      const nombreProducto =resto.nombreProducto;
      console.log(nombreProducto);
      const existeProducto=await Producto.findOne({nombreProducto});

      if(existeProducto){
           return res.status(201).json({
               msg:`Este producto ya existe ${existeProducto}`,
       })         
      }
  
      const data={
          ...resto,
          nombre:nombreProducto.toUpperCase(),
          usuario:req.usuario._id,
          categoria:req.params.id
      }
      const producto= new Producto(data);
      await producto.save();
      
      return res.status(201).json({
       msg:`Producto Creado `,
       producto

      })



          
      } catch (error) {
         return res.status(400).json({
             msg:`Ocurrio un error ${error}`,

             }); 
      }
}
const obtenerProducto=async (req,res) => {


    const {id}=req.params;
    const producto=await Producto.findById(id)
                         .populate('usuario','nombre')
                        .populate('categoria','nombre');
    if(!producto){
        return res.status(400).json({
         msg:`No existe id de este producto ${id}`
        })
    }
   
    return res.status(200).json({
    
          msg:`Producto seleccionado ${producto.nombre}`,
          producto
         
    })
}

const actualizarProducto=async (req,res) => {
   try {

      
   const {id}=req.params
   const {estado,usuario,...resto}=req.body;
   if(resto.nombre){

       resto.nombre=resto.nombre.toUpperCase();
    }
    resto.usuario=req.usuario._id;
   
   const productoActualizado= await Producto.findByIdAndUpdate(id,resto,{new:true}); 
    return res.status(201).json({

      msg:`Producto Actulizado Correctamente`,
      productoActualizado
    })

   } catch (error) {
    console.log(`Hubo un error ${error}`)   
   }
}

const eliminarProducto=async (req,res) => {

    try {
     const {id}=req.params;
     const productoEliminado=await Producto.findByIdAndUpdate(id,{estado:false},{new:true});
   
     return res.status(200).json({
   
   
          msg:`Producto ${productoEliminado.nombre} Eliminado`
     })
    } catch (e) {
        console.log(` Algo salio mal ${e} `)
        
    }
   }


module.exports={
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}
