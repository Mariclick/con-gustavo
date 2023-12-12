import User from '../../../models/users.js'

const editUser = async (req, res) => {

  const { id } = req.params;
  const {nombre, enlace, empresa,mision, genero, protagnista, objetivo, motivacion, malo, ayudante, actitud, mensaje, comportamiento, responseAi} = req.body;
  await User
    .updateOne({
      _id: id
    },{
       $set:
       { ...nombre && {nombre}, 
        ...enlace && {enlace},
        ...empresa && {empresa},
        ...mision && {mision},
        ...genero && {genero},
        ...protagnista && {protagnista},
        ...objetivo && {objetivo},
        ...motivacion && {motivacion},
        ...malo && {malo},
        ...ayudante && {ayudante},
        ...actitud && {actitud},
        ...mensaje && {mensaje},
        ...comportamiento && {comportamiento},
        ...responseAi && {responseAi},

      
      }
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json({message: 'Your request gives error'}));
};

export default editUser;