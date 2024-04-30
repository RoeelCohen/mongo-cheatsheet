// GET - all products
const mongooseProducts = await Product.find();
// not recomended, bypassing mongoose schema validator etc..
const mongooseProducts = await Product.collection.find().toArray();
const mongoProducts = await productsCollection.find().toArray()



// GET all products, sort by price ascending. -> descending = -1
const mongooseProducts = await Product.find().sort({ price: 1 }).exec();
const mongoProducts = await productsCollection.find().sort({ price: 1 }).toArray();



// Get - all with category
const mongooseProducts = await Product.find().populate('categoryId');
const mongoProducts = await productsCollection.aggregate([
    { $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
    }}
]).toArray();



// GET all with categories, sort by category name:
const mongooseProducts = await Product.find().populate({
    path: 'categoryId',
    select: 'name'
}).sort({ name: 1 }).exec();
const mongoProducts = await productsCollection.aggregate([
    { $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
    }},
    { $unwind: "$category" },
    { $sort: { 'category.name': 1 }}
]).toArray();



// GET all with price lower than 10
const mongooseProducts = await Product.find({ price: { $lt: 10 } }).exec();
const mongoProducts = await productsCollection.find({ price: { $lt: 10 } }).toArray();



// GET all with price higher than 10
const mongooseProducts = await Product.find({ price: { $gt: 10 } }).exec();
const mongoProducts = await productsCollection.find({ price: { $gt: 10 } }).toArray();



// GET all with price between 10 and 50
const mongooseProducts = await Product.find({ price: { $gte: 10, $lte: 50 } }).exec();
const mongoProducts = await productsCollection.find({ price: { $gte: 10, $lte: 50 } }).toArray();



// GET with name tomato - case insensitive or just oncluding text, for example /to/i will finnd tomato and potato.
const mongooseProducts = await Product.find({ name: /ToMato/i }).exec();
const mongoProducts = await productsCollection.find({ name: /ToMato/i }).toArray();



// GET all  where price between 10 to 50 and category name is "Deli", not working properly for mongoose.
const mongooseProducts = await Product.find({ price: { $gte: 10, $lte: 50 } }).populate({
    path: 'categoryId',
    match: { name: 'Deli' }
}).exec();



const mongoProducts = await productsCollection.aggregate([
    { $match: { price: { $gte: 10, $lte: 50 } } },
    { $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
    }},
    { $unwind: '$category' },
    { $match: { 'category.name': 'Deli' } }
]).toArray();