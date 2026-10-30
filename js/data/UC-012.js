/* UC-012: Manage User Accounts
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-012",
  "name": "Manage User Accounts",
  "actor": "Admin",
  "goal": "The administrator creates, reviews, updates, and deactivates user accounts according to the system’s account-management rules.",
  "preconditions": "• The administrator is logged in. | • The administrator is authorized to manage user accounts.",
  "trigger": "The administrator selects “Manage User Accounts”.",
  "postconditions": "The requested account operation is saved and the system displays its outcome.",
  "stakeholders": "Admin, Students, Real-time Operations Operator, Strategic Simulation Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only authorized administrators may manage accounts. | • Required account information must be valid and unique where a unique identifier is required. | • Deactivated accounts must not be able to start new authenticated sessions.",
  "assumptions": "The system defines the required account fields and available account statuses.",
  "steps": [
    {
      "n": 1,
      "text": "The administrator selects “Manage User Accounts”."
    },
    {
      "n": 2,
      "text": "The system displays existing accounts and available management actions."
    },
    {
      "n": 3,
      "text": "The administrator selects “Create Account” or chooses an existing account to view or manage."
    },
    {
      "n": 4,
      "text": "The system displays the relevant form or account details."
    },
    {
      "n": 5,
      "text": "The administrator enters or updates information, or selects an account-status action, and submits the request."
    },
    {
      "n": 6,
      "text": "The system validates the information and checks for conflicting account identifiers."
    },
    {
      "n": 7,
      "text": "The administrator confirms the operation when required."
    },
    {
      "n": 8,
      "text": "The system saves the change and displays a confirmation."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Administrator searches or views accounts",
      "description": "The administrator enters search criteria or selects an account. The system displays matching accounts or the selected account details without changing account data."
    },
    {
      "code": "A2",
      "title": "Administrator deactivates an account",
      "description": "The administrator selects an account and chooses deactivation. After confirmation, the system marks the account as inactive and confirms the change."
    },
    {
      "code": "A3",
      "title": "Administrator cancels an operation",
      "description": "The administrator cancels before saving. The system discards unconfirmed changes and returns to the account list."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Account information is missing or invalid",
      "description": "The system identifies the fields that need correction and does not save invalid information."
    },
    {
      "code": "E2",
      "title": "Duplicate account identifier",
      "description": "If the identifier already exists, the system rejects creation and does not create a duplicate account."
    },
    {
      "code": "E3",
      "title": "Account operation fails",
      "description": "The system displays an error and does not report the operation as successful. The administrator may retry."
    }
  ],
  "sourceTitle": "UC-012: Manage User Accounts",
  "category": "Account & Access Management",
  "decisionIndex": 5,
  "decisionText": "Is the account operation valid?",
  "sequence": {
    "parts": [
      "Administrator",
      "Admin UI",
      "Account Management Service",
      "User Account Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Manage User Accounts",
        "call"
      ],
      [
        1,
        2,
        "Request accounts and management actions",
        "call"
      ],
      [
        2,
        3,
        "Retrieve current accounts",
        "call"
      ],
      [
        3,
        2,
        "Return account list",
        "return"
      ],
      [
        2,
        1,
        "Display accounts and actions",
        "return"
      ],
      [
        0,
        1,
        "Select create or existing-account action",
        "call"
      ],
      [
        1,
        2,
        "Request account form or details",
        "call"
      ],
      [
        2,
        1,
        "Display form or selected account",
        "return"
      ],
      [
        0,
        1,
        "Enter/update details or select status action",
        "call"
      ],
      [
        1,
        2,
        "Submit account operation",
        "call"
      ],
      [
        2,
        3,
        "Validate fields and unique identifier",
        "call"
      ],
      [
        3,
        2,
        "Return validation result",
        "return"
      ],
      [
        0,
        1,
        "Confirm operation when required",
        "call"
      ],
      [
        1,
        2,
        "Save validated account change",
        "call"
      ],
      [
        2,
        3,
        "Create/update/deactivate account record",
        "call"
      ],
      [
        3,
        2,
        "Return saved account status",
        "return"
      ],
      [
        2,
        1,
        "Return operation result",
        "return"
      ],
      [
        1,
        0,
        "Display account confirmation",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Account-management workflow",
    "states": [
      "Account List",
      "Operation Selected",
      "Form / Details Open",
      "Validating Account Change",
      "Account Change Saved"
    ],
    "events": [
      "Choose create/view/update/deactivate",
      "Open selected action",
      "Submit change",
      "Validation succeeds"
    ],
    "branches": [
      {
        "from": 3,
        "label": "Invalid or duplicate data",
        "name": "Correction Required",
        "returnTo": 2
      },
      {
        "from": 3,
        "label": "Save error",
        "name": "Account Change Failed",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Cancel operation",
        "name": "Operation Cancelled",
        "terminal": true
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
