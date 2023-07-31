import React from 'react'

//Common
const Login = React.lazy(() => import('./common/Login'))
const EditProfile = React.lazy(() => import('./common/EditProfile'))

//Sys admin
const DashboardSystemAdmin = React.lazy(() => import('./system_admin_module/DashboardSystemAdmin'))
const SchoolTable = React.lazy(() => import('./system_admin_module/SchoolTable'))
const SchoolTableViewAdmins = React.lazy(() => import('./system_admin_module/SchoolTableViewAdmins'))
const CompanyTable = React.lazy(() => import('./system_admin_module/CompanyTable'))
const CompanyTableViewDrivers = React.lazy(() => import('./system_admin_module/CompanyTableViewDrivers'))

//Sch admin
const DashboardSchoolAdmin = React.lazy(() => import('./school_admin_module/DashboardSchoolAdmin'))
const AnnouncementTable = React.lazy(() => import('./school_admin_module/AnnouncementTable'))
const TeacherTable = React.lazy(() => import('./school_admin_module/TeacherTable'))
const ChildTable = React.lazy(() => import('./school_admin_module/ChildTable'))
const SchoolSchedule = React.lazy(() => import('./school_admin_module/SchoolSchedule'))
const UploadTeacher = React.lazy(() => import('./school_admin_module/UploadTeacher')) 
const UploadChild = React.lazy(() => import('./school_admin_module/UploadChild')) 
const UploadSchedule = React.lazy(() => import('./school_admin_module/UploadSchedule')) 
const GateAssignment = React.lazy(() => import('./school_admin_module/GateAssignment'))

//Vendor
const DashboardVendor = React.lazy(() => import('./vendor_module/DashboardVendor'))
const DriverTable = React.lazy(() => import('./vendor_module/DriverTable'))
const VehicleTable = React.lazy(() => import('./vendor_module/VehicleTable'))
const DriverAssignment = React.lazy(() => import('./vendor_module/DriverAssignment'))
const UploadVehicle = React.lazy(() => import('./vendor_module/UploadVehicle'))
const UploadDriver = React.lazy(() => import('./vendor_module/UploadDriver'))

const routes = [
  { path: '/', exact: true, name: 'Login', element: Login },
  { path: '/editprofile', exact: true, name: 'Edit Profile', element: EditProfile },

  { path: '/system-admin/dashboard', name: 'System Admin Dashboard', element: DashboardSystemAdmin },
  { path: '/system-admin/school', name: 'SchoolTable', element: SchoolTable },
  { path: '/system-admin/school/viewadmins', name: 'SchoolTableViewAdmins', element: SchoolTableViewAdmins },
  { path: '/system-admin/company', name: 'CompanyTable', element: CompanyTable },
  { path: '/system-admin/company/viewdrivers', name: 'CompanyTableViewDrivers', element: CompanyTableViewDrivers },

  { path: '/school-admin/dashboard', name: 'School Admin Dashboard', element: DashboardSchoolAdmin },
  { path: '/school-admin/announcements', name: 'Announcements', element: AnnouncementTable },
  { path: '/school-admin/teachers', name: 'Teacher', element: TeacherTable },
  { path: '/school-admin/child', name: 'Child', element: ChildTable },
  { path: '/school-admin/schedule', name: 'Schedule', element: SchoolSchedule },
  { path: '/school-admin/uploadteacher', name: 'Upload Teacher', element: UploadTeacher },
  { path: '/school-admin/uploadchild', name: 'Upload Child', element: UploadChild },
  { path: '/school-admin/uploadschedule', name: 'Upload Schedule', element: UploadSchedule },
  { path: '/school-admin/gateassignment', name: 'Gate Assignment', element: GateAssignment },

  { path: '/vendor/dashboard', name: 'Vendor Dashboard', element: DashboardVendor },
  { path: '/vendor/drivers', name: 'Drivers', element: DriverTable },
  { path: '/vendor/vehicletable', name: 'Vehicle Management', element: VehicleTable },
  { path: '/vendor/driverassignment', name: 'Driver Assignment', element: DriverAssignment },
  { path: '/vendor/uploadvehicle', name: 'Upload Vehicle', element: UploadVehicle },
  { path: '/vendor/uploaddriver', name: 'Upload Driver', element: UploadDriver },
]

export default routes