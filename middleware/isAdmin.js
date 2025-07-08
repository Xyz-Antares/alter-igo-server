const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Accès refusé. Droits d\'administrateur requis.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification des droits d\'administrateur' });
    }
};