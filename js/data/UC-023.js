/* UC-023: Log out
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-023",
  "name": "Log out",
  "actor": "Student; Admin; Real-time Operations Operator; Strategic Simulation Operator",
  "goal": "The user securely ends the current authenticated session.",
  "preconditions": "• The user has an active authenticated session.",
  "trigger": "The user selects “Log out”.",
  "postconditions": "The current session is terminated and the login screen is displayed.",
  "stakeholders": "Student, Admin, Real-time Operations Operator, Strategic Simulation Operator",
  "priority": "High",
  "businessRules": "• After logout, protected functions must not remain accessible through the ended session. | • Logging out must not change saved bookings, profiles, or operational records.",
  "assumptions": "The system can identify and terminate the current user session.",
  "steps": [
    {
      "n": 1,
      "text": "The user selects “Log out”."
    },
    {
      "n": 2,
      "text": "The system terminates the authenticated session and clears the user’s authenticated state."
    },
    {
      "n": 3,
      "text": "The system displays the login screen."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Logout is abandoned before confirmation",
      "description": "If the application uses a confirmation prompt and the user cancels it, the session remains active. This flow applies only if confirmation is implemented."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Session has already expired",
      "description": "The system clears the local authenticated state and displays the login screen."
    },
    {
      "code": "E2",
      "title": "Logout request fails",
      "description": "The system informs the user and prevents continued access to protected functions through an invalid local session."
    }
  ],
  "sourceTitle": "UC-023: Log out",
  "category": "Common & Support Services",
  "decisionIndex": 1,
  "decisionText": "Was the session terminated?",
  "sequence": {
    "parts": [
      "User",
      "Application UI",
      "Session Service",
      "Session State"
    ],
    "messages": [
      [
        0,
        1,
        "Select Log out",
        "call"
      ],
      [
        1,
        2,
        "Request session termination",
        "call"
      ],
      [
        2,
        3,
        "Invalidate current session",
        "call"
      ],
      [
        3,
        2,
        "Confirm session termination",
        "return"
      ],
      [
        2,
        1,
        "Return logout result",
        "return"
      ],
      [
        1,
        0,
        "Display login screen",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Authenticated session logout",
    "states": [
      "Session Active",
      "Logout Requested",
      "Terminating Session",
      "Logged Out"
    ],
    "events": [
      "Select log out",
      "Request termination",
      "Session invalidated"
    ],
    "branches": [
      {
        "from": 0,
        "label": "Cancel confirmation if shown",
        "name": "Session Remains Active",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Session already expired",
        "name": "Logged Out",
        "terminal": true
      },
      {
        "from": 2,
        "label": "Logout operation fails",
        "name": "Protected Access Blocked",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
