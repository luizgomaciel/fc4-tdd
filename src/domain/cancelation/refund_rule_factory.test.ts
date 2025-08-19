import {Property} from "../entities/property";
import {User} from "../entities/user";
import {DateRange} from "../value_objects/date_range";
import {faker} from "@faker-js/faker/locale/ar";
import { v4 as uuidv4 } from 'uuid';
import {Booking} from "../entities/booking";

describe("Refund Rule Factory", () => {

    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        // ARRANGE
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = faker.number.float({ min: 1, max: 9 });

        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + 8);
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + 20);

        const property = new Property(
            uuidv4(),
            faker.person.fullName(),
            faker.lorem.word(),
            maxGuests,
            basePricePerNight
        );

        const user = new User(
            uuidv4(),
            faker.person.fullName()
        );

        const dateRange = new DateRange(
            startDate,
            endDate
        );

        const booking = new Booking(
            uuidv4(),
            property,
            user,
            dateRange,
            maxGuests
        );

        // ACTION
        booking.cancel(now);

        // ASSERTIONS
        expect(booking.getTotalPrice()).toBe(0);

    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        // ARRANGE
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = faker.number.float({ min: 1, max: 9 });

        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + 1);
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + 5);

        const property = new Property(
            uuidv4(),
            faker.person.fullName(),
            faker.lorem.word(),
            maxGuests,
            basePricePerNight
        );

        const user = new User(
            uuidv4(),
            faker.person.fullName()
        );

        const dateRange = new DateRange(
            startDate,
            endDate
        );

        const booking = new Booking(
            uuidv4(),
            property,
            user,
            dateRange,
            maxGuests
        );

        // ACTION
        booking.cancel(now);

        // ASSERTIONS
        const totalNights = dateRange.getTotalNights();
        let totalPrice = totalNights * basePricePerNight;
        totalPrice = totalPrice * 0.5;

        expect(booking.getTotalPrice()).toBe(totalPrice);

    });

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        // ARRANGE
        const maxGuests = faker.number.int({ min: 1, max: 9 });
        const basePricePerNight = faker.number.float({ min: 1, max: 9 });

        const now = new Date();
        const startDate = new Date(now);
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + 5);

        const property = new Property(
            uuidv4(),
            faker.person.fullName(),
            faker.lorem.word(),
            maxGuests,
            basePricePerNight
        );

        const user = new User(
            uuidv4(),
            faker.person.fullName()
        );

        const dateRange = new DateRange(
            startDate,
            endDate
        );

        const booking = new Booking(
            uuidv4(),
            property,
            user,
            dateRange,
            maxGuests
        );

        // ACTION
        booking.cancel(now);

        // ASSERTIONS
        const totalNights = dateRange.getTotalNights();
        let totalPrice = totalNights * basePricePerNight;

        expect(booking.getTotalPrice()).toBe(totalPrice);

    });

});