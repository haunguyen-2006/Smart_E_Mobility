/* UC-004: Search Mobility Hub
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-004",
  "name": "Search Mobility Hub",
  "actor": "Student",
  "goal": "The student finds Mobility Hubs that are suitable for the intended journey or service.",
  "preconditions": "• The system is available. | • Mobility Hub information is available for searching.",
  "trigger": "The student selects “Search Mobility Hub”.",
  "postconditions": "The system displays matching Hubs and allows the student to select a Hub for further information.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Search results must be based on Hub information available to the system. | • The system must indicate when no Hub matches the search criteria.",
  "assumptions": "Search criteria are limited to options supported by the application; a sophisticated 3D map is not required.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Search Mobility Hub”."
    },
    {
      "n": 2,
      "text": "The system displays the available search options and a list of Hubs."
    },
    {
      "n": 3,
      "text": "The student enters search criteria or selects an area of interest."
    },
    {
      "n": 4,
      "text": "The system retrieves and displays matching Hubs with their basic information."
    },
    {
      "n": 5,
      "text": "The student reviews the results and selects a Hub."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Student views Hub status",
      "description": "The student chooses to inspect a Hub’s current resources. The system activates “View Hub Status” as an extension, then the student may return to the search results."
    },
    {
      "code": "A2",
      "title": "No matching Hub found",
      "description": "If no Hub matches the criteria, the system informs the student. The student may revise the criteria and search again or end the use case."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Hub information cannot be retrieved",
      "description": "If the search service or Hub data is unavailable, the system displays a temporary error and allows the student to retry."
    }
  ],
  "sourceTitle": "UC-004: Search Mobility Hub",
  "category": "Hub Search & Discovery Services",
  "decisionIndex": 3,
  "decisionText": "Were any matching Hubs found?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Hub Search Service",
      "Hub Catalog"
    ],
    "messages": [
      [
        0,
        1,
        "Open Search Mobility Hub",
        "call"
      ],
      [
        1,
        2,
        "Request search options and Hub list",
        "call"
      ],
      [
        2,
        3,
        "Retrieve available Hub information",
        "call"
      ],
      [
        3,
        2,
        "Return Hub catalog",
        "return"
      ],
      [
        2,
        1,
        "Display search options",
        "return"
      ],
      [
        0,
        1,
        "Enter criteria or select area",
        "call"
      ],
      [
        1,
        2,
        "Search using selected criteria",
        "call"
      ],
      [
        2,
        3,
        "Find matching Hubs",
        "call"
      ],
      [
        3,
        2,
        "Return matching Hub results",
        "return"
      ],
      [
        2,
        1,
        "Display matching Hubs",
        "return"
      ],
      [
        0,
        1,
        "Select a Hub",
        "call"
      ]
    ]
  },
  "state": {
    "subject": "Hub search session",
    "states": [
      "Idle",
      "Criteria Entered",
      "Searching Hubs",
      "Results Displayed",
      "Hub Selected"
    ],
    "events": [
      "Start search",
      "Submit criteria",
      "Matches found",
      "Select result"
    ],
    "branches": [
      {
        "from": 2,
        "label": "No matches",
        "name": "No Results",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Search service error",
        "name": "Search Unavailable",
        "returnTo": 1
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
