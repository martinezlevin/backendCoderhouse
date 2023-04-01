import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname };
export const creaHash = (password)=>{return bcrypt.hashSync(password, bcrypt.genSaltSync(10));}
export const esClaveValida = (password, user)=>{return bcrypt.compareSync(password, user.password)}