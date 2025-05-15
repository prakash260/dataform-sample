// definitions/merge_table1.sqlx
// Merge operation for Table 1

${require("dataform_includes/merge_template.js").generateMergeStatement({
  sourceName: "customers_raw",
  targetName: "customers_dim",
  sourceDataset: "raw_data",  // New parameter
  targetDataset: "dwh",       // New parameter
  sourceTable: "${ref('raw_customers')}",
  targetTable: "${ref('customers_dimension')}",
  mergeKey: ["customer_id"],
  insertColumns: [
    "customer_id",
    "customer_name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "postal_code"
  ],
  updateColumns: [
    "customer_name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "postal_code"
  ],
  sourceFilters: "is_active = true",
  additionalLogic: ""
})}

// definitions/merge_table2.sqlx
// Merge operation for Table 2

${require("dataform_includes/merge_template.js").generateMergeStatement({
  sourceName: "products_staging",
  targetName: "products_dim",
  sourceDataset: "staging",     // New parameter
  targetDataset: "dwh",         // New parameter
  sourceTable: "${ref('staging_products')}",
  targetTable: "${ref('products_dimension')}",
  mergeKey: ["product_id", "vendor_id"],
  insertColumns: [
    "product_id",
    "vendor_id",
    "product_name",
    "category",
    "subcategory",
    "price",
    "cost",
    "status"
  ],
  updateColumns: [
    "product_name",
    "category",
    "subcategory",
    "price",
    "cost",
    "status"
  ],
  sourceFilters: "",
  additionalLogic: ""
})}

// definitions/merge_table3.sqlx
// Merge operation for Table 3

// Example with multiple source filters
${require("dataform_includes/merge_template.js").generateMergeStatement({
  sourceName: "transactions_daily",
  targetName: "transactions_fact",
  sourceDataset: "staging",
  targetDataset: "dwh",
  sourceTable: "${ref('daily_transactions')}",
  targetTable: "${ref('fact_transactions')}",
  mergeKey: ["transaction_id"],
  insertColumns: [
    "transaction_id",
    "customer_id",
    "product_id",
    "transaction_date",
    "quantity",
    "unit_price",
    "total_amount",
    "discount_amount",
    "payment_method"
  ],
  updateColumns: [
    "quantity",
    "unit_price",
    "total_amount",
    "discount_amount",
    "payment_method"
  ],
  sourceFilters: [
    "transaction_date >= CURRENT_DATE() - 7",
    "status = 'completed'",
    "total_amount > 0"
  ],
  additionalLogic: ""
})}