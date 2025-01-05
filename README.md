# Project README

## Brief Overview

This is a brief documentation for the changes that occurred and the enhancements made across the code repository.

## 1- Top 10 Most Frequently Ordered Products API

To enhance the performance of this feature, I wrote a raw SQL query that optimizes the retrieval of these products.

### Details:
**- SQL Query:** The query retrieves the top 10 most ordered products based on the frequency of orders.
Performance Optimization: By directly querying the database using raw SQL, the system bypasses the overhead of complex ORM queries, leading to faster data retrieval times, especially when working with large datasets.

### Implementation

```javascript
// SQL Query for Top 10 Most Ordered Products
const topProductsQuery = 
`SELECT 
    p.id,
    p.name,
    p.category,
    IFNULL(SUM(oi.quantity), 0) AS product_count
    FROM 
    Product AS p
    JOIN 
    OrderItem AS oi ON p.id = oi.productId
    ${area ? Prisma.sql`WHERE p.area = ${area}` : Prisma.empty}
    GROUP BY 
    p.id, p.name, p.area, p.category
    ORDER BY 
    product_count DESC
    LIMIT 10;
  `;
```

### Description

- Retrieves the top 10 most ordered products.
- Results are filtered by region if specified.
- Efficiently uses SQL aggregation and sorting for performance.

### Future Work
To further improve the performance of the "Top 10 Most Frequently Ordered Products" query, we can do:

Convert the Area to an Enum: Currently, the area field is stored as a string in the database. Converting it to an enum (stored as a number) in the database will allow for better indexing and faster queries. The backend can convert the numeric value to a string when needed, which would allow for efficient querying and indexing on the area field, improving the overall performance of the API.

#### Benefits:
**- Improved Query Performance:** Numeric values are more efficient for indexing compared to strings.
**- Better Data Integrity:** Using an enum ensures that the area field contains only valid values, reducing the likelihood of errors or inconsistencies in the database.

## 2- Optimizing a Poorly Implemented List Products API

### Improvements

1. **Pagination**: ntroduced limit and offset to manage the amount of data returned, reducing the load on the client and enhancing response times.
2. **Filters**: Enabled filtering by product category, price range, and availability, allowing users to retrieve more specific product sets.
3. **Optimized Query**: Reduced redundant joins and optimized database indexes to minimize the time taken for complex queries.


### Implementation

```javascript
async getAllProducts(filters: ProductFilters): Promise<ProductDTO[]> {
    const {
      categories,
      areas,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      pageSize = 20,
    } = filters;

  
    const query: any = {
      skip: (page - 1) * pageSize, 
      take: pageSize, 
      orderBy: {
        [sortBy]: sortOrder, 
      },
      where: {
        ...(categories && { category: { in: categories } }),
        ...(areas && { area: { in: areas } }),
      },
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
        createdAt: true,
        orders: {
          select: {
            id: true, 
          },
        },
      },
    };

    const products = await this.prismaService.product.findMany(query);

    return products;
  }
```

## 3- Adding Test Cases Using Jest and Testing Database

I wrote test cases using Jest to ensure the correctness of the functionality related to retrieving the top 10 most frequently ordered products. The test runs in an isolated testing database to ensure data consistency and reliability.

### Test Cases:

1. **Top 10 Products in a Specific Region**
   - Tests if the getTopTenProductsInRegion method correctly returns the top 10 products for a specified region (e.g., 'Giza'). It checks that the result matches the expected products based on the number of orders in that region.
2. **Top 10 Products Without Specifying Region**
   -  Tests if the method correctly returns the top 10 products across all regions when no specific region is provided.

### Implementation

```javascript
// Jest Test Case Example
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
        // other products...
      ],
    });

    // Seed the order item data
    await prismaService.orderItem.createMany({
      data: [
        { id: 1, productId: 1, quantity: 5, orderId: 1 },
        { id: 2, productId: 6, quantity: 5, orderId: 1 },
        // other order items...
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
      // other products...
    ];

    const result = await productRepository.getTopTenProductsInRegion(area);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result).toEqual(expectedTopProducts);
  });

  it('should return top 10 products when no region is specified', async () => {
    const expectedTopProducts = [
      { id: 17, name: 'Product R', area: 'Giza', category: 'Category 17', product_count: '5' },
      { id: 4, name: 'Product E', area: 'Giza', category: 'Category 4', product_count: '5' },
      // other products...
    ];
    const products = await productRepository.getTopTenProductsInRegion();
    expect(products).toEqual(expectedTopProducts);
    expect(products.length).toBeLessThanOrEqual(10);
  });
});
```
### Assumptions

- Products without orders are excluded from the top 10 list.
- Filters are optional but improve usability.


## 4- Pushover Notification Integration

### Implementation

```javascript
// Pushover Integration Example
const Pushover = require('pushover-notifications');
const pushover = new Pushover({
  user: process.env.PUSHOVER_USER,
  token: process.env.PUSHOVER_TOKEN,
});

 async createOrder(orderData: CreateOrderDTO) {
   const newOrder = await this.orderRepository.create(orderData.customerId);
   const orderItems = await this.orderItemService.createOrderItems(newOrder.id, orderData.items);
   const notificationMessage = `New Order Created: ${newOrder.id}  - ${orderItems.length} items`;
   await this.pushoverService.sendNotification(notificationMessage);
    return newOrder;
  }

  async sendNotification(message: string): Promise<void> {
    const msg = {
      message,
      title: 'New Order Created', 
      sound: 'pushover', 
      priority: 1, 
    };
    this.pushoverClient.send(msg, (err, res) => {
      if (err) {
        console.error('Pushover notification error:', err);
      } else {
        console.log('Notification sent successfully:', res);
      }
    });
    }
```

### Description

- Sends real-time notifications upon order creation.
- Utilizes the Pushover library for reliability.
- Includes order details in the notification message.

### Future Work:

- Notification Preferences: Implementing user-specific notification preferences (e.g., opt-in for certain types of notifications or different alert priorities).
- Expanded Notification Types: Adding more event types that trigger notifications, such as low stock alerts, product updates, etc.

## Conclusion

This project has seen significant improvements in performance, functionality, and notification systems:

**- Top 10 Most Frequently Ordered Products API:** By implementing an optimized raw SQL query, we enhanced the performance, ensuring faster and more accurate data retrieval.
**- Optimized Product List API:** Pagination and filtering were added, along with query optimization to reduce redundant joins and improve indexing, resulting in better scalability and responsiveness.
**- Unit Testing with Jest:** Comprehensive integration tests using Jest and a testing database were added to ensure that all features work as expected and to facilitate future changes with confidence.
**- Pushover Notification Integration:** Real-time notifications were integrated using Pushover, ensuring that users are immediately alerted about new orders, providing a better user experience.

## Future Work:
Converting the area field to an enum for better indexing and performance.
Enhancing notification preferences and expanding the types of notifications to improve user engagement and system scalability.


Overall, the changes made to this project improve its performance, maintainability, and user experience, laying a strong foundation for further improvements and growth.