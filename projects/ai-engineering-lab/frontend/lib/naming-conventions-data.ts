/**
 * Naming Conventions Data Service
 * Complete OIC naming standards data from OIC-Naming-Standards.md
 */

import { NamingConvention, NamingCategory } from './naming-types'

export const namingConventionsData: NamingConvention[] = [
  // ==================== INTEGRATIONS ====================
  {
    id: 'int-001',
    category: 'integrations',
    component: 'Integration',
    field: 'Name',
    pattern: '<ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
    description: 'Standard naming convention for integration names',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-001',
        description: 'Perfect format with all components',
        value: 'BCRX_3PL_ERP_IMPORTTRANSACTIONS_INT',
        isCorrect: true,
        explanation: 'Follows the pattern with ORG=BCRX, SRC=3PL, TGT=ERP, OBJ=IMPORTTRANSACTIONS, TYPE=INT'
      },
      {
        id: 'ex-002',
        description: 'Scheduled integration type',
        value: 'BCRX_3PL_ERP_IMPORTTRANSACTIONS_SCH',
        isCorrect: true,
        explanation: 'Uses SCH type for scheduled integrations'
      },
      {
        id: 'ex-003',
        description: 'Missing ORG component',
        value: '3PL_ERP_TRANSACTIONS',
        isCorrect: false,
        explanation: 'Missing organization code at the beginning'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z]{3,4}_[A-Z0-9]+_[A-Z0-9]+_[A-Z0-9]+_(INT|SCH|SUB|RT)$',
        message: 'Must follow pattern: <ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
        severity: 'error'
      },
      {
        type: 'length',
        value: 50,
        message: 'Cannot be longer than 50 characters',
        severity: 'error'
      }
    ],
    maxLength: 50,
    minLength: 10,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['integration', 'oic', 'standard']
  },
  {
    id: 'int-002',
    category: 'integrations',
    component: 'Integration',
    field: 'Identifier',
    pattern: '<ORG>_<SRC>_<TGT>_<OBJ>_<TYPE>',
    description: 'Unique identifier for integration',
    guidelines: 'Enter the code using letters (A-Z), Numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters, can\'t have a pattern *-(BA|XBA|TA|R)-* and must start with letters (A-Z).',
    examples: [
      {
        id: 'ex-004',
        description: 'Valid identifier',
        value: 'BCRX_ERP_WMS_ORDERSYNC_RT',
        isCorrect: true,
        explanation: 'Valid real-time integration identifier'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z][A-Z0-9_-]*$',
        message: 'Must start with letter and contain only letters, numbers, underscore, dash',
        severity: 'error'
      },
      {
        type: 'length',
        value: 32,
        message: 'Cannot be longer than 32 characters',
        severity: 'error'
      },
      {
        type: 'reserved',
        value: ['*-(BA|XBA|TA|R)-*'],
        message: 'Cannot contain reserved patterns BA/XBA/TA/R',
        severity: 'error'
      }
    ],
    maxLength: 32,
    reservedWords: ['BA', 'XBA', 'TA', 'R'],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['integration', 'identifier', 'oic']
  },
  {
    id: 'int-003',
    category: 'integrations',
    component: 'Integration',
    field: 'Version',
    pattern: '<MAJOR>.<MINOR>.<PATCH>',
    description: 'Semantic versioning for integrations',
    guidelines: 'Enter a version number using numbers (0-9) in the following format: major.minor.patch (xx.xx.xxxx). It cannot be longer than 10 characters.',
    examples: [
      {
        id: 'ex-005',
        description: 'Initial release',
        value: '01.00.0000',
        isCorrect: true,
        explanation: 'Default initial version'
      },
      {
        id: 'ex-006',
        description: 'Major version update',
        value: '02.00.0000',
        isCorrect: true,
        explanation: 'Major version with breaking changes'
      },
      {
        id: 'ex-007',
        description: 'Minor version update',
        value: '02.10.0000',
        isCorrect: true,
        explanation: 'Minor enhancements'
      },
      {
        id: 'ex-008',
        description: 'Patch version',
        value: '02.10.1000',
        isCorrect: true,
        explanation: 'Bug fix release'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
        message: 'Must follow format: xx.xx.xxxx',
        severity: 'error'
      }
    ],
    maxLength: 10,
    minLength: 10,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['version', 'integration']
  },
  {
    id: 'int-004',
    category: 'integrations',
    component: 'Integration',
    field: 'Package',
    pattern: '<ORG>_<DOMAIN>_<SUBDOMAIN>',
    description: 'Package grouping for integrations',
    guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9) and special characters ( _ - . ). It cannot be longer than 50 characters, can\'t have a pattern *.(ba|xba|ta|r).* and must start with letters (A-Z)',
    examples: [
      {
        id: 'ex-009',
        description: 'Valid package name',
        value: 'BCRX_SUPPLY_CHAIN_LOGISTICS',
        isCorrect: true,
        explanation: 'Properly structured package name'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z][A-Za-z0-9_.-]*$',
        message: 'Must start with letter and contain only letters, numbers, underscore, dash, dot',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: ['ba', 'xba', 'ta', 'r'],
    caseSensitive: false,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['package', 'integration']
  },

  // ==================== CONNECTIONS ====================
  {
    id: 'conn-001',
    category: 'connections',
    component: 'Connection',
    field: 'Name',
    pattern: '<ORG>_<SYSTEM>_<TYPE>_CONN',
    description: 'Connection name pattern',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-010',
        description: 'Valid connection name',
        value: 'BCRX_SALESFORCE_REST_CONN',
        isCorrect: true,
        explanation: 'REST API connection to Salesforce'
      },
      {
        id: 'ex-011',
        description: 'SFTP connection',
        value: 'BCRX_SFTP_3PL_CONN',
        isCorrect: true,
        explanation: 'SFTP connection to 3PL system'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z]{3,4}_[A-Z0-9]+_(REST|SOAP|FTP|DB|FILE)_CONN$',
        message: 'Must follow pattern: <ORG>_<SYSTEM>_<TYPE>_CONN',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['connection', 'oic']
  },
  {
    id: 'conn-002',
    category: 'connections',
    component: 'Connection',
    field: 'Identifier',
    pattern: '<ORG>_<SYSTEM>_<TYPE>_CONN',
    description: 'Unique connection identifier',
    guidelines: 'Enter the code using letters (A-Z), Numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters.',
    examples: [
      {
        id: 'ex-012',
        description: 'Valid identifier',
        value: 'BCRX_SAP_SOAP_CONN',
        isCorrect: true,
        explanation: 'SOAP connection identifier for SAP'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z][A-Z0-9_-]*_CONN$',
        message: 'Must end with _CONN',
        severity: 'error'
      }
    ],
    maxLength: 32,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['connection', 'identifier']
  },
  {
    id: 'conn-003',
    category: 'connections',
    component: 'Connection',
    field: 'Type',
    pattern: 'REST | SOAP | FTP | DB | FILE',
    description: 'Connection type',
    guidelines: 'Select the appropriate connection type from the available options.',
    examples: [
      {
        id: 'ex-013',
        description: 'REST API connection',
        value: 'REST',
        isCorrect: true,
        explanation: 'For REST API connections'
      },
      {
        id: 'ex-014',
        description: 'SOAP web service',
        value: 'SOAP',
        isCorrect: true,
        explanation: 'For SOAP-based web services'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^(REST|SOAP|FTP|DB|FILE)$',
        message: 'Must be one of: REST, SOAP, FTP, DB, FILE',
        severity: 'error'
      }
    ],
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['connection', 'type']
  },
  {
    id: 'conn-004',
    category: 'connections',
    component: 'Connection',
    field: 'Role',
    pattern: 'SOURCE | TARGET | BIDIRECTIONAL',
    description: 'Connection role in integration',
    guidelines: 'Choose Trigger, Invoke, or Trigger and Invoke appropriately.',
    examples: [
      {
        id: 'ex-015',
        description: 'Data source',
        value: 'SOURCE',
        isCorrect: true,
        explanation: 'Connection acts as data source'
      },
      {
        id: 'ex-016',
        description: 'Data destination',
        value: 'TARGET',
        isCorrect: true,
        explanation: 'Connection acts as data target'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^(SOURCE|TARGET|BIDIRECTIONAL)$',
        message: 'Must be one of: SOURCE, TARGET, BIDIRECTIONAL',
        severity: 'error'
      }
    ],
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['connection', 'role']
  },
  {
    id: 'conn-005',
    category: 'connections',
    component: 'Connection',
    field: 'Security Policy',
    pattern: '<ORG>_<SYSTEM>_SECURITY_POLICY',
    description: 'Security policy name',
    guidelines: 'Define security policy following the naming pattern.',
    examples: [
      {
        id: 'ex-017',
        description: 'Valid policy name',
        value: 'BCRX_SALESFORCE_SECURITY_POLICY',
        isCorrect: true,
        explanation: 'Security policy for Salesforce connection'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z]{3,4}_[A-Z0-9]+_SECURITY_POLICY$',
        message: 'Must follow pattern: <ORG>_<SYSTEM>_SECURITY_POLICY',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['connection', 'security']
  },

  // ==================== LOOKUPS ====================
  {
    id: 'lookup-001',
    category: 'lookups',
    component: 'Lookup',
    field: 'Name',
    pattern: '<ORG>_<SOURCE>_<PURPOSE>_LOOKUP',
    description: 'Lookup table name for value mapping',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-018',
        description: 'Common integration lookup',
        value: 'BCRX_ERP_CMN_INT_LOOKUP',
        isCorrect: true,
        explanation: 'Common lookup for ERP integrations'
      },
      {
        id: 'ex-019',
        description: 'Status code mapping',
        value: 'BCRX_WMS_STATUS_CODE_LOOKUP',
        isCorrect: true,
        explanation: 'Maps status codes between systems'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z]{3,4}_[A-Z0-9]+_[A-Z0-9_]+_LOOKUP$',
        message: 'Must follow pattern: <ORG>_<SOURCE>_<PURPOSE>_LOOKUP',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['lookup', 'mapping']
  },

  // ==================== PACKAGES ====================
  {
    id: 'pkg-001',
    category: 'packages',
    component: 'Package',
    field: 'Name',
    pattern: 'com.<ORG>.<PROJECT>.<MODULE>',
    description: 'Package name for grouping integrations',
    guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9) and special characters ( _ - . ). It cannot be longer than 50 characters, can\'t have a pattern *.(ba|xba|ta|r).* and must start with letters (A-Z)',
    examples: [
      {
        id: 'ex-020',
        description: 'ERP integration module package',
        value: 'com.bcrx.erp.im',
        isCorrect: true,
        explanation: 'Package for ERP integration management'
      },
      {
        id: 'ex-021',
        description: 'Supply chain logistics package',
        value: 'com.bcrx.scm.logistics',
        isCorrect: true,
        explanation: 'Package for supply chain logistics integrations'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^com\\.[a-z]{3,4}\\.[a-z0-9]+\\.[a-z0-9]+$',
        message: 'Must follow pattern: com.<org>.<project>.<module>',
        severity: 'error'
      },
      {
        type: 'reserved',
        value: ['*.(ba|xba|ta|r).*'],
        message: 'Cannot contain reserved words: ba, xba, ta, r',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: ['ba', 'xba', 'ta', 'r'],
    caseSensitive: false,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['package', 'grouping']
  },

  // ==================== PROJECTS ====================
  {
    id: 'proj-001',
    category: 'projects',
    component: 'Project',
    field: 'Name',
    pattern: 'com.<ORG>.<TRACK>.<MODULE>',
    description: 'Project workspace name',
    guidelines: 'Enter a name using letters (A-Z a-z), numbers (0-9) and special characters ( _ - . ). It cannot be longer than 50 characters, can\'t have a pattern *.(ba|xba|ta|r).* and must start with letters (A-Z)',
    examples: [
      {
        id: 'ex-022',
        description: 'ERP integration project',
        value: 'com.bcrx.erp.im',
        isCorrect: true,
        explanation: 'Project for ERP integration management'
      },
      {
        id: 'ex-023',
        description: 'HCM integration project',
        value: 'com.bcrx.hcm.employee',
        isCorrect: true,
        explanation: 'Project for HCM employee integrations'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^com\\.[a-z]{3,4}\\.[a-z0-9]+\\.[a-z0-9]+$',
        message: 'Must follow pattern: com.<org>.<track>.<module>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: ['ba', 'xba', 'ta', 'r'],
    caseSensitive: false,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['project', 'workspace']
  },

  // ==================== AGENTS ====================
  {
    id: 'agent-001',
    category: 'agents',
    component: 'Agent',
    field: 'Name',
    pattern: '<ORG>_<SYSTEM>_<ADAPTER>_AGENT',
    description: 'On-premises agent name',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-024',
        description: 'Database agent',
        value: 'BCRX_EBS_DB_AGENT',
        isCorrect: true,
        explanation: 'Agent for EBS database connectivity'
      },
      {
        id: 'ex-025',
        description: 'SFTP agent',
        value: 'BCRX_ERP_SFTP_AGENT',
        isCorrect: true,
        explanation: 'Agent for ERP SFTP connectivity'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z]{3,4}_[A-Z0-9]+_(DB|SFTP|FTP)_AGENT$',
        message: 'Must follow pattern: <ORG>_<SYSTEM>_<ADAPTER>_AGENT',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['agent', 'connectivity']
  },
  {
    id: 'agent-002',
    category: 'agents',
    component: 'Agent',
    field: 'Identifier',
    pattern: '<ORG>_<SYSTEM>_<ADAPTER>_AGENT',
    description: 'Unique agent identifier',
    guidelines: 'Enter the code using letters (A-Z), Numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters.',
    examples: [
      {
        id: 'ex-026',
        description: 'Valid agent identifier',
        value: 'BCRX_EBS_DB_AGENT',
        isCorrect: true,
        explanation: 'Unique identifier for database agent'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Z][A-Z0-9_-]*_AGENT$',
        message: 'Must end with _AGENT',
        severity: 'error'
      }
    ],
    maxLength: 32,
    reservedWords: [],
    caseSensitive: true,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['agent', 'identifier']
  },

  // ==================== LIBRARIES ====================
  {
    id: 'lib-001',
    category: 'libraries',
    component: 'Library',
    field: 'Name',
    pattern: '<ORG>_<FUNCTIONALITY>',
    description: 'JavaScript library name',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-027',
        description: 'DateTime formatter library',
        value: 'BCRX_DATETIME_FORMATTER',
        isCorrect: true,
        explanation: 'Library for date/time formatting functions'
      },
      {
        id: 'ex-028',
        description: 'String utilities library',
        value: 'bcrx_string_utils',
        isCorrect: true,
        explanation: 'Library for string manipulation utilities'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Za-z]{3,4}_[A-Za-z0-9_]+$',
        message: 'Must follow pattern: <ORG>_<FUNCTIONALITY>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['library', 'javascript']
  },
  {
    id: 'lib-002',
    category: 'libraries',
    component: 'Library',
    field: 'Identifier',
    pattern: '<ORG>_<FUNCTIONALITY>',
    description: 'Unique library identifier',
    guidelines: 'Enter the code using letters (A-Z), Numbers (0-9) and special characters (_ -). Cannot be longer than 32 characters.',
    examples: [
      {
        id: 'ex-029',
        description: 'Valid library identifier',
        value: 'BCRX_DATETIME_FORMATTER',
        isCorrect: true,
        explanation: 'Unique identifier for datetime formatter library'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^[A-Za-z][A-Za-z0-9_-]*$',
        message: 'Must start with letter',
        severity: 'error'
      }
    ],
    maxLength: 32,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: false,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['library', 'identifier']
  },

  // ==================== ACTIONS ====================
  {
    id: 'action-001',
    category: 'actions',
    component: 'Assign',
    field: 'Name',
    pattern: 'Asg_<element_name>',
    description: 'Assign action name for variable assignment',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-030',
        description: 'Assign datetime variable',
        value: 'Asg_datetime',
        isCorrect: true,
        explanation: 'Assigns value to datetime variable'
      },
      {
        id: 'ex-031',
        description: 'Assign order status',
        value: 'Asg_order_status',
        isCorrect: true,
        explanation: 'Assigns value to order status variable'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^Asg_[A-Za-z][A-Za-z0-9_]*$',
        message: 'Must follow pattern: Asg_<element_name>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'assign', 'data']
  },
  {
    id: 'action-002',
    category: 'actions',
    component: 'Map',
    field: 'Name',
    pattern: 'Map to <endpoint>',
    description: 'Mapping action name',
    guidelines: 'Provide a meaningful name based on the endpoint. Default format is "Map to <endpoint>".',
    examples: [
      {
        id: 'ex-032',
        description: 'Map to endpoint',
        value: 'Map to UpdatePhoneNumber',
        isCorrect: true,
        explanation: 'Maps data to UpdatePhoneNumber endpoint'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^Map to [A-Za-z][A-Za-z0-9_]*$',
        message: 'Must follow pattern: Map to <endpoint>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'map', 'data']
  },
  {
    id: 'action-003',
    category: 'actions',
    component: 'Logger',
    field: 'Name',
    pattern: 'Log_<object>',
    description: 'Logger action name for logging messages',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-033',
        description: 'Log order details',
        value: 'Log_OrderDetails',
        isCorrect: true,
        explanation: 'Logs order details to activity stream'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^Log_[A-Za-z][A-Za-z0-9_]*$',
        message: 'Must follow pattern: Log_<object>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'logger', 'general']
  },
  {
    id: 'action-004',
    category: 'actions',
    component: 'ForEach',
    field: 'Name',
    pattern: 'ForEach_<repeating_element>',
    description: 'ForEach loop action name',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-034',
        description: 'Loop through orders',
        value: 'ForEach_OrderApproval',
        isCorrect: true,
        explanation: 'Iterates over order approval items'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^ForEach_[A-Za-z][A-Za-z0-9_]*$',
        message: 'Must follow pattern: ForEach_<repeating_element>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'foreach', 'collection']
  },
  {
    id: 'action-005',
    category: 'actions',
    component: 'Switch',
    field: 'Name',
    pattern: 'IF <condition>',
    description: 'Switch/If condition action name',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-035',
        description: 'Check status condition',
        value: 'IF Status not equal to SUCCESS',
        isCorrect: true,
        explanation: 'Conditional branch for status check'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^IF [A-Za-z].*$',
        message: 'Must follow pattern: IF <condition>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'switch', 'collection']
  },
  {
    id: 'action-006',
    category: 'actions',
    component: 'Notification',
    field: 'Name',
    pattern: 'Notify_<object>_<status>',
    description: 'Notification action name',
    guidelines: 'Enter a name using letters (A-Z a-z), Numbers (0-9), spaces ( ) and special characters ( _ - ). Cannot be longer than 50 chars and must start with a letter.',
    examples: [
      {
        id: 'ex-036',
        description: 'Notify order success',
        value: 'Notify_OrderStatus_Success',
        isCorrect: true,
        explanation: 'Sends notification for successful order processing'
      }
    ],
    validationRules: [
      {
        type: 'regex',
        value: '^Notify_[A-Za-z][A-Za-z0-9_]*_[A-Za-z][A-Za-z0-9_]*$',
        message: 'Must follow pattern: Notify_<object>_<status>',
        severity: 'error'
      }
    ],
    maxLength: 50,
    reservedWords: [],
    caseSensitive: false,
    allowSpaces: true,
    status: 'active',
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    tags: ['action', 'notification', 'general']
  }
]

/**
 * Get conventions by category
 */
export function getConventionsByCategory(category: NamingCategory): NamingConvention[] {
  return namingConventionsData.filter(conv => conv.category === category)
}

/**
 * Get convention by ID
 */
export function getConventionById(id: string): NamingConvention | undefined {
  return namingConventionsData.find(conv => conv.id === id)
}

/**
 * Get all categories with counts
 */
export function getCategoriesWithCounts() {
  const categories: NamingCategory[] = [
    'integrations',
    'connections',
    'lookups',
    'packages',
    'projects',
    'agents',
    'libraries',
    'actions'
  ]

  return categories.map(category => ({
    id: category,
    count: getConventionsByCategory(category).length
  }))
}

/**
 * Search conventions
 */
export function searchConventions(query: string): NamingConvention[] {
  const lowerQuery = query.toLowerCase()
  return namingConventionsData.filter(conv =>
    conv.field.toLowerCase().includes(lowerQuery) ||
    conv.description.toLowerCase().includes(lowerQuery) ||
    conv.pattern.toLowerCase().includes(lowerQuery) ||
    conv.component.toLowerCase().includes(lowerQuery)
  )
}

