import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome, 
  cilPeople,
  cilBusAlt,
  cilTask,
  cilPencil,
} from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _navBusVendor = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/bus-vendor/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assignments',
    to: '/bus-vendor/driverassignment',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Accounts',
    items: [
      {
        component: CNavItem,
        name: 'Driver',
        to: '/bus-vendor/drivers',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
    ]
  },

  {
    component: CNavGroup,
    name: 'Additional',
    items: [
      {
        component: CNavItem,
        name: 'Vehicle',
        to: '/bus-vendor/busmanagement',
        icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navBusVendor