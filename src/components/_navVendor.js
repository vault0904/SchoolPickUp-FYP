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

const _navVendor = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/vendor/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assignments',
    to: '/vendor/driverassignment',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Accounts',
    items: [
      {
        component: CNavItem,
        name: 'Driver',
        to: '/vendor/drivers',
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
        to: '/vendor/vehicletable',
        icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navVendor