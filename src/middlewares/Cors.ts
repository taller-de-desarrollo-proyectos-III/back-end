import { CorsConfig } from "../config";
import CORS from "cors";

export const cors = () => CORS(CorsConfig);
