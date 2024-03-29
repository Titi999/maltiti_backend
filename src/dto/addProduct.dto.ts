import {IsBoolean, IsNotEmpty, IsNumber} from "class-validator";

export class AddProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    ingredients: string[]

    @IsNotEmpty()
    @IsNumber()
    weight: string

    @IsNotEmpty()
    category: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    size: string

    @IsNotEmpty()
    image: string

    @IsNotEmpty()
    @IsNumber()
    wholesale: string

    @IsNotEmpty()
    @IsNumber()
    retail: string

    @IsNotEmpty()
    @IsNumber()
    stockQuantity: string

    @IsNotEmpty()
    @IsNumber()
    inBoxPrice: string

    @IsNotEmpty()
    @IsNumber()
    quantityInBox: string

    @IsBoolean()
    favorite: boolean = false
}
