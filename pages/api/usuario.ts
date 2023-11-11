import type { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { UserModel } from "@/models/UsersModel";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { respostaPadrao } from "@/types/respostaPadrao";
import nc from "next-connect";
