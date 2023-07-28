import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSchool,
  cilPeople,
} from '@coreui/icons'
import { CNavItem, CNavGroup  } from '@coreui/react'

const _navSystemAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/system-admin/dashboard',
  },

  {
    component: CNavGroup,
    name: 'Pickup records',
    items: [
      {
        component: CNavItem,
        name: 'Self pickups',
        to: '/sys-adm/selfpickupoverview',
      },
      {
        component: CNavItem,
        name: 'Vehicle pickups',
        to: '/sys-adm/vehiclepickupoverview',
      },
    ]
  },

  {
    component: CNavGroup,
    name: 'Accounts',
    to: '/',

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
        to: '/system-admin/company',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navSystemAdmin