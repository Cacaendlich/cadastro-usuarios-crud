import type {NextApiRequest, NextApiResponse, NextApiHandler } from "next"; // NextApiHandler é manipulador de API Next.js
import { respostaPadrao } from "@/types/respostaPadrao";
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler : NextApiHandler) => async (req : NextApiRequest, res : NextApiResponse<respostaPadrao>) => {
    try {
        await NextCors(req, res, {
            origin: '*', 
            methods: ['POST'],
            optionsSuccessStatus: 200,
         });
        return handler(req, res);
         
    } catch (e) {
        console.log('Erro ao tratar a politica de CORS:', e);
        return res.status(500).json({error : 'Erro ao tratar a politica de CORS.'})
    }
}
