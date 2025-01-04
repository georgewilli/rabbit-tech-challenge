import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../src/prisma/prisma.service";
import { ProductRepository } from "../../src/product/product.repository";

describe('ProductRepository (Integration)', () => {
  let productRepository: ProductRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRepository, PrismaService],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear existing data before seeding
    await prismaService.orderItem.deleteMany();
    await prismaService.product.deleteMany();

    // Seed the product data
    await prismaService.product.createMany({
      data: [
        { id: 1, name: 'Product A', area: 'Giza', category: 'Category 1' },
        { id: 2, name: 'Product B', area: 'Maadi', category: 'Category 2' },
        { id: 3, name: 'Product D', area: 'Giza', category: 'Category 3' },
        { id: 4, name: 'Product E', area: 'Giza', category: 'Category 4' },
        { id: 5, name: 'Product F', area: 'Maadi', category: 'Category 5' },
        { id: 6, name: 'Product G', area: 'Giza', category: 'Category 6' },
        { id: 7, name: 'Product H', area: 'Giza', category: 'Category 7' },
        { id: 8, name: 'Product I', area: 'Giza', category: 'Category 8' },
        { id: 9, name: 'Product J', area: 'Maadi', category: 'Category 9' },
        { id: 10, name: 'Product K', area: 'Giza', category: 'Category 10' },
        { id: 11, name: 'Product L', area: 'Giza', category: 'Category 11' },
        { id: 12, name: 'Product M', area: 'Maadi', category: 'Category 12' },
        { id: 13, name: 'Product N', area: 'Giza', category: 'Category 13' },
        { id: 14, name: 'Product O', area: 'Maadi', category: 'Category 14' },
        { id: 15, name: 'Product P', area: 'Giza', category: 'Category 15' },
        { id: 16, name: 'Product Q', area: 'Maadi', category: 'Category 16' },
        { id: 17, name: 'Product R', area: 'Giza', category: 'Category 17' },
        { id: 18, name: 'Product S', area: 'Maadi', category: 'Category 18' },
      ],
    });

    // Seed the order item data with quantity not exceeding 5
    await prismaService.orderItem.createMany({
      data: [
        { id: 1, productId: 1, quantity: 5, orderId: 1 },
        { id: 2, productId: 6, quantity: 5, orderId: 1 },
        { id: 3, productId: 8, quantity: 5, orderId: 1 },
        { id: 4, productId: 4, quantity: 5, orderId: 1 },
        { id: 5, productId: 3, quantity: 5, orderId: 1 },
        { id: 6, productId: 10, quantity: 5, orderId: 1 },
        { id: 7, productId: 12, quantity: 5, orderId: 1 },
        { id: 8, productId: 15, quantity: 5, orderId: 1 },
        { id: 9, productId: 10, quantity: 5, orderId: 1 },
        { id: 10, productId: 2, quantity: 5, orderId: 1 },
        { id: 11, productId: 6, quantity: 5, orderId: 1 },
        { id: 12, productId: 9, quantity: 5, orderId: 1 },
        { id: 13, productId: 17, quantity: 5, orderId: 1 },
        { id: 14, productId: 13, quantity: 5, orderId: 1 },
        { id: 15, productId: 14, quantity: 5, orderId: 1 },
      ],
    });
  });

  afterAll(async () => {
    await prismaService.orderItem.deleteMany();
    await prismaService.product.deleteMany();
    await prismaService.$disconnect();
  });

  it('should return top 10 products in the specified region', async () => {
    const area = 'Giza';
    const expectedTopProducts = [
      { id: 17, name: 'Product R', category: 'Category 17', area: 'Giza', product_count: '5' },
      { id: 4, name: 'Product E', category: 'Category 4', area: 'Giza', product_count: '5' },
      { id: 3, name: 'Product D', category: 'Category 3', area: 'Giza', product_count: '5' },
      { id: 6, name: 'Product G', category: 'Category 6', area: 'Giza', product_count: '10' },
      { id: 8, name: 'Product I', category: 'Category 8', area: 'Giza', product_count: '5' },
      { id: 10, name: 'Product K', category: 'Category 10', area: 'Giza', product_count: '10' },
      { id: 13, name: 'Product N', category: 'Category 13', area: 'Giza', product_count: '5' },
      { id: 15, name: 'Product P', category: 'Category 15', area: 'Giza', product_count: '5' },
      { id: 1, name: 'Product A', category: 'Category 1', area: 'Giza', product_count: '5' },
      { id: 11, name: 'Product L', category: 'Category 11', area: 'Giza', product_count: '0' },
    ];

    const result = await productRepository.getTopTenProductsInRegion(area);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result).toEqual(expectedTopProducts);
  });

  it('should return top 10 products when no region is specified', async () => {
    const expectedTopProducts = [ 
     { id: 17, name: 'Product R', area: 'Giza', category: 'Category 17', product_count: '5' },
     { id: 4, name: 'Product E', area: 'Giza', category: 'Category 4', product_count: '5' },
     { id: 3, name: 'Product D', area: 'Giza', category: 'Category 3', product_count: '5' },
     { id: 6, name: 'Product G', area: 'Giza', category: 'Category 6', product_count: '10' },
     { id: 8, name: 'Product I', area: 'Giza', category: 'Category 8', product_count: '5' },
     { id: 14, name: 'Product O', area: 'Maadi', category: 'Category 14', product_count: '5' },
     { id: 10, name: 'Product K', area: 'Giza', category: 'Category 10', product_count: '10' },
     { id: 13, name: 'Product N', area: 'Giza', category: 'Category 13', product_count: '5' },
     { id: 15, name: 'Product P', area: 'Giza', category: 'Category 15', product_count: '5' },
     { id: 2, name: 'Product B', area: 'Maadi', category: 'Category 2', product_count: '5' }
    ];
    const products = await productRepository.getTopTenProductsInRegion();
    expect(products).toEqual(expectedTopProducts);
    expect(products.length).toBeLessThanOrEqual(10);
  });
});
