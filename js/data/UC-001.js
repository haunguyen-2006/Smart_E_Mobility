/* UC-001: Log in
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-001",
  "name": "Log in",
  "actor": "Student; Admin; Real-time Operations Operator; Strategic Simulation Operator",
  "goal": "The user securely accesses the Smart E-Mobility Hub system with an active account and the permissions assigned to that role.",
  "preconditions": "• The user has an account in the system. | • The account is active and the login service is available.",
  "trigger": "The user opens the application and selects “Log in”.",
  "postconditions": "The system authenticates the user, establishes a session, and displays the functions permitted for the user’s role.",
  "stakeholders": "Student, Admin, Real-time Operations Operator, Strategic Simulation Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only valid credentials for an active account may create an authenticated session. | • Access to functions must follow the permissions associated with the user’s role.",
  "assumptions": "User accounts and role assignments are maintained in the system.",
  "steps": [
    {
      "n": 1,
      "text": "The user opens the application and selects “Log in”."
    },
    {
      "n": 2,
      "text": "The system displays the login form."
    },
    {
      "n": 3,
      "text": "The user enters the required credentials and submits the form."
    },
    {
      "n": 4,
      "text": "The system validates the credentials and checks that the account is active."
    },
    {
      "n": 5,
      "text": "The system establishes an authenticated session and displays the appropriate home screen."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "User leaves the login process",
      "description": "Before submitting the form, the user returns to the previous screen. The system does not establish a session, and the use case ends."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Invalid credentials or inactive account",
      "description": "If the credentials are invalid or the account is inactive, the system rejects the attempt and displays an authentication message. The user may try again."
    },
    {
      "code": "E2",
      "title": "Authentication service unavailable",
      "description": "If the system cannot validate the credentials, it displays a temporary error and does not create a session."
    }
  ],
  "sourceTitle": "UC-001: Log in",
  "category": "Common & Support Services",
  "decisionIndex": 3,
  "decisionText": "Are credentials valid and account active?",
  "sequence": {
    "parts": [
      "User",
      "Application UI",
      "Authentication Service",
      "Account & Session Records"
    ],
    "messages": [
      [
        0,
        1,
        "Select Log in",
        "call"
      ],
      [
        1,
        2,
        "Request login form",
        "call"
      ],
      [
        2,
        1,
        "Display login form",
        "return"
      ],
      [
        0,
        1,
        "Enter credentials and submit",
        "call"
      ],
      [
        1,
        2,
        "Submit credentials",
        "call"
      ],
      [
        2,
        3,
        "Validate credentials and account status",
        "call"
      ],
      [
        3,
        2,
        "Return account status and role",
        "return"
      ],
      [
        2,
        1,
        "Establish session / return result",
        "return"
      ],
      [
        1,
        0,
        "Show role-appropriate home screen",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Authentication session",
    "states": [
      "Login Idle",
      "Credentials Entered",
      "Authenticating",
      "Authenticated"
    ],
    "events": [
      "Open login",
      "Submit credentials",
      "Credentials valid"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Invalid credentials",
        "name": "Authentication Rejected",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Service unavailable",
        "name": "Validation Unavailable",
        "returnTo": 1
      },
      {
        "from": 0,
        "label": "Leave login",
        "name": "Login Cancelled",
        "terminal": true
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
