import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { UserModel } from "@/models/UsersModel";
import { respostaPadrao } from "@/types/respostaPadrao";
import { loginResposta } from "@/types/loginResposta";
import { politicaCORS } from "@/middlewares/politicaCORS";
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import nc from 'next-connect';

const handler = nc()
    .post(async (req: NextApiRequest, res: NextApiResponse<respostaPadrao | loginResposta>) => {
        try {
            const { JWT_PRIVATE_KEY } = process.env;
            if(!JWT_PRIVATE_KEY){
                res.status(500).json({ error : "Chave privada do JWT não encontrada. Certifique-se de configurar a variável de ambiente JWT_PRIVATE_KEY corretamente."})
            }
            const { login, senha } = req.body;
            
            const senhaCriptografada = md5(senha);

            const usuarioEncontrado = await UserModel.findOne({email: login, senha: senhaCriptografada})

            console.log(usuarioEncontrado);

            if(!usuarioEncontrado){
                return res.status(500).json({error : "email não cadastrado!"});  
            }

            if (senha !== usuarioEncontrado.senha) {
                return res.status(500).json({error: "Senha incorreta!"});
            }

            const tokenDeResposta = jwt.sign({_id : usuarioEncontrado._id}, JWT_PRIVATE_KEY!);

            return res.status(200).json({nome: usuarioEncontrado.nome, email: usuarioEncontrado.email, token : tokenDeResposta});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error : "Oops! Erro ao tentar fazer Login!"});
        }
    })

export default politicaCORS(connectMongoDB(handler));