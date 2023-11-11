import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { respostaPadrao } from "@/types/respostaPadrao";
import jwt, {JwtPayload} from "jsonwebtoken";

export const autenticarToken = (handler : NextApiHandler) => (req : NextApiRequest, res: NextApiResponse<respostaPadrao>) => {
    try {
        const { JWT_PRIVATE_KEY } = process.env;

        if(!JWT_PRIVATE_KEY){
            return res.status(500).json({error : 'Erro interno do servidor: A chave privada JWT não está configurada corretamente.'});
        }
    
        if(!req || !req.headers){
            return res.status(400).json({error : 'Erro interno do servidor: A requisição não contém cabeçalhos válidos.'});
        }

        if(req.method !== 'OPTIONS'){            
            const authorization = req.headers['authorization'];
            
            if (!authorization){
                return res.status(401).json({ error: 'Ocorreu um erro ao validar o token de acesso.'});
            }

            const token = authorization.substring(7);

            if (!token){
                return res.status(401).json({ error: 'Ocorreu um erro ao validar o token de acesso.'});
            }

            const payloadTokenVerificado = jwt.verify(token, JWT_PRIVATE_KEY as string) as JwtPayload;
            if (!payloadTokenVerificado){
                return res.status(401).json({ error: 'Ocorreu um erro ao validar o token de acesso.'});
            }

            if (!req.query){
                req.query = {};
            }

            req.query.userId = payloadTokenVerificado._id;   
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Ocorreu um erro ao validar o token de acesso.' });
    }
    return handler(req, res);
}