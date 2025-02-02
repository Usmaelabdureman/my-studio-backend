"use strict";
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
 *         name:
 *           type: string
 *           nullable: true
 *           example: "Project Team"
 *         member_count:
 *           type: integer
 *           example: 5
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
 *     summary: Create a new thread with an optional name and an initial message
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
 *                 example: "GROUP"
 *               name:
 *                 type: string
 *                 nullable: true
 *                 example: "Project Team"
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2", "user3"]
 *               initialMessage:
 *                 type: object
 *                 properties:
 *                   authorId:
 *                     type: string
 *                     example: "user1"
 *                   content:
 *                     type: string
 *                     example: "Hello, everyone!"
 *                   type:
 *                     type: string
 *                     enum: ["TEXT", "IMAGE"]
 *                     example: "TEXT"
 *     responses:
 *       200:
 *         description: Thread created successfully with optional name and an initial message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Thread'
 */
/**
 * @swagger
 * /threads:
 *   get:
 *     summary: Get all threads for a user
 *     tags: [Thread]
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "user1"
 *     responses:
 *       200:
 *         description: List of threads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Thread'
 */
/**
 * @swagger
 * /threads/message:
 *   post:
 *     summary: Add a message to a thread
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: string
 *               authorId:
 *                 type: string
 *                 example: "user1"
 *               content:
 *                 type: string
 *                 example: "Here is a file to check out!"
 *               type:
 *                 type: string
 *                 enum: ["TEXT", "FILE"]
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (only for FILE type)
 *     responses:
 *       200:
 *         description: Message added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Server error
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
/**
 * @swagger
 * /threads/message/edit:
 *   put:
 *     summary: Edit a message in a thread
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 example: "msg123"
 *               thread_id:
 *                 type: string
 *                 example: "thread123"
 *               author_id:
 *                type: string
 *                example: "user1"
 *               newContent:
 *                 type: string
 *                 example: "Hello, world! (edited)"
 *     responses:
 *       200:
 *         description: Message edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /threads/message/delete:
 *   delete:
 *     summary: Delete a message in a thread
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 example: "msg123"
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /threads/message/reply:
 *   post:
 *     summary: Reply to a message in a thread
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: string
 *                 example: "thread123"
 *               authorId:
 *                 type: string
 *                 example: "user1"
 *               parentMessageId:
 *                 type: string
 *                 example: "msg123"
 *               content:
 *                 type: string
 *                 example: "I agree!"
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
/**
 * @swagger
 * /threads/message/comment:
 *   post:
 *     summary: Comment on a message in a thread
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: string
 *                 example: "thread123"
 *               authorId:
 *                 type: string
 *                 example: "user1"
 *               parentMessageId:
 *                 type: string
 *                 example: "msg123"
 *               content:
 *                 type: string
 *                 example: "I agree!"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
// get contacts by query
/**
 * @swagger
 * /threads/contacts:
 *   get:
 *     summary: Get contacts by query string
 *     tags: [Thread]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "John Doe"
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                     example: "user1"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 */ 
