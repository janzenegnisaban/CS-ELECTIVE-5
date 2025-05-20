# QuiCake Ecommerce

A full-featured ecommerce platform for selling cakes and baked goods online.

## Features

- User authentication (register, login, logout)
- Product browsing and filtering
- Shopping cart functionality
- Checkout process
- Order history
- Admin dashboard for managing products and orders

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/quicake-ecommerce.git
cd quicake-ecommerce
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the root directory with the following content:

\`\`\`
DATABASE_URL="postgresql://username:password@hostname:port/database"
JWT_SECRET="janzenpogi111"
\`\`\`

Replace the DATABASE_URL with your actual PostgreSQL connection string.

4. Set up the database:

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
\`\`\`

5. Test database connection:

\`\`\`bash
node scripts/test-db-connection.js
\`\`\`

This script will verify that your database connection is working properly.

6. Seed the database:

Start the development server and visit:

\`\`\`
http://localhost:3000/api/seed
\`\`\`

This will create the admin and regular user accounts, as well as sample products.

7. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

- Admin: admin@sweetdelights.com / admin123
- User: user@example.com / password123

## Database Schema Verification

After setting up your database, you can verify the schema was created correctly by running:

\`\`\`bash
npx prisma studio
\`\`\`

This will open Prisma Studio in your browser, where you can view and edit your database tables.

## Troubleshooting

### Database Connection Issues

- Verify your DATABASE_URL is correct in the .env file
- Make sure your PostgreSQL database is running
- Check if your database user has the correct permissions
- Run `node scripts/test-db-connection.js` to test the connection
- Try `npx prisma db push` to ensure schema is up to date
- Check for firewall or network issues that might block the connection

### Authentication Problems

- Clear cookies if you encounter login issues
- Verify the JWT_SECRET is set correctly in the .env file
- Check browser console for any errors
- Try registering a new account to test the authentication flow

### API Route Errors

- Check server logs for detailed error messages
- Verify that all API routes are properly implemented
- Test API routes using tools like Postman or curl
- Check the Network tab in browser DevTools for request/response details

### Cart Functionality Issues

- Ensure you're logged in before adding items to cart
- Check browser console for any errors
- Verify that the cart API routes are working correctly
- Try clearing your browser cache and cookies

### Deployment Issues

- Make sure all environment variables are set in your deployment environment
- Verify that the database is accessible from your deployment environment
- Check deployment logs for any errors
- Ensure your database connection string is properly formatted for your hosting provider

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

## 15. Add globals.css with Proper Styling
