import { StaticLogoSchema } from "../schema/index.js";
import { TokenAdmin } from "../model/index.js";

import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


// Set up multer storage configuration for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('logo');


const uploadsController = {
    async logoupload(req, res, next) {
        try {
            upload(req, res, async (err) => {
                console.log(err)
                if (err) {
                    return res.status(500).json({ status: 0, "error": err })
                }

                let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ "error": "Invalid refresh token!" });
                }
                // Create new StaticLogo document

                const filename = req.file.originalname;
                const parts = filename.split('.'); // ["example", "txt"]
                const something = parts[0];
                const logo = new StaticLogoSchema({
                    name: something,
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                });
                await logo.save();
                return res.status(200).json({ status: 1, message: 'Image uploaded successfully!' });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: 1, error: 'Internal server error' });
        }
    },
    async logodownload(req, res, next) {
        try {
            const logo = await StaticLogoSchema.findOne({ name: req.params.name });
            if (!logo) {
                return res.status(404).json({ status: 0, error: 'Image not found' });
            }
            res.set('Content-Type', logo.contentType);
            return res.status(200).send(logo.data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 0, error: 'Internal server error' });
        }
    }
}

export default uploadsController;