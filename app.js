import express from 'express';
import session from 'express-session';
import moment from 'moment-timezone';

const app = express();

//Configuracion del middleware de sesiones
app.use(
    session({
        secret: 'p3-CDGP#Charly-sesionespersistentes',//Palabra secreta para identificacion
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge:24 * 60 * 60 *1000} // 1 dia
    })
);

//Ruta para inicializar la sesion
app.get('/iniciar-sesion', (req, res) => {
    if (!req.session.inicio){
        req.session.inicio = new Date();//fecha de inicio de sesion
        req.session.ultimoAcceso = new Date();// Ultima consulta inicial
        res.send('Sesion iniciada.');
    }else{
        res.send('La sesion ya esta activa.');
    }
});

//Ruta para actualizar la fecha de ultima consulta
app.get ('/actualizar', (req, res) => {
    if (req.session.inicio){
        req.session.ultimoAcceso = new Date();
        res.send('Fecha de la ultima consulta actualizada.');
    }else{
        res.send('No hay una sesion activa.');
    }
});

//Ruta para ver el estado de la sesion
app.get('/estado-sesion', (req, res) => {
    if (req.session.inicio){
        const inicio = req.session.inicio;
        const ultimoAcceso = req.session.ultimoAcceso;
        const ahora = new Date();
     
        //Calcular la antiguedad de la sesion
        const antiguedadMs = ahora - inicio;
        const horas = Math.floor(antiguedadMs / (1000*60*60));
        const minutos = Math.floor(antiguedadMs % (1000 * 60 * 60) / (1000 * 60));
        const segundos = Math.floor(antiguedadMs % (1000 * 60) /1000);

        //convertir la dechas al husos horario de  CDMX
        const inicioCDMX = moment(inicio).tz('America/mexico_City').format('YYY-MM-DD HH:mm:ss');
        const ultimoCMDX = moment(ultimoAcceso).tz('America/mexico_City').format('YYY-MM-DD HH:mm:ss');

        res.json({
            mensaje: 'Estado de la sesion',
            seseionID: req.sessionID,
            inicio: inicioCDMX,
            ultimoAcceso: ultimoCMDX,
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        });
    }else{
        res.send('No hay una sesion activa');
    }
})

//Ruta para cerrar la sesion 
app.get ('/cerrar-sesion', (req, res) =>{
    if (req.session){
        req.session.destroy((err) => {
            if (err){
                return res.status(500).sed('Error al cerrar la sesion');
            }
            res.send('Sesion cerrada correctamente.');
        });
    }else{
        res.send('No hay una sesion activa para cerrar.');
    }
});

//Iniciar el sevidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    
});