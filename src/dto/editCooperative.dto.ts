import {IsNotEmpty} from "class-validator";

export class EditCooperativeDto {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    community: string

    @IsNotEmpty()
    registrationFee: string

    @IsNotEmpty()
    monthlyFee: string

    @IsNotEmpty()
    minimalShare: string

}
