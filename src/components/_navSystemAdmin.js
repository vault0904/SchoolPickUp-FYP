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
  cilGroup,
  cilTags,
} from '@coreui/icons'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'

const _navSystemAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/system-admin/dashboard',
    icon: <CIcon icon={cilWindowMaximize} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscribers',
    to: '/system-admin/managesubscribers',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Assignments',
  },
  {
    component: CNavItem,
    name: 'School-Vendor',
    to: '/system-admin/schoolvendorassignment',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Pickup records',
  },
  {
    component: CNavItem,
    name: 'Self pickups',
    to: '/system-admin/selfpickuprecords',
    icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vehicle pickups',
    to: '/system-admin/vehiclepickuprecords',
    icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Pickup records',
  //   // icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Self pickups',
  //       to: '/system-adm/selfpickupoverview',
  //       icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Vehicle pickups',
  //       to: '/system-adm/vehiclepickupoverview',
  //       icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
  //     },
  //   ]
  // },

  {
    component: CNavTitle,
    name: 'Accounts',
  },
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
  // {
  //   component: CNavGroup,
  //   name: 'Accounts',
  //   // icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'School',
  //       to: '/system-admin/school',
  //       icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Vendor',
  //       to: '/system-admin/vendor',
  //       icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  //     },
  //   ]
  // },
]

export default _navSystemAdmin