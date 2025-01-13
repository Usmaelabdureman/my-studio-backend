/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

// Create User

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: combina@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: password123
 *               contact_number:
 *                 type: string
 *                 description: Contact number of the user
 *                 example: 123456789
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 0efdeb79-877d-4b25-bdec-d6f71e9a2e6f
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: combina@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 123456789
 *                     profile_pic:
 *                       type: null
 *                       example: null
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     role:
 *                       type: string
 *                       example: USER
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-08-09T10:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-08-09T10:00:00.000Z
 *       400:
 *         description: Bad Request
 */

// Login

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: combina@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: password123
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: combina@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 123456789
 *                     profile_pic:
 *                       type: string
 *                       example: null | https://example.com/profile
 *                     role:
 *                       type: string
 *                       example: USER
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBlZmRlYjc5LTg3N2QtNGRVI6MTczNDc1NzUwMH0.NuHJrEbOlkl03Vx9ClWl9X4bQezAWjXWEjlblbhgqEE
 *       400:
 *         description: Bad Request
 */
