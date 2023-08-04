// import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
// import { AppSidebarNav } from './AppSidebarNav'
// import SimpleBar from 'simplebar-react'
// import 'simplebar/dist/simplebar.min.css'
// import BrandLogo from '../assets/images/brand-logo1.jpg'
// // Import the sidebar of the different actors using the website
// import navigationSystemAdmin from './_navSystemAdmin'
// import navigationSchoolAdmin from './_navSchoolAdmin'
// import navigationVendor from './_navVendor'

// const AppSidebar = () => {
//   const dispatch = useDispatch()
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable)
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   // Get account type from local storage, to know which nav bar to display
//   // Switch case for which sidebar to show
//   const usertype = localStorage.getItem('usertype')
//   let AppSidebarNavItems = null;
//   switch (usertype) {
//     case 'sys-adm':
//       AppSidebarNavItems = <AppSidebarNav items={navigationSystemAdmin} />;
//       break;
//     case 'sch-adm':
//       AppSidebarNavItems = <AppSidebarNav items={navigationSchoolAdmin} />;
//       break;
//     case 'ven':
//       AppSidebarNavItems = <AppSidebarNav items={navigationVendor} />;
//       break;
//     default:
//       AppSidebarNavItems = null;
//   }

//   // const [typeText, setTypeText] = useState('')
//   // useEffect(()=>{
//   //   if (usertype == 'sys-adm') {
//   //     setTypeText('System Admin')
//   //   } else if (usertype == 'sch-adm') {
//   //     setTypeText('School Admin')
//   //   } else if (usertype == 'ven') {
//   //     setTypeText('VENDOR')
//   //   } else {
//   //     setTypeText('Invalid')
//   //   }
//   // },[])

//   return (
//     <CSidebar
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       style={{ backgroundColor: '#56844B' }}
//       onVisibleChange={(visible) => {
//         dispatch({ type: 'set', sidebarShow: visible })
//       }} >
//       <CSidebarBrand 
//         className="d-none d-md-flex"  
//         to="/dashboard" 
//         style={{ backgroundColor: '#56844B', borderBottom: '2px solid #56824B '}}>
//         <img src={BrandLogo} alt="MARSUPIUM" style={{ width: '60%'}} />
//       </CSidebarBrand>
//       {/* <CSidebarBrand style={{ backgroundColor: '#56844B' }}>{typeText}</CSidebarBrand> */}
//       <CSidebarNav>
//         <SimpleBar>
//           {AppSidebarNavItems}
//         </SimpleBar>
//       </CSidebarNav>
//       <CSidebarToggler
//         className="d-none d-lg-flex" 
//         onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}/>
//       {/* <CSidebarToggler
//         className="d-none d-lg-flex"
//         onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })} /> */}
//     </CSidebar>
//   )
// }

// export default React.memo(AppSidebar)

























import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import BrandLogo from '../assets/images/brand-logo1.jpg'
// Import the sidebar of the different actors using the website
import navigationSystemAdmin from './_navSystemAdmin'
import navigationSchoolAdmin from './_navSchoolAdmin'
import navigationVendor from './_navVendor'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Add local state to manage the sidebar visibility
  const [localSidebarShow, setLocalSidebarShow] = useState(() => {
    // When the component is first rendered, read the sidebar state from local storage (if available)
    const storedSidebarShow = localStorage.getItem('sidebarShow');
    return storedSidebarShow ? JSON.parse(storedSidebarShow) : sidebarShow;
  });

  // When the Redux `sidebarShow` state changes, update the local state and local storage
  useEffect(() => {
    setLocalSidebarShow(sidebarShow);
    localStorage.setItem('sidebarShow', JSON.stringify(sidebarShow));
  }, [sidebarShow]);

  // Modify the onVisibleChange event to update the Redux store directly
  const handleSidebarVisibilityChange = (visible) => {
    dispatch({ type: 'set', sidebarShow: visible });
  };

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
    case 'ven':
      AppSidebarNavItems = <AppSidebarNav items={navigationVendor} />;
      break;
    default:
      AppSidebarNavItems = null;
  }

  // const [typeText, setTypeText] = useState('')
  // useEffect(()=>{
  //   if (usertype == 'sys-adm') {
  //     setTypeText('System Admin')
  //   } else if (usertype == 'sch-adm') {
  //     setTypeText('School Admin')
  //   } else if (usertype == 'ven') {
  //     setTypeText('VENDOR')
  //   } else {
  //     setTypeText('Invalid')
  //   }
  // },[])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={localSidebarShow}
      style={{ backgroundColor: '#56844B' }}
      onVisibleChange={(handleSidebarVisibilityChange)}>
      <CSidebarBrand 
        className="d-none d-md-flex"  
        to="/dashboard" 
        style={{ backgroundColor: '#56844B', borderBottom: '2px solid #56824B '}}>
        <img src={BrandLogo} alt="MARSUPIUM" style={{ width: '60%'}} />
      </CSidebarBrand>
      {/* <CSidebarBrand style={{ backgroundColor: '#56844B' }}>{typeText}</CSidebarBrand> */}
      <CSidebarNav>
        <SimpleBar>
          {AppSidebarNavItems}
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex" 
        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}/>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })} /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)