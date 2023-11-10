import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "@/models/UsersModel";
import { respostaPadrao } from "@/types/respostaPadrao";
import { respostaCadastro } from "@/types/respostaCadastro";
import md5 from "md5";

//endpoint cadastro