// https://coreui.io/react/docs/components/modal/
import React from 'react';
import { CModal, CButton, CModalHeader, CModalTitle, CModalBody, CModalFooter} from '@coreui/react';

const ConfirmationModal = ({ visible, onClose, onConfirm, callingComponent }) => {
  if (callingComponent === 'SchoolTable') {
    return (
      // Modal for SchoolTable
      <CModal scrollable visible={visible} onClose={onClose} >   
        <CModalHeader>
          <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this school?</p>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={onConfirm} color="light">Confirm</CButton>
          <CButton onClick={onClose} color="secondary">Cancel</CButton>
        </CModalFooter>
      </CModal>
    );
  } else if (callingComponent === 'SchoolTableViewAdmins') {
    return (
      // Modal for SchoolTableViewAdmins
      <CModal scrollable visible={visible} onClose={onClose} >   
        <CModalHeader>
          <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this admin?</p>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={onConfirm} color="light">Confirm</CButton>
          <CButton onClick={onClose} color="secondary">Cancel</CButton>
        </CModalFooter>
      </CModal>
    );
  } else if (callingComponent === 'CompanyTable') {
    return (
      // Modal for CompanyTable
      <CModal scrollable visible={visible} onClose={onClose} >   
        <CModalHeader>
          <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this vendor?</p>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={onConfirm} color="light">Confirm</CButton>
          <CButton onClick={onClose} color="secondary">Cancel</CButton>
        </CModalFooter>
      </CModal>
    );
  } else if (callingComponent === 'CompanyTableViewDrivers') {
    return (
      // Modal for CompanyTableViewDrivers
      <CModal scrollable visible={visible} onClose={onClose} >   
        <CModalHeader>
          <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this driver?</p>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={onConfirm} color="light">Confirm</CButton>
          <CButton onClick={onClose} color="secondary">Cancel</CButton>
        </CModalFooter>
      </CModal>
    );
  }
  
  else {
    // Default fallback rendering
    return null;
  }
};

export default ConfirmationModal;