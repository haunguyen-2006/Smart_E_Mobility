/* UC-002: Manage Personal Profile
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-002",
  "name": "Manage Personal Profile",
  "actor": "Student",
  "goal": "The student views and updates personal profile information that the system allows the student to maintain.",
  "preconditions": "• The student is logged in. | • A profile is associated with the student account.",
  "trigger": "The student selects “Manage Personal Profile”.",
  "postconditions": "The system displays the current profile and saves valid changes confirmed by the student.",
  "stakeholders": "Student, Admin, VNU-HCM Management",
  "priority": "Medium",
  "businessRules": "• Students may edit only permitted profile fields. | • Profile changes must be validated before saving. | • Profile management does not grant permission to change roles or access rights.",
  "assumptions": "The system defines which profile fields students may view or update.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Manage Personal Profile”."
    },
    {
      "n": 2,
      "text": "The system displays the student’s current profile information."
    },
    {
      "n": 3,
      "text": "The student selects the edit option and changes permitted fields."
    },
    {
      "n": 4,
      "text": "The student submits the changes, and the system validates the entered information."
    },
    {
      "n": 5,
      "text": "The system saves the valid changes and displays a confirmation."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Student views the profile without editing",
      "description": "The student reviews the displayed information and leaves the profile page. No changes are saved."
    },
    {
      "code": "A2",
      "title": "Student cancels editing",
      "description": "Before saving, the student cancels the edit. The system discards the unsubmitted changes and returns to the profile view."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Profile information is invalid",
      "description": "The system identifies the fields that need correction and asks the student to revise them. The saved profile remains unchanged."
    },
    {
      "code": "E2",
      "title": "Profile update fails",
      "description": "If the system cannot save the changes, it displays an error and allows the student to retry."
    }
  ],
  "sourceTitle": "UC-002: Manage Personal Profile",
  "category": "Common & Support Services",
  "decisionIndex": 3,
  "decisionText": "Are profile changes valid?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Profile Service",
      "Profile Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Manage Personal Profile",
        "call"
      ],
      [
        1,
        2,
        "Request current profile",
        "call"
      ],
      [
        2,
        3,
        "Retrieve saved profile",
        "call"
      ],
      [
        3,
        2,
        "Return profile information",
        "return"
      ],
      [
        2,
        1,
        "Display profile",
        "return"
      ],
      [
        0,
        1,
        "Edit permitted fields and submit",
        "call"
      ],
      [
        1,
        2,
        "Validate profile changes",
        "call"
      ],
      [
        2,
        3,
        "Save validated profile",
        "call"
      ],
      [
        3,
        2,
        "Confirm saved profile",
        "return"
      ],
      [
        2,
        1,
        "Return update result",
        "return"
      ],
      [
        1,
        0,
        "Display confirmation",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Profile editing workflow",
    "states": [
      "Profile Displayed",
      "Editing",
      "Validating Changes",
      "Changes Saved"
    ],
    "events": [
      "Select edit",
      "Submit changes",
      "Validation succeeds"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Invalid fields",
        "name": "Correction Required",
        "returnTo": 1
      },
      {
        "from": 1,
        "label": "Cancel edit",
        "name": "Editing Cancelled",
        "terminal": true
      },
      {
        "from": 2,
        "label": "Save error",
        "name": "Save Failed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
