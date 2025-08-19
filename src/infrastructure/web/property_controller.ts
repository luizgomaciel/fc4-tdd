import {PropertyService} from "../../application/services/property_service";
import { Request, Response } from "express";

export class PropertyController {

    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
      this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            const { name, description, maxGuests, basePricePerNight } = req.body;

            if(basePricePerNight === undefined){
                return res.status(400).json({
                    message: "O preço base por noite é obrigatório."
               });
            }

            const property = await this.propertyService.createProperty(
                name.trim(), description.trim(), maxGuests, basePricePerNight
            );

            return res.status(201).json({
              message: "Property created successfully",
              property,
            });

        } catch(error: any){
            var message = "";
            if(error.message === "O nome é obrigatório"){
                message = "O nome da propriedade é obrigatório.";
            }

            if(error.message === "O número máximo de hóspedes deve ser maior que zero"){
                message = "A capacidade máxima deve ser maior que zero.";
            }

            return res.status(400).json({
                 message: message
            });
        }
    }

}