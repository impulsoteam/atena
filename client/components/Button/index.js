import React from 'react'
import PropTypes from 'prop-types'
import StyledButton from './style'

const Button = ({ children }) => <StyledButton>{children}</StyledButton>

Button.propTypes = {
  children: PropTypes.element.isRequired
}

export default Button
