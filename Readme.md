********
# Entrega del proyecto final: #2
********
**Objetivo:** CRUD de productos y carrito. 

**Tecnologías:** 
DB: MongoDB

ORM: Mongoose

Motor de plantillas: Handlebars

Servidor: Node / Express

Paginación: Mongoose Paginate V2.


**Endpoints:**

*Views:*
* http://localhost:8080/products: Vista con todos los productos (Paginate)
* http://localhost:8080/carts/:cid: Vista para un carrito especifico (Lista los productos y cantidades.)

*API:*
* GET:
	* http://localhost:8080/api/products: JSON con los todos los productos.
	* http://localhost:8080/api/products/:pid: JSON con un producto ubicado por ID

	* http://localhost:8080/api/carts: JSON con los todos los carritos.
	* http://localhost:8080/api/carts/:cid: JSON con un carrito ubicado por ID
* POST:
	* http://localhost:8080/api/products: Crea un producto nuevo (data -> body)
	
	* http://localhost:8080/api/carts: Crea un carrito vacío (products -> [ ])
	* http://localhost:8080/api/carts/:cid/product/:pid: Agrega un producto a un carrito (quantity -> body) | Si ya existe suma el quantity.
* DELETE:
	* http://localhost:8080/api/products/:pid: Elimina un producto de la base de datos.
	
	* http://localhost:8080/api/carts/:cid: Limpia un carrito existente (productos -> [ ])
	* http://localhost:8080/api/carts/:cid/product/:pid: Elimina un producto de un carrito
* PUT:
	* http://localhost:8080/api/carts/:cid: Actualiza el Array de productos de un carrito existente. (Lo pisa.)
	* http://localhost:8080/api/carts/:cid/carts/:pid: Actualiza el Quantity de un producto de un carrito. (Pasa quantity por body)

**TO-DO:**
- [ ] Embellecer vistas
- [ ] /products: Funcionalidad agregar a un carrito
