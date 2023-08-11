const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Option 2 - Use sequelize feature created 'cause I did a relation btw them
  req.user.createProduct({
    title: title, 
    price: price, 
    imageUrl: imageUrl,
    description: description,
  })
  /* OPTION 1
  Product.create({
    title: title, 
    price: price, 
    imageUrl: imageUrl,
    description: description,
    // Option 1 - Manually add user to the product: userId: req.user.id 
  })*/
  .then(result => {
    console.log('Created product');
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err);
  }); 
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({ where: {id: prodId}})
  // Product.findByPk(prodId)
  .then(products => {
    const product = products[0]; 
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });

  })
  .catch(err => console.log(err)); 
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product => {
    // This not change the database, only locally 
    product.title = updatedTitle; 
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    // To change the database - takes the product as we saved it and saves it to the DB
    return product.save(); 
  })
  .then(result => {
    console.log('UPDATED PRODUCT! :)');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err)); 
};

exports.getProducts = (req, res, next) => {
  // Just list the products for this user
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    }); 
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Option 1: Product.destroy({where...})
  // Option 2: 
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy(); 
  })
  .then(result => {
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
};
