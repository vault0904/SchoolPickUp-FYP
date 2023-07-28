import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHamburgerMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './index'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1" 
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })} >
          <CIcon 
            icon={cilHamburgerMenu} 
            size="lg" 
            style={{color: '#56844B'}} />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/" />
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
