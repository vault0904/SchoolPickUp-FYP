import React from 'react'

export default function DashboardSchoolAdmin() {
  const firstname = localStorage.getItem('firstname').toUpperCase();
  const lastname = localStorage.getItem('lastname').toUpperCase();

  return( 
    <div>
      <p style={{color: '#56844B', fontWeight: 'bold'}}>
        Welcome, SCHOOL ADMIN {firstname} {lastname}
      </p> 
    </div>
  )
}