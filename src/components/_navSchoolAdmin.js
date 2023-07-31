import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilPencil,
  cilPeople,
  cilFile,
  cilCalendar,
} from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _navSchoolAdmin = [
  

  {
    component: CNavItem,
    name: 'Announcements',
    to: '/school-admin/announcements',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Schedule',
    to: '/school-admin/schedule',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assignments',
    to: '/school-admin/gateassignment',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Accounts',
    items: [
      {
        component: CNavItem,
        name: 'Teacher',
        to: '/school-admin/teacher',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Parent',
        to: '/school-admin/parent',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Child',
        to: '/school-admin/child',
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
        name: 'Gate',
        to: '/school-admin/gate',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Class',
        to: '/school-admin/class',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navSchoolAdmin








