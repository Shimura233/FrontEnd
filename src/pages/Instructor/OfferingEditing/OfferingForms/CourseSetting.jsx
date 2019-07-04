import React from 'react'
// Layouts
import { Grid, Form, Select, Popup, Button, Icon, Label, Message, Divider } from 'semantic-ui-react'
// Vars
import { util } from '../../../../util'

export default function CourseSetting({state, onChange, toProgress, removeCourse}) {
  const { departments, courses, currDepart, offering, offeringInfo, selectedCourses } = state
  const departOptions = util.getSelectOptions(departments)
  const courseOptions = util.getSelectOptions(courses, currDepart ? currDepart.acronym : '')
  const canGoNext = selectedCourses.length > 0
  return (
    <>
      <h2>1. Select Courses for Your Offering</h2>
      <Popup
        basic position="right center"
        trigger={<Icon name="question circle outline" size="large" color="black"/>}
        content={
          <p>
            <strong>Why multiple courses?</strong><br/>
            Some offerings may be held by multiple departments. For Example CS425 and ECE428 have the same content.
          </p>
      }/>
      
      <Grid.Row>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-depart'
            control={Select}
            label='Department'
            options={departOptions}
            onChange={(event, {value}) => onChange(value, 'currDepart')}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-course'
            control={Select}
            label='Course'
            options={courseOptions}
            onChange={(event, {value}) => onChange(value, 'courseId')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{padding: '0 1rem 0 1rem'}}>
        <Message>
          <Message.Header><p>Selected Courses</p></Message.Header>
          <Divider />
          {!selectedCourses.length && <p><span>none</span></p>}
          <Label.Group size="large">
            {selectedCourses.map( course => (
              <Label key={course.id}>
                {course.fullCourseNumber}
                <Icon name="delete" onClick={()=>removeCourse(course.id)}/>
              </Label>
            ))}
          </Label.Group>
        </Message>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column className="ap-buttons">
          {!canGoNext && <>Select courses to continue&ensp;&ensp;</>}
          <Button disabled={!canGoNext} secondary onClick={()=>toProgress('TermSecType')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}