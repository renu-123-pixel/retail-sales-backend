// backend/src/controllers/salesController.js

import Sale from "../models/Sale.js";

const PAGE_SIZE = 10;

export const getSales = async (req, res) => {
    try {
        const {
            q,
            regions,
            genders,
            age_min,
            age_max,
            categories,
            tags,
            payment_methods,
            date_from,
            date_to,
            sort,
            page = 1
        } = req.query;

        let query = {};

        // -----------------------------
// 1. SEARCH
// -----------------------------
if (q) {
    query.$or = [
        { "Customer Name": { $regex: q, $options: "i" } },
        { "Product Name": { $regex: q, $options: "i" } },
        { "Product Category": { $regex: q, $options: "i" } },
        { "Customer Region": { $regex: q, $options: "i" } },
        { "Tags": { $regex: q, $options: "i" } }
    ];
}

        // -----------------------------
// 2. FILTERS
// -----------------------------

if (regions) {
    query["Customer Region"] = { $in: regions.split(",") };
}

if (genders) {
    query["Gender"] = { $in: genders.split(",") };
}

if (age_min || age_max) {
    query["Age"] = {};
    if (age_min) query["Age"]["$gte"] = Number(age_min);
    if (age_max) query["Age"]["$lte"] = Number(age_max);
}

if (categories) {
    query["Product Category"] = { $in: categories.split(",") };
}

if (tags) {
    query["Tags"] = { $in: tags.split(",") };
}

if (payment_methods) {
    query["Payment Method"] = { $in: payment_methods.split(",") };
}

if (date_from || date_to) {
    query["Date"] = {};
    if (date_from) query["Date"]["$gte"] = date_from;
    if (date_to) query["Date"]["$lte"] = date_to;
}


        // -----------------------------
// 3. SORTING
// -----------------------------
let sortOptions = { "Date": -1 }; // default

if (sort === "date_desc") sortOptions = { "Date": -1 };
if (sort === "quantity_desc") sortOptions = { "Quantity": -1 };
if (sort === "customer_asc") sortOptions = { "Customer Name": 1 };


        // -----------------------------
        // 4. PAGINATION
        // -----------------------------
        const pageNumber = Number(page);
        const skip = (pageNumber - 1) * PAGE_SIZE;

        const [items, total] = await Promise.all([
            Sale.find(query).sort(sortOptions).skip(skip).limit(PAGE_SIZE),
            Sale.countDocuments(query)
        ]);

        res.status(200).json({
            items,
            total,
            page: pageNumber,
            page_size: PAGE_SIZE,
            total_pages: Math.ceil(total / PAGE_SIZE)
        });

    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
