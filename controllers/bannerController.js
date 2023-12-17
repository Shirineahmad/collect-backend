const Banner = require('../models/bannerModel');
const { FileUpload } = require('../extra/imageUploader');
const { trusted } = require('mongoose');

const setBannerhiglighted = async (req, res) => {
  try {
    const bannerID = req.params.ID;
    const { higlighted } = req.body;
    console.log(higlighted);
    console.log(`Received higlighted: ${bannerID},${higlighted}`);

    // Use findByIdAndUpdate to update the document
    const updatedBanner = await Banner.findByIdAndUpdate(
      { _id: bannerID },
      { $set: { higlighted: higlighted } },
      { new: true } // Return the updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to update data",
      error: error,
    });
  }
};
const getHiglightedBanners = async (_, res) => {
  try {
    const banner = await Banner.find({ higlighted: true });
    console.log(banner); // Move the logging here
    res.status(200).json({
      success: true,
      message: "Banner data retrieved successfully",
      data: banner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to get banner data",
      error: error.message,
    });
  }
};


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
    const existingBanner = await Banner.findById(bannerID);

    const bannerData = {};

    if (text && text !== existingBanner.text) {
      bannerData.text = text;
    }

    if (textButton && textButton !== existingBanner.textButton) {
      if (textButton.length > 25) {
        return res.status(400).json({
          success: false,
          message: "The button text must be a maximum of 25 characters",
        });
      }
      bannerData.textButton = textButton;
    }

    if (link && link !== existingBanner.link) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(link)) {
        return res.status(401).json({
          success: false,
          message: "Provide a link with valid URL format",
        });
      }
      bannerData.link = link;
    }

    const file = req.file;
    let image = req.body.image;
    if (file) {
      const uploadedFile = await FileUpload(file);
      image = uploadedFile.downloadURL;
      bannerData.image = image;
    }

    const banner = await Banner.findByIdAndUpdate(bannerID, bannerData);
    res.status(200).json({
      success: true,
      message: "Banner data updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to update data",
      error: error,
    });
  }
};


module.exports = { create, getBanners, update, setBannerhiglighted, getHiglightedBanners};