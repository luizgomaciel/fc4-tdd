import { PropertyEntity } from "../entities/property_entity";
import { Property } from "../../../domain/entities/property";
import {PropertyMapper} from "./property_mapper";
import { v4 as uuidv4 } from 'uuid';
import {faker} from "@faker-js/faker/locale/ar";

describe("PropertyMapper", () => {

    it("deve converter PropertyEntity em Property corretamente", () => {
        // ARRANGE
        const entity = new PropertyEntity();
        entity.id = uuidv4();
        entity.name = faker.person.fullName();
        entity.description = faker.lorem.word();
        entity.maxGuests = faker.number.int({ min: 1, max: 9 });
        entity.basePricePerNight = faker.number.float({ min: 1, max: 9 });

        // ACTION
        const domain = PropertyMapper.toDomain(entity);

        // ASSERTIONS
        expect(domain).not.toBeNull();
        expect(domain.getId()).toBe(entity.id);
        expect(domain.getName()).toBe(entity.name);
        expect(domain.getDescription()).toBe(entity.description);
        expect(domain.getMaxGuests()).toBe(entity.maxGuests);
        expect(domain.getBasePricePerNight()).toBe(entity.basePricePerNight);

    });

    it("deve converter Property para PropertyEntity corretamente", () => {
        // ARRANGE
        const domain = new Property(
            uuidv4(),
            faker.person.fullName(),
            faker.lorem.word(),
            faker.number.int({ min: 1, max: 9 }),
            faker.number.float({ min: 1, max: 9 })
        );

        // ACTION
        const entity = PropertyMapper.toPersistence(domain);

        // ASSERTIONS
        expect(entity).not.toBeNull();
        expect(entity.id).toBe(domain.getId());
        expect(entity.name).toBe(domain.getName());
        expect(entity.description).toBe(domain.getDescription());
        expect(entity.maxGuests).toBe(domain.getMaxGuests());
        expect(entity.basePricePerNight).toBe(domain.getBasePricePerNight());

    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
        // ARRANGE
        const entity = new PropertyEntity();

        // ACTION && ASSERTIONS
        expect(() => {
            PropertyMapper.toDomain(entity);
        }).toThrow("O nome é obrigatório");

        expect(() => {
            entity.name = faker.person.fullName();
            entity.maxGuests = 0;
            PropertyMapper.toDomain(entity);
        }).toThrow("O número máximo de hóspedes deve ser maior que zero");

    });

});