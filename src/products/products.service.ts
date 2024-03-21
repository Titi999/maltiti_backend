import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { AddProductDto } from '../dto/addProduct.dto';
import { IBestProducts, productsPagination } from '../interfaces/general';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    category: string = '',
  ): Promise<productsPagination> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (searchTerm) {
      queryBuilder.where('LOWER(product.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm.toLowerCase()}%`,
      });
    }

    if (category) {
      queryBuilder.andWhere('LOWER(product.category) LIKE LOWER(:category)', {
        category: `%${category.toLowerCase()}%`,
      });
    }

    const [products, totalItems] = await queryBuilder
      .skip(skip)
      .take(10)
      .getManyAndCount();

    const customizedProduct = products.map(product => ({
      ...product,
      ingredients: product.ingredients.split(','),
    }));

    return {
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      products: customizedProduct,
    };
  }

  async getBestProducts(): Promise<IBestProducts> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .orderBy('RANDOM()') // Order by random to get random products
      .take(8); // Take only 8 products

    const products = await queryBuilder.getMany();

    const customizedProduct = products.map(product => ({
      ...product,
      ingredients: product.ingredients.split(','),
    }));

    return {
      totalItems: 8, // Assuming you always want to retrieve 8 random products
      data: customizedProduct,
    };
  }

  async getOneProducts(id: string): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  async createProduct(productInfo: AddProductDto): Promise<Product> {
    const product = new Product();
    await this.setProduct(product, productInfo);
    return this.productsRepository.save(product);
  }

  async editProduct(id: string, productInfo: AddProductDto): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id: id });
    await this.setProduct(product, productInfo);
    return this.productsRepository.save(product);
  }

  async changeProductStatus(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (product.status === 'active') {
      product.status = 'inactive';
    } else if (product.status === 'inactive') {
      product.status = 'active';
    }
    return this.productsRepository.save(product);
  }

  async favorite(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (product.favorite) {
      product.favorite = false;
    } else if (!product.favorite) {
      product.favorite = true;
    }
    return this.productsRepository.save(product);
  }

  async setProduct(
    product: Product,
    productInfo: AddProductDto,
  ): Promise<void> {
    product.name = productInfo.name;
    product.category = productInfo.category;
    product.image = productInfo.image;
    product.description = productInfo.description;
    product.ingredients = productInfo.ingredients.toString();
    product.retail = productInfo.retail;
    product.weight = productInfo.weight;
    product.wholesale = productInfo.wholesale;
    product.size = productInfo.size;
    product.status = productInfo.status;
    product.inBoxPrice = String(
      Number(productInfo.quantityInBox) * Number(productInfo.wholesale),
    );
    product.stockQuantity = productInfo.stockQuantity;
    product.quantityInBox = productInfo.quantityInBox;
    product.updatedAt = new Date();
    product.rating = String((Math.random() * (3.5 - 5) + 5).toFixed(1));
    product.reviews = String(Math.floor(Math.random() * 99) + 1);
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    return this.productsRepository.delete({ id: id });
  }

  async findOne(id: string): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
  }
}
