/**
 * @swagger
 * tags:
 *   name: Thread
 *   description: API for managing threads and messages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Thread:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "thread123"
 *         type:
 *           type: string
 *           enum: ["DIRECT", "GROUP"]
 *           example: "DIRECT"
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "user1"
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "msg123"
 *         thread_id:
 *           type: string
 *           example: "thread123"
 *         author_id:
 *           type: string
 *           example: "user1"
 *         content:
 *           type: string
 *           example: "Hello, world!"
 *         type:
 *           type: string
 *           enum: ["TEXT", "IMAGE"]
 *           example: "TEXT"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-13T12:00:00Z"
 */

/**
 * @swagger
 * /threads/create:
 *   post:
 *     summary: Create a new thread with an initial message
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["DIRECT", "GROUP"]
 *                 example: "DIRECT"
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *               initialMessage:
 *                 type: object
 *                 properties:
 *                   authorId:
 *                     type: string
 *                     example: "user1"
 *                   content:
 *                     type: string
 *                     example: "Hello, world!"
 *                   type:
 *                     type: string
 *                     enum: ["TEXT", "IMAGE"]
 *                     example: "TEXT"
 *     responses:
 *       200:
 *         description: Thread created successfully with an initial message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thread'
 */

/**
 * 
 * @swagger
 * /threads/message:
 *   post:
 *     summary: Add a message to a thread
 *     tags: [Thread]
 *     parameters:
 *       - name: threadId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "thread123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: string
 *                 example: "user1"
 *               content:
 *                 type: string
 *                 example: "Hello, world!"
 *               type:
 *                 type: string
 *                 enum: ["TEXT", "IMAGE"]
 *                 example: "TEXT"
 *     responses:
 *       200:
 *         description: Message added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */

/**
 * @swagger
 * /threads/{threadId}/messages:
 *   get:
 *     summary: Get all messages in a thread
 *     tags: [Thread]
 *     parameters:
 *       - name: threadId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "thread123"
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */

