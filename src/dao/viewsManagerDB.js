import { productsModel } from "./models/products.model.js";

export default class ViewsManagerDB {

    async getProducts(req, res) {
        let products;
        let paginaActual = 1
        let limit = 10
        let sort = 1

        paginaActual = req.query.pagina ? req.query.pagina : paginaActual;
        limit = req.query.limit ? req.query.limit : limit;
        if (req.query.sort == "asc"){
            sort = 1
        } if (req.query.sort == "desc") {
            sort = -1
        }

        try {
            products = await productsModel.paginate({}, { page: paginaActual, limit: limit, sort: { price: sort }})
            console.log(products)

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ message: "Error al obtener los productos de la DB"})
        }

        let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = products

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('products', {
            products: products.docs,
            totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
        })
    }

}