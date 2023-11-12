import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { respostaPadrao } from "@/types/respostaPadrao";

export const connectMongoDB = ( handler : NextApiHandler ) => async ( req : NextApiRequest, res : NextApiResponse<respostaPadrao>) => {
    try {
        const estadoDeConexaoDesconectado = mongoose.connections[0].readyState;
        if(estadoDeConexaoDesconectado){
            return handler(req, res);
        }

        const { CONNECTION_STRING } = process.env;
        if(!CONNECTION_STRING){
            return res.status(500).json({ error : "Oops! Parece que a string de conexão não foi encontrada. Por favor, verifique as configurações e tente novamente."});
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados CONECTADO!'));  
        mongoose.connection.on('error', error => console.log(`ERRO ao conectar banco de dados. ${error}`));

        await mongoose.connect(CONNECTION_STRING);

        return handler(req,res);

    } catch (error) {
        console.log("Erro ao tentar conectar ao banco de dados:", error);
        return res.status(500).json({ error: `Oops! Encontramos um problema ao tentar conectar ao banco de dados.` });
    }
}