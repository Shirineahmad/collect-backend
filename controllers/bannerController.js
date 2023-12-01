const Banner = require('../models/bannerModel');
const { FileUpload } = require('../extra/imageUploader')

const create = async (req, res) => {
    try {
        const { text, textButton, link, highlighted } = req.body;
        const file = req.file;

        if (!text || !textButton || !link) {
            return res.status(400).json({
                success: false,
                message: 'All 3 fields are mandatory',
            });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided',
            });
        }

        const uploadedFile = await FileUpload(file);

        const newBanner = new Banner({
            text,
            textButton,
            link,
            image: uploadedFile.downloadURL,
            highlighted: highlighted || false,
        });
        await newBanner.save();

        res.status(200).json({
            success: true,
            message: 'Banner added successfully',
            data: newBanner,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to add banner',
            error: error.message,
        });
    }
};

const getBanners = async (_, res) => {
    try {
        const banner = await Banner.find({});
        res.status(200).json({
            success: true,
            message: 'Banner data retrieved successfully',
            data: banner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to get banner data',
            error: error,
        });
    }
}

const update = async (req, res) => {
    const { text, textButton, link } = req.body;
    const bannerID = req.params.ID;

    try {
        const file = req.file;
        let image = req.body.image; 
        if (file) {
            const uploadedFile = await FileUpload(file);
            image = uploadedFile.downloadURL; 
        }

        if (!text || !textButton || !link) {
            return res.status(400).json({
                success: false,
                message: 'All 3 fields are mandatory',
            });
        }

        if (textButton.length > 25) {
            return res.status(400).json({
                success: false,
                message: 'The button text must be a maximum of 25 characters',
            });
        }

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(link)) {
            return res.status(401).json({
                success: false,
                message: 'Provide a link with valid URL format',
            });
        }

        const bannerData = {
            text,
            textButton,
            link,
            image,
            highlighted: highlighted || false,
        };

        const banner = await Banner.findByIdAndUpdate(bannerID, bannerData);
        res.status(200).json({
            success: true,
            message: 'Banner data updated successfully',
            data: banner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to update data',
            error: error,
        });
    }
};

module.exports = { create, getBanners, update }