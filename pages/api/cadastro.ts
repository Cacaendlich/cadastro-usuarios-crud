import { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "@/models/UsersModel";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { politicaCORS } from "@/middlewares/politicaCORS";
import { respostaPadrao } from "@/types/respostaPadrao";
import { requisicaoCadastro } from "@/types/requisicaoCadastro";
import md5 from "md5";
import nc from "next-connect";

const handler = nc()
    .post(async (req : NextApiRequest, res: NextApiResponse<respostaPadrao>) =>{
        try {
            const usuario = req.body as requisicaoCadastro;

            if(!validarNome(usuario.nome)){
                return res.status(400).json({error : "O nome fornecida não é válido, ele precisa ter pelo menos 3 caracteres."});
            }

            if(validarEmail(usuario.email)){
                return res.status(400).json({error : "O e-mail fornecido não é válido."});
            }
            
            if(await validarEmailExistente(usuario.email, req) == false){
                return res.status(400).json({error : "O e-mail fornecido já exite!"});
            }

            if(!validarSenha(usuario.senha)){
                return res.status(400).json({error : "A senha fornecida não é válida, ela precisa ter pelo menos 4 caracteres."});
            }

            const usuarioCadastrando = {
                nome: usuario.nome,
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

function validarEmail(email: string){
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = regexEmail.test(email);

    if (!email || email.trim() === "" || emailValido) {
        return false;
    } 
    return true;
}

async function validarEmailExistente(email: string, req: NextApiRequest) {
    const usuario = req.body as requisicaoCadastro;
    const usuariosComMesmoEmail = await UserModel.find({ email: usuario.email });
  
    if (usuariosComMesmoEmail.length > 0) {
      return false;
    }  
    return true;
}

function validarSenha(senha: string){
    if (!senha || senha.trim() === "") {
        return false;
    }
    const regexSenha = /^.{4,}$/;
    return regexSenha.test(senha);
}

function validarNome(nome: string){
    if (!nome || nome.trim() === "") {
        return false;
    }
    const regexSenha = /^.{3,}$/;
    return regexSenha.test(nome);
}
export default politicaCORS(connectMongoDB(handler));