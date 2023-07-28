import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilPencil,
  cilPeople,
  cilFile,
  cilCalendar,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navSchoolAdmin = [
  //CoreUI open source SVG -> https://coreui.io/icons/all/
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/school-admin/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Announcements',
    to: '/school-admin/announcements',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Teacher',
    to: '/school-admin/teachers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Student',
    to: '/school-admin/students',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },

  {
  component: CNavItem,
  name: 'Schedule',
  to: '/school-admin/schedule',
  icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
]

export default _navSchoolAdmin