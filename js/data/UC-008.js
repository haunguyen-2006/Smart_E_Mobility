/* UC-008: Return a Shared Vehicle
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-008",
  "name": "Return a Shared Vehicle",
  "actor": "Student",
  "goal": "The student completes a trip by returning a shared electric vehicle to a Hub that can accept it.",
  "preconditions": "• The student is logged in. | • The student has an active trip and the vehicle is marked as “In Use”.",
  "trigger": "The student arrives at a Hub and selects “Return a Shared Vehicle”.",
  "postconditions": "The return is recorded, the trip is completed, and the vehicle status is updated according to its recorded condition.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• A vehicle may be returned only when it is associated with an active trip. | • The system must not complete a return until the return location and resource state are accepted and the return is recorded. | • A vehicle status must reflect its recorded condition after return.",
  "assumptions": "Hub parking capacity and vehicle status can be represented by real or simulated data.",
  "steps": [
    {
      "n": 1,
      "text": "The student selects “Return a Shared Vehicle” for the active trip."
    },
    {
      "n": 2,
      "text": "The system displays the trip details and asks the student to select or confirm the return Hub."
    },
    {
      "n": 3,
      "text": "The system verifies the active trip and checks whether the selected Hub can accept the vehicle."
    },
    {
      "n": 4,
      "text": "The student confirms the return."
    },
    {
      "n": 5,
      "text": "The system records the return, completes the trip, and updates the vehicle status according to its condition."
    },
    {
      "n": 6,
      "text": "The system displays the return confirmation and trip summary."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Selected Hub has no available capacity",
      "description": "The system informs the student and suggests alternative Hubs with available capacity, if any. The student selects another Hub and the system checks it before the return. If no suitable Hub is available, the trip remains active and the student is directed to contact the Operator or follow the approved return procedure."
    },
    {
      "code": "A2",
      "title": "Student cancels before confirming the return",
      "description": "The system returns to the active-trip screen. The trip remains active and the return is not recorded."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Active trip or vehicle cannot be verified",
      "description": "The system informs the student that the return cannot be verified and does not complete the trip."
    },
    {
      "code": "E2",
      "title": "Return status update fails",
      "description": "The system displays a failure message and does not report the trip as completed. The student may retry or contact the Operator."
    }
  ],
  "sourceTitle": "UC-008: Return a Shared Vehicle",
  "category": "Vehicle Services",
  "decisionIndex": 2,
  "decisionText": "Can the Hub accept the vehicle?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Return Service",
      "Trip & Hub Capacity Records"
    ],
    "messages": [
      [
        0,
        1,
        "Select Return a Shared Vehicle",
        "call"
      ],
      [
        1,
        2,
        "Request active trip and return options",
        "call"
      ],
      [
        2,
        3,
        "Retrieve trip and Hub capacity",
        "call"
      ],
      [
        3,
        2,
        "Return trip and capacity status",
        "return"
      ],
      [
        2,
        1,
        "Display trip and return Hub options",
        "return"
      ],
      [
        0,
        1,
        "Select or confirm return Hub",
        "call"
      ],
      [
        1,
        2,
        "Validate active trip and Hub capacity",
        "call"
      ],
      [
        2,
        1,
        "Confirm Hub can accept vehicle or suggest alternatives",
        "return"
      ],
      [
        0,
        1,
        "Confirm return",
        "call"
      ],
      [
        1,
        2,
        "Record return and complete trip",
        "call"
      ],
      [
        2,
        3,
        "Update vehicle state and return record",
        "call"
      ],
      [
        3,
        2,
        "Return saved result",
        "return"
      ],
      [
        2,
        1,
        "Return confirmation and trip summary",
        "return"
      ],
      [
        1,
        0,
        "Display return result",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Vehicle return / trip lifecycle",
    "states": [
      "Trip Active",
      "Return Requested",
      "Hub Capacity Checked",
      "Return Recorded",
      "Trip Completed"
    ],
    "events": [
      "Request return",
      "Check destination capacity",
      "Capacity accepted",
      "Persist return"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Hub full",
        "name": "Alternative Hub Required",
        "returnTo": 1
      },
      {
        "from": 1,
        "label": "Cancel return",
        "name": "Trip Still Active",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Record update fails",
        "name": "Return Not Completed",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
