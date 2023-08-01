import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSchool,
  cilPeople,
  cilContact,
  cilTouchApp,
  cilBusAlt,
  cilWalk,
  cilWindowMaximize,
} from '@coreui/icons'
import { CNavItem, CNavGroup  } from '@coreui/react'

const _navSystemAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/system-admin/dashboard',
    icon: <CIcon icon={cilWindowMaximize} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Pickup records',
    // icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Self pickups',
        to: '/system-adm/selfpickupoverview',
        icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Vehicle pickups',
        to: '/system-adm/vehiclepickupoverview',
        icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
      },
    ]
  },

  {
    component: CNavGroup,
    name: 'Accounts',
    // icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'School',
        to: '/system-admin/school',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Vendor',
        to: '/system-admin/vendor',
        icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navSystemAdmin