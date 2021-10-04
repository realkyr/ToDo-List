import { useEffect, useState } from 'react'
import {
  Typography,
  Layout,
  Row,
  Col,
  Input,
  Button,
  Collapse,
  Spin,
  message,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'

// import './App.css'
import './app.scss'

const { Title } = Typography
const { Content } = Layout
const { Panel } = Collapse

function App() {
  const [data, setData] = useState([])
  const [edit, setEdit] = useState([])
  const [task, setTask] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isAddLoading, setAddLoading] = useState(false)

  useEffect(() => {
    const didMount = async () => {
      setLoading(true)
      const data = await axios.get(
        'https://602dd56696eaad00176dcd53.mockapi.io/api/v1/to-do',
      )
      setData(data.data)
      setLoading(false)
    }

    didMount()
  }, [])

  const udBtn = (i) => (
    <Row className='update-delete-console' gutter={[16, 16]}>
      <Col span={12}>
        <EditOutlined
          className='edit'
          onClick={(event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation()
            const tmpdata = [...edit]

            tmpdata[i] = !Boolean(tmpdata[i])
            setEdit(tmpdata)
          }}
        />
      </Col>

      <Col span={12}>
        <DeleteOutlined
          className='delete'
          onClick={(event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation()

            const tmpdata = [...data]

            tmpdata.splice(i, 1)
            setData(tmpdata)
          }}
        />
      </Col>
    </Row>
  )

  const onEdit = (text, id) => {
    const tmpdata = [...data]
    const index = tmpdata.findIndex((el) => el.id === id)

    tmpdata[index].task = text
    setData(tmpdata)
  }

  const addTask = async () => {
    setAddLoading(true)
    try {
      const response = await axios.post(
        'https://602dd56696eaad00176dcd53.mockapi.io/api/v1/to-do',
        {
          task,
          note,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      message.success('Task add successful!')

      const tmpdata = [...data, response.data]

      setNote('')
      setTask('')
      setAddLoading(false)
      setData(tmpdata)
    } catch (error) {
      message.error('Add Task Failed')
      setAddLoading(false)
    }
  }

  const taskList = [...data].reverse()

  return (
    <Layout style={{ padding: '0 10px' }}>
      <Content className='App'>
        <Title level={1}>To-do List</Title>

        <Row gutter={[16, 16]}>
          <Col span={10}>
            <Input
              className='my-input'
              value={task}
              onPressEnter={addTask}
              onChange={(e) => setTask(e.target.value)}
              placeholder='task'
            />
          </Col>

          <Col span={10}>
            <Input
              className='my-input'
              value={note}
              onPressEnter={addTask}
              onChange={(e) => setNote(e.target.value)}
              placeholder='note'
            />
          </Col>

          <Col span={4}>
            <Button className='my-btn' onClick={addTask}>
              {isAddLoading ? <Spin /> : 'Add'}
            </Button>
          </Col>

          <Col span={24}>
            {isLoading ? (
              <Spin />
            ) : (
              <Collapse>
                {taskList.map((d, i) => (
                  <Panel
                    className='my-panel'
                    key={d.id}
                    header={
                      edit[i] ? (
                        <Input
                          className='my-input'
                          onClick={(e) => e.stopPropagation()}
                          defaultValue={d.task}
                          onPressEnter={() => {
                            const tmpdata = [...edit]

                            tmpdata[i] = !Boolean(tmpdata[i])
                            setEdit(tmpdata)
                          }}
                          onChange={(e) => onEdit(e.target.value, d.id)}
                        />
                      ) : (
                        `${i + 1}. ${d.task}`
                      )
                    }
                    extra={udBtn(i)}
                  >
                    <div>{d.note}</div>
                  </Panel>
                ))}
              </Collapse>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default App
