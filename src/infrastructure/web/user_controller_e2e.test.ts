import request from "supertest";
import {UserController} from "./user_controller";
import {UserService} from "../../application/services/user_service";
import express from "express";
import {DataSource} from "typeorm";
import {UserEntity} from "../persistence/entities/user_entity";
import {TypeORMUserRepository} from "../repositories/typeorm_user_repository";
import {faker} from "@faker-js/faker/locale/ar";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userController: UserController;
let userService: UserService;
let userRepository: TypeORMUserRepository;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [ UserEntity ],
        synchronize: true,
        logging: false,
      });

    await dataSource.initialize();

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );

    userService = new UserService(userRepository);
    userController = new UserController(userService);

    app.post("/users", (req, res, next) => {
      userController.createUser(req, res).catch((err) => next(err));
    });

});

afterAll(async () => {
    await dataSource.destroy();
});


describe("UserController", () => {

    beforeAll(async () => {
        const userRepo = dataSource.getRepository(UserEntity);
        await userRepo.clear();
    });

    it("deve criar um usuário com sucesso", async () => {
        // ARRANGE
        const name = faker.person.fullName();

        // ACTION
        const response = await request(app).post("/users").send({
            name: name
        });

        // ASSERTION
        const userRepo = dataSource.getRepository(UserEntity);

        const user = await userRepo.findOne({
            where: { name: name }
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully");
        expect(response.body.user.id).toBe(user!.id);
        expect(response.body.user.name).toBe(user!.name);

    });

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        // ARRANGE
        const name = "";

        // ACTION
        const response = await request(app).post("/users").send({
            name: name
        });

        // ASSERTION
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O campo nome é obrigatório.' ao enviar um nome vazio");

    });

});