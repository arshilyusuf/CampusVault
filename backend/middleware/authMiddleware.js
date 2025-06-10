const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No auth token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const protectAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No auth token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.user || decoded.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { protect, protectAdmin };
