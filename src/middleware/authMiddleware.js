import jwt from 'jsonwebtoken'; 


const authMiddleware = (req, res, next) => {
  const token = req.cookies["jwtToken"]; 
  if (!token) {
    return res.status(401).json({ success: false, error: 'No se ha proporcionado un token.' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token inválido.', message: error.message });
  }
};

export default authMiddleware;
