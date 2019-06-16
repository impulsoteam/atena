import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import StyledTab from './style'

const renderItem = ({ title, content }, index) => (
  <a key={index} href="javascript:;" className="tab__item">
    <span className="tab__title">{title}</span>
    <div className="tab__content">{content}</div>
  </a>
)

const renderItems = data => data.map((item, index) => renderItem(item, index))

const Tab = ({ data }) => (
  <StyledTab>
    <Fragment>{renderItems(data)}</Fragment>
  </StyledTab>
)

renderItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired
}

Tab.propTypes = {
  data: PropTypes.array.isRequired
}

export default Tab
