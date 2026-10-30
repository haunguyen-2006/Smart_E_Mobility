/* UC-013: Manage Roles & Access
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-013",
  "name": "Manage Roles & Access",
  "actor": "Admin",
  "goal": "The administrator manages role permissions so that users can access only the functions authorized for their roles.",
  "preconditions": "• The administrator is logged in and authorized to manage access. | • User roles and their permissions are defined.",
  "trigger": "The administrator selects “Manage Roles & Access”.",
  "postconditions": "Confirmed access changes are saved and reflected by the system.",
  "stakeholders": "Admin, Student, Real-time Operations Operator, Strategic Simulation Operator",
  "priority": "High",
  "businessRules": "• Permission changes must comply with access-control rules. | • At least one authorized administrator must retain the ability to manage access permissions. | • Unconfirmed or invalid changes must not replace valid permissions.",
  "assumptions": "The set of roles and assignable permissions is defined by the system access-control requirements.",
  "steps": [
    {
      "n": 1,
      "text": "The administrator selects “Manage Roles & Access”."
    },
    {
      "n": 2,
      "text": "The system displays existing roles and their associated permissions."
    },
    {
      "n": 3,
      "text": "The administrator selects a role to review or update."
    },
    {
      "n": 4,
      "text": "The system displays the role’s current permissions."
    },
    {
      "n": 5,
      "text": "The administrator selects permissions to add or remove."
    },
    {
      "n": 6,
      "text": "The system validates the proposed changes against the access-control rules, including the requirement to retain administrative access."
    },
    {
      "n": 7,
      "text": "The system displays a summary of the proposed changes."
    },
    {
      "n": 8,
      "text": "The administrator confirms the changes."
    },
    {
      "n": 9,
      "text": "The system saves the updated permissions and displays a confirmation."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Administrator reviews permissions without changing them",
      "description": "The administrator reviews a role’s permissions and returns to the role list. No changes are made."
    },
    {
      "code": "A2",
      "title": "Administrator revises proposed permissions",
      "description": "The administrator returns to permission selection, changes the proposal, and submits it for validation again."
    },
    {
      "code": "A3",
      "title": "Administrator cancels the changes",
      "description": "The system returns to the role details without applying unconfirmed changes."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Invalid or conflicting permission changes",
      "description": "The system rejects the proposed changes, identifies the issue, and allows the administrator to revise or cancel them."
    },
    {
      "code": "E2",
      "title": "Changes would remove all essential administrative access",
      "description": "The system rejects the changes and retains the existing valid administrative permissions."
    },
    {
      "code": "E3",
      "title": "Permission update fails",
      "description": "The system displays an error and leaves the existing permissions unchanged."
    }
  ],
  "sourceTitle": "UC-013: Manage Roles & Access",
  "category": "Account & Access Management",
  "decisionIndex": 5,
  "decisionText": "Do proposed permissions satisfy policy?",
  "sequence": {
    "parts": [
      "Administrator",
      "Admin UI",
      "Access Control Service",
      "Role & Permission Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Manage Roles & Access",
        "call"
      ],
      [
        1,
        2,
        "Request roles and permissions",
        "call"
      ],
      [
        2,
        3,
        "Retrieve current access rules",
        "call"
      ],
      [
        3,
        2,
        "Return roles and permissions",
        "return"
      ],
      [
        2,
        1,
        "Display role list",
        "return"
      ],
      [
        0,
        1,
        "Select role to review or update",
        "call"
      ],
      [
        1,
        2,
        "Request selected role permissions",
        "call"
      ],
      [
        2,
        1,
        "Display current permissions",
        "return"
      ],
      [
        0,
        1,
        "Select permissions to add/remove",
        "call"
      ],
      [
        1,
        2,
        "Submit proposed changes",
        "call"
      ],
      [
        2,
        2,
        "Validate access rules and retain admin access",
        "self"
      ],
      [
        2,
        1,
        "Display validation and change summary",
        "return"
      ],
      [
        0,
        1,
        "Confirm valid changes",
        "call"
      ],
      [
        1,
        2,
        "Save updated permissions",
        "call"
      ],
      [
        2,
        3,
        "Update role permission record",
        "call"
      ],
      [
        3,
        2,
        "Return saved permission set",
        "return"
      ],
      [
        2,
        1,
        "Return confirmation",
        "return"
      ],
      [
        1,
        0,
        "Display success result",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Role-permission change",
    "states": [
      "Current Permissions",
      "Proposed Changes",
      "Validating Changes",
      "Review Summary",
      "Permissions Updated"
    ],
    "events": [
      "Select role",
      "Propose permission changes",
      "Rules pass",
      "Confirm changes"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Invalid/conflicting changes",
        "name": "Proposal Rejected",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Would remove admin access",
        "name": "Admin Access Preserved",
        "returnTo": 0
      },
      {
        "from": 3,
        "label": "Cancel changes",
        "name": "Changes Cancelled",
        "terminal": true
      },
      {
        "from": 3,
        "label": "Save failure",
        "name": "Update Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
