import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../authentication/guards/jwt-auth.guard";
import {ProductsService} from "./products.service";
import {IResponse} from "../interfaces/general";
import {AddCooperativeDto} from "../dto/addCooperative.dto";
import {AddProductDto} from "../dto/addProduct.dto";

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {
    }

    @Get('all-products')
    async getAllProducts(@Query('page') page: number, @Query('searchTerm') searchTerm: string, @Query('category') category: string): Promise<IResponse> {
        const products = await this.productsService.getAllProducts(page, 10, searchTerm, category)

        return {
            message: 'Products loaded successfully',
            data: products
        }
    }

    @Get('best-products')
    async getBestProducts(): Promise<IResponse> {
        const products = await this.productsService.getBestProducts()

        return {
            message: 'Products loaded successfully',
            data: products
        }
    }

    @Get('product/:id')
    async getProduct(@Param('id') id: string): Promise<IResponse> {
        const product = await this.productsService.getOneProducts(id)

        return {
            message: 'Product loaded successfully',
            data: product
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-product')
    async addProduct(@Body() productInfo: AddProductDto) {
        const product = await this.productsService.createProduct(productInfo)

        return {
            message: 'Product created successfully',
            data: product
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('edit-product/:id')
    async editProduct(@Param('id') id: string, @Body() productInfo: AddProductDto) {
        const product = await this.productsService.editProduct(id, productInfo)
        const customizedProduct = {...product, ingredients: product.ingredients.split(',')}

        return {
            message: 'Product edited successfully',
            data: customizedProduct
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-product/:id')
    async deleteCooperative(@Param('id') id: string) {
        const deleteResult = await this.productsService.deleteProduct(id)

        return {
            message: 'Product deleted successfully',
            data: deleteResult
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('change-status/:id')
    async changeProductStatus(@Param('id') id: string) {
        const product = await this.productsService.changeProductStatus(id)
        const customizedProduct = {...product, ingredients: product.ingredients.split(',')}

        return {
            message: 'Product status changed successfully',
            data: customizedProduct
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('favorite/:id')
    async favorite(@Param('id') id: string) {
        const product = await this.productsService.favorite(id)
        const customizedProduct = {...product, ingredients: product.ingredients.split(',')}

        return {
            message: customizedProduct.favorite ? 'Product marked as favorite successfully' : 'Product unmarked successfully',
            data: customizedProduct
        }
    }
}
