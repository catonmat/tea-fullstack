// Core React and style
import React, { Component } from 'react';
import './style.scss';
//Components
import NavBar from '../../components/navbar/navbar.jsx';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
// Actions
import { fetchAllUsers, toggleMatch, resetAllUsers } from '../../actions/index.js';
// HTML
import Container from './container.jsx';

class Swiper extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    users: this.props.users,
    currentMatchId: 0
  }

  componentDidMount() {
    this.props.fetchAllUsers();
  }

  renderUsers() {
    return _.map(this.props.users, (user, index) => {
      if (user.new === true && this.props.users.indexOf(user) === this.state.currentMatchId) {
      return (
      <div className="match-container">
        <div className="profile-img">
          <Link to={`/match_profile/${user.id}`} key={user.id}>
            {user.images.map((url,index) => <img key={index} className="avatar-pic" src={url} alt=""/>)}
          </Link>
          <h1>{user.first_name}</h1>
          <p>{user.last_name}</p>
          <p>{user.age} years old</p>
          <i>1.7km far away</i>
        </div>

        <div className="dropdowns">
          <div className="skills">
            <i>Skills I offer to teach</i>
            <ul>
              {user.skills.map(skill => <li>{skill}</li>)}
            </ul>
          </div>
          <div className="competencies">
            <i>I am interested in learning</i>
            <ul>
              {user.interests.map(interest => <li>{interest}</li>)}
            </ul>
          </div>
        </div>

        <div className='footer'>
          <i className="fas fa-times" onClick={() => {this.declineMatch(user.id)}}></i>
          <Link to={`/match_profile/${user.id}`} key={user.id} user={user}>More Info</Link>
          <i className="fas fa-check" onClick={()=> {this.acceptMatch(user.id)}}></i>
        </div>

      </div>
      )}
    })
  }

  resetUsers = () => {
    this.props.resetAllUsers;
    this.setState({currentMatchId: this.state.users[1].id}, () => {
      console.log('clicked', this.state.currentMatchId, this.state.users)
    });
  }

  declineMatch = (user_id) => {
    this.setState({currentMatchId: this.state.currentMatchId + 1})
    this.markUserAsSeen(user_id, false)
    // this.props.toggleMatch(user_id, false)
    // .then(this.props.history.push('/swiper'))
  }

  acceptMatch = (user_id) => {
    this.setState({currentMatchId: this.state.currentMatchId + 1})
    this.markUserAsSeen(user_id, true)
    // this.props.toggleMatch(user_id, true)
    // .then(this.props.history.push('/swiper'))
  }

  markUserAsSeen = (user_id, accepted) => {
    const csrf = document.querySelector("meta[name=csrf-token]").getAttribute("content");
    const endpoint = `http://0.0.0.0:3000/api/v1/frontend/mark_user_as_seen`;
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrf
      },
      'body': JSON.stringify({
        user_id: user_id,
        accepted: accepted
      })
    })
  }

  render() {
    return(
      <div className='swiper'>
        <NavBar/>
        <button onClick={this.resetUsers}>Reset Users</button>
        {this.renderUsers()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllUsers,
    resetAllUsers,
    toggleMatch }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Swiper);

