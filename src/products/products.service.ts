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

    async getAllProducts(page: number = 1, limit: number = 10, searchTerm: string = '') {
        const skip = (page - 1) * limit;

        const queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .skip(skip)
            .take(limit);

        if (searchTerm) {
            queryBuilder.where('product.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }

        const [products, totalItems] = await queryBuilder.getManyAndCount();

        return {
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            products,
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