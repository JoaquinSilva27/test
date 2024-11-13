// middleware/sessionMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Necesitas iniciar sesión" });
    }
  }
  
function authorizeRoles(...roles) {
  return (req, res, next) => {
      console.log("Rol del usuario en sesión:", req.session.user ? req.session.user.rol : 'No autenticado');
      if (req.session.user && roles.includes(req.session.user.rol)) {
          console.log("Autorización exitosa");
          next();
      } else {
          console.log("Autorización fallida");
          res.status(403).json({ success: false, message: "Acceso denegado" });
      }
  };
}
  
module.exports = { isAuthenticated, authorizeRoles };