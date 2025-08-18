import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import {PropertyEntity} from "../persistence/entities/property_entity";
import {PropertyService} from "../../application/services/property_service";
import {PropertyController} from "./property_controller";
import {faker} from "@faker-js/faker/locale/ar";
import {BookingEntity} from "../persistence/entities/booking_entity";
import {UserEntity} from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let propertyService: PropertyService;
let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyController: PropertyController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [ PropertyEntity, BookingEntity, UserEntity ],
        synchronize: true,
        logging: false,
      });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );

    propertyService = new PropertyService(propertyRepository);

    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
      propertyController.createProperty(req, res).catch((err) => next(err));
    });

});

afterAll(async () => {
    await dataSource.destroy();
});

describe("PropertyController", () => {
    beforeAll(async () => {
            const userRepo = dataSource.getRepository(UserEntity);
            const bookingRepo = dataSource.getRepository(BookingEntity);
            const propertyRepo = dataSource.getRepository(PropertyEntity);

            await bookingRepo.clear();
            await propertyRepo.clear();
            await userRepo.clear();

    });

    it("deve criar uma propriedade com sucesso", async () => {
        // ARRANGE
        const name = faker.person.fullName();
        const description = faker.lorem.word();
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = faker.number.float({ min: 1, max: 9 })

        // ACTION
        const response = await request(app).post("/properties").send({
            name: name,
            description: description,
            maxGuests: maxGuests,
            basePricePerNight: basePricePerNight,
        });

        // ASSERTION
        const propertyRepo = dataSource.getRepository(PropertyEntity);

        const property = await propertyRepo.findOne({
            where: { name: name }
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Property created successfully");
        expect(response.body.property.id).toBe(property!.id);
        expect(response.body.property.name).toBe(property!.name);
        expect(response.body.property.description).toBe(property!.description);
        expect(response.body.property.maxGuests).toBe(property!.maxGuests);
        expect(response.body.property.basePricePerNight).toBe(property!.basePricePerNight);

    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        // ARRANGE
        const name = "";
        const description = faker.lorem.word();
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = faker.number.float({ min: 1, max: 9 })

        // ACTION
        const response = await request(app).post("/properties").send({
            name: name,
            description: description,
            maxGuests: maxGuests,
            basePricePerNight: basePricePerNight,
        });

        // ASSERTION
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O nome da propriedade é obrigatório.");

    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
        // ARRANGE
        const name = faker.person.fullName();
        const description = faker.lorem.word();
        const maxGuests = 0;
        const basePricePerNight = faker.number.float({ min: 1, max: 9 })

        // ACTION
        const response = await request(app).post("/properties").send({
            name: name,
            description: description,
            maxGuests: maxGuests,
            basePricePerNight: basePricePerNight,
        });

        // ASSERTION
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");

    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        // ARRANGE
        const name = faker.person.fullName();
        const description = faker.lorem.word();
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = 0

        // ACTION
        const response = await request(app).post("/properties").send({
            name: name,
            description: description,
            maxGuests: maxGuests,
            basePricePerNight: basePricePerNight,
        });

        // ASSERTION
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("O preço base por noite é obrigatório.");
        
    });

});