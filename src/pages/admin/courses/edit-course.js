import React from 'react'
import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../admin-components'
import { Grid, Form, Input, TextArea } from 'semantic-ui-react'

import { api, handleData, util } from '../../../util'
const initialCourse = api.initialData.initialCourse;

export default class EditCoursePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.id.substring(0,3) === 'new',
      course: null,
      courseInfo: handleData.copy(initialCourse),
      confirmed: false,
    }
    this.path = 'Courses';
    this.departId = this.state.isNew ? this.state.id.substring(4, this.state.id.length) : null;
  }

  componentDidMount() {
    console.log(this.uniId)
    if (this.state.id !== 'new') {
      api.getData(this.path, this.state.id)
        .then( response => this.setState({course: response.data}))
    }
  }

  onChange = (value, key) => {
    const newData = this.state.courseInfo;
    newData[key] = value;
    this.setState({courseInfo: newData});
  }

  onSubmit = () => {
    const data = this.state.courseInfo;
    data.departmentId = this.departId;
    api.postData(this.path, data, () => this.onSave())
  }

  onUpdate = () => {
    const { course, courseInfo, id } = this.state;
    var data = handleData.updateJson(courseInfo, course)
    data.id = id;
    api.updateData(this.path, data, () => this.onSave())
  }

  onConfirm = () => this.setState({confirmed: true})

  onInactive = () => {
    api.deleteData(this.path, this.state.id, () => this.onSave())
  }

  onSave = () => {
    util.toAdminPage()
  };

  onCancel = () => {
    this.props.history.goBack()
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'Create New Course' : 'Edit the Course';
    const button = isNew ? <SubmitButton {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <CourseForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

function CourseForm(props) {
  const { onChange } = props;
  const course = props.isNew ? initialCourse : props.state.course;
  return (
    <Form className="ap-form">
      {course ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='course-num-edit'
              control={Input}
              label='Course Number'
              placeholder='E.g. 241'
              defaultValue={course.courseNumber}
              onChange={({target: {value}}) => onChange(value, 'courseNumber')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='course-name-edit'
              control={Input}
              label='Course Name'
              placeholder='E.g. System Programming'
              defaultValue={course.courseName}
              onChange={({target: {value}}) => onChange(value, 'courseName')}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Field
              id='course-decription-edit'
              control={TextArea}
              label='Course Description'
              placeholder='Enter course description here ...'
              defaultValue={course.description}
              onChange={({target: {value}}) => onChange(value, 'description')}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid> : <GeneralLoader inverted height='10rem'/>}
    </Form>
  )
}