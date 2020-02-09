import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMemory, deleteMemory, getMemories, updateMemory } from '../api/memories-api'
import Auth from '../auth/Auth'
import { MemoryItem } from '../../../backend/src/models/memoryItem'

interface MemoriesProps {
  auth: Auth
  history: History
}

interface MemoriesState {
  memories: MemoryItem[]
  newMemoryName: string,
  loadingMemories: boolean
}

export class Memories extends React.PureComponent<MemoriesProps, MemoriesState> {
  state: MemoriesState = {
    memories: [],
    newMemoryName: '',
    loadingMemories: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMemoryName: event.target.value })
  }

  onEditButtonClick = (timeStamp: string) => {
    this.props.history.push(`/memories/${timeStamp}/edit`)
  }

  onMemoryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newMemory = await createMemory(this.props.auth.getIdToken(), {
        date: new Date().toDateString(),
        title: this.state.newMemoryName,
      })
      this.setState({
        memories: [...this.state.memories, newMemory],
        newMemoryName: ''
      })
    } catch {
      alert('Memory creation failed -- hold on!')
    }
  }

  onMemoryDelete = async (timeStamp: string) => {
    try {
      await deleteMemory(this.props.auth.getIdToken(), timeStamp)
      this.setState({
        memories: this.state.memories.filter(memory => memory.timeStamp !== timeStamp)
      })
    } catch {
      alert('Memory deletion failed!')
    }
  }

  onMemoryVisit = async (pos: number) => {
    try {
      const memory = this.state.memories[pos]
      console.log('memory in visit:', memory)
      await updateMemory(this.props.auth.getIdToken(), memory.timeStamp, {
        revisited: !memory.revisited
      })
      this.setState({
        memories: update(this.state.memories, {
          [pos]: { revisited: { $set: !memory.revisited } }
        })
      })
    } catch {
      alert('Memory revisiting failed')
    }
  }

  async componentDidMount() {
    try {
      const memories = await getMemories(this.props.auth.getIdToken())
      this.setState({
        memories,
        loadingMemories: false
      })
    } catch (e) {
      alert(`Failed to fetch memories: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Your memories</Header>

        {this.renderCreateMemoryInput()}

        {this.renderMemories()}
      </div>
    )
  }

  renderCreateMemoryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New memory',
              onClick: this.onMemoryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="The most wonderful day today..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderMemories() {
    if (this.state.loadingMemories) {
      return this.renderLoading()
    }

    return this.renderMemoriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Memories
        </Loader>
      </Grid.Row>
    )
  }

  renderMemoriesList() {
    return (
      <Grid padded>
        {this.state.memories.map((memory, pos) => {
          return (
            <Grid.Row key={memory.timeStamp}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onMemoryVisit(pos)}
                  checked={memory.revisited}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {memory.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {memory.date}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(memory.timeStamp)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMemoryDelete(memory.timeStamp)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {memory.imageURL && (
                <Image src={memory.imageURL} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
