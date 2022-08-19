# start
npm install

npm run dev

# db commands

npx prisma migrate dev --name <name>

npx prisma studio


# .env file

Create a .env file:

```env
# db's from heroku free. Create 2 on one app:
DATABASE_URL="postgres/url"
SHADOW_DATABASE_URL="postgres/url"

GITHUB_ID=123
GITHUB_SECRET=123
NEXTAUTH_URL=http://localhost:3000/api/auth

NEXTAUTH_SECRET=123455

```