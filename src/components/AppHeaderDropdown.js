import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilPenAlt,
  cilSettings,
  cilEnvelopeOpen,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Avatar from '../assets/images/defaultavatar.jpg'
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const redirectToProfile = (userid,usertype) => {
    // post userid to url
    // redirect to editprofile page
    navigate(`/editprofile?id=${userid}&type=${usertype}`)
  }

  const handleSignOut = () => {
    // clear local storage
    // redirect back to login page
    localStorage.clear(); 
    navigate('/')
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={Avatar} size="sm" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
          <CDropdownItem onClick={() => redirectToProfile(localStorage.getItem('userid'), localStorage.getItem('usertype'))}>
            <CIcon icon={cilPenAlt} className="me-2" />
            Edit Profile
          </CDropdownItem>
          <CDropdownItem>
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages (Chat function)
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={handleSignOut}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Sign out
          </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown