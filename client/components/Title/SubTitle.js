import React from 'react'
import PropTypes from 'prop-types'
import StyledSubTitle from './SubTitle.style'

const SubTitle = props => {
  const { children } = props

  return <StyledSubTitle>{children}</StyledSubTitle>
}

SubTitle.propTypes = {
  children: PropTypes.string.isRequired
}

export default SubTitle
