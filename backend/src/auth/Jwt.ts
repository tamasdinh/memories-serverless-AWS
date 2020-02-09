import { JwtHeader } from "jsonwebtoken";
import { JwtPayload } from "./JwtPayload";

/* Interface describing a JWT Token (top level) */

export interface Jwt {
  header: JwtHeader,
  payload: JwtPayload
}