import {UserService} from "../../application/services/user_service";
import { Request, Response } from "express";
import any = jasmine.any;

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        try{
            const { name } = req.body;

            const user = await this.userService.createUser(name.trim());

            return res.status(201).json({
              message: "User created successfully",
              user,
            });
        }catch (error: any){
            var message = "";
            if(error.message === "O nome é obrigatório"){
                message = "O campo nome é obrigatório.' ao enviar um nome vazio";
            }

            return res.status(400).json({
                 message: message
            });
        }
    }

}