import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilPencil,
  cilPeople,
  cilFile,
  cilCalendar,
  cilLockLocked,
  cilRoom,
  cilWindowMaximize,
  cilContact,
  cilTags,
} from '@coreui/icons'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'

const _navSchoolAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/school-admin/dashboard',
    icon: <CIcon icon={cilWindowMaximize} customClassName="nav-icon" />,
  },
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
    component: CNavTitle,
    name: 'Assignments',
  },
  {
    component: CNavItem,
    name: 'Gate',
    to: '/school-admin/gateassignment',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Teacher-Child',
    to: '/school-admin/teacherchildassignment',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Assignments',
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Gate Assignment',
  //       to: '/school-admin/gateassignment',
  //       icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Teacher-Child Allocation',
  //       to: '/school-admin/teacherchildassignment',
  //       icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  //     },
  //   ]
  // },

  {
    component: CNavTitle,
    name: 'Accounts',
  },
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
  // {
  //   component: CNavGroup,
  //   name: 'Accounts',
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Teacher',
  //       to: '/school-admin/teacher',
  //       icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Parent',
  //       to: '/school-admin/parent',
  //       icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Child',
  //       to: '/school-admin/child',
  //       icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //     },
  //   ]
  // },

  {
    component: CNavTitle,
    name: 'Additional',
  },
  {
    component: CNavItem,
    name: 'Gate',
    to: '/school-admin/gate',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Class',
    to: '/school-admin/class',
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Additional',
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Gate',
  //       to: '/school-admin/gate',
  //       icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Class',
  //       to: '/school-admin/class',
  //       icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
  //     },
  //   ]
  // },
]

export default _navSchoolAdmin








