// dataform_includes/merge_template.js
// Updated to support fully qualified table names with project.dataset.table format
// Removed config block - this should be defined in the .sqlx files

function generateMergeStatement(config) {
  const {
    sourceName,
    targetName,
    sourceProject = "",       // Parameter for source project
    targetProject = "",       // Parameter for target project
    sourceDataset = "",
    targetDataset = "",
    sourceTable,
    targetTable,
    mergeKey,
    insertColumns,
    updateColumns,
    sourceFilters = [],       // Array for multiple filters
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

  // Construct fully qualified table names with project and dataset if provided
  const fullyQualifiedSourceTable = constructFullyQualifiedTableName(
    sourceProject,
    sourceDataset,
    sourceTable
  );

  const fullyQualifiedTargetTable = constructFullyQualifiedTableName(
    targetProject,
    targetDataset,
    targetTable
  );

  return `MERGE \`${fullyQualifiedTargetTable}\` AS target
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

// Helper function to construct fully qualified table names
function constructFullyQualifiedTableName(project, dataset, table) {
  // Handle table references that might already include backticks
  const cleanTable = table.replace(/`/g, "");
  
  if (project && dataset) {
    return `${project}.${dataset}.${cleanTable}`;
  } else if (dataset) {
    return `${dataset}.${cleanTable}`;
  } else {
    return cleanTable;
  }
}

module.exports = { generateMergeStatement };
