const port = process.env.PORT || 3000,
express = require('express'),
app = express();
db = require('./models');

app.listen(port, () => {
    console.log('Servidor corriendo en puerto',port);
});

db.sequelize
.authenticate()
.then(() => console.log('Te conectaste a la base de datos ;v'))
.catch((e) => console.log('Error =>',e));