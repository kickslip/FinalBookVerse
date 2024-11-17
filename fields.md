## User Model Fields

1.  id String @id @default(uuid())
2.  username String @unique
3.  firstName
4.  lastName
5.  displayName
6.  email
7.  passwordHash
8.  vatNumber
9.  phoneNumber
10. streetAddress
11. addressLine2
12. suburb
13. townCity
14. postcode
15. country
16. createdAt DateTime @default(now())
17. updatedAt DateTime @updatedAt

## Book Model

1.  id String @id @default(uuid())
2.  title
3.  author
4.  publishYear
5.  price
6.  available
7.  description
8.  createdAt DateTime @default(now())
9.  updatedAt DateTime @updatedAt

## Book Table head fields

1. No
2. title
3. author
4. publishYear
5. price
6. actions => ( Hint: This header's table cells will have an eye, trash bin and
   a pen with clickable links that will take you to the delete, update and read
   more pages. )
