/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Campaign
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the campaign
 *           example: "Sample Campaign"
 *         description:
 *           type: string
 *           description: Description of the campaign
 *           example: This is a sample campaign
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the campaign
 *           example: 2023-08-01
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the campaign
 *           example: 2023-08-31
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED]
 *           description: Status of the campaign
 *           example: PENDING
 *         thumbnail:
 *           type: string
 *           description: Thumbnail of the campaign
 *           example: /general/thumbnail.jpg
 *         stackholder:
 *           type: string
 *           description: Stackholder of the campaign
 *           example: John Doe
 *         goal:
 *           type: string
 *           description: Goal of the campaign
 *           example: goal
 *         partner_compensation:
 *           type: number
 *           description: Partner compensation of the campaign
 *           example: 100
 *         partner_deliverables:
 *           type: string
 *           description: Partner deliverables of the campaign
 *           example: deliverables
 *         contributed_partners:
 *           type: string
 *           description: Contributed partners of the campaign
 *           example: partners
 *         prospected_partners:
 *           type: string
 *           description: Prospected partners of the campaign
 *           example: partners
 *         content_HQ:
 *           type: string
 *           description: Content of the campaign
 *           example: content
 *         content_guidelines:
 *           type: string
 *           description: Content guidelines of the campaign
 *           example: guidelines
 *         image_inspiration:
 *           type: string
 *           description: Image inspiration of the campaign
 *           example: inspiration
 *         video_inspiration:
 *           type: string
 *           description: Video inspiration of the campaign
 *           example: inspiration
 *         content_engagement:
 *           type: number
 *           description: Content engagement of the campaign
 *           example: 100
 *         product_expense:
 *           type: number
 *           description: Product expense of the campaign
 *           example: 100
 *         partner_expense:
 *           type: number
 *           description: Partner expense of the campaign
 *           example: 100
 *         social_platforms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *                 description: Platform name
 *                 example: Instagram
 *               url:
 *                 type: string
 *                 description: URL of the platform
 *                 example: https://instagram.com/sample
 */


// Add Campaign

/**
 * @swagger
 * /campaign/add-campaign:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     security:
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Campaign'
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
