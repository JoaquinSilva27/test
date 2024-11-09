function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Necesitas iniciar sesión" });
    }
  }
  
function authorizeRoles(...roles) {
    return (req, res, next) => {
        console.log("Usuario en sesión:", req.session.user);
        if (req.session.user && roles.includes(req.session.user.rol)) {
            next();
        }else {
        res.status(403).json({ success: false, message: "Acceso denegado" });
      }
    };
  }
  
module.exports = { isAuthenticated, authorizeRoles };