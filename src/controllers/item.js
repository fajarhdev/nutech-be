const { QueryTypes, Op } = require("sequelize");
const Conn = require("../configs/db");
const Item = require("../models/item");
const Picture = require("../models/picture");

// create
const AddItem = async (req, res) => {
	const users_id = req.users_id;

	const { name, buyPrice, sellPrice, stock } = req.body;
	const { files } = req;
	try {
		// check name item exist or not
		const itemName = name.toLowerCase();
		const checkItem = await Item.findOne({
			where: {
				name: itemName,
			},
		});

		// if (checkItem !== null) {
		// 	return res.status(406).json({ data: "The Item is already exist" });
		// }

		// if success check item
		const addItem = await Item.create({
			name: itemName,
			buy_price: buyPrice,
			sell_price: sellPrice,
			stock: stock,
			users_id: users_id,
		});
		let fileArray = [];
		console.log(files);
		for (let i = 0; i < files.length; i++) {
			fileArray.push(files[i].originalname);
		}
		console.log(fileArray);
		// add picture
		// const addPicture = await Picture.create({
		// 	filename: filename.filename,
		// 	items_id: addItem.id,
		// });

		// make me for looping to insert fileArray to Picture.create
		for (let i = 0; i < fileArray.length; i++) {
			const filename = fileArray[i];
			const addPicture = await Picture.create({
				filename: filename,
				items_id: addItem.id,
			});
			console.log(addPicture);
		}

		return res.status(200).json({ data: "Success add item" });
	} catch (error) {
		return res.status(500).json({ data: "Failed to add item", error });
	}
};

// update
const UpdateItem = async (req, res) => {
	const users_id = req.users_id;

	const { name, buyPrice, sellPrice, stock } = req.body;
	const { items_id } = req.query;
	const { files } = req;

	console.log(typeof users_id, typeof parseInt(items_id));
	try {
		// update
		const updateItem = await Item.update(
			{
				name: name,
				buy_price: buyPrice,
				sell_price: sellPrice,
				stock: stock,
			},
			{
				where: {
					[Op.and]: [{ users_id: users_id }, { id: parseInt(items_id) }],
				},
			}
		);

		console.log("zcxzcx");

		let fileArray = [];
		console.log(files);
		for (let i = 0; i < files.length; i++) {
			fileArray.push(files[i].originalname);
		}
		console.log(fileArray);

		for (let i = 0; i < fileArray.length; i++) {
			const filename = fileArray[i];
			const addPicture = await Picture.create({
				filename: filename,
				items_id: updateItem.id,
			});
			console.log(addPicture);
		}
		console.log("qweqwe");
		return res.status(200).json({ data: "Success update item" });
	} catch (error) {
		return res.status(500).json({ data: "Failed to update item", error });
	}
};

// delete
const DeleteItem = async (req, res) => {
	const users_id = req.users_id;

	const { items_id } = req.query;

	try {
		const deleteItem = await Item.destroy({
			where: {
				id: items_id,
			},
		});

		const deletePicture = await Picture.destroy({
			where: {
				items_id: items_id,
			},
		});

		return res.status(200).json({ data: "Success deleting item" });
	} catch (error) {
		return res.status(500).json({ data: "Failed deleting item", error });
	}
};

// read all item as buyer
const GetItem = async (req, res) => {
	const users_id = req.users_id;
	const { limit, page } = req.query;
	try {
		const countItem = await Item.findAndCountAll();

		const limits = limit ? parseInt(limit) : 10;
		const offsets = page ? (page - 1 < 0 ? 0 : (page - 1) * limits) : 0;
		const totalPages = Math.ceil(countItem.count / limits);
		const currentPage = Math.ceil(offsets / limits) + 1;

		const firstQuery =
			"SELECT i.name, i.buy_price, i.sell_price, i.stock, p.filename FROM items i LEFT JOIN pictures p ON p.items_id = i.id";
		const whereQuery = ` WHERE i.deletedAt IS null AND p.deletedAt IS null`;
		const pagination = ` LIMIT ${limits} OFFSET ${offsets}`;
		const query = firstQuery + whereQuery + pagination;
		const getAllItem = await Conn.query(query, { type: QueryTypes.SELECT });

		return res
			.status(200)
			.json({ data: { total_pages: totalPages, current_page: currentPage, items: getAllItem } });
	} catch (error) {
		return res.status(500).json({ data: "Failed to get data", error });
	}
};

// read all item as seller
const GetAllItemSeller = async (req, res) => {
	const users_id = req.users_id;
	const { limit, page } = req.query;

	try {
		const countItem = await Item.findAndCountAll({
			where: {
				users_id: users_id,
			},
		});

		const limits = limit ? parseInt(limit) : 10;
		const offsets = page ? (page - 1 < 0 ? 0 : (page - 1) * limits) : 0;
		const totalPages = Math.ceil(countItem.count / limits);
		const currentPage = Math.ceil(offsets / limits) + 1;

		const firstQuery =
			"SELECT i.name, i.buy_price, i.sell_price, i.stock, p.filename FROM items i LEFT JOIN pictures p ON p.items_id = i.id";
		const whereQuery = ` WHERE i.users_id = ${users_id} AND i.deletedAt IS null AND p.deletedAt IS null`;
		const pagination = ` LIMIT ${limits} OFFSET ${offsets}`;
		const query = firstQuery + whereQuery + pagination;
		const getAllItem = await Conn.query(query, { type: QueryTypes.SELECT });

		return res
			.status(200)
			.json({ data: { total_pages: totalPages, current_page: currentPage, items: getAllItem } });
	} catch (error) {
		return res.status(500).json({ data: "Failed to get data", error });
	}
};

// read specific items
const GetSpecificItem = async (req, res) => {
	const users_id = req.users_id;

	const { search } = req.body;
	console.log(search);
	try {
		const getSpecificItem = await Item.findAll({
			where: {
				name: search,
			},
		});

		if (getSpecificItem === null) {
			return res.status(200).json({ data: "Data is not available" });
		}

		return res.status(200).json({ data: getSpecificItem });
	} catch (error) {
		return res.status(500).json({ data: "Failed to get data", error });
	}
};

module.exports = { AddItem, UpdateItem, DeleteItem, GetItem, GetAllItemSeller, GetSpecificItem };
