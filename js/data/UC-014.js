/* UC-014: Manage Hub Configuration
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-014",
  "name": "Manage Hub Configuration",
  "actor": "Admin",
  "goal": "The administrator maintains Hub information and configuration used by the Smart E-Mobility Hub system.",
  "preconditions": "• The administrator is logged in. | • The administrator is authorized to manage Hub configuration.",
  "trigger": "The administrator selects “Manage Hub Configuration”.",
  "postconditions": "Valid Hub configuration changes are saved and reflected in the system.",
  "stakeholders": "Admin, Real-time Operations Operator, Strategic Simulation Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only authorized administrators may change Hub configuration. | • Required Hub information and supported capacity values must be valid. | • Configuration changes must not silently overwrite current operational status or active reservations.",
  "assumptions": "The exact configurable fields are those provided by the application, such as Hub identity, location, operating status, and supported resource capacity.",
  "steps": [
    {
      "n": 1,
      "text": "The administrator selects “Manage Hub Configuration”."
    },
    {
      "n": 2,
      "text": "The system displays the configured Mobility Hubs and available configuration actions."
    },
    {
      "n": 3,
      "text": "The administrator selects an existing Hub or chooses to add a Hub if creation is supported."
    },
    {
      "n": 4,
      "text": "The system displays the current configuration or an empty form."
    },
    {
      "n": 5,
      "text": "The administrator enters or updates the supported Hub information and submits it."
    },
    {
      "n": 6,
      "text": "The system validates required fields and configuration consistency."
    },
    {
      "n": 7,
      "text": "The administrator confirms the changes."
    },
    {
      "n": 8,
      "text": "The system saves the configuration and displays a confirmation."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Administrator views configuration without editing",
      "description": "The administrator selects a Hub and reviews its configuration. The system makes no changes."
    },
    {
      "code": "A2",
      "title": "Administrator cancels configuration changes",
      "description": "The administrator cancels before saving. The system discards unconfirmed changes and returns to the Hub list."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Configuration values are invalid",
      "description": "The system identifies the invalid fields or inconsistent capacity values and asks the administrator to correct them."
    },
    {
      "code": "E2",
      "title": "Configuration cannot be saved",
      "description": "The system displays an error and does not report the update as successful. The prior saved configuration remains in effect."
    }
  ],
  "sourceTitle": "UC-014: Manage Hub Configuration",
  "category": "Account & Access Management",
  "decisionIndex": 5,
  "decisionText": "Is the Hub configuration valid?",
  "sequence": {
    "parts": [
      "Administrator",
      "Admin UI",
      "Hub Configuration Service",
      "Hub Configuration Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Manage Hub Configuration",
        "call"
      ],
      [
        1,
        2,
        "Request Hub list and configuration actions",
        "call"
      ],
      [
        2,
        3,
        "Retrieve configured Hubs",
        "call"
      ],
      [
        3,
        2,
        "Return Hub configuration list",
        "return"
      ],
      [
        2,
        1,
        "Display Hub list",
        "return"
      ],
      [
        0,
        1,
        "Select Hub or choose add if supported",
        "call"
      ],
      [
        1,
        2,
        "Request configuration or empty form",
        "call"
      ],
      [
        2,
        1,
        "Display selected configuration/form",
        "return"
      ],
      [
        0,
        1,
        "Enter or update supported Hub information",
        "call"
      ],
      [
        1,
        2,
        "Submit configuration changes",
        "call"
      ],
      [
        2,
        2,
        "Validate required fields and capacity consistency",
        "self"
      ],
      [
        0,
        1,
        "Confirm changes",
        "call"
      ],
      [
        1,
        2,
        "Save validated configuration",
        "call"
      ],
      [
        2,
        3,
        "Update Hub configuration record",
        "call"
      ],
      [
        3,
        2,
        "Return saved configuration",
        "return"
      ],
      [
        2,
        1,
        "Return configuration confirmation",
        "return"
      ],
      [
        1,
        0,
        "Display result",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Hub configuration change",
    "states": [
      "Hub List",
      "Configuration Selected",
      "Editing Configuration",
      "Validating Configuration",
      "Configuration Saved"
    ],
    "events": [
      "Select Hub/add action",
      "Open configuration",
      "Submit configuration",
      "Configuration valid"
    ],
    "branches": [
      {
        "from": 3,
        "label": "Invalid fields/capacity",
        "name": "Correction Required",
        "returnTo": 2
      },
      {
        "from": 2,
        "label": "Cancel before save",
        "name": "Configuration Unchanged",
        "returnTo": 0
      },
      {
        "from": 3,
        "label": "Save failure",
        "name": "Save Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
