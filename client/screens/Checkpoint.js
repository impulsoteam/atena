import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import Layout from 'Layout'
import StyledScreenCheckpoint from './Checkpoint.style'
import FullPage from '../components/FullPage'
import Title from 'components/Title'

const rewards = ({ data = [] }) =>
  data.map((reward, index) => (
    <Fragment key={index}>
      <span>{reward}</span>
      <br />
      <br />
    </Fragment>
  ))

const ScreenCheckpoint = ({ data = [], ...props }) => (
  <StyledScreenCheckpoint>
    <Layout {...props}>
      <FullPage height="40" overlay>
        <Flex alignItems="baseline" justifyContent="center" flex="1">
          <Box>
            <Title large color="white" align="center">
              Checkpoint
            </Title>
          </Box>
        </Flex>
      </FullPage>
      <div className="_inner">
        <a href="/checkpoints/novo">Novo</a>
        <ul>
          <li>Level | XP | Total Engaged Users | Recompensas | Ações</li>
          {data.map((item, index) => (
            <li key={index}>
              {item.level} | {item.xp} | {item.totalEngagedUsers} |{' '}
              {rewards({ data: item.rewards })} |{' '}
              <a href={`/checkpoints/editar/${item._id}`}>Editar</a>
              <a href={`/checkpoints/apagar/${item._id}`}>Apagar</a>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  </StyledScreenCheckpoint>
)

ScreenCheckpoint.propTypes = {
  data: PropTypes.array
}

export default ScreenCheckpoint
