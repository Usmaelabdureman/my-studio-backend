/**
 * @swagger
 * tags:
 *   name: Record
 *   description: Record
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Sample Title"
 *         campaign:
 *           type: string
 *           example: "Summer Campaign"
 *         product:
 *           type: string
 *           example: "Product Name"
 *         stakeholder:
 *           type: string
 *           example: "John Doe"
 *         posting_quality:
 *           type: string
 *           example: "High"
 *         google_drive_files:
 *           type: string
 *           example: "https://drive.google.com/file/d/123456789"
 *         playbook_link:
 *           type: string
 *           example: "https://example.com/playbook"
 *         uppromote_conversion:
 *           type: integer
 *           example: 100
 *         asset_status:
 *           type: string
 *           example: "Active"
 *         month_uploaded:
 *           type: string
 *           example: "2023-12"
 *         REVO_pinterest:
 *           type: string
 *           example: "https://www.pinterest.com/sample"
 *         pin_accounts_used:
 *           type: string
 *           example: "Account 1, Account 2"
 *         pinterest_PIN_click:
 *           type: integer
 *           example: 100
 *         pinterest_view:
 *           type: integer
 *           example: 200
 */

// Get Records

/**
 * @swagger
 * /record:
 *   get:
 *     summary: Get records
 *     description: Retrieves a list of records.
 *     tags: [Record]
 *     security:
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Record updated successfully.
 *       400:
 *         description: Bad request.
 */

// Update Record

/**
 * @swagger
 * /record/update-record/{id}:
 *   patch:
 *     summary: Update a record
 *     description: Updates a record with optional fields.
 *     tags: [Record]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the record.
 *                 example: "Sample Title"
 *               campaign:
 *                 type: string
 *                 description: Campaign associated with the record.
 *                 example: "Summer Campaign"
 *               product:
 *                 type: string
 *                 description: Product associated with the record.
 *                 example: "Product Name"
 *               stakeholder:
 *                 type: string
 *                 description: Stakeholder information.
 *                 example: "John Doe"
 *               posting_quality:
 *                 type: string
 *                 description: Quality of the posting.
 *                 example: "High"
 *               google_drive_files:
 *                 type: string
 *                 description: Google Drive file links.
 *                 example: "https://drive.google.com/..."
 *               playbook_link:
 *                 type: string
 *                 description: Link to the playbook.
 *                 example: "https://example.com/playbook"
 *               uppromote_conversion:
 *                 type: integer
 *                 description: Conversion value for Uppromote.
 *                 minimum: 0
 *                 example: 10
 *               asset_status:
 *                 type: string
 *                 description: Status of the asset.
 *                 example: "Active"
 *               month_uploaded:
 *                 type: string
 *                 description: Month the record was uploaded.
 *                 example: "2023-12"
 *               REVO_pinterest:
 *                 type: string
 *                 description: REVO Pinterest information.
 *                 example: "Pinterest info"
 *               PIN_accounts_used:
 *                 type: string
 *                 description: Pinterest accounts used.
 *                 example: "Account 1, Account 2"
 *               pinterest_PIN_click:
 *                 type: integer
 *                 description: Number of Pinterest PIN clicks.
 *                 minimum: 0
 *                 example: 15
 *               pinterest_view:
 *                 type: integer
 *                 description: Number of Pinterest views.
 *                 minimum: 0
 *                 example: 100
 *               REVO_instagram:
 *                 type: string
 *                 description: REVO Instagram information.
 *                 example: "Instagram info"
 *               IG_like:
 *                 type: integer
 *                 description: Number of Instagram likes.
 *                 minimum: 0
 *                 example: 50
 *               IG_comment:
 *                 type: integer
 *                 description: Number of Instagram comments.
 *                 minimum: 0
 *                 example: 10
 *               IG_share:
 *                 type: integer
 *                 description: Number of Instagram shares.
 *                 minimum: 0
 *                 example: 5
 *               IG_view:
 *                 type: integer
 *                 description: Number of Instagram views.
 *                 minimum: 0
 *                 example: 200
 *               IG_social_sets_used:
 *                 type: string
 *                 description: Instagram social sets used.
 *                 example: "Set A"
 *               partner_IG_link:
 *                 type: string
 *                 description: Partner Instagram link.
 *                 example: "https://instagram.com/..."
 *               REVO_twitter:
 *                 type: string
 *                 description: REVO Twitter information.
 *                 example: "Twitter info"
 *               REVO_tiktok:
 *                 type: string
 *                 description: REVO TikTok information.
 *                 example: "TikTok info"
 *               REVO_TT_view:
 *                 type: integer
 *                 description: Number of REVO TikTok views.
 *                 minimum: 0
 *                 example: 300
 *               tiktok_accounts_used:
 *                 type: string
 *                 description: TikTok accounts used.
 *                 example: "Account X"
 *               partner_tiktok_link:
 *                 type: string
 *                 description: Partner TikTok link.
 *                 example: "https://tiktok.com/..."
 *               partner_TT_like:
 *                 type: integer
 *                 description: Number of partner TikTok likes.
 *                 minimum: 0
 *                 example: 25
 *               partner_TT_comment:
 *                 type: integer
 *                 description: Number of partner TikTok comments.
 *                 minimum: 0
 *                 example: 5
 *               partner_TT_share:
 *                 type: integer
 *                 description: Number of partner TikTok shares.
 *                 minimum: 0
 *                 example: 8
 *               partner_TT_view:
 *                 type: integer
 *                 description: Number of partner TikTok views.
 *                 minimum: 0
 *                 example: 400
 *               partner_TT_save:
 *                 type: integer
 *                 description: Number of partner TikTok saves.
 *                 minimum: 0
 *                 example: 10
 *               TT_dummy_account_used:
 *                 type: string
 *                 description: TikTok dummy accounts used.
 *                 example: "Dummy Account 1"
 *               YT_account_used:
 *                 type: string
 *                 description: YouTube accounts used.
 *                 example: "Account Y"
 *               partner_YT_link:
 *                 type: string
 *                 description: Partner YouTube link.
 *                 example: "https://youtube.com/..."
 *               partner_YT_like:
 *                 type: integer
 *                 description: Number of partner YouTube likes.
 *                 minimum: 0
 *                 example: 30
 *               partner_YT_comment:
 *                 type: integer
 *                 description: Number of partner YouTube comments.
 *                 minimum: 0
 *                 example: 6
 *               partner_YT_view:
 *                 type: integer
 *                 description: Number of partner YouTube views.
 *                 minimum: 0
 *                 example: 500
 *               partner_YT_save:
 *                 type: integer
 *                 description: Number of partner YouTube saves.
 *                 minimum: 0
 *                 example: 12
 *               REVO_clubrevo_youtube:
 *                 type: string
 *                 description: REVO ClubREVO YouTube information.
 *                 example: "YouTube info"
 *               REVO_youtube:
 *                 type: string
 *                 description: REVO YouTube information.
 *                 example: "YouTube info"
 *               YT_clubrevo_like:
 *                 type: integer
 *                 description: Number of ClubREVO YouTube likes.
 *                 minimum: 0
 *                 example: 18
 *               YT_clubrevo_view:
 *                 type: integer
 *                 description: Number of ClubREVO YouTube views.
 *                 minimum: 0
 *                 example: 200
 *               YT_REVOMADIC_like:
 *                 type: integer
 *                 description: Number of REVOMADIC YouTube likes.
 *                 minimum: 0
 *                 example: 25
 *               YT_REVOMADIC_comment:
 *                 type: integer
 *                 description: Number of REVOMADIC YouTube comments.
 *                 minimum: 0
 *                 example: 4
 *               YT_REVOMADIC_share:
 *                 type: integer
 *                 description: Number of REVOMADIC YouTube shares.
 *                 minimum: 0
 *                 example: 3
 *               YT_REVOMADIC_view:
 *                 type: integer
 *                 description: Number of REVOMADIC YouTube views.
 *                 minimum: 0
 *                 example: 150
 *               creator_status:
 *                 type: string
 *                 description: Creator status information.
 *                 example: "Active"
 *               profile:
 *                 type: string
 *                 description: Profile information.
 *                 example: "Profile info"
 *               posting_status:
 *                 type: string
 *                 description: Status of the posting.
 *                 enum: ["Draft", "Published", "Archived"]
 *                 example: "Published"
 *               partner_HQ:
 *                 type: string
 *                 description: Partner HQ information.
 *                 example: "HQ Info"
 *               portfolio:
 *                 type: string
 *                 description: Portfolio link or information.
 *                 example: "https://example.com/portfolio"
 *               contributed_engagement:
 *                 type: integer
 *                 description: Contributed engagement value.
 *                 minimum: 0
 *                 example: 20
 *               by_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the record.
 *                 example: ["tag1", "tag2"]
 *               by_city:
 *                 type: string
 *                 description: City information.
 *                 example: "New York"
 *               all_internet_search:
 *                 type: string
 *                 description: Internet search data.
 *                 example: "Search info"
 *             required: []
 *     responses:
 *       200:
 *         description: Record updated successfully.
 *       400:
 *         description: Bad request.
 */


/**
 * @swagger
 * /record/delete-records:
 *   delete:
 *     summary: Delete records
 *     description: Deletes a list of records.
 *     tags: [Record]
 *     security:
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of record IDs to delete.
 *                 example: ["2c423e29-900b-4d8e-b442-1515ec95c0af"]
 *     responses:
 *       200:
 *         description: If records are deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: If records are deleted successfully.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Records deleted successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleted_count:
 *                       type: number
 *                       description: Number of records deleted.
 *                       example: 1
 *                     message:
 *                       type: string
 *                       description: Success message.
 *                       example: "1 records deleted successfully."
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized. Only admin can delete records.
 */
