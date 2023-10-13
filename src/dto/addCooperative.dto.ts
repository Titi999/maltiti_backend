import {IsNotEmpty} from "class-validator";

export class AddCooperativeDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    community: string

    @IsNotEmpty()
    registrationFee: string
z
    @IsNotEmpty()
    monthlyFee: string

    @IsNotEmpty()
    minimalShare: string
}
