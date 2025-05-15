// dataform_includes/merge_template.js
// Updated to support multiple source filters

function generateMergeStatement(config) {
  const {
    sourceName,
    targetName,
    sourceDataset = "",
    targetDataset = "",
    sourceTable,
    targetTable,
    mergeKey,
    insertColumns,
    updateColumns,
    sourceFilters = [], // Change to array for multiple filters
    additionalLogic = "",
  } = config;

  // Handle both string and array formats for backward compatibility
  const filtersArray = Array.isArray(sourceFilters)
    ? sourceFilters
    : sourceFilters
    ? [sourceFilters]
    : [];

  // Construct the WHERE clause if filters exist
  const whereClause =
    filtersArray.length > 0 ? `WHERE ${filtersArray.join(" AND ")}` : "";

  // Construct fully qualified table names with datasets if provided
  const fullyQualifiedSourceTable = sourceDataset
    ? `${sourceDataset}.${sourceTable}`
    : `${sourceTable}`;

  const fullyQualifiedTargetTable = targetDataset
    ? `${targetDataset}.${targetTable}`
    : `${targetTable}`;

  return `
config {
  type: "operations",
  name: "${sourceName}_to_${targetName}_merge",
  schema: "staging",
  tags: ["merge_operations"]
}

MERGE \`${fullyQualifiedTargetTable}\` AS target
USING (
  SELECT 
    ${insertColumns.map((col) => `${col}`).join(",\n    ")}
  FROM \`${fullyQualifiedSourceTable}\` 
  ${whereClause}
) AS source
ON ${mergeKey.map((key) => `target.${key} = source.${key}`).join(" AND ")}

WHEN MATCHED THEN
  UPDATE SET
    ${updateColumns
      .map((col) => `target.${col} = source.${col}`)
      .join(",\n    ")},
    target.updated_at = CURRENT_TIMESTAMP()

WHEN NOT MATCHED THEN
  INSERT (
    ${insertColumns.map((col) => `${col}`).join(",\n    ")},
    created_at,
    updated_at
  )
  VALUES (
    ${insertColumns.map((col) => `source.${col}`).join(",\n    ")},
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
  )
${additionalLogic}
`;
}

module.exports = { generateMergeStatement };
