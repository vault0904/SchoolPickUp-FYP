import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import BrandLogo from '../assets/images/brand-logo1.jpg'
// Import the sidebar of the different actors using the website
import navigationSystemAdmin from './_navSystemAdmin'
import navigationSchoolAdmin from './_navSchoolAdmin'
import navigationBusVendor from './_navBusVendor'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Get account type from local storage, to know which nav bar to display
  // Switch case for which sidebar to show
  const usertype = localStorage.getItem('usertype')
  let AppSidebarNavItems = null;
  switch (usertype) {
    case 'sys-adm':
      AppSidebarNavItems = <AppSidebarNav items={navigationSystemAdmin} />;
      break;
    case 'sch-adm':
      AppSidebarNavItems = <AppSidebarNav items={navigationSchoolAdmin} />;
      break;
    case 'bus-ven':
      AppSidebarNavItems = <AppSidebarNav items={navigationBusVendor} />;
      break;
    default:
      AppSidebarNavItems = null;
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{ backgroundColor: '#56844B' }}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }} >
      <CSidebarBrand 
        className="d-none d-md-flex" 
        to="/dashboard" 
        style={{ backgroundColor: '#56844B' }}>
        <img src={BrandLogo} alt="MARSUPIUM" style={{ width: '60%'}} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {AppSidebarNavItems}
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)