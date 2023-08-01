import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto px-2">
        <p>FYP 2023</p>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
