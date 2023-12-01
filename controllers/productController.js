const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { FileUpload } = require('../extra/imageUploader')

const add = async (req, res) => {
    try {
        const { categoryID, name, description, reference, price, status, discountPercentage } = req.body;
        const files = req.files;

        const categoryExists = await Category.findById(categoryID);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: `Category not found`,
            });
        }

        if (!files || files.length < 3 || files.length > 6) {
            return res.status(400).json({
                success: false,
                message: `Provide between 3 to 6 images`,
            });
        }

        const uploadedFiles = await Promise.all(files.map(async (file) => {
            const uploadedFile = await FileUpload(file);
            return uploadedFile.downloadURL;
        }));

        const newProduct = new Product({
            categoryID,
            name,
            images: uploadedFiles,
            description,
            reference,
            price,
            status,
            discountPercentage,
        });

        await newProduct.save();

        res.status(200).json({
            success: true,
            message: `Product data added successfully`,
            data: newProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: `Unable to add product data`,
            error: error.message,
        });
    }
};

const getAll = async (_, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            message: `Products' data retrieved successfully`,
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Unable to get products' data`,
            error: error,
        });
    }
};

const getByID = async (req, res) => {
    try {
        const product = await Product.findById(req.params.ID);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${req.params.ID} not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: `Product data retrieved successfully`,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Unable to get product data by ID`,
            error: error,
        });
    }
};

const deleteById = async (req, res) => {
    try {
        const product = await Product.deleteOne({ _id: req.params.ID });

        if (product.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No product found with ID ${req.params.ID}`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Product with ID ${req.params.ID} deleted successfully`,
            data: product,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Unable to delete product data`,
            error: error,
        });
    }
};

const update = async (req, res) => {
    const { ID } = req.params;
    const updates = req.body;
    const images = req.files;
    const imageIndex = req.body.imageIndex;

    try {
        const existingProduct = await Product.findById(ID);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        for (const key in updates) {
            existingProduct[key] = updates[key];
        }

        if (images && images.length > 0 && imageIndex !== undefined) {
            const uploadedImages = [];

            for (let i = 0; i < images.length; i++) {
                const file = images[i];

                if (!file) {
                    return res.status(400).json({
                        success: false,
                        message: `No file provided for image ${i}`,
                    });
                }

                const uploadedFile = await FileUpload(file);
                uploadedImages.push(uploadedFile.downloadURL);
            }

            if (imageIndex >= 0 && imageIndex < existingProduct.images.length) {
                existingProduct.images[imageIndex] = uploadedImages[0];
            }
        }

        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to update product',
            error: error.message,
        });
    }
};

const removeImageFromArray = async (req, res) => {
    const { productID, imageIndex } = req.body;

    try {
        const existingProduct = await Product.findById(productID);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (imageIndex < 0 || imageIndex >= existingProduct.images.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image index',
            });
        }

        existingProduct.images.splice(imageIndex, 1);

        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: 'Image removed from product array successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to remove image from product array',
            error: error.message,
        });
    }
};

const addImageToArray = async (req, res) => {
    const { productID } = req.body;
    const image = req.file;

    try {
        const existingProduct = await Product.findById(productID);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'No file provided',
            });
        }

        const uploadedFile = await FileUpload(image);

        existingProduct.images.push(uploadedFile.downloadURL);

        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            message: 'Image added to product array successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to add image to product array',
            error: error.message,
        });
    }
};

const getAllByCategoryID = async (req, res) => {
    const { categoryID } = req.params;

    try {
        const existingCategory = await Category.findById(categoryID);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: `Category with ID ${categoryID} does not exist`,
            });
        }

        const products = await Product.find({ categoryID });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for the category with ID ${categoryID}`,
            });
        }

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch data',
            error: error.message,
        });
    }
};

const getAllByCategoryName = async (req, res) => {
    const { categoryName } = req.params;

    try {
        const existingCategory = await Category.findOne({ name: categoryName });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: `Category"${categoryName}" does not exist`,
            });
        }

        const products = await Product.find({ categoryID: existingCategory._id });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for the category "${categoryName}"`,
            });
        }

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch data',
            error: error.message,
        });
    }
};

module.exports = {
    getAll,
    getByID,
    add,
    update,
    deleteById,
    addImageToArray,
    removeImageFromArray,
    getAllByCategoryID,
    getAllByCategoryName,
};