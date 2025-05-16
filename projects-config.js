// dataform_includes/project_config.js
// Central configuration file for project and dataset constants

// Projects configuration
const PROJECTS = {
  // Source projects
  SOURCE: "my-source-project",      // Main source project
  ANALYTICS: "my-analytics-project", // Analytics project
  
  // Target projects
  TARGET: "my-dwh-project",         // Main data warehouse
  
  // Environment-specific projects
  DEV: "my-dev-project",            // Development environment
  TEST: "my-test-project",          // Testing environment  
  PROD: "my-prod-project"           // Production environment
};

// Datasets configuration
const DATASETS = {
  RAW: "raw_data",                  // Raw ingested data
  STAGING: "staging",               // Staging area for transformations
  DWH: "dwh",                       // Core data warehouse
  ANALYTICS: "analytics",           // Analytics-ready data
  REPORTING: "reporting"            // Reporting views and tables
};

// Schema configuration
const SCHEMAS = {
  OPERATIONS: "staging",            // Schema for operations
  DEFAULT: "staging"                // Default schema
};

// Tags configuration
const TAGS = {
  MERGE: ["merge_operations"],      // Tags for merge operations
  TRANSFORM: ["transformations"],   // Tags for transformations
  REPORTING: ["reporting"]          // Tags for reporting
};

module.exports = {
  PROJECTS,
  DATASETS,
  SCHEMAS,
  TAGS
};
