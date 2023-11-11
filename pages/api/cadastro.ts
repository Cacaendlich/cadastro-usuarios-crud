import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "@/models/UsersModel";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { respostaPadrao } from "@/types/respostaPadrao";
import { respostaCadastro } from "@/types/respostaCadastro";
import md5 from "md5";
import nc from "next-connect";

const handler = nc()
    .post(async (req : NextApiRequest, res: NextApiResponse<respostaPadrao>) =>{
        try {
            const usuario = req.body as respostaCadastro;
        
            if(!validarEmail(usuario.email)){
                return res.status(400).json({error : "O e-mail fornecido não é válido."});
            }

            // const usuariosComMesmoEmail = await UserModel.find({email : usuario.email});


            if(!validarSenha(usuario.senha)){
                return res.status(400).json({error : "A senha fornecida não é válida, ela precisa ter pelo menos 4 caracteres."});
            }

            const usuarioCadastrando = {
                email: usuario.email,
                senha : md5(usuario.senha)
            }
            
            const usuarioCadastrado = await UserModel.create(usuarioCadastrando);

            return res.status(200).json({msg : "Usuário cadastrado com sucesso!",
            ...usuarioCadastrado.toObject()});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error : "Oops! Erro ao tentar cadastrar usuário!"});
            
        }
        
    });

async function validarEmail(email: string){

    if (!email || email.trim() === "") {
        return false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regexEmail.test(email);
}
function validarSenha(senha: string){
    if (!senha || senha.trim() === "") {
        return false;
    }
    const regexSenha = /^.{4,}$/;
    return regexSenha.test(senha);
}



export default connectMongoDB(handler);