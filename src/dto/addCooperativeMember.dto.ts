import {IsNotEmpty} from "class-validator";

export class AddCooperativeMemberDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    cooperative: string

    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    houseNumber: string

    @IsNotEmpty()
    gpsAddress: string

    @IsNotEmpty()
    image: any

    @IsNotEmpty()
    idType: string

    @IsNotEmpty()
    idNumber: string

    @IsNotEmpty()
    community: string

    @IsNotEmpty()
    district: string

    @IsNotEmpty()
    region: string

    @IsNotEmpty()
    dob: Date

    @IsNotEmpty()
    education: string

    @IsNotEmpty()
    occupation: string

    @IsNotEmpty()
    secondaryOccupation: string

    @IsNotEmpty()
    crops: string

    @IsNotEmpty()
    farmSize: number
}
