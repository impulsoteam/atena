import React from "react"
import PropTypes from "prop-types"
import StyledCard from "./style"
import { Flex, Box } from "@rebass/grid"

const Card = props => {
  const { children, large } = props

  return (
    <StyledCard large={large}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box width={1}>{children}</Box>
      </Flex>
    </StyledCard>
  )
}

Card.propTypes = {
  children: PropTypes.element.isRequired,
  large: PropTypes.boolean
}

export default Card
