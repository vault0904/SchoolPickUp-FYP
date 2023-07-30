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
    name: 'Announcement',
    to: '/school-admin/announcements',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Schedules',
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
        to: '/school-admin/teachers',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Parent',
        to: '/sys-adm/buspickupoverview',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Student',
        to: '/school-admin/students',
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
        to: '/sys-adm/selfpickupoverview',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Form class',
        to: '/sys-adm/buspickupoverview',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
    ]
  },
]

export default _navSchoolAdmin








