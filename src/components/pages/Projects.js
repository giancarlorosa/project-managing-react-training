import {useLocation, userLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'

import styles from './Projects.module.css'

import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import Message from '../layout/Message'
import ProjectCard from '../project/ProjectCard'
import Loading from '../layout/Loading'

function Projects() {
  const [projects, setProject] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')
  const location = useLocation()
  const fakeLoading = Math.random() * (3000 - 300) + 300
  let message = ''

  if (location.state) {
    message = location.state
  }

  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setRemoveLoading(true)
      })
      .catch((err) => console.log(err))
    }, fakeLoading)
  }, [])

  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((resp) => resp.json())
    .then(() => {
      setProject(projects.filter((project) => project.id !== id ))
      setProjectMessage('Projeto removido com sucesso!')
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message msg={message} type="success" />}
      {projectMessage && <Message msg={projectMessage} type="success" />}
      <Container customClass="start">
        {projects.length > 0 && projects.map((project) => (
          <ProjectCard
            name={project.name}
            id={project.id}
            budget={project.budget}
            category={project.category.name}
            key={project.id}
            handleRemove={removeProject}
          />
        ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>N??o h?? projetos cadastrados</p>
        )}
      </Container>
    </div>
  )
}

export default Projects