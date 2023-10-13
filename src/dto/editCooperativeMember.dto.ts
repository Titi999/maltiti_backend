import {IsNotEmpty} from "class-validator";

export class EditCooperativeMemberDto {
    @IsNotEmpty()
    id: string

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
    image: string

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
