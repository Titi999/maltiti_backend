import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Product} from "../entities/Product.entity";
import {AddCooperativeMemberDto} from "../dto/addCooperativeMember.dto";
import {CooperativeMember} from "../entities/CooperativeMember.entity";
import {AddProductDto} from "../dto/addProduct.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {
    }

    async getAllProducts(page: number = 1, limit: number = 10, searchTerm: string = '', category: string = '') {
        const skip = (page - 1) * limit;

        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .skip(skip)
            .take(limit);

        if (searchTerm) {
            queryBuilder.where('LOWER(product.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm.toLowerCase()}%` });
        }

        if (category) {
            queryBuilder.andWhere('LOWER(product.category) LIKE LOWER(:category)', { category: `%${category.toLowerCase()}%` });
        }


        const [products, totalItems] = await queryBuilder.getManyAndCount();

        return {
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            products,
        };
    }

    async getBestProducts() {
        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .orderBy('RANDOM()')  // Order by random to get random products
            .take(8);           // Take only 8 products

        const products = await queryBuilder.getMany();

        return {
            totalItems: 8,  // Assuming you always want to retrieve 8 random products
            data: products,
        };
    }

    async getOneProducts(id: string) {
        return this.productsRepository.findOneBy({id: id})
    }

    async createProduct(productInfo: AddProductDto) {
        const product = new Product()
        await this.setProduct(product, productInfo)
        return this.productsRepository.save(product)
    }

    async setProduct(product: Product, productInfo: AddProductDto) {
        product.name = productInfo.name
        product.category = productInfo.category
        product.image = productInfo.image
        product.description = productInfo.description
        product.ingredients = productInfo.ingredients
        product.code = productInfo.code
        product.retail = productInfo.retail
        product.weight = productInfo.weight
        product.wholesale = productInfo.wholesale
        product.size = productInfo.size
        product.status = productInfo.status
        product.stockQuantity = productInfo.stockQuantity
    }
}