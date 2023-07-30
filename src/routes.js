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
const StudentTable = React.lazy(() => import('./school_admin_module/StudentTable'))
const SchoolSchedule = React.lazy(() => import('./school_admin_module/SchoolSchedule'))
const UploadTeacher = React.lazy(() => import('./school_admin_module/UploadTeacher')) 
const UploadStudent = React.lazy(() => import('./school_admin_module/UploadStudent')) 
const UploadSchedule = React.lazy(() => import('./school_admin_module/UploadSchedule')) 
const GateAssignment = React.lazy(() => import('./school_admin_module/GateAssignment'))

//Bus vendor
const DashboardBusVendor = React.lazy(() => import('./bus_vendor_module/DashboardBusVendor'))
const DriverTable = React.lazy(() => import('./bus_vendor_module/DriverTable'))
const BusManagementTable = React.lazy(() => import('./bus_vendor_module/BusManagementTable'))
const DriverAssignmentTable = React.lazy(() => import('./bus_vendor_module/DriverAssignmentTable'))
const UploadVehicle = React.lazy(() => import('./bus_vendor_module/UploadVehicle'))
const UploadDriver = React.lazy(() => import('./bus_vendor_module/UploadDriver'))

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
  { path: '/school-admin/students', name: 'Student', element: StudentTable },
  { path: '/school-admin/schedule', name: 'Schedule', element: SchoolSchedule },
  { path: '/school-admin/uploadteacher', name: 'Upload Teacher', element: UploadTeacher },
  { path: '/school-admin/uploadstudent', name: 'Upload Student', element: UploadStudent },
  { path: '/school-admin/uploadschedule', name: 'Upload Schedule', element: UploadSchedule },
  { path: '/school-admin/gateassignment', name: 'Gate Assignment', element: GateAssignment },

  { path: '/bus-vendor/dashboard', name: 'Bus Vendor Dashboard', element: DashboardBusVendor },
  { path: '/bus-vendor/drivers', name: 'Drivers', element: DriverTable },
  { path: '/bus-vendor/busmanagement', name: 'Bus Management', element: BusManagementTable },
  { path: '/bus-vendor/driverassignment', name: 'Driver Assignment', element: DriverAssignmentTable },
  { path: '/bus-vendor/uploadvehicle', name: 'Upload Vehicle', element: UploadVehicle },
  { path: '/bus-vendor/uploaddriver', name: 'Upload Driver', element: UploadDriver },
]

export default routes