// test/mocks/auth.js - CORRECT

// Ici, vous exportez DIRECTEMENT la fonction. C'est ce qu'Express attend.
module.exports = (req, res, next) => {
  req.user = { id: 'mockUserId', role: 'ADMIN' };
  next();
};