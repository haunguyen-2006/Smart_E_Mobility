/* UC-007: Pickup Shared Vehicle
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-007",
  "name": "Pickup Shared Vehicle",
  "actor": "Student",
  "goal": "The student collects the shared vehicle associated with a valid reservation and starts the trip.",
  "preconditions": "• The student is logged in. | • The student has a valid reservation for the shared vehicle. | • The reserved vehicle is available at the assigned pickup Hub.",
  "trigger": "The student selects “Pickup Shared Vehicle” for an active reservation.",
  "postconditions": "The pickup is recorded, the vehicle status changes to “In Use”, and trip-start confirmation is displayed.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only the student associated with a valid reservation may pick up the vehicle. | • Pickup must not be confirmed if the reservation or vehicle status cannot be verified.",
  "assumptions": "The system can match the reservation to the student, vehicle, and pickup Hub. Physical unlocking hardware is outside this use case unless separately specified.",
  "steps": [
    {
      "n": 1,
      "text": "The student opens the relevant booking and selects “Pickup Shared Vehicle”."
    },
    {
      "n": 2,
      "text": "The system displays the reservation and pickup details."
    },
    {
      "n": 3,
      "text": "The system verifies that the reservation is valid and the vehicle is available for pickup."
    },
    {
      "n": 4,
      "text": "The student confirms the pickup."
    },
    {
      "n": 5,
      "text": "The system records the pickup and changes the vehicle status to “In Use”."
    },
    {
      "n": 6,
      "text": "The system displays confirmation that the trip has started."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "Student postpones pickup",
      "description": "Before confirming pickup, the student returns to the booking details. The reservation remains unchanged and the trip does not start."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "No valid reservation is found",
      "description": "The system informs the student that no valid reservation can be found and does not start the trip."
    },
    {
      "code": "E2",
      "title": "Reserved vehicle is unavailable",
      "description": "The system rejects the pickup and informs the student that the vehicle cannot be collected. The student may review the booking or seek assistance."
    },
    {
      "code": "E3",
      "title": "Pickup status cannot be saved",
      "description": "The system displays an error and does not show the trip as successfully started."
    }
  ],
  "sourceTitle": "UC-007: Pickup Shared Vehicle",
  "category": "Vehicle Services",
  "decisionIndex": 2,
  "decisionText": "Is the reservation and vehicle valid?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Pickup Service",
      "Booking & Vehicle State"
    ],
    "messages": [
      [
        0,
        1,
        "Open booking and select Pickup Shared Vehicle",
        "call"
      ],
      [
        1,
        2,
        "Request reservation and pickup details",
        "call"
      ],
      [
        2,
        3,
        "Verify reservation and vehicle status",
        "call"
      ],
      [
        3,
        2,
        "Return verification result",
        "return"
      ],
      [
        2,
        1,
        "Display pickup details",
        "return"
      ],
      [
        0,
        1,
        "Confirm pickup",
        "call"
      ],
      [
        1,
        2,
        "Record pickup request",
        "call"
      ],
      [
        2,
        3,
        "Update vehicle status to In Use",
        "call"
      ],
      [
        3,
        2,
        "Confirm pickup record",
        "return"
      ],
      [
        2,
        1,
        "Return trip-start result",
        "return"
      ],
      [
        1,
        0,
        "Display trip-start confirmation",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Pickup / trip lifecycle",
    "states": [
      "Reservation Active",
      "Pickup Requested",
      "Pickup Verified",
      "Vehicle In Use",
      "Trip Active"
    ],
    "events": [
      "Request pickup",
      "Reservation and vehicle valid",
      "Record pickup",
      "Trip begins"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Reservation invalid",
        "name": "Pickup Rejected",
        "returnTo": 0
      },
      {
        "from": 2,
        "label": "Vehicle unavailable",
        "name": "Pickup Blocked",
        "returnTo": 0
      },
      {
        "from": 1,
        "label": "Postpone pickup",
        "name": "Pickup Deferred",
        "returnTo": 0
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
