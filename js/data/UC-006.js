/* UC-006: Book Shared Vehicle
 * Edit this file to update only this Use Case's data.
 */
window.SMART_MOBILITY_UCS.push({
  "id": "UC-006",
  "name": "Book Shared Vehicle",
  "actor": "Student",
  "goal": "The student reserves an available shared electric vehicle at a selected Mobility Hub.",
  "preconditions": "• The student is logged in. | • Hub and shared-vehicle information is available. | • A suitable vehicle is available for booking.",
  "trigger": "The student selects “Book Shared Vehicle”, including from a selected Hub’s status view where supported.",
  "postconditions": "The reservation is created, the selected vehicle is marked as “Reserved”, and confirmation details are displayed.",
  "stakeholders": "Student, Real-time Operations Operator, VNU-HCM Management",
  "priority": "High",
  "businessRules": "• Only a currently available vehicle may be reserved. | • The system must verify availability before confirming a booking. | • A cancelled or failed booking must not leave an unintended active reservation.",
  "assumptions": "Vehicle status and battery-level information is updated using near-real-time sensor or simulated data.",
  "steps": [
    {
      "n": 1,
      "text": "The student opens “Book Shared Vehicle” and selects a pickup Hub."
    },
    {
      "n": 2,
      "text": "The system displays shared vehicles available at that Hub, including their current status and battery levels."
    },
    {
      "n": 3,
      "text": "The student selects a suitable vehicle."
    },
    {
      "n": 4,
      "text": "The system verifies that the selected vehicle is still available."
    },
    {
      "n": 5,
      "text": "The system creates the reservation and changes the vehicle status to “Reserved”."
    },
    {
      "n": 6,
      "text": "The system displays the booking confirmation and reservation details."
    }
  ],
  "alternatives": [
    {
      "code": "A1",
      "title": "No suitable vehicle at the selected Hub",
      "description": "The system informs the student that no suitable vehicle is available. The student may select another Hub and repeat the search, or cancel without creating a reservation."
    },
    {
      "code": "A2",
      "title": "Student cancels before confirmation",
      "description": "The student cancels the booking before confirmation. The system ends the process without creating a reservation."
    }
  ],
  "exceptions": [
    {
      "code": "E1",
      "title": "Vehicle availability cannot be verified",
      "description": "If current vehicle status cannot be retrieved, the system informs the student and does not confirm the booking using unverified information. The student may retry."
    },
    {
      "code": "E2",
      "title": "Vehicle becomes unavailable",
      "description": "If another booking makes the selected vehicle unavailable, the system rejects the request and lets the student choose another vehicle."
    },
    {
      "code": "E3",
      "title": "Reservation creation fails",
      "description": "The system displays a failure message and ensures that the vehicle is not incorrectly marked as “Reserved”."
    }
  ],
  "sourceTitle": "UC-006: Book Shared Vehicle",
  "category": "Vehicle Services",
  "decisionIndex": 3,
  "decisionText": "Is the vehicle still available?",
  "sequence": {
    "parts": [
      "Student",
      "Application UI",
      "Booking Service",
      "Vehicle & Booking Records"
    ],
    "messages": [
      [
        0,
        1,
        "Open Book Shared Vehicle and select pickup Hub",
        "call"
      ],
      [
        1,
        2,
        "Request available vehicles",
        "call"
      ],
      [
        2,
        3,
        "Retrieve vehicle status and battery levels",
        "call"
      ],
      [
        3,
        2,
        "Return available vehicle list",
        "return"
      ],
      [
        2,
        1,
        "Display vehicles",
        "return"
      ],
      [
        0,
        1,
        "Select a suitable vehicle",
        "call"
      ],
      [
        1,
        2,
        "Request booking",
        "call"
      ],
      [
        2,
        3,
        "Recheck current vehicle availability",
        "call"
      ],
      [
        3,
        2,
        "Return availability result",
        "return"
      ],
      [
        2,
        3,
        "Create reservation and mark vehicle Reserved",
        "call"
      ],
      [
        3,
        2,
        "Return booking record",
        "return"
      ],
      [
        2,
        1,
        "Return booking confirmation",
        "return"
      ],
      [
        1,
        0,
        "Display reservation details",
        "return"
      ]
    ]
  },
  "state": {
    "subject": "Shared-vehicle booking",
    "states": [
      "Hub Selected",
      "Vehicle Selected",
      "Checking Availability",
      "Reservation Created",
      "Vehicle Reserved"
    ],
    "events": [
      "Select vehicle",
      "Check current state",
      "Availability confirmed",
      "Set status Reserved"
    ],
    "branches": [
      {
        "from": 2,
        "label": "Vehicle no longer available",
        "name": "Vehicle Unavailable",
        "returnTo": 1
      },
      {
        "from": 2,
        "label": "Reservation save fails",
        "name": "Booking Failed",
        "returnTo": 1
      },
      {
        "from": 1,
        "label": "Cancel before confirmation",
        "name": "Booking Cancelled",
        "terminal": true
      }
    ]
  },
  "stateNote": "Logical workflow-state model inferred from the approved scenario. It is not a claim that every displayed state is a stored database status."
});
