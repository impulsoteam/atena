import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import Layout from 'Layout'
import FullPage from '../components/FullPage'
import Title from 'components/Title'

const ScreenNewCheckpoint = () => (
  <Layout>
    <FullPage height="40" overlay>
      <Flex alignItems="baseline" justifyContent="center" flex="1">
        <Box>
          <Title large color="white" align="center">
            Checkpoints
          </Title>
        </Box>
      </Flex>
    </FullPage>
    <div className="_inner">
      <a href="/checkpoints">Lista</a>
      <form action="/checkpoints/save" method="post">
        <fieldset>
          <label htmlFor="Level">Nível </label>
          <input name="level" type="text" />
          <br />
          <br />
          <label htmlFor="xp">XP </label>
          <input name="xp" type="text" />
          <br />
          <br />
          <label htmlFor="totalEngagedUsers">
            Total de Usuários Engajados{' '}
          </label>
          <input name="totalEngagedUsers" type="text" />
          <br />
          <br />
          <label htmlFor="rewards">Recompensas: </label>
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input name="rewards[]" type="text" />
          <br />
          <br />
          <input type="submit" value="Salvar" />
        </fieldset>
      </form>
    </div>
  </Layout>
)

ScreenNewCheckpoint.propTypes = {
  data: PropTypes.array
}

export default ScreenNewCheckpoint
