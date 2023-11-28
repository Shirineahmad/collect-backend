const Category = require('../models/categoryModel');
const {FileUpload} = require('../extra/imageUploader')

const getAll = async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: categories,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get data',
        error: error,
      });
    }
  };
  
  const getByID = async (req, res) => {
    try {
      const category = await Category.findById(req.params.ID);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Data not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Unable to get data by ID',
        error: error,
      });
    }
  };
  
  const add = async (req, res) => {
    try {
        const { name, highlighted } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided',
            });
        }

        const uploadedFile = await FileUpload(file);
        
        const newCategory = new Category({
            name,
            image: uploadedFile.downloadURL, 
            highlighted: highlighted || false,
        });

        await newCategory.save();

        res.status(200).json({
            success: true,
            message: 'Data added successfully',
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to add data',
            error: error.message,
        });
    }
};
  
  const deleteById = async (req, res) => {
    try {
      const category = await Category.deleteOne({ _id: req.params.ID });
      res.status(200).json({
        success: true,
        message: 'Data deleted successfully',
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to delete data',
        error: error,
      });
    }
  };
  
  const update = async (req, res) => {
    const { name, highlighted } = req.body;

    try {
        const file = req.file;
        let image = req.body.image; 
        if (file) {
            const uploadedFile = await FileUpload(file);
            image = uploadedFile.downloadURL; 
        }

        const categoryData = {
            name,
            image,
            highlighted: highlighted || false,
        };

        const category = await Category.findByIdAndUpdate(req.params.ID, categoryData);
        res.status(200).json({
            success: true,
            message: 'Data updated successfully',
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to update data',
            error: error,
        });
    }
};


  
  module.exports = {
    getAll,
    getByID,
    add,
    update,
    deleteById,
  };