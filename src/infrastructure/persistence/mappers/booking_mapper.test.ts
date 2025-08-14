import {BookingEntity} from "../entities/booking_entity";
import {faker} from "@faker-js/faker/locale/ar";
import { v4 as uuidv4 } from 'uuid';
import {BookingMapper} from "./booking_mapper";
import {PropertyEntity} from "../entities/property_entity";
import {UserEntity} from "../entities/user_entity";
import {Property} from "../../../domain/entities/property";
import {User} from "../../../domain/entities/user";
import {Booking} from "../../../domain/entities/booking";
import {DateRange} from "../../../domain/value_objects/date_range";
import {en} from "@faker-js/faker";
import {PropertyMapper} from "./property_mapper";

describe("BookingMapper", () => {

    it("deve converter BookingEntity em Booking corretamente", () => {
        // ARRANGE
        const maxGuests = faker.number.int({ min: 1, max: 9 });

        const entityProperty = new PropertyEntity();
        entityProperty.id = uuidv4();
        entityProperty.name = faker.person.fullName();
        entityProperty.description = faker.lorem.word();
        entityProperty.maxGuests = maxGuests;
        entityProperty.basePricePerNight = faker.number.float({ min: 1, max: 9 })

        const userEntity = new UserEntity();
        userEntity.id = uuidv4();
        userEntity.name = faker.person.fullName();

        const entity = new BookingEntity();
        entity.id = uuidv4();
        entity.property = entityProperty;
        entity.guest = userEntity;
        entity.startDate = faker.date.recent({ days: 10 });
        entity.endDate = faker.date.soon({ days: 10 });
        entity.guestCount = maxGuests;
        entity.totalPrice = faker.number.float({ min: 1, max: 1000 });

        // ACTION
        const domain = BookingMapper.toDomain(entity);

        // ASSERTIONS
        expect(domain).not.toBeNull();
        expect(domain.getId()).toBe(entity.id);
        expect(domain.getDateRange().getStartDate()).toBe(entity.startDate);
        expect(domain.getDateRange().getEndDate()).toBe(entity.endDate);
        expect(domain.getGuestCount()).toBe(entity.guestCount);
        expect(domain.getTotalPrice()).toBe(entity.totalPrice);

        const domainProperty = domain.getProperty();
        expect(domainProperty.getId()).toBe(entityProperty.id);
        expect(domainProperty.getName()).toBe(entityProperty.name);
        expect(domainProperty.getDescription()).toBe(entityProperty.description);
        expect(domainProperty.getMaxGuests()).toBe(entityProperty.maxGuests);
        expect(domainProperty.getBasePricePerNight()).toBe(entityProperty.basePricePerNight);

        const domainUser = domain.getUser();
        expect(domainUser.getId()).toBe(userEntity.id);
        expect(domainUser.getName()).toBe(userEntity.name);

    });

    it("deve converter Booking para BookingEntity corretamente", () => {
        // ARRANGE
        const maxGuests = faker.number.int({ min: 1, max: 9 });

        const domainProperty = new Property(
            uuidv4(),
            faker.person.fullName(),
            faker.lorem.word(),
            maxGuests,
            faker.number.float({ min: 1, max: 9 })
        );

        const domainUser = new User(
            uuidv4(),
            faker.person.fullName()
        );

        const dateRange = new DateRange(
            faker.date.recent({ days: 10 }),
            faker.date.soon({ days: 10 })
        );

        const domain = new Booking(
            uuidv4(),
            domainProperty,
            domainUser,
            dateRange,
            maxGuests
        );

        // ACTION
        const entity = BookingMapper.toPersistence(domain);

        // ASSERTIONS
        expect(entity).not.toBeNull();
        expect(entity.id).toBe(domain.getId());
        expect(entity.startDate).toBe(domain.getDateRange().getStartDate());
        expect(entity.endDate).toBe(domain.getDateRange().getEndDate());
        expect(entity.guestCount).toBe(domain.getGuestCount());
        expect(entity.totalPrice).toBe(domain.getTotalPrice());

        const entityProperty = entity.property;
        expect(entityProperty.id).toBe(domainProperty.getId());
        expect(entityProperty.name).toBe(domainProperty.getName());
        expect(entityProperty.description).toBe(domainProperty.getDescription());
        expect(entityProperty.maxGuests).toBe(domainProperty.getMaxGuests());
        expect(entityProperty.basePricePerNight).toBe(domainProperty.getBasePricePerNight());

        const entityUser = entity.guest;
        expect(entityUser.id).toBe(domainUser.getId());
        expect(entityUser.name).toBe(domainUser.getName());

    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        // ARRANGE
//        var entityProperty = new PropertyEntity();
//        entityProperty.id = uuidv4();
//        entityProperty.name = faker.person.fullName();
//        entityProperty.description = faker.lorem.word();
//        entityProperty.maxGuests = faker.number.int({ min: 1, max: 9 });
//        entityProperty.basePricePerNight = faker.number.float({ min: 1, max: 9 })

//        var userEntity = new UserEntity();
//        userEntity.id = uuidv4();
//        userEntity.name = faker.person.fullName();


//        entity.property = entityProperty;
//        entity.guest = userEntity;
//        entity.startDate = faker.date.recent({ days: 10 });
//        entity.endDate = faker.date.soon({ days: 10 });
//        entity.guestCount = faker.number.int({ min: 1, max: 9 });
//        entity.totalPrice = faker.number.float({ min: 1, max: 1000 });

        // ACTION && ASSERTIONS
       expect(() => {
           // User validation
           var entity = new BookingEntity();
           entity.id = uuidv4();

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();

           entity.guest = userEntity;
           BookingMapper.toDomain(entity);
       }).toThrow("O nome é obrigatório");


       expect(() => {
           // User validation
           var entity = new BookingEntity();
           entity.id = uuidv4();

           var userEntity = new UserEntity();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 2;

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrowError("O ID é obrigatório");

       expect(() => {
           // DateRange validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           const date = new Date();
           entity.startDate = date;
           entity.endDate = date;

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 1;
           entityProperty.name = faker.person.fullName();

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("A data de início e término não podem ser iguais.");


       expect(() => {
           // DateRange validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           const hoje = new Date();
           const umDiaEmMs = 1000 * 60 * 60 * 24;

           entity.startDate = hoje;
           entity.endDate = new Date(hoje.getTime() - umDiaEmMs);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 1;
           entityProperty.name = faker.person.fullName();

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("A data de término deve ser posterior à data de início.");


       expect(() => {
           // Property validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           entity.startDate = new Date(2025, 1, 15);
           entity.endDate = new Date(2025, 2, 15);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 1;

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("O nome é obrigatório");

       expect(() => {
           // Property validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           entity.startDate = new Date(2025, 1, 15);
           entity.endDate = new Date(2025, 2, 15);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 0;
           entityProperty.name = faker.person.fullName();

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("O número máximo de hóspedes deve ser maior que zero");

       expect(() => {
           // Booking validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           entity.startDate = new Date(2025, 1, 15);
           entity.endDate = new Date(2025, 2, 15);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 1;
           entityProperty.name = faker.person.fullName();

           entity.guest = userEntity;
           entity.guestCount = 0;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("O número de hóspedes deve ser maior que zero.");

       expect(() => {
           // Booking validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           entity.startDate = new Date(2025, 1, 15);
           entity.endDate = new Date(2025, 2, 15);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityProperty = new PropertyEntity();
           entityProperty.maxGuests = 1;
           entityProperty.name = faker.person.fullName();

           entity.guest = userEntity;
           entity.guestCount = 10;
           entity.property = entityProperty;
           BookingMapper.toDomain(entity);
       }).toThrow("Número máximo de hóspedes excedido. Máximo permitido: 1");

       expect(() => {
           // Booking validation
           var entity = new BookingEntity();
           entity.id = uuidv4();
           entity.startDate = new Date(2025, 7, 14);
           entity.endDate = new Date(2025, 7, 16);

           var userEntity = new UserEntity();
           userEntity.id = uuidv4();
           userEntity.name = faker.person.fullName();

           var entityPropertySelec = new PropertyEntity();
           entityPropertySelec.id = uuidv4();
           entityPropertySelec.maxGuests = 1;
           entityPropertySelec.name = faker.person.fullName();

           // bloco - propriedade existente
           var entityProperty = new PropertyEntity();
           entityProperty.id = uuidv4();
           entityProperty.maxGuests = 1;
           entityProperty.name = faker.person.fullName();

           var existingBookingEntity = new BookingEntity();
           existingBookingEntity.id = uuidv4();
           existingBookingEntity.guest = userEntity;
           existingBookingEntity.startDate = new Date(2025, 7, 13);
           existingBookingEntity.endDate = new Date(2025, 7, 20);
           existingBookingEntity.status = "CONFIRMED";
           existingBookingEntity.property = entityProperty;
           const existingBooking = BookingMapper.toDomain(existingBookingEntity);

           const existingPropertyDomain = PropertyMapper.toDomain(entityProperty);
           existingPropertyDomain.addBooking(existingBooking);
           // bloco - propriedade existente

           entity.guest = userEntity;
           entity.guestCount = 1;
           entity.property = entityPropertySelec;
           BookingMapper.toDomain(entity, existingPropertyDomain);
       }).toThrowError("A propriedade não está disponível para o período selecionado.");

    });

});