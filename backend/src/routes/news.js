import express from 'express';
import multer from 'multer';
import { pdf } from 'pdf-to-img';
import AWS from 'aws-sdk';
import moment from 'moment';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';

const router = express.Router();

// Set up multer in-memory storage for PDF uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticateToken, upload.single('pdf'), async (req, res) => {
    try {
        // TODO 1: Check for uploaded PDF file
        if (!req.file) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                message: 'No PDF file provided in request body.'
            });
        }

        // Get date from file name e.g., 19102025_epaper.pdf -> 19102025
        const originalName = req.file.originalname;
        const fileDate = originalName.split('_')[0];
        // Format date as YYYY-MM-DD for folder (if needed)
        let dateFolder = fileDate;
        if (/^\d{8}$/.test(fileDate)) {
            dateFolder = moment(fileDate, "DDMMYYYY").format("YYYY-MM-DD");
        }

        // TODO 2: Convert each page to image (PNG by default)
        // pdf-to-img returns an async generator that yields each page
        const pdfDocument = await pdf(req.file.buffer, {
            scale: 2.0 // Adjust quality (1.0 = default, higher = better quality)
        });

        // Collect all page buffers from the generator
        const images = [];
        for await (const image of pdfDocument) {
            images.push(image); // Each image is a Buffer
        }

        // TODO 3: Upload each page as an image to S3
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        const uploadPromises = images.map((imgBuffer, idx) => {
            const key = `${dateFolder}/page-${idx + 1}.png`;
            return s3.upload({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: imgBuffer,
                ContentType: 'image/png',
                ACL: 'public-read'
            }).promise();
        });

        const s3Results = await Promise.all(uploadPromises);
        const imageUrls = s3Results.map(r => r.Location);

        // Save news record to database
        const newsRecord = await prisma.news.create({
            data: {
                title: `E-Paper ${dateFolder}`,
                date: new Date(dateFolder),
                dateFolder: dateFolder,
                images: imageUrls,
                uploadedBy: req.user.userId
            }
        });

        res.status(STATUS_CODES.OK).json({
            message: 'PDF uploaded and pages converted to images successfully.',
            images: imageUrls,
            dateFolder,
            newsId: newsRecord.id
        });
    } catch (err) {
        console.error(err);
        res.status(STATUS_CODES.SERVER_ERROR).json({
            message: 'Failed to process PDF upload.',
            error: err.message
        });
    }
});

router.get('/', (req, res) => {
    // TODO 1: get the paper for the day using CDN 
    // CDN should deliver the paper in the format of images
    res.status(STATUS_CODES.OK).json({
        message: MESSAGES.NEWS_FETCHED,
        news: []
    });
})

export default router;