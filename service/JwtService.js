import {
    JWT_SECRET,
    JWT_EXPIRES_IN,
} from '../config/index.js';
import jwt from 'jsonwebtoken';

class JwtService {
    static sign(payload, exp = JWT_EXPIRES_IN) {
        // console.log(`exp = ${exp}`);
        return jwt.sign(payload, JWT_SECRET, { expiresIn: exp });
    }
    static verify(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}
export default JwtService;