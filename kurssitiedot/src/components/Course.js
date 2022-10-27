const Course = (props) => {
    return(
      props.course.map(course => 
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
          {console.log('kurssi', course.name)}
        </div>
      )
    )
  }
  
  const Header = (props) => {
    return (
      <h1>{props.name}</h1>
    )
  }
  
  const Content = (props) => {
    return ( 
      props.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)
    )
  }
  
  const Total = (props) => {
    return (
      <b>
        total of {props.parts.reduce((eka, toka) => {
        console.log('what is happening', eka, toka.exercises)
        return (eka + toka.exercises)
        },0)} exercises
     </b>
    )
  }

  export default Course